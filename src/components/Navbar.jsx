

// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

// const Navbar = () => {
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle state

//   // 👇 यहाँ सारे लिंक्स मौजूद हैं (Track Booking के साथ) 👇
//   const navLinks = [
//     { name: "Home", path: "/" },
//     { name: "Doctors", path: "/doctors" },
//     { name: "Services", path: "/services" },
//     { name: "Appointments", path: "/appointments" },
//     { name: "Track Booking", path: "/my-bookings" }, // 👈 यह वापस आ गया!
//     { name: "Contact", path: "/contact" },
//   ];

//   return (
//     <nav className="bg-white shadow-sm border-t-4 border-t-green-500 border-b border-b-green-100 sticky top-0 z-50">
      
//       {/* 🟢 TOP BAR (Always Visible) */}
//       <div className="flex items-center justify-between px-4 lg:px-8 py-4 max-w-7xl mx-auto">
        
//         {/* 1. Logo Section */}
//         <Link to="/" className="flex items-center gap-2 md:gap-3 z-50">
//           <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center border-2 border-green-500 shadow-sm">
//             <span className="text-xl">⚕️</span>
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-green-700 leading-tight">MediCare</h1>
//             <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Healthcare Solutions</p>
//           </div>
//         </Link>

//         {/* 2. Desktop Center Links (Hidden on Mobile & Tablet Portrait) */}
//         <div className="hidden lg:flex items-center gap-6 xl:gap-8 px-6 py-3 bg-white rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-green-50 text-sm font-medium">
//           {navLinks.map((link) => {
//             const isActive = location.pathname === link.path; 
//             return (
//               <Link 
//                 key={link.name} 
//                 to={link.path} 
//                 className={`relative group transition-colors whitespace-nowrap ${isActive ? "text-green-500 font-bold" : "text-gray-600 hover:text-green-500"}`}
//               >
//                 {link.name}
//                 <span className={`absolute left-1/2 -bottom-2 w-1.5 h-1.5 bg-green-500 rounded-full -translate-x-1/2 transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}></span>
//               </Link>
//             );
//           })}
//         </div>

//         {/* 3. Desktop Action Buttons */}
//         <div className="hidden lg:flex items-center gap-4">
//           <Link to="/doctor-admin/login" className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-green-700 bg-white border-2 border-green-500 rounded-full hover:bg-green-50 transition shadow-sm whitespace-nowrap">
//             <span>👤 Doctor Admin</span>
//           </Link>

//           <SignedOut>
//             <SignInButton mode="modal">
//               <button className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition shadow-md shadow-green-200 whitespace-nowrap">
//                 <span>🔐 Login</span>
//               </button>
//             </SignInButton>
//           </SignedOut>

//           <SignedIn>
//             <div className="border-2 border-green-200 rounded-full p-[2px] flex items-center justify-center">
//               <UserButton afterSignOutUrl="/" />
//             </div>
//           </SignedIn>
//         </div>

//         {/* 4. Mobile Menu Button & Profile (Visible ONLY on Mobile & Tablet Portrait) */}
//         <div className="flex lg:hidden items-center gap-4">
          
//           <SignedIn>
//             <div className="border-2 border-green-200 rounded-full p-[2px] flex items-center justify-center z-50">
//               <UserButton afterSignOutUrl="/" />
//             </div>
//           </SignedIn>

//           {/* Hamburger Icon */}
//           <button 
//             onClick={() => setIsOpen(!isOpen)} 
//             className="text-green-700 text-3xl focus:outline-none z-50"
//           >
//             {isOpen ? '✕' : '☰'}
//           </button>
//         </div>

//       </div>

//       {/* 🟢 MOBILE DROPDOWN MENU */}
//       {isOpen && (
//         <div className="lg:hidden absolute top-[72px] left-0 w-full bg-white border-t border-green-100 shadow-xl py-4 px-6 flex flex-col gap-4 z-40">
          
//           {/* Mobile Navigation Links */}
//           <div className="flex flex-col gap-2">
//             {navLinks.map((link) => {
//               const isActive = location.pathname === link.path;
//               return (
//                 <Link 
//                   key={link.name} 
//                   to={link.path} 
//                   onClick={() => setIsOpen(false)} // Click hote hi menu band ho jayega
//                   className={`px-4 py-3 rounded-xl text-base font-bold transition-colors ${isActive ? "bg-green-50 text-green-600" : "text-gray-700 hover:bg-gray-50"}`}
//                 >
//                   {link.name}
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Mobile Action Buttons */}
//           <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
//             <Link 
//               to="/doctor-admin/login" 
//               onClick={() => setIsOpen(false)}
//               className="w-full text-center px-5 py-3 text-sm font-bold text-green-700 bg-white border-2 border-green-500 rounded-xl hover:bg-green-50 transition"
//             >
//               👨‍⚕️ Doctor Admin
//             </Link>

//             <SignedOut>
//               <SignInButton mode="modal">
//                 <button 
//                   onClick={() => setIsOpen(false)}
//                   className="w-full text-center px-5 py-3 text-sm font-bold text-white bg-green-500 rounded-xl hover:bg-green-600 transition shadow-md shadow-green-200"
//                 >
//                   🔐 Patient Login
//                 </button>
//               </SignInButton>
//             </SignedOut>
//           </div>

//         </div>
//       )}

//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle state

  // 👇 यहाँ सारे लिंक्स मौजूद हैं 👇
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Doctors", path: "/doctors" },
    { name: "Services", path: "/services" },
    { name: "Appointments", path: "/appointments" },
    { name: "Track Booking", path: "/my-bookings" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-sm border-t-4 border-t-green-500 border-b border-b-green-100 sticky top-0 z-50">
      
  
      <div className="flex items-center justify-between px-4 lg:px-8 py-4 max-w-7xl mx-auto">
        
      
        <Link to="/" className="flex items-center gap-2 md:gap-3 z-50">
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden">
            <img 
              src={`http://localhost:5000/uploads/logo.png?t=${new Date().getTime()}`} 
              alt="Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
               
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
        
            <div style={{display: 'none'}} className="w-full h-full bg-blue-50 rounded-full items-center justify-center border-2 border-green-500 shadow-sm">
              <span className="text-xl">⚕️</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-700 leading-tight">MediCare</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Healthcare Solutions</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8 px-6 py-3 bg-white rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-green-50 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path; 
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`relative group transition-colors whitespace-nowrap ${isActive ? "text-green-500 font-bold" : "text-gray-600 hover:text-green-500"}`}
              >
                {link.name}
                <span className={`absolute left-1/2 -bottom-2 w-1.5 h-1.5 bg-green-500 rounded-full -translate-x-1/2 transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}></span>
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link to="/doctor-admin/login" className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-green-700 bg-white border-2 border-green-500 rounded-full hover:bg-green-50 transition shadow-sm whitespace-nowrap">
            <span>👤 Staff/Admin</span>
          </Link>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition shadow-md shadow-green-200 whitespace-nowrap">
                <span>🔐 Login</span>
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="border-2 border-green-200 rounded-full p-[2px] flex items-center justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>

        
        <div className="flex lg:hidden items-center gap-4">
          
          <SignedIn>
            <div className="border-2 border-green-200 rounded-full p-[2px] flex items-center justify-center z-50">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

         
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-green-700 text-3xl focus:outline-none z-50"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 w-full bg-white border-t border-green-100 shadow-xl py-4 px-6 flex flex-col gap-4 z-40">
          
       
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)} 
                  className={`px-4 py-3 rounded-xl text-base font-bold transition-colors ${isActive ? "bg-green-50 text-green-600" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

      
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <Link 
              to="/doctor-admin/login" 
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-5 py-3 text-sm font-bold text-green-700 bg-white border-2 border-green-500 rounded-xl hover:bg-green-50 transition"
            >
              👨‍⚕️ Staff/Admin Login
            </Link>

            <SignedOut>
              <SignInButton mode="modal">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-5 py-3 text-sm font-bold text-white bg-green-500 rounded-xl hover:bg-green-600 transition shadow-md shadow-green-200"
                >
                  🔐 Patient Login
                </button>
              </SignInButton>
            </SignedOut>
          </div>

        </div>
      )}

    </nav>
  );
};

export default Navbar;