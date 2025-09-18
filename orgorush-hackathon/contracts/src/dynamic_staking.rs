use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("DynamicStaking11111111111111111111111111111");

#[program]
pub mod dynamic_staking {
    use super::*;

    pub fn initialize_staking_pool(
        ctx: Context<InitializeStakingPool>,
        pool_bump: u8,
    ) -> Result<()> {
        let staking_pool = &mut ctx.accounts.staking_pool;
        staking_pool.authority = ctx.accounts.authority.key();
        staking_pool.orgo_mint = ctx.accounts.orgo_mint.key();
        staking_pool.total_staked = 0;
        staking_pool.total_rewards = 0;
        staking_pool.bump = pool_bump;
        staking_pool.base_apy = 1570; // 15.70% base APY (in basis points)
        staking_pool.ai_boost_multiplier = 120; // 1.2x AI boost
        staking_pool.last_rebalance = Clock::get()?.unix_timestamp;
        
        // Initialize AI allocation weights
        staking_pool.allocations = vec![
            Allocation {
                protocol: "Meteora".to_string(),
                weight: 6000, // 60% (in basis points)
                current_apy: 1800, // 18%
                risk_score: 200, // 2%
            },
            Allocation {
                protocol: "Raydium".to_string(),
                weight: 3000, // 30%
                current_apy: 1500, // 15%
                risk_score: 300, // 3%
            },
            Allocation {
                protocol: "Orca".to_string(),
                weight: 1000, // 10%
                current_apy: 1200, // 12%
                risk_score: 150, // 1.5%
            },
        ];
        
        Ok(())
    }

    pub fn stake_tokens(
        ctx: Context<StakeTokens>,
        amount: u64,
    ) -> Result<()> {
        let staking_pool = &mut ctx.accounts.staking_pool;
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Transfer tokens from user to pool
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;
        
        // Update user stake record
        if user_stake.amount == 0 {
            user_stake.user = ctx.accounts.user.key();
            user_stake.amount = amount;
            user_stake.stake_timestamp = Clock::get()?.unix_timestamp;
            user_stake.last_claim = Clock::get()?.unix_timestamp;
            user_stake.ai_boost_active = amount >= 100_000_000_000; // 100 ORGO minimum for AI boost
        } else {
            // Calculate pending rewards before updating stake
            let pending_rewards = calculate_pending_rewards(user_stake, staking_pool)?;
            user_stake.pending_rewards += pending_rewards;
            user_stake.amount += amount;
            user_stake.last_claim = Clock::get()?.unix_timestamp;
        }
        
        // Update pool totals
        staking_pool.total_staked += amount;
        
        // Trigger AI rebalancing if significant stake change
        if amount > staking_pool.total_staked / 100 { // 1% of total pool
            rebalance_allocations(staking_pool)?;
        }
        
        emit!(StakeEvent {
            user: ctx.accounts.user.key(),
            amount,
            total_staked: user_stake.amount,
            ai_boost_active: user_stake.ai_boost_active,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let staking_pool = &mut ctx.accounts.staking_pool;
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Calculate total rewards
        let pending_rewards = calculate_pending_rewards(user_stake, staking_pool)?;
        let total_rewards = user_stake.pending_rewards + pending_rewards;
        
        require!(total_rewards > 0, StakingError::NoRewardsToClaim);
        
        // Apply AI boost if eligible
        let final_rewards = if user_stake.ai_boost_active {
            (total_rewards as u128 * staking_pool.ai_boost_multiplier as u128 / 100) as u64
        } else {
            total_rewards
        };
        
        // Transfer rewards to user
        let seeds = &[
            b"staking_pool",
            staking_pool.orgo_mint.as_ref(),
            &[staking_pool.bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.pool_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: staking_pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, final_rewards)?;
        
        // Update user stake
        user_stake.pending_rewards = 0;
        user_stake.last_claim = Clock::get()?.unix_timestamp;
        user_stake.total_claimed += final_rewards;
        
        // Update pool totals
        staking_pool.total_rewards += final_rewards;
        
        emit!(RewardClaimEvent {
            user: ctx.accounts.user.key(),
            amount: final_rewards,
            ai_boost_applied: user_stake.ai_boost_active,
            total_claimed: user_stake.total_claimed,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    pub fn ai_rebalance(ctx: Context<AIRebalance>) -> Result<()> {
        let staking_pool = &mut ctx.accounts.staking_pool;
        
        // Only allow rebalancing every 24 hours
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time - staking_pool.last_rebalance > 86400,
            StakingError::RebalanceTooFrequent
        );
        
        // Simulate AI-powered rebalancing
        rebalance_allocations(staking_pool)?;
        staking_pool.last_rebalance = current_time;
        
        emit!(RebalanceEvent {
            allocations: staking_pool.allocations.clone(),
            timestamp: current_time,
        });
        
        Ok(())
    }
}

// Helper functions
fn calculate_pending_rewards(user_stake: &UserStake, staking_pool: &StakingPool) -> Result<u64> {
    let current_time = Clock::get()?.unix_timestamp;
    let time_diff = current_time - user_stake.last_claim;
    
    // Calculate weighted APY based on allocations
    let weighted_apy = staking_pool.allocations.iter()
        .map(|alloc| (alloc.current_apy as u128 * alloc.weight as u128) / 10000)
        .sum::<u128>() as u64;
    
    // Annual rewards = stake * weighted_apy / 10000
    // Time-proportional rewards = annual_rewards * time_diff / 31536000 (seconds in year)
    let annual_rewards = (user_stake.amount as u128 * weighted_apy as u128) / 10000;
    let rewards = (annual_rewards * time_diff as u128) / 31536000;
    
    Ok(rewards as u64)
}

fn rebalance_allocations(staking_pool: &mut StakingPool) -> Result<()> {
    // Simulate AI-powered allocation optimization
    // In real implementation, this would call external AI models
    
    // Mock market conditions
    let market_volatility = 25; // 2.5%
    let liquidity_score = 85; // 85%
    
    // Adjust allocations based on simulated AI analysis
    for allocation in &mut staking_pool.allocations {
        match allocation.protocol.as_str() {
            "Meteora" => {
                // Increase Meteora allocation in high volatility
                if market_volatility > 20 {
                    allocation.weight = std::cmp::min(7000, allocation.weight + 500);
                    allocation.current_apy = 1900; // Boost APY
                }
            },
            "Raydium" => {
                // Stable allocation for Raydium
                allocation.weight = 2500;
                allocation.current_apy = 1600;
            },
            "Orca" => {
                // Reduce Orca in high volatility
                if market_volatility > 20 {
                    allocation.weight = std::cmp::max(500, allocation.weight - 200);
                    allocation.current_apy = 1100;
                }
            },
            _ => {}
        }
    }
    
    // Ensure weights sum to 10000 (100%)
    let total_weight: u64 = staking_pool.allocations.iter().map(|a| a.weight).sum();
    if total_weight != 10000 {
        let adjustment = (10000 - total_weight) as i64;
        staking_pool.allocations[0].weight = (staking_pool.allocations[0].weight as i64 + adjustment) as u64;
    }
    
    Ok(())
}

// Account structures
#[derive(Accounts)]
pub struct InitializeStakingPool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + StakingPool::INIT_SPACE,
        seeds = [b"staking_pool", orgo_mint.key().as_ref()],
        bump
    )]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub orgo_mint: Account<'info, token::Mint>,
    
    #[account(
        init,
        payer = authority,
        token::mint = orgo_mint,
        token::authority = staking_pool,
        seeds = [b"pool_token_account", orgo_mint.key().as_ref()],
        bump
    )]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(mut)]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserStake::INIT_SPACE,
        seeds = [b"user_stake", user.key().as_ref(), staking_pool.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(mut)]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AIRebalance<'info> {
    #[account(mut)]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

// Data structures
#[account]
pub struct StakingPool {
    pub authority: Pubkey,
    pub orgo_mint: Pubkey,
    pub total_staked: u64,
    pub total_rewards: u64,
    pub bump: u8,
    pub base_apy: u64, // In basis points (1570 = 15.70%)
    pub ai_boost_multiplier: u64, // 120 = 1.2x multiplier
    pub last_rebalance: i64,
    pub allocations: Vec<Allocation>,
}

impl StakingPool {
    pub const INIT_SPACE: usize = 32 + 32 + 8 + 8 + 1 + 8 + 8 + 8 + (4 + 3 * Allocation::INIT_SPACE);
}

#[account]
pub struct UserStake {
    pub user: Pubkey,
    pub amount: u64,
    pub stake_timestamp: i64,
    pub last_claim: i64,
    pub pending_rewards: u64,
    pub total_claimed: u64,
    pub ai_boost_active: bool,
}

impl UserStake {
    pub const INIT_SPACE: usize = 32 + 8 + 8 + 8 + 8 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Allocation {
    pub protocol: String,
    pub weight: u64, // In basis points (6000 = 60%)
    pub current_apy: u64, // In basis points
    pub risk_score: u64, // In basis points
}

impl Allocation {
    pub const INIT_SPACE: usize = 4 + 32 + 8 + 8 + 8; // String + 3 u64s
}

// Events
#[event]
pub struct StakeEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub total_staked: u64,
    pub ai_boost_active: bool,
    pub timestamp: i64,
}

#[event]
pub struct RewardClaimEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub ai_boost_applied: bool,
    pub total_claimed: u64,
    pub timestamp: i64,
}

#[event]
pub struct RebalanceEvent {
    pub allocations: Vec<Allocation>,
    pub timestamp: i64,
}

// Errors
#[error_code]
pub enum StakingError {
    #[msg("No rewards to claim")]
    NoRewardsToClaim,
    #[msg("Rebalancing too frequent, wait 24 hours")]
    RebalanceTooFrequent,
    #[msg("Insufficient stake for AI boost")]
    InsufficientStakeForBoost,
}

