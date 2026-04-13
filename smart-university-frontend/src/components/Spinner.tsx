interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

export function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${sizeMap[size]} animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600`} />
    </div>
  );
}
