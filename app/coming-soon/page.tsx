"use client";
import {useEffect, useRef, useState} from "react";

export default function ComingSoon() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [titleOpacity, setTitleOpacity] = useState(0);
  const [subOpacity, setSubOpacity] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => {
      const t = video.currentTime;
      // Title: fade in 7-9s, out 23-25s
      let o = 0;
      if (t >= 7 && t < 9) o = (t - 7) / 2;
      else if (t >= 9 && t < 23) o = 1;
      else if (t >= 23 && t < 25) o = 1 - (t - 23) / 2;
      setTitleOpacity(o);

      // Subtext: fade in 10-12s, out 23-25s
      let so = 0;
      if (t >= 10 && t < 12) so = (t - 10) / 2;
      else if (t >= 12 && t < 23) so = 1;
      else if (t >= 23 && t < 25) so = 1 - (t - 23) / 2;
      setSubOpacity(so);

      // Logo: fade in 13-15s, out 23-25s
      let lo = 0;
      if (t >= 13 && t < 15) lo = (t - 13) / 2;
      else if (t >= 15 && t < 23) lo = 1;
      else if (t >= 23 && t < 25) lo = 1 - (t - 23) / 2;
      setLogoOpacity(lo);
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return (
    <main className="relative w-full h-screen min-h-screen overflow-hidden" style={{fontFamily: "Focus Grotesk, Arial, sans-serif"}}>
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/zebra_slow.mp4"
        aria-hidden="true"
      />
      {/* Right-side Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 100%)"
        }}
        aria-hidden="true"
      />
      {/* Content Box */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          top: 218,
          left: 960,
          width: 432,
          gap: 24,
          position: "absolute",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        {/* Title */}
        <div className="title" style={{
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div className="title1" style={{
            flex: 1,
            position: "relative",
            fontWeight: 300,
            fontSize: 120,
            textShadow: "0px 2px 2px rgba(0,0,0,0.25)",
            opacity: titleOpacity,
            color: "#fff",
            lineHeight: "1",
            fontFamily: "Focus Grotesk, Arial, sans-serif",
            transition: "opacity 0.5s"
          }}>
            coming soon
          </div>
        </div>
        {/* Subtitle */}
        <div className="subtext" style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 42,
          color: "#fff",
          textShadow: "0px 2px 2px rgba(0,0,0,0.25)",
          fontWeight: 300,
          width: 339,
          position: "relative",
          opacity: subOpacity,
          transition: "opacity 0.5s"
        }}>
          <span className="title-txt" style={{width: "100%"}}>
            <p className="one-zebras-long" style={{marginBlockStart: 0, marginBlockEnd: 24}}>One zebra's long road to answers.</p>
            <p className="one-zebras-long" style={{marginBlockStart: 0, marginBlockEnd: 24}}>hEDS, POTS & MCAS</p>
            <p className="this-is-my" style={{margin: 0}}>This is my story.</p>
          </span>
        </div>
        {/* Logo */}
        <img
          className="logo-icon"
          src="/logo.svg"
          alt="bendy bethc logo"
          style={{
            width: 92,
            height: 54,
            display: "block",
            opacity: logoOpacity,
            transition: "opacity 0.5s"
          }}
        />
      </div>
      {/* Responsive: Center content on small screens */}
      <style>{`
        @media (max-width: 1200px) {
          main > div[style] {
            left: 50vw !important;
            top: 20vh !important;
            transform: translateX(-50%);
            width: 90vw !important;
            min-width: 0 !important;
          }
          .title1 { font-size: 48px !important; }
          .subtext { font-size: 20px !important; width: 90vw !important; }
        }
        @media (max-width: 600px) {
          main > div[style] {
            top: 10vh !important;
            width: 98vw !important;
          }
          .title1 { font-size: 32px !important; }
          .subtext { font-size: 16px !important; width: 98vw !important; }
        }
      `}</style>
    </main>
  );
}