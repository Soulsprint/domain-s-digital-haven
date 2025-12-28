import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, LogIn, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type LoginType = 'admin' | 'staff';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<LoginType>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user && role) {
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'staff') {
        navigate('/staff');
      }
    }
  }, [user, role, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Role check and redirect happens in useEffect
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-glow">
          <Cpu className="w-16 h-16 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-glow-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <Cpu className="w-12 h-12 text-primary animate-pulse-glow" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-2xl tracking-wider text-foreground">
              DOMAIN
            </span>
            <span className="font-display text-xs tracking-[0.3em] text-primary">
              COMPUTERS
            </span>
          </div>
        </div>

        {/* Login Type Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={loginType === 'admin' ? 'glow' : 'outline'}
            className="flex-1 gap-2"
            onClick={() => setLoginType('admin')}
          >
            <Shield className="w-4 h-4" />
            Admin Login
          </Button>
          <Button
            type="button"
            variant={loginType === 'staff' ? 'glow' : 'outline'}
            className="flex-1 gap-2"
            onClick={() => setLoginType('staff')}
          >
            <User className="w-4 h-4" />
            Staff Login
          </Button>
        </div>

        {/* Login Form */}
        <div className="glass rounded-2xl p-8">
          <h2 className="font-display text-xl text-center mb-6">
            {loginType === 'admin' ? 'Admin Portal' : 'Staff Portal'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>

            <Button
              type="submit"
              variant="glow"
              className="w-full gap-2"
              disabled={isLoading}
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-muted-foreground text-sm text-center mt-6">
            {loginType === 'admin'
              ? 'Access the admin dashboard to manage staff and tasks'
              : 'View and manage your assigned repair tasks'}
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
