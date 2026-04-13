import { ShieldX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ShieldX className="h-20 w-20 text-red-400 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">403 — Access Denied</h1>
      <p className="text-gray-500 mb-8">You don&apos;t have permission to access this page.</p>
      <button
        onClick={() => navigate('/dashboard')}
        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
