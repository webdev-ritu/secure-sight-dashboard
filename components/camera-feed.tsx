import styles from './camera-feed.module.css';
import { Video, RefreshCw, Maximize, Minimize, Circle, Wifi, WifiOff, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Camera {
  id: number;
  name: string;
  location: string;
  thumbnailUrl: string;
  status?: 'online' | 'offline';
}

interface Incident {
  thumbnailUrl: string;
  camera: {
    name: string;
    location: string;
  };
}

interface CameraFeedProps {
  incident: Incident;
  cameras: Camera[];
  onSelectCamera: (id: number) => void;
  onRefresh?: () => void;
}

export function CameraFeed({ incident, cameras, onSelectCamera, onRefresh }: CameraFeedProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCamera, setActiveCamera] = useState(incident.camera.name);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');

  useEffect(() => {
    // Simulate connection status changes
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? 'online' : 'offline');
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsLoading(true);
      try {
        await onRefresh();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSelectCamera = (id: number) => {
    const selectedCamera = cameras.find(camera => camera.id === id);
    if (selectedCamera) {
      setActiveCamera(selectedCamera.name);
      onSelectCamera(id);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`${styles.cameraFeed} ${isFullscreen ? styles.fullscreen : ''}`}>
      <div className={styles.mainFeed}>
        <div className={styles.feedHeader}>
          <div className={styles.cameraInfo}>
            <Video size={18} className={styles.icon} />
            <div>
              <h3 className={styles.cameraName}>{activeCamera}</h3>
              <div className={styles.statusIndicator}>
                {connectionStatus === 'online' ? (
                  <>
                    <Wifi size={14} className={styles.onlineIcon} />
                    <span>Live</span>
                    <Circle size={8} fill="#22c55e" className={styles.pulseDot} />
                  </>
                ) : (
                  <>
                    <WifiOff size={14} className={styles.offlineIcon} />
                    <span>Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={styles.feedControls}>
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className={styles.controlButton}
              aria-label="Refresh feed"
            >
              <RefreshCw size={18} className={`${styles.icon} ${isLoading ? styles.spin : ''}`} />
              <span className={styles.tooltip}>Refresh</span>
            </button>
            <button 
              onClick={toggleFullscreen}
              className={styles.controlButton}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize size={18} className={styles.icon} />
              ) : (
                <Maximize size={18} className={styles.icon} />
              )}
              <span className={styles.tooltip}>
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </span>
            </button>
          </div>
        </div>
        
        <div className={styles.feedContainer}>
          <Image
            src={incident.thumbnailUrl}
            alt={`Live feed from ${incident.camera.name}`}
            className={styles.mainImage}
            width={640}
            height={360}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/default-camera.jpg';
              (e.currentTarget as HTMLImageElement).className = `${styles.mainImage} ${styles.fallbackImage}`;
            }}
          />
          {isLoading && (
            <div className={styles.loadingOverlay}>
              <RefreshCw size={32} className={styles.spin} />
              <p>Refreshing feed...</p>
            </div>
          )}
          <div className={styles.timeStamp}>
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className={styles.thumbnailGrid}>
        <div className={styles.thumbnailHeader}>
          <h4 className={styles.thumbnailTitle}>Available Cameras</h4>
          <span className={styles.cameraCount}>{cameras.length} cameras</span>
        </div>
        <div className={styles.thumbnailContainer}>
          {cameras.map(camera => (
            <button
              key={camera.id}
              className={`${styles.thumbnail} ${activeCamera === camera.name ? styles.active : ''}`}
              onClick={() => handleSelectCamera(camera.id)}
              aria-label={`Switch to ${camera.name} camera`}
            >
              <div className={styles.thumbnailImageContainer}>
                <Image
                  src={camera.thumbnailUrl && camera.thumbnailUrl.trim() !== "" ? camera.thumbnailUrl : "/default-camera.jpg"}
                  alt={`Thumbnail for ${camera.name}`}
                  className={styles.thumbnailImage}
                  width={100}
                  height={75}
                />
                <div className={`${styles.cameraStatus} ${
                  camera.status === 'offline' ? styles.offline : styles.online
                }`}>
                  {camera.status === 'offline' ? (
                    <WifiOff size={12} />
                  ) : (
                    <Wifi size={12} />
                  )}
                </div>
              </div>
              <div className={styles.thumbnailInfo}>
                <p className={styles.thumbnailLabel}>
                  <Video size={14} className={styles.cameraIcon} />
                  {camera.name}
                </p>
                <p className={styles.thumbnailLocation}>
                  <MapPin size={12} className={styles.locationIcon} />
                  {camera.location}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}