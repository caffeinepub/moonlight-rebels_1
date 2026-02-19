import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={disabled}
      className={`
        px-6 py-2 rounded-full font-medium transition-all
        flex items-center gap-2
        ${isAuthenticated
          ? 'bg-muted hover:bg-muted/80 text-foreground'
          : 'bg-gradient-to-r from-moonlight-500 to-rebel-500 hover:from-moonlight-600 hover:to-rebel-600 text-white shadow-lg shadow-moonlight-500/20'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {loginStatus === 'logging-in' ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Logging in...</span>
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </>
      )}
    </button>
  );
}
