# Authentication System Documentation

## Overview
Complete authentication system with state management, route protection, and token handling.

## Installation

First, install Zustand:
```bash
npm install zustand
```

## Architecture

### 1. Auth Store (`src/store/authStore.ts`)
Zustand store for global authentication state with persistence.

**Features:**
- User data storage
- Token management
- Auto token refresh
- Token expiry checking
- Persistent storage (localStorage)

**State:**
```typescript
{
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Actions:**
- `login(user, token)` - Store user and token
- `logout()` - Clear auth state
- `setUser(user)` - Update user data
- `setToken(token)` - Update token
- `refreshToken()` - Refresh expired token
- `checkTokenExpiry()` - Auto-check token expiry

### 2. Custom Hook (`src/hooks/useAuth.ts`)
Simplified hook for accessing auth state and actions.

**Usage:**
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### 3. Route Protection

#### ProtectedRoute Component
Protect individual routes:
```typescript
<ProtectedRoute requiredRole="admin">
  <AdminPage />
</ProtectedRoute>
```

#### AuthGuard Component
Protect entire app (use in root layout):
```typescript
<AuthGuard>
  {children}
</AuthGuard>
```

## Usage Examples

### Login Flow
```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const { login } = useAuth();
  
  const handleLogin = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    login(data.user, data.token);
  };
}
```

### Logout Flow
```typescript
import { useAuth } from '@/hooks/useAuth';

function Header() {
  const { logout, user } = useAuth();
  
  return (
    <button onClick={logout}>
      Logout {user?.email}
    </button>
  );
}
```

### Protected Route
```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
```

### Check Auth Status
```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, user, userName } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <div>Welcome, {userName}!</div>;
}
```

## Token Management

### Auto Token Refresh
- Checks token expiry every 1 minute
- Auto-refreshes when token has < 5 minutes remaining
- Auto-logout when token expires

### Token Expiry
- Default: 1 hour (configurable in `authStore.ts`)
- Stored in localStorage with timestamp
- Automatic cleanup on logout

### Manual Token Refresh
```typescript
const { refreshToken } = useAuth();
await refreshToken();
```

## API Endpoints

### POST /api/auth/login
```json
Request: { "email": "user@example.com", "password": "password" }
Response: { "user": {...}, "token": "..." }
```

### POST /api/auth/signup
```json
Request: { "firstName": "John", "lastName": "Doe", ... }
Response: { "user": {...}, "token": "..." }
```

### POST /api/auth/refresh
```json
Headers: { "Authorization": "Bearer <token>" }
Response: { "token": "...", "expiresIn": 3600 }
```

### POST /api/auth/forgot-password
```json
Request: { "email": "user@example.com" }
Response: { "message": "Reset link sent" }
```

### POST /api/auth/sso
```json
Request: { "domain": "company" }
Response: { "redirectUrl": "...", "provider": "okta" }
```

## Security Features

1. **Token Storage**: Tokens stored in Zustand (memory) and localStorage
2. **Auto Logout**: Automatic logout on token expiry
3. **Token Refresh**: Proactive token refresh before expiry
4. **Route Protection**: Client-side route guards
5. **Remember Me**: Optional persistent sessions

## Public Routes
Routes that don't require authentication:
- `/login`
- `/register`
- `/forgot-password`
- `/sso`

## Configuration

### Token Expiry Time
Edit `src/store/authStore.ts`:
```typescript
const TOKEN_EXPIRY_TIME = 3600000; // 1 hour in milliseconds
```

### Token Check Interval
```typescript
const TOKEN_EXPIRY_CHECK_INTERVAL = 60000; // 1 minute
```

### Public Routes
Edit `src/components/auth/AuthGuard.tsx`:
```typescript
const PUBLIC_ROUTES = ["/login", "/register", ...];
```

## Best Practices

1. **Always use `useAuth` hook** instead of accessing store directly
2. **Wrap protected pages** with `<ProtectedRoute>`
3. **Use AuthGuard** in root layout for app-wide protection
4. **Handle token refresh errors** gracefully
5. **Clear sensitive data** on logout
6. **Validate tokens** on the server side

## Troubleshooting

### Token not persisting
- Check localStorage permissions
- Verify Zustand persist middleware is configured

### Auto-logout not working
- Check token timestamp in localStorage
- Verify `checkTokenExpiry()` is called on app load

### Protected routes accessible
- Ensure `<AuthGuard>` is in root layout
- Check `isAuthenticated` state
- Verify public routes configuration

## Migration from Old Auth System

1. Install Zustand: `npm install zustand`
2. Replace old auth context with `useAuth` hook
3. Update login/signup to use `login()` action
4. Wrap app with `<AuthGuard>`
5. Replace route protection with `<ProtectedRoute>`
6. Test token refresh and auto-logout

## Next Steps

- [ ] Implement server-side session validation
- [ ] Add refresh token rotation
- [ ] Implement 2FA support
- [ ] Add OAuth providers (Google, GitHub, etc.)
- [ ] Add role-based access control (RBAC)
- [ ] Implement audit logging
