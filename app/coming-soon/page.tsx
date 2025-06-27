import Image from 'next/image';
import '../../styles/globals.css';

export default function ComingSoon() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white
      bg-[hsla(317.1428571428571,57%,68%,1)] bg-blend-overlay animate-gradient-animation">
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-[800px] 
        bg-white/10 backdrop-blur-xl rounded-[20px] shadow-lg">
        <div className="mb-6">
          <Image src="/company-logo.png" alt="Health Journey Logo" width={180} height={120} priority />
        </div>
        <h1 className="font-bold text-4xl mb-4 text-white drop-shadow-md">
          My Health Journey
        </h1>
        <p className="font-medium text-xl text-white/90 mb-8">
          We're building something special to help you track and share your health journey.
          <br />
          Check back soon!
        </p>
      </div>

      <footer className="absolute bottom-0 left-0 w-full p-4 bg-black/20 backdrop-blur-md z-20">
        <div className="flex justify-between items-center max-w-[1200px] mx-auto px-4">
          <div className="text-sm text-white/70">
            &copy; {currentYear} Health Journey. All rights reserved.
          </div>
          <div className="flex gap-4">
            {/* Social icons can be added here when available */}
          </div>
        </div>
      </footer>
    </main>
  );
} 