use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("OrgoSwap11111111111111111111111111111111");

#[program]
pub mod orgo_swap {
    use super::*;

    /// Initialize a new atomic swap with ORGO burn mechanism
    pub fn initiate_swap(
        ctx: Context<InitiateSwap>,
        amount_in: u64,
        min_amount_out: u64,
        burn_bps: u16, // Basis points for ORGO burn (e.g., 10 = 0.1%)
        recipient: Pubkey,
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let clock = Clock::get()?;

        // Validate burn rate (max 1000 bps = 10%)
        require!(burn_bps <= 1000, ErrorCode::InvalidBurnRate);

        // Transfer user's tokens to escrow
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount_in)?;

        // Store swap parameters
        escrow.user = ctx.accounts.user.key();
        escrow.recipient = recipient;
        escrow.amount_in = amount_in;
        escrow.min_amount_out = min_amount_out;
        escrow.burn_bps = burn_bps;
        escrow.created_at = clock.unix_timestamp;
        escrow.status = SwapStatus::Pending;

        emit!(SwapInitiated {
            escrow: escrow.key(),
            user: ctx.accounts.user.key(),
            amount_in,
            burn_bps,
        });

        Ok(())
    }

    /// Execute the atomic swap with dynamic burn calculation
    pub fn execute_swap(
        ctx: Context<ExecuteSwap>,
        volatility_multiplier: u16, // Multiplier for volatile conditions
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let clock = Clock::get()?;

        // Verify swap is still valid (24 hour expiry)
        require!(
            clock.unix_timestamp - escrow.created_at < 86400,
            ErrorCode::SwapExpired
        );
        require!(escrow.status == SwapStatus::Pending, ErrorCode::InvalidStatus);

        // Calculate dynamic burn amount
        let base_burn = (escrow.amount_in as u128 * escrow.burn_bps as u128) / 10000;
        let adjusted_burn = (base_burn * volatility_multiplier as u128) / 100;
        let burn_amount = adjusted_burn.min(escrow.amount_in as u128 / 10) as u64; // Max 10% burn

        // Calculate output amount after burn
        let output_amount = escrow.amount_in.saturating_sub(burn_amount);
        require!(output_amount >= escrow.min_amount_out, ErrorCode::SlippageExceeded);

        // Transfer tokens to recipient
        let seeds = &[
            b"escrow".as_ref(),
            escrow.user.as_ref(),
            &[ctx.bumps.escrow],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: escrow.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, output_amount)?;

        // Burn ORGO tokens (transfer to burn address)
        if burn_amount > 0 {
            let burn_cpi_accounts = Transfer {
                from: ctx.accounts.escrow_token_account.to_account_info(),
                to: ctx.accounts.burn_account.to_account_info(),
                authority: escrow.to_account_info(),
            };
            let burn_cpi_ctx = CpiContext::new_with_signer(cpi_program, burn_cpi_accounts, signer);
            token::transfer(burn_cpi_ctx, burn_amount)?;
        }

        escrow.status = SwapStatus::Completed;

        emit!(SwapExecuted {
            escrow: escrow.key(),
            output_amount,
            burn_amount,
            volatility_multiplier,
        });

        Ok(())
    }

    /// Stake ORGO tokens for fee discounts
    pub fn stake_orgo(ctx: Context<StakeOrgo>, amount: u64) -> Result<()> {
        let stake_account = &mut ctx.accounts.stake_account;
        let clock = Clock::get()?;

        // Transfer ORGO to stake account
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_orgo_account.to_account_info(),
            to: ctx.accounts.stake_orgo_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Update stake record
        stake_account.user = ctx.accounts.user.key();
        stake_account.amount = stake_account.amount.checked_add(amount).unwrap();
        stake_account.last_staked = clock.unix_timestamp;

        // Calculate fee discount (0.5% per 100 ORGO, max 50%)
        let discount_bps = ((stake_account.amount / 100_000_000) * 50).min(5000) as u16; // 100 ORGO = 100M lamports
        stake_account.fee_discount_bps = discount_bps;

        emit!(OrgoStaked {
            user: ctx.accounts.user.key(),
            amount,
            total_staked: stake_account.amount,
            discount_bps,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitiateSwap<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 8 + 2 + 8 + 1,
        seeds = [b"escrow", user.key().as_ref()],
        bump
    )]
    pub escrow: Account<'info, EscrowAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteSwap<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.user.as_ref()],
        bump
    )]
    pub escrow: Account<'info, EscrowAccount>,
    
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub burn_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct StakeOrgo<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 32 + 8 + 8 + 2,
        seeds = [b"stake", user.key().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, StakeAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_orgo_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub stake_orgo_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct EscrowAccount {
    pub user: Pubkey,
    pub recipient: Pubkey,
    pub amount_in: u64,
    pub min_amount_out: u64,
    pub burn_bps: u16,
    pub created_at: i64,
    pub status: SwapStatus,
}

#[account]
pub struct StakeAccount {
    pub user: Pubkey,
    pub amount: u64,
    pub last_staked: i64,
    pub fee_discount_bps: u16,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum SwapStatus {
    Pending,
    Completed,
    Cancelled,
}

#[event]
pub struct SwapInitiated {
    pub escrow: Pubkey,
    pub user: Pubkey,
    pub amount_in: u64,
    pub burn_bps: u16,
}

#[event]
pub struct SwapExecuted {
    pub escrow: Pubkey,
    pub output_amount: u64,
    pub burn_amount: u64,
    pub volatility_multiplier: u16,
}

#[event]
pub struct OrgoStaked {
    pub user: Pubkey,
    pub amount: u64,
    pub total_staked: u64,
    pub discount_bps: u16,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid burn rate - maximum 10%")]
    InvalidBurnRate,
    #[msg("Swap has expired")]
    SwapExpired,
    #[msg("Invalid swap status")]
    InvalidStatus,
    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,
}

