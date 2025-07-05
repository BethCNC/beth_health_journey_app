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
      // Title: fade in 6-8s, out 18-20s
      let o = 0;
      if (t >= 6 && t < 8) o = (t - 6) / 2;
      else if (t >= 8 && t < 18) o = 1;
      else if (t >= 18 && t < 20) o = 1 - (t - 18) / 2;
      setTitleOpacity(o);

      // Subtext: fade in 8-10s, out 18-20s
      let so = 0;
      if (t >= 8 && t < 10) so = (t - 8) / 2;
      else if (t >= 10 && t < 18) so = 1;
      else if (t >= 18 && t < 20) so = 1 - (t - 18) / 2;
      setSubOpacity(so);

      // Logo: fade in 10-12s, out 18-20s
      let lo = 0;
      if (t >= 10 && t < 12) lo = (t - 10) / 2;
      else if (t >= 12 && t < 18) lo = 1;
      else if (t >= 18 && t < 20) lo = 1 - (t - 18) / 2;
      setLogoOpacity(lo);
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return (
    <main className="relative w-full h-screen min-h-screen overflow-hidden font-[var(--font-focus-grotesk)]">
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
      {/* Content Box: bottom-right on desktop, centered on mobile */}
      <div className="absolute inset-0 flex items-end justify-end p-8 sm:p-12 md:p-24">
        <div
          className="flex flex-col items-center w-full max-w-[432px] bg-transparent"
          style={{gap: 24}}
        >
          {/* Title */}
          <div className="flex w-full justify-center">
            <div
              className="font-[300] text-white leading-none"
              style={{
                fontFamily: "Focus Grotesk, Arial, sans-serif",
                fontWeight: 300,
                fontSize: "120px",
                textShadow: "0px 2px 2px rgba(0,0,0,0.25)",
                letterSpacing: 0,
                textAlign: "center",
                width: "100%",
                display: "block",
                marginBottom: "48px",
                opacity: titleOpacity,
                transition: "opacity 0.5s"
              }}
            >
              coming soon
            </div>
          </div>
          {/* Subtitle */}
          <div
            className="flex w-full justify-center"
            style={{
              fontFamily: "Focus Grotesk, Arial, sans-serif",
              fontWeight: 300,
              fontSize: "42px",
              textShadow: "0px 2px 2px rgba(0,0,0,0.25)",
              letterSpacing: 0,
              textAlign: "center",
              display: "block",
              maxWidth: "339px",
              margin: "0 auto",
              marginBottom: "24px",
              whiteSpace: "pre-line",
              opacity: subOpacity,
              transition: "opacity 0.5s"
            }}
          >
            <span className="w-full">
              <p className="m-0 mb-6">One zebra's long road to answers.</p>
              <p className="m-0 mb-6">hEDS, POTS & MCAS</p>
              <p className="m-0">This is my story.</p>
            </span>
          </div>
          {/* Logo (SVG only, animated) */}
          <img
            src="/logo.svg"
            alt="bendy bethc logo"
            className="w-[92px] h-[54px] mt-6"
            style={{
              objectFit: "contain",
              opacity: logoOpacity,
              transition: "opacity 0.5s"
            }}
          />
        </div>
      </div>
      {/* Responsive: Center content on small screens */}
      <style>{`
        @media (max-width: 900px) {
          .flex.items-end.justify-end {
            justify-content: center !important;
            align-items: center !important;
          }
        }
      `}</style>
    </main>
  );
}