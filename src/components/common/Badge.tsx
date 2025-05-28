
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'email' | 'linkedin' | 'sms' | 'calls';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children, className }) => {
  const badgeClasses = {
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    email: 'badge-channel-email',
    linkedin: 'badge-channel-linkedin',
    sms: 'badge-channel-sms',
    calls: 'badge-channel-calls',
  };

  return (
    <span className={cn(badgeClasses[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
