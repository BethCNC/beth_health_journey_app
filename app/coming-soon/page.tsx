"use client";
import '../../styles/globals.css';
import {useEffect, useRef, useState} from 'react';

export default function ComingSoon() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);
  const [subOpacity, setSubOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => {
      const t = video.currentTime;
      let o = 0;
      let so = 0;
      if (t >= 6 && t < 8) {
        o = (t - 6) / 2;
      } else if (t >= 8 && t < 18) {
        o = 1;
      } else if (t >= 18 && t < 20) {
        o = 1 - (t - 18) / 2;
      } else {
        o = 0;
      }
      // Subtext fades in after 8s, out at 18s
      if (t >= 8 && t < 10) {
        so = (t - 8) / 2;
      } else if (t >= 10 && t < 18) {
        so = 1;
      } else if (t >= 18 && t < 20) {
        so = 1 - (t - 18) / 2;
      } else {
        so = 0;
      }
      setOpacity(o);
      setSubOpacity(so);
    };
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/zebra_slow.mp4"
      />
      {/* Gradient */}
      <div
        className="absolute inset-0 z-10"
        style={{
          pointerEvents: 'none',
          background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%)'
        }}
        aria-hidden="true"
      />
      {/* Content Block */}
      <div
        className="absolute z-20 flex flex-col items-center"
        style={{
          top: '218px',
          right: '93px',
          width: '432px',
          background: 'none',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            opacity,
            transition: 'opacity 0.5s',
            fontFamily: 'Focus Grotesk, Arial, sans-serif',
            fontWeight: 300,
            fontSize: '120px',
            lineHeight: '0.973em',
            color: '#fff',
            textShadow: '0px 2px 2px rgba(0,0,0,0.25)',
            letterSpacing: 0,
            textAlign: 'center',
            width: '100%',
            display: 'block',
            marginBottom: '24px',
            opacity: 0.9,
          }}
        >
          coming soon
        </span>
        {/* Divider */}
        <div
          style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255,255,255,0.3)',
            marginBottom: '24px',
          }}
        />
        <span
          style={{
            opacity: subOpacity,
            transition: 'opacity 0.5s',
            fontFamily: 'Focus Grotesk, Arial, sans-serif',
            fontWeight: 300,
            fontSize: '42px',
            lineHeight: '0.973em',
            color: '#fff',
            textShadow: '0px 2px 2px rgba(0,0,0,0.25)',
            letterSpacing: 0,
            textAlign: 'center',
            display: 'block',
            maxWidth: '339px',
            margin: '0 auto',
            marginBottom: '24px',
            whiteSpace: 'pre-line',
          }}
        >
          {`One zebra's long road to answers.\nhEDS, POTS & MCAS\nThis is my story.`}
        </span>
        {/* Divider below subtext */}
        <div
          style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255,255,255,0.3)',
            marginBottom: '24px',
          }}
        />
        {/* Logo always visible */}
        <img
          src="/logo.svg"
          alt="bendy bethc logo"
          style={{ width: '92px', height: '54px', display: 'block', margin: '0 auto', marginBottom: '93px' }}
        />
      </div>
    </main>
  );
}