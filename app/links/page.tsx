'use client';

import Image from 'next/image';

const links = [
  {
    id: 'youtube',
    title: '🎥 Watch Day 13: EDS + Autism',
    url: 'https://youtube.com/watch?v=placeholder',
    description: 'My latest video on EDS and autism intersection',
  },
  {
    id: 'instagram',
    title: '📷 My EDS Awareness Posts',
    url: 'https://instagram.com/bethcnc',
    description: 'Follow my journey and awareness content',
  },
  {
    id: 'website',
    title: '💻 Visit bethcnc.com',
    url: 'https://bethcnc.com',
    description: 'My main website and blog',
  },
  {
    id: 'notion',
    title: '📓 Read My Medical Story',
    url: 'https://notion.so/medical-story',
    description: 'Detailed health journey documentation',
  },
  {
    id: 'email',
    title: '✉️ Get in Touch',
    url: 'mailto:beth@bethcnc.com',
    description: 'Email me for collaborations or questions',
  },
];

export default function LinksPage() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (linkId: string, url: string) => {
    // Analytics tracking could go here
    console.log(`Link clicked: ${linkId}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc53e2' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="relative mx-auto mb-6">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-pink-200 shadow-lg">
                <Image
                  src="/avatar.png"
                  alt="Beth Cartrette"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Beth Cartrette
            </h1>
            <p className="text-lg text-gray-600 mb-3">
              @bethcnc
            </p>
            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
              EDS Awareness Advocate • Medical Storyteller • Health Journey Blogger
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-4 mb-8">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                className="w-full group relative overflow-hidden"
              >
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-pink-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200">
                        {link.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {link.description}
                      </div>
                    </div>
                    <div className="ml-3 text-gray-400 group-hover:text-pink-500 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-2">
              Thanks for visiting! 💜
            </div>
            <div className="text-xs text-gray-300">
              © {currentYear} Beth Cartrette. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-10 left-10 w-20 h-20 bg-pink-200/20 rounded-full blur-xl pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 bg-green-200/20 rounded-full blur-xl pointer-events-none"></div>
    </div>
  );
} 