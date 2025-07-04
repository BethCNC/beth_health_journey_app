import '../../styles/globals.css';

export default function ComingSoon() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Background Video */}
      <video 
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
          background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 65%, rgba(0,0,0,0.8) 100%)'
        }}
        aria-hidden="true"
      />
    </main>
  );
}