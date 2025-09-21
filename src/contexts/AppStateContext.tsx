import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// Types
interface User {
  id: string;
  publicKey: string;
  username?: string;
  avatar?: string;
  memberSince: Date;
  supportLevel: 'basic' | 'premium' | 'enterprise';
}

interface Stats {
  supportQueries: number;
  transactions: number;
  tokensBurned: number;
  activeVMs: number;
  successRate: number;
  avgResponseTime: number;
}

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'busy';
  specialty: string;
  confidence: number;
  lastAction?: string;
  timestamp: Date;
}

interface SupportSession {
  id: string;
  transcript: string;
  status: 'active' | 'completed' | 'pending';
  agents: Agent[];
  startTime: Date;
  endTime?: Date;
  satisfaction?: number;
  nftReward?: string;
}

interface Activity {
  id: string;
  type: 'support' | 'payment' | 'system' | 'security';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
  amount?: number;
  token?: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  dismissed?: boolean;
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  cpu: number;
  memory: number;
  network: number;
  uptime: string;
  lastUpdate: Date;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface AppState {
  user: User | null;
  stats: Stats | null;
  agents: Agent[];
  supportSession: SupportSession | null;
  recentActivity: Activity[];
  alerts: Alert[];
  systemHealth: SystemHealth | null;
  notifications: {
    items: Notification[];
    unreadCount: number;
  };
  isLoading: boolean;
  error: string | null;
}

// Actions
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_STATS'; payload: Stats }
  | { type: 'SET_AGENTS'; payload: Agent[] }
  | { type: 'UPDATE_AGENT'; payload: Agent }
  | { type: 'SET_SUPPORT_SESSION'; payload: SupportSession }
  | { type: 'UPDATE_SUPPORT_SESSION'; payload: Partial<SupportSession> }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'SET_RECENT_ACTIVITY'; payload: Activity[] }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'DISMISS_ALERT'; payload: string }
  | { type: 'SET_SYSTEM_HEALTH'; payload: SystemHealth }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: AppState = {
  user: null,
  stats: null,
  agents: [],
  supportSession: null,
  recentActivity: [],
  alerts: [],
  systemHealth: null,
  notifications: {
    items: [],
    unreadCount: 0
  },
  isLoading: false,
  error: null
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    
    case 'SET_AGENTS':
      return { ...state, agents: action.payload };
    
    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.id ? action.payload : agent
        )
      };
    
    case 'SET_SUPPORT_SESSION':
      return { ...state, supportSession: action.payload };
    
    case 'UPDATE_SUPPORT_SESSION':
      return {
        ...state,
        supportSession: state.supportSession
          ? { ...state.supportSession, ...action.payload }
          : null
      };
    
    case 'ADD_ACTIVITY':
      return {
        ...state,
        recentActivity: [action.payload, ...state.recentActivity.slice(0, 49)]
      };
    
    case 'SET_RECENT_ACTIVITY':
      return { ...state, recentActivity: action.payload };
    
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts]
      };
    
    case 'DISMISS_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload)
      };
    
    case 'SET_SYSTEM_HEALTH':
      return { ...state, systemHealth: action.payload };
    
    case 'ADD_NOTIFICATION': {
      const newNotification = action.payload;
      return {
        ...state,
        notifications: {
          items: [newNotification, ...state.notifications.items],
          unreadCount: state.notifications.unreadCount + (newNotification.read ? 0 : 1)
        }
      };
    }
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          items: state.notifications.items.map(item =>
            item.id === action.payload ? { ...item, read: true } : item
          ),
          unreadCount: Math.max(0, state.notifications.unreadCount - 1)
        }
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
};

// Context
const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Safely get wallet connection info with error handling
  const walletContext = useConnection();
  const walletInfo = useWallet();
  
  const connection = walletContext?.connection || null;
  const publicKey = walletInfo?.publicKey || null;
  const connected = walletInfo?.connected || false;

  // Initialize user when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      const user: User = {
        id: publicKey.toBase58(),
        publicKey: publicKey.toBase58(),
        memberSince: new Date(),
        supportLevel: 'basic'
      };
      dispatch({ type: 'SET_USER', payload: user });
    } else {
      dispatch({ type: 'SET_USER', payload: null });
    }
  }, [connected, publicKey]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Simulate loading stats
        const mockStats: Stats = {
          supportQueries: 1247,
          transactions: 42700,
          tokensBurned: 2847.39,
          activeVMs: 4,
          successRate: 99.7,
          avgResponseTime: 0.3
        };
        dispatch({ type: 'SET_STATS', payload: mockStats });

        // Simulate loading agents
        const mockAgents: Agent[] = [
          {
            id: 'agent-1',
            name: 'Voice Transcription Agent',
            status: 'active',
            specialty: 'Speech Processing',
            confidence: 95,
            timestamp: new Date()
          },
          {
            id: 'agent-2',
            name: 'Blockchain Query Agent',
            status: 'idle',
            specialty: 'Wallet Analysis',
            confidence: 88,
            timestamp: new Date()
          },
          {
            id: 'agent-3',
            name: 'Solution Generation Agent',
            status: 'idle',
            specialty: 'Problem Resolution',
            confidence: 92,
            timestamp: new Date()
          }
        ];
        dispatch({ type: 'SET_AGENTS', payload: mockAgents });

        // Simulate loading recent activity
        const mockActivity: Activity[] = [
          {
            id: 'activity-1',
            type: 'support',
            title: 'Voice query resolved',
            description: 'Wallet connection issue resolved for user 0x...abc',
            timestamp: new Date(Date.now() - 5 * 60000),
            status: 'success'
          },
          {
            id: 'activity-2',
            type: 'payment',
            title: 'Payment processed',
            description: 'Cross-chain transfer completed',
            timestamp: new Date(Date.now() - 10 * 60000),
            status: 'success',
            amount: 150.50,
            token: 'ORGO'
          },
          {
            id: 'activity-3',
            type: 'system',
            title: 'VM health check',
            description: 'All systems operating normally',
            timestamp: new Date(Date.now() - 15 * 60000),
            status: 'info'
          }
        ];
        dispatch({ type: 'SET_RECENT_ACTIVITY', payload: mockActivity });

        // Simulate system health
        const mockHealth: SystemHealth = {
          overall: 'healthy',
          cpu: 45,
          memory: 62,
          network: 98,
          uptime: '99.9%',
          lastUpdate: new Date()
        };
        dispatch({ type: 'SET_SYSTEM_HEALTH', payload: mockHealth });

      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load initial data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update stats periodically
      if (state.stats) {
        const updatedStats: Stats = {
          ...state.stats,
          supportQueries: state.stats.supportQueries + Math.floor(Math.random() * 3),
          transactions: state.stats.transactions + Math.floor(Math.random() * 10),
          tokensBurned: state.stats.tokensBurned + (Math.random() * 0.1)
        };
        dispatch({ type: 'SET_STATS', payload: updatedStats });
      }

      // Update system health
      if (state.systemHealth) {
        const updatedHealth: SystemHealth = {
          ...state.systemHealth,
          cpu: Math.max(20, Math.min(80, state.systemHealth.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(30, Math.min(90, state.systemHealth.memory + (Math.random() - 0.5) * 8)),
          network: Math.max(80, Math.min(100, state.systemHealth.network + (Math.random() - 0.5) * 5)),
          lastUpdate: new Date()
        };
        dispatch({ type: 'SET_SYSTEM_HEALTH', payload: updatedHealth });
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [state.stats, state.systemHealth]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Hook
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  
  return {
    ...context.state,
    dispatch: context.dispatch,
    
    // Helper functions
    addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => {
      const newActivity: Activity = {
        ...activity,
        id: `activity-${Date.now()}`,
        timestamp: new Date()
      };
      context.dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
    },
    
    addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => {
      const newAlert: Alert = {
        ...alert,
        id: `alert-${Date.now()}`,
        timestamp: new Date()
      };
      context.dispatch({ type: 'ADD_ALERT', payload: newAlert });
    },
    
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: `notification-${Date.now()}`,
        timestamp: new Date(),
        read: false
      };
      context.dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    },
    
    startSupportSession: (transcript: string) => {
      const session: SupportSession = {
        id: `session-${Date.now()}`,
        transcript,
        status: 'active',
        agents: context.state.agents.filter(agent => agent.status === 'active'),
        startTime: new Date()
      };
      context.dispatch({ type: 'SET_SUPPORT_SESSION', payload: session });
    },
    
    updateAgent: (agentId: string, updates: Partial<Agent>) => {
      const agent = context.state.agents.find(a => a.id === agentId);
      if (agent) {
        const updatedAgent = { ...agent, ...updates, timestamp: new Date() };
        context.dispatch({ type: 'UPDATE_AGENT', payload: updatedAgent });
      }
    }
  };
};

export default AppStateProvider;
