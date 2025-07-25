'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { IncidentCard } from '@/components/incident-card';
import { CameraFeed } from '@/components/camera-feed';
import { Timeline } from '@/components/timeline';
import { IncidentWithCamera } from '@/types';
import { Activity, AlertCircle, Clock, Loader2 } from 'lucide-react';
import styles from './page.module.css';

export default function Dashboard() {
  const [incidents, setIncidents] = useState<IncidentWithCamera[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentWithCamera | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [cameras, setCameras] = useState<{ id: number; name: string; location: string; thumbnailUrl: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/incidents?resolved=false');
        const data: IncidentWithCamera[] = await response.json();
        setIncidents(data);
        
        if (data.length > 0 && !selectedIncident) {
          setSelectedIncident(data[0]);
        }
        
        // Get unique cameras
        const uniqueCameras = data.reduce((acc: { id: number; name: string; location: string; thumbnailUrl: string }[], incident) => {
          if (!acc.some(cam => cam.id === incident.camera.id)) {
            acc.push({
              id: incident.camera.id,
              name: incident.camera.name,
              location: incident.camera.location,
              thumbnailUrl: incident.camera.thumbnailUrl
            });
          }
          return acc;
        }, []);
        
        setCameras(uniqueCameras);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const handleResolve = async (id: number) => {
    setIsResolving(true);
    try {
      const response = await fetch(`/api/incidents/${id}/resolve`, {
        method: 'PATCH',
      });
      const updatedIncident: IncidentWithCamera = await response.json();
      
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === id ? updatedIncident : incident
        )
      );
      
      if (selectedIncident?.id === id) {
        const nextIncident = incidents.find(i => !i.resolved && i.id !== id);
        setSelectedIncident(nextIncident || null);
      }
    } catch (error) {
      console.error('Error resolving incident:', error);
    } finally {
      setIsResolving(false);
    }
  };

  const handleSelectCamera = (cameraId: number) => {
    const incidentForCamera = incidents.find(incident => 
      incident.cameraId === cameraId && !incident.resolved
    );
    if (incidentForCamera) {
      setSelectedIncident(incidentForCamera);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={32} className={styles.spinner} />
        <p>Loading security dashboard...</p>
      </div>
    );
  }

  if (!selectedIncident) {
    return (
      <div className={styles.emptyState}>
        <AlertCircle size={48} className={styles.emptyIcon} />
        <h2>No active incidents</h2>
        <p>All security systems are currently normal</p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Navbar />
      
      <div className={styles.dashboardContainer}>
        <div className={styles.gridLayout}>
          {/* Left side - Camera feed */}
          <div className={styles.mainContent}>
            <div className={styles.contentHeader}>
              <h2 className={styles.sectionTitle}>
                <Activity size={20} className={styles.titleIcon} />
                Live Monitoring
              </h2>
              <div className={styles.statsBadge}>
                {incidents.filter(i => !i.resolved).length} active incidents
              </div>
            </div>
            
            <CameraFeed 
              incident={selectedIncident} 
              cameras={cameras}
              onSelectCamera={handleSelectCamera}
            />
            <Timeline incidents={incidents} />
          </div>
          
          {/* Right side - Incident list */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>
                <Clock size={20} className={styles.titleIcon} />
                Recent Incidents
              </h2>
              <div className={styles.timeDisplay}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            <div className={styles.incidentsContainer}>
              {incidents.length > 0 ? (
                incidents.map(incident => (
                  <IncidentCard
                    key={incident.id}
                    incident={incident}
                    onResolve={handleResolve}
                    isResolving={isResolving && incident.id === selectedIncident.id}
                  />
                ))
              ) : (
                <div className={styles.noIncidents}>
                  <AlertCircle size={24} />
                  <p>No incidents detected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}