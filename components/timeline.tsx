// components/timeline.tsx
import { IncidentWithCamera } from '@/types';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import styles from './timeline.module.css';

interface TimelineProps {
  incidents: IncidentWithCamera[];
}

export function Timeline({ incidents }: TimelineProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>24h Activity</h3>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <AlertCircle size={14} className={styles.activeIcon} />
            <span>Active</span>
          </span>
          <span className={styles.legendItem}>
            <CheckCircle2 size={14} className={styles.resolvedIcon} />
            <span>Resolved</span>
          </span>
        </div>
      </div>
      
      <div className={styles.timeline}>
        {hours.map(hour => {
          const date = new Date();
          date.setHours(hour, 0, 0, 0);
          
          return (
            <div 
              key={hour} 
              className={styles.hourMarker}
              style={{ left: `${(hour / 24) * 100}%` }}
            >
              <span className={styles.hourLabel}>
                {format(date, 'HH')}
              </span>
            </div>
          );
        })}
        
        <div className={styles.currentTimeIndicator}>
          <Clock size={14} className={styles.clockIcon} />
          <div className={styles.timeLine} />
        </div>
        
        {incidents.map(incident => {
          const startDate = new Date(incident.tsStart);
          const endDate = new Date(incident.tsEnd);
          
          const startHour = startDate.getHours();
          const startMinute = startDate.getMinutes();
          const endHour = endDate.getHours();
          const endMinute = endDate.getMinutes();
          
          const startPos = (startHour + startMinute / 60) / 24 * 100;
          const endPos = (endHour + endMinute / 60) / 24 * 100;
          const width = Math.max(0.5, endPos - startPos);
          
          return (
            <div 
              key={incident.id}
              className={`${styles.incidentBar} ${
                incident.resolved ? styles.resolved : styles.active
              }`}
              style={{ 
                left: `${startPos}%`, 
                width: `${width}%`
              }}
              title={`${incident.type} at ${incident.camera.name}\n${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`}
            >
              <div className={styles.incidentTooltip}>
                <div className={styles.tooltipHeader}>
                  {incident.resolved ? (
                    <CheckCircle2 size={16} className={styles.resolvedIcon} />
                  ) : (
                    <AlertCircle size={16} className={styles.activeIcon} />
                  )}
                  <span className={styles.incidentType}>{incident.type}</span>
                </div>
                <div className={styles.tooltipContent}>
                  <span>Camera: {incident.camera.name}</span>
                  <span>Duration: {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}