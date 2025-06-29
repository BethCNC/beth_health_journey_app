import '../../styles/globals.css';

export default function ComingSoon() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Background Video with CSS fallback */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/images/videos/optimized/zebra-micro-720p.mp4"
      >
        {/* Multiple sources for different screen sizes and device capabilities */}
        <source 
          src="/images/videos/optimized/zebra-micro-1080p.mp4" 
          type="video/mp4" 
          media="(min-width: 1024px)"
        />
        <source 
          src="/images/videos/optimized/zebra-micro-720p.mp4" 
          type="video/mp4" 
          media="(min-width: 768px)"
        />
        <source 
          src="/images/videos/optimized/zebra-micro-480p.mp4" 
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </main>
  );
}