interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantClasses: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ text, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {text}
    </span>
  );
}

export function statusVariant(status: string): BadgeProps['variant'] {
  switch (status.toUpperCase()) {
    case 'CONFIRMED': case 'RESOLVED': return 'success';
    case 'PENDING': return 'warning';
    case 'CANCELLED': case 'REJECTED': return 'danger';
    default: return 'default';
  }
}
