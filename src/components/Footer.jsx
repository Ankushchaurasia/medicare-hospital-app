

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter a valid email address.");
    alert(`Thank you! Health updates will be sent to ${email}`);
    setEmail(''); 
  };

  return (
    <footer className="bg-gray-50 pt-10 pb-6 px-4 md:px-8 font-sans relative">
      
      {/* 🌟 COMPACT FLOATING DARK CARD 🌟 */}
      <div className="max-w-7xl mx-auto bg-[#022c22] rounded-[2rem] p-8 md:p-10 relative overflow-hidden shadow-xl">
        
        {/* Background Glowing Circles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
          
          {/* COLUMN 1: Brand */}
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-black mb-3 flex items-center gap-2">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                  <span className="text-green-400 text-xl">⚕️</span>
                </div>
                MediCare
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed mb-4 font-medium">
                Redefining healthcare with technology. Book appointments and consult top doctors seamlessly.
              </p>
              <div className="flex flex-col gap-1 text-xs text-gray-300 mb-4">
                <a href="tel:+919289841669" className="hover:text-green-400 transition-colors">📞 +91 92898 41669</a>
                <a href="mailto:ac2682004@gmail.com" className="hover:text-green-400 transition-colors">✉️ ac2682004@gmail.com</a>
              </div>
            </div>
            {/* Small Social Icons */}
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 hover:text-[#022c22] transition-colors text-xs font-bold">FB</a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 hover:text-[#022c22] transition-colors text-xs font-bold">IG</a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 hover:text-[#022c22] transition-colors text-xs font-bold">IN</a>
            </div>
          </div>

          {/* COLUMN 2: Links */}
          <div>
            <h3 className="text-base font-bold mb-4 text-white/90 border-b-2 border-green-500 inline-block pb-1">Quick Links</h3>
            <ul className="space-y-2.5 text-gray-400 text-sm font-medium">
              <li><Link to="/" onClick={scrollToTop} className="hover:text-green-400 transition-colors">Home</Link></li>
              <li><Link to="/doctors" onClick={scrollToTop} className="hover:text-green-400 transition-colors">Find a Doctor</Link></li>
              <li><Link to="/services" onClick={scrollToTop} className="hover:text-green-400 transition-colors">Lab Services</Link></li>
              <li><Link to="/my-bookings" onClick={scrollToTop} className="hover:text-green-400 transition-colors">Track Bookings</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: Departments */}
          <div>
            <h3 className="text-base font-bold mb-4 text-white/90 border-b-2 border-green-500 inline-block pb-1">Departments</h3>
            <ul className="space-y-2.5 text-gray-400 text-sm font-medium">
              <li className="hover:text-green-400 cursor-pointer transition-colors">❤️ Cardiology</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">🧠 Neurology</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">🦴 Orthopedics</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">👶 Pediatrics</li>
            </ul>
          </div>

          {/* COLUMN 4: Compact Newsletter */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 h-max">
            <h3 className="text-base font-bold mb-2">Get Updates</h3>
            <p className="text-xs text-gray-400 mb-3">Subscribe for health tips & news.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-xs text-white placeholder-gray-400 outline-none focus:border-green-400 transition-colors" 
              />
              <button type="submit" className="w-full bg-green-500 text-[#022c22] font-bold py-2 rounded-lg hover:bg-green-400 transition-all text-sm shadow-md">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT LINE (Tight Spacing) */}
        <div className="relative z-10 border-t border-white/10 mt-8 pt-5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} MediCare.</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
          </div>
          <p className="mt-3 md:mt-0">Designed by <span className="text-green-400 font-bold">Ankush Chaurasia</span></p>
        </div>

      </div>

      {/* 🟢 SMALLER SCROLL TO TOP BUTTON 🟢 */}
      <button 
        onClick={scrollToTop} 
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-all duration-300 z-50 border-2 border-white ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

    </footer>
  );
};

export default Footer;