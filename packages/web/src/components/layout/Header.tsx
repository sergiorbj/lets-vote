import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Feature Voting System
          </h1>
          {user && (
            <p className="text-sm text-gray-600">Welcome, {user.name}</p>
          )}
        </div>
        {isAuthenticated && (
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}
