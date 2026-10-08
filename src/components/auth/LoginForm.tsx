import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup, onForgotPassword }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-slate-900/90 border border-white/10 text-white shadow-2xl backdrop-blur-xl">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-3xl font-semibold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center text-white/70">
          Sign in to your MSP dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                id="email"
                type="email"
                placeholder="admin@msp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-violet-500 focus:ring-violet-500"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/80"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v) => setRememberMe(!!v)} />
              <Label htmlFor="remember" className="text-sm text-white/80">Remember me</Label>
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-sm text-white"
              onClick={onForgotPassword}
            >
              Forgot password?
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900/30 border-red-600/40 text-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 shadow-lg shadow-violet-500/30" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/90 px-2 text-white/60">Demo Accounts</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-2 text-sm text-white/70">
            <div className="p-2 bg-white/10 border border-white/15 rounded">
              <strong>Admin:</strong> admin@msp.com / demo123
            </div>
            <div className="p-2 bg-white/10 border border-white/15 rounded">
              <strong>Technician:</strong> tech@msp.com / demo123
            </div>
            <div className="p-2 bg-white/10 border border-white/15 rounded">
              <strong>Client:</strong> client@company.com / demo123
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm space-y-2">
          <div>
            Don't have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold text-white"
              onClick={onSwitchToSignup}
            >
              Sign up
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};