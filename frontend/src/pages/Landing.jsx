import React from 'react';
import { Heart, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white bg-opacity-50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-red-600">BloodLink</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#how" className="text-gray-700 hover:text-red-600">How it Works</a>
          <a href="#groups" className="text-gray-700 hover:text-red-600">Blood Groups</a>
          <a href="#stories" className="text-gray-700 hover:text-red-600">Stories</a>
          <a href="#contact" className="text-gray-700 hover:text-red-600">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-red-600 font-semibold hover:text-red-700">Sign In</button>
          <button className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700">
            Register Now
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 w-fit">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="text-red-600 text-sm font-medium">AI-Powered Blood Donation Platform</span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Every Drop Counts.{' '}
                <span className="text-red-600">Find Donors</span> in{' '}
                <span className="text-gray-900">Minutes.</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed">
              BloodLink connects blood donors, patients, and hospitals through AI-powered matching. In emergencies, seconds matter — we make finding compatible donors instant.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 flex items-center justify-center gap-2 transition">
                Donate Blood <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-50 flex items-center justify-center gap-2 transition">
                Find Donors <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-gray-700">Verified Donors</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="text-gray-700">Emergency 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <span className="text-gray-700">Location-Based</span>
              </div>
            </div>
          </div>

          {/* Right Side - Emergency Card */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm">EMERGENCY REQUEST</p>
                  <h3 className="text-2xl font-bold text-gray-900">Blood Needed Urgently</h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-red-600">2 min</p>
                  <p className="text-gray-500 text-xs">Avg match time</p>
                </div>
              </div>

              {/* Blood Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Blood Group</p>
                  <p className="text-2xl font-bold text-gray-900">O-</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Location</p>
                  <p className="font-semibold text-gray-900">Bir Hospital</p>
                  <p className="text-gray-500 text-sm">Kathmandu</p>
                </div>
              </div>

              {/* Found Donors Section */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">AI Found Nearby Donors</h4>
                  <span className="text-red-600 font-bold">3 matches</span>
                </div>

                {/* Donor Cards */}
                <div className="space-y-3">
                  {/* Donor 1 */}
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        R
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Rahul K.</p>
                        <p className="text-gray-500 text-xs">0.8 km away</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 font-semibold">98%</span>
                    </div>
                  </div>

                  {/* Donor 2 */}
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-200 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                        A
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Anjali M.</p>
                        <p className="text-gray-500 text-xs">1.4 km away</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 font-semibold">94%</span>
                    </div>
                  </div>

                  {/* Donor 3 */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                        S
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Suresh P.</p>
                        <p className="text-gray-500 text-xs">2.1 km away</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-700 font-semibold">87%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                Contact Top Donor
              </button>

              {/* Lives Saved Badge */}
              <div className="absolute -bottom-6 left-8 bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg">
                8,900+
                <p className="text-xs font-normal">Lives saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing for Badge */}
      <div className="h-12"></div>
    </div>
  );
}
