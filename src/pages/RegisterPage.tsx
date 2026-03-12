import { useNavigate } from 'react-router-dom';
import { RegisterForm } from 'nauth-react';
import { ROUTES } from '../lib/constants';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <RegisterForm
          onSuccess={() => navigate(ROUTES.DASHBOARD)}
        />
      </div>
    </div>
  );
}
