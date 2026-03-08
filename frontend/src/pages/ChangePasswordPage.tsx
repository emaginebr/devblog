import { useNavigate } from 'react-router-dom';
import { ChangePasswordForm } from 'nauth-react';
import { ROUTES } from '../lib/constants';

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Alterar Senha</h1>
      <ChangePasswordForm
        onSuccess={() => navigate(ROUTES.DASHBOARD)}
      />
    </div>
  );
}
