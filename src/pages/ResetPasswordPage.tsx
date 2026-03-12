import { useParams, useNavigate } from 'react-router-dom';
import { ResetPasswordForm } from 'nauth-react';
import { ROUTES } from '../lib/constants';

export default function ResetPasswordPage() {
  const { hash } = useParams<{ hash: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <ResetPasswordForm
          recoveryHash={hash}
          onSuccess={() => navigate(ROUTES.LOGIN)}
        />
      </div>
    </div>
  );
}
