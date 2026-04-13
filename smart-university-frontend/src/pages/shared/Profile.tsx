import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../api/userApi';
import { useAuth } from '../../auth/useAuth';
import { Spinner } from '../../components/Spinner';
import { UserCircle } from 'lucide-react';

export default function Profile() {
  const { username, roles, sub, authenticated, initialized, token } = useAuth();
  const { data: meInfo, isLoading, isError, error } = useQuery({ queryKey: ['me'], queryFn: getMe, enabled: authenticated });

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <UserCircle className="h-10 w-10 text-indigo-600" />
          </div>
          <div>
            <p className="text-xl font-semibold">{username || '(no username)'}</p>
            <p className="text-sm text-gray-500">{roles.filter((r) => ['ADMIN', 'TEACHER', 'STUDENT'].includes(r)).join(', ') || '(no roles)'}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Authenticated</span>
            <span className={authenticated ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{String(authenticated)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Keycloak Sub</span>
            <span className="font-mono text-xs">{sub || '(empty)'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Roles</span>
            <span className="font-mono text-xs">{roles.length > 0 ? roles.join(', ') : '(empty)'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Token present</span>
            <span className={token ? 'text-green-600' : 'text-red-600'}>{token ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">API /me response</span>
            <span>{!authenticated ? '(not authenticated)' : isLoading ? <Spinner size="sm" /> : isError ? <span className="text-red-500">{(error as Error)?.message}</span> : meInfo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
