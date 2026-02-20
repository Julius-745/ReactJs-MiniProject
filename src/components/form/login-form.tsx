import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuthStore } from '../../store/auth-store';

const LoginForm = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoadingAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate('/product');
    } catch {
      // Error is handled in the store
    }
  };

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit}>
      <div className="w-full space-y-1">
        <Label htmlFor="username" className="leading-5">
          Username*
        </Label>
        <Input
          type="text"
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoadingAuth}
          className="w-full"
        />
      </div>

      <div className="w-full space-y-1">
        <Label htmlFor="password" className="leading-5">
          Password*
        </Label>
        <div className="relative w-full">
          <Input
            id="password"
            type={isVisible ? 'text' : 'password'}
            placeholder="••••••••••••••••"
            className="w-full pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoadingAuth}
          />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
          >
            {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            <span className="sr-only">
              {isVisible ? 'Hide password' : 'Show password'}
            </span>
          </Button>
        </div>
      </div>

      <Button
        variant="default"
        className="w-full"
        type="submit"
        disabled={isLoadingAuth || !username || !password}
      >
        {isLoadingAuth ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};

export default LoginForm;
