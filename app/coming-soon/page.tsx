import '../../styles/globals.css';

export default function ComingSoon() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white">
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/images/videos/optimized/milky-way-720p.mp4" // Fallback image
      >
        {/* Multiple sources for different screen sizes and device capabilities */}
        <source 
          src="/images/videos/optimized/milky-way-1080p.mp4" 
          type="video/mp4" 
          media="(min-width: 1024px)"
        />
        <source 
          src="/images/videos/optimized/milky-way-720p.mp4" 
          type="video/mp4" 
          media="(min-width: 768px)"
        />
        <source 
          src="/images/videos/optimized/milky-way-480p.mp4" 
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/40 z-5"></div>

      {/* Gradient Overlay (keeping your original design aesthetic) */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-primary-500/30 to-secondary-400/20 z-10"></div>

      <div className="relative z-20 flex flex-col items-center justify-center text-center p-8 max-w-[800px] 
        bg-white/10 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/20">
        
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center border-2 border-white/30">
            <span className="text-3xl font-serif font-bold text-white">B</span>
          </div>
        </div>

        {/* Main Content */}
        <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6 text-white drop-shadow-lg">
          My Health Journey
        </h1>
        
        <p className="font-sans text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
          We're building something special to help you track and share your complex health journey.
          <br />
          <span className="font-medium">Coming soon...</span>
        </p>

        {/* Feature Preview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 w-full max-w-2xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl mb-2">🧩</div>
            <p className="text-sm text-white/90">Connect the dots</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm text-white/90">Visualize patterns</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl mb-2">🤝</div>
            <p className="text-sm text-white/90">Share your story</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-white/80 text-sm mb-4">Want to be notified when we launch?</p>
          <a 
            href="/landing" 
            className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-200 border border-white/30 hover:border-white/50"
          >
            Join the Waitlist
          </a>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 w-full p-6 bg-black/20 backdrop-blur-md z-30">
        <div className="flex justify-between items-center max-w-[1200px] mx-auto px-4">
          <div className="text-sm text-white/70">
            &copy; {currentYear} My Health Journey. Built with understanding.
          </div>
          <div className="text-sm text-white/70">
            By <span className="text-white/90 font-medium">Beth Cartrette</span>
          </div>
        </div>
      </footer>
    </main>
  );
}