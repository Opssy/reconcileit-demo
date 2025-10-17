import { useAuthStore } from '@/store/authStore';

/**
 * Custom hook for authentication
 * Provides easy access to auth state and actions
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser,
    setToken,
    refreshToken,
  } = useAuthStore();

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    logout,
    setUser,
    setToken,
    refreshToken,
    
    // Computed values
    userEmail: user?.email,
    userName: user?.name || `${user?.firstName} ${user?.lastName}`.trim(),
    userRole: user?.role,
  };
};
