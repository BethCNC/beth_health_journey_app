"use client";
import '../../styles/globals.css';
import {useEffect, useRef, useState} from 'react';
import Head from 'next/head';

export default function ComingSoon() {
  const videoRef = useRef(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => {
      const t = video.currentTime;
      let o = 0;
      if (t >= 6 && t < 8) {
        o = (t - 6) / 2; // fade in 0->1
      } else if (t >= 8 && t < 18) {
        o = 1;
      } else if (t >= 18 && t < 20) {
        o = 1 - (t - 18) / 2; // fade out 1->0
      } else {
        o = 0;
      }
      setOpacity(o);
    };
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Focus+Grotesk:wght@300&display=swap" />
      </Head>
      {/* Background Video */}
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/zebra_slow.mp4"
      >
        Your browser does not support the video tag.
      </video>
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)'
        }}
        aria-hidden="true"
      />
      {/* Animated Coming Soon Text */}
      <div
        className="absolute inset-0 flex items-center justify-center z-20 select-none"
        style={{pointerEvents: 'none'}}
      >
        <span
          style={{
            opacity,
            transition: 'opacity 0.5s',
            fontFamily: 'Focus Grotesk, Arial, sans-serif',
            fontWeight: 300,
            fontSize: '96px',
            color: '#fff',
            textShadow: '0px 2px 2px rgba(0,0,0,0.25)',
            letterSpacing: 0,
            lineHeight: 1,
            textAlign: 'center',
          }}
        >
          coming soon
        </span>
      </div>
    </main>
  );
}