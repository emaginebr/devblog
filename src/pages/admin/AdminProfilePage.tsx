import { useNavigate } from 'react-router-dom';
import { useAuth, UserEditForm } from 'nauth-react';
import { ROUTES } from '../../lib/constants';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Meu Perfil</h1>
      <UserEditForm
        userId={user.userId}
        onSuccess={() => navigate(ROUTES.DASHBOARD)}
        onCancel={() => navigate(ROUTES.DASHBOARD)}
      />
    </div>
  );
}
