import { useRef, useState } from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';
import styles from './ProductVideo.module.css';

export default function ProductVideo({ src, poster }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    };

    if (!src) return null;

    return (
        <div className={styles.container}>
            <video
                ref={videoRef}
                src={src}
                className={styles.video}
                muted={isMuted}
                loop
                playsInline
                onClick={togglePlay}
                poster={poster}
            />

            <div className={styles.controls}>
                <button className={styles.controlBtn} onClick={togglePlay}>
                    {isPlaying ? <FiPause /> : <FiPlay />}
                </button>
                <button className={styles.controlBtn} onClick={toggleMute}>
                    {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                </button>
            </div>
        </div>
    );
}
