import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User interface
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  company?: string;
  role?: string;
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  refreshToken: () => Promise<void>;
  checkTokenExpiry: () => void;
}

// Token expiry check (in milliseconds)
const TOKEN_EXPIRY_CHECK_INTERVAL = 60000; // 1 minute
const TOKEN_EXPIRY_TIME = 3600000; // 1 hour

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Login action
      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        // Store token timestamp for expiry check
        localStorage.setItem('tokenTimestamp', Date.now().toString());

        // Start token expiry check
        get().checkTokenExpiry();
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Clear token timestamp
        localStorage.removeItem('tokenTimestamp');
        localStorage.removeItem('authToken');
      },

      // Set user
      setUser: (user: User) => {
        set({ user });
      },

      // Set token
      setToken: (token: string) => {
        set({ token });
        localStorage.setItem('authToken', token);
        localStorage.setItem('tokenTimestamp', Date.now().toString());
      },

      // Refresh token
      refreshToken: async () => {
        const { token } = get();
        
        if (!token) {
          return;
        }

        try {
          // API call to refresh token
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            set({ token: data.token });
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('tokenTimestamp', Date.now().toString());
          } else {
            // Token refresh failed, logout
            get().logout();
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
        }
      },

      // Check token expiry
      checkTokenExpiry: () => {
        const timestampStr = localStorage.getItem('tokenTimestamp');
        
        if (!timestampStr) {
          return;
        }

        const timestamp = parseInt(timestampStr, 10);
        const now = Date.now();
        const elapsed = now - timestamp;

        // If token is expired, logout
        if (elapsed >= TOKEN_EXPIRY_TIME) {
          console.log('Token expired, logging out...');
          get().logout();
          return;
        }

        // If token is close to expiry (within 5 minutes), refresh it
        const timeUntilExpiry = TOKEN_EXPIRY_TIME - elapsed;
        if (timeUntilExpiry < 300000) { // 5 minutes
          console.log('Token expiring soon, refreshing...');
          get().refreshToken();
        }

        // Schedule next check
        setTimeout(() => {
          get().checkTokenExpiry();
        }, TOKEN_EXPIRY_CHECK_INTERVAL);
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize token expiry check on app load
if (typeof window !== 'undefined') {
  const store = useAuthStore.getState();
  if (store.isAuthenticated && store.token) {
    store.checkTokenExpiry();
  }
}
