import { IncidentWithCamera } from '@/types';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle2, Clock, MapPin, Video, Loader2 } from 'lucide-react';
import styles from './incident-card.module.css';

interface IncidentCardProps {
  incident: IncidentWithCamera;
  onResolve: (id: number) => void;
  isResolving?: boolean;
}

// Enhanced Button component with icons support
const Button = ({
  variant = 'default',
  size = 'default',
  children,
  icon,
  ...props
}: {
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    outline: 'none',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    gap: '8px'
  };

  const variants = {
    default: {
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      color: '#1a202c',
      '&:hover': {
        backgroundColor: '#f8fafc'
      }
    },
    primary: {
      backgroundColor: '#2563eb',
      color: 'white',
      borderColor: '#2563eb',
      '&:hover': {
        backgroundColor: '#1d4ed8'
      }
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#2563eb',
      borderColor: '#2563eb',
      '&:hover': {
        backgroundColor: '#eff6ff'
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'currentColor',
      border: 'none',
      '&:hover': {
        backgroundColor: '#f8fafc'
      }
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
      {...props}
    >
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
      {children}
    </button>
  );
};

export function IncidentCard({ incident, onResolve, isResolving }: IncidentCardProps) {
  return (
    <div className={`${styles.card} ${incident.resolved ? styles.resolved : styles.active}`}>
      <div className={styles.imageContainer}>
        <img
          src={incident.thumbnailUrl} 
          alt={`Incident at ${incident.camera.location}`}
          className={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-thumbnail.jpg';
          }}
        />
        <div className={`${styles.incidentBadge} ${incident.resolved ? styles.resolvedBadge : styles.activeBadge}`}>
          {incident.resolved ? (
            <CheckCircle2 size={14} className={styles.badgeIcon} />
          ) : (
            <AlertCircle size={14} className={styles.badgeIcon} />
          )}
          <span>{incident.type}</span>
        </div>
        <button className={styles.viewButton}>
          <Video size={16} />
          <span>View</span>
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{incident.camera.name}</h3>
          <span className={styles.time}>
            <Clock size={14} className={styles.timeIcon} />
            {format(new Date(incident.tsStart), 'HH:mm')} - {format(new Date(incident.tsEnd), 'HH:mm')}
          </span>
        </div>
        <p className={styles.location}>
          <MapPin size={14} className={styles.locationIcon} />
          {incident.camera.location}
        </p>
        <div className={styles.footer}>
          <div className={styles.statusIndicator}>
            <div className={`${styles.statusDot} ${incident.resolved ? styles.resolvedDot : styles.activeDot}`} />
            <span>{incident.resolved ? 'Resolved' : 'Active'}</span>
          </div>
          {!incident.resolved && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => onResolve(incident.id)}
              disabled={isResolving}
              icon={isResolving ? <Loader2 size={14} className={styles.spinner} /> : null}
            >
              {isResolving ? 'Resolving...' : 'Resolve'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}