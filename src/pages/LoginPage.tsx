import { useNavigate } from 'react-router-dom';
import { LoginForm } from 'nauth-react';
import { ROUTES } from '../lib/constants';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <LoginForm
          onSuccess={() => navigate(ROUTES.DASHBOARD)}
          showRememberMe
        />
      </div>
    </div>
  );
}
