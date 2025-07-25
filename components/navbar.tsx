// components/navbar.tsx
import { User, Shield, Menu, Bell } from 'lucide-react';
import styles from './navbar.module.css';

// Local Button component implementation (unchanged)
const Button = ({
  variant = 'default',
  size = 'default',
  children,
  className = '',
  ...props
}: {
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  size?: 'icon' | 'sm' | 'default' | 'lg';
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    outline: 'none',
    border: '1px solid transparent',
    backgroundColor: 'transparent'
  };

  const variants = {
    default: {
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0'
    },
    primary: {
      backgroundColor: '#2563eb',
      color: 'white',
      borderColor: '#2563eb'
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#2563eb',
      borderColor: '#2563eb'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'currentColor',
      border: 'none'
    }
  };

  const sizes = {
    sm: {
      height: '32px',
      padding: '0 12px',
      fontSize: '14px'
    },
    default: {
      height: '40px',
      padding: '0 16px',
      fontSize: '16px'
    },
    lg: {
      height: '48px',
      padding: '0 24px',
      fontSize: '18px'
    },
    icon: {
      height: '40px',
      width: '40px',
      padding: '0'
    }
  };

  return (
    <button
      style={{
        ...baseStyle,
        ...variants[variant],
        ...sizes[size],
        ...(props.disabled && { opacity: 0.5, cursor: 'not-allowed' })
      }}
      className={`${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Button variant="ghost" size="icon" className={styles.menuButton}>
          <Menu size={24} />
        </Button>
        <div className={styles.brandContainer}>
          <Shield className={styles.brandIcon} size={24} />
          <h1 className={styles.brand}>SecureSight</h1>
        </div>
      </div>
      <div className={styles.navbarRight}>
        <Button variant="ghost" size="icon" className={styles.notificationButton}>
          <Bell className={styles.icon} size={20} />
          <span className={styles.notificationBadge}>3</span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className={styles.icon} size={20} />
        </Button>
      </div>
    </header>
  );
}