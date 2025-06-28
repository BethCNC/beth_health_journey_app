'use client';

import Image from 'next/image';
import { useState } from 'react';
import '../../styles/globals.css';

export default function HealthJourneyLanding() {
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSubmitted(true);
    // TODO: Add email collection logic
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-30 animate-gradient-animation bg-gradient-to-br from-primary-200 via-secondary-100 to-primary-100"></div>
        
        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Logo/Avatar */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-primary-200">
              <span className="text-4xl font-serif font-bold text-primary-600">B</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif font-bold text-4xl md:text-6xl lg:text-7xl text-gray-900 mb-6 leading-tight">
            My Health Journey
            <span className="block text-primary-600 text-3xl md:text-4xl lg:text-5xl mt-2">
              Connecting the Dots
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            After years of undiagnosed symptoms, endless doctor visits, and finally connecting EDS, POTS, MCAS, and autism—
            <span className="text-primary-700 font-medium"> I'm building something to help others navigate complex health journeys.</span>
          </p>

          {/* Key Points */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary-100">
              <div className="text-3xl mb-3">🧩</div>
              <h3 className="font-sans font-semibold text-gray-900 mb-2">Connect the Dots</h3>
              <p className="text-gray-600 text-sm">Track symptoms, medications, and appointments in one place</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-secondary-100">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-sans font-semibold text-gray-900 mb-2">Visualize Patterns</h3>
              <p className="text-gray-600 text-sm">See your health timeline and identify triggers</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary-100">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-sans font-semibold text-gray-900 mb-2">Share Your Story</h3>
              <p className="text-gray-600 text-sm">Communicate effectively with your medical team</p>
            </div>
          </div>

          {/* Email Signup */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/50 max-w-lg mx-auto">
            {!isEmailSubmitted ? (
              <>
                <h3 className="font-sans font-semibold text-xl text-gray-900 mb-4">
                  Be the first to know when we launch
                </h3>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Join the Waitlist
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-3">
                  No spam, just updates on our progress and launch.
                </p>
              </>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-sans font-semibold text-xl text-gray-900 mb-2">
                  Thank you!
                </h3>
                <p className="text-gray-600">
                  You'll be the first to know when we're ready to help you connect the dots in your health journey.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-center text-gray-900 mb-12">
            Why I'm Building This
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                For years, I knew something was wrong but couldn't get answers. Chronic pain, daily nausea, 
                joint dislocations, and overwhelming fatigue were dismissed or misunderstood.
              </p>
              <p className="text-gray-700 leading-relaxed">
                It wasn't until I discovered the connections between EDS (Ehlers-Danlos Syndrome), 
                POTS, MCAS, and later autism, that everything started to make sense.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <span className="text-primary-700 font-medium">The problem?</span> There's no simple way to track 
                complex, interconnected symptoms and share that story with medical professionals who might only 
                see you for 15 minutes.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
              <blockquote className="text-gray-800 font-medium text-lg italic leading-relaxed">
                "I realized I have no idea how to exist in a world that requires me to make my own decisions 
                based on what I need and want... Masking is all I know."
              </blockquote>
              <footer className="mt-4 text-sm text-gray-600">
                — From my autism discovery journey
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-gray-900 mb-8">
            What We're Building
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="font-sans font-semibold text-gray-900 mb-2">Symptom Tracking</h3>
              <p className="text-gray-600 text-sm">Daily logging with pattern recognition</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="font-sans font-semibold text-gray-900 mb-2">Appointment Management</h3>
              <p className="text-gray-600 text-sm">Prep notes and follow-up tracking</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-sans font-semibold text-gray-900 mb-2">Visual Timeline</h3>
              <p className="text-gray-600 text-sm">See your health story at a glance</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="font-sans font-semibold text-gray-900 mb-2">AI Insights</h3>
              <p className="text-gray-600 text-sm">Pattern detection and care suggestions</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            This isn't just another health app. It's a tool built by someone who understands the complexity 
            of navigating multiple conditions, medical gaslighting, and the exhaustion of explaining 
            your symptoms over and over again.
          </p>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-gray-900 mb-8">
            Join Our Community
          </h2>
          
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            Connect with others who understand complex health journeys. Share experiences, 
            find support, and help shape the future of patient-centered care.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-sans font-semibold text-gray-900 mb-2">Support Groups</h3>
              <p className="text-gray-600 text-sm">Connect with others who get it</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-sans font-semibold text-gray-900 mb-2">Resource Library</h3>
              <p className="text-gray-600 text-sm">Curated tools and information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-sans font-semibold text-gray-900 mb-2">Advocacy Tools</h3>
              <p className="text-gray-600 text-sm">Templates for better medical communication</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="font-serif font-bold text-2xl mb-4">My Health Journey</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Building tools for complex health journeys, one story at a time.
            </p>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <div>
                &copy; {currentYear} My Health Journey. Built with understanding.
              </div>
              <div className="mt-4 md:mt-0">
                <p>
                  Created by{' '}
                  <span className="text-primary-400 font-medium">Beth Cartrette</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}