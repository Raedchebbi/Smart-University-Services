import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No data found' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <Inbox className="h-16 w-16 mb-4" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
