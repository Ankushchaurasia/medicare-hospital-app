

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const DoctorLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('http://localhost:5000/api/admins/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });
//       const data = await res.json();
      
//       if (data.success) {
//         // 🟢 Role aur Email ko browser me save kar rahe hain
//         localStorage.setItem('adminRole', data.admin.role);
//         localStorage.setItem('adminEmail', data.admin.email);
//         alert(`Welcome ${data.admin.role}!`);
//         navigate('/doctor-dashboard');
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       alert("Server Error!");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-green-50">
//       <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border-t-4 border-green-600">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚕️</div>
//           <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
//           <p className="text-gray-500 text-sm">Sign in to manage the portal</p>
//         </div>
//         <form onSubmit={handleLogin} className="flex flex-col gap-5">
//           <input type="email" placeholder="Email Address" required className="p-4 border rounded-xl bg-gray-50 outline-none focus:border-green-500" value={email} onChange={e => setEmail(e.target.value)} />
//           <input type="password" placeholder="Password" required className="p-4 border rounded-xl bg-gray-50 outline-none focus:border-green-500" value={password} onChange={e => setPassword(e.target.value)} />
//           <button type="submit" className="bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700 transition shadow-md">Login Securely</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DoctorLogin;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // 🟢 नया Smooth Notification

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // बटन लोडिंग के लिए
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // क्लिक करते ही लोडिंग शुरू
    
    try {
      // 🟢 Localhost को हटाकर सही रेंडर वाला लिंक लगा दिया गया है
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admins/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('adminRole', data.admin.role);
        localStorage.setItem('adminEmail', data.admin.email);
        
        // 🟢 Smooth Success Message (बिना OK बटन के)
        toast.success(`Welcome ${data.admin.role}!`, {
          style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
        
        // 1 सेकंड बाद डैशबोर्ड पर भेज देगा ताकि यूजर मैसेज पढ़ सके
        setTimeout(() => {
          navigate('/doctor-dashboard');
        }, 1000);
        
      } else {
        // 🟢 Smooth Error Message
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Server Error! Check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      
      {/* 🟢 यह Toaster वो जगह है जहाँ से मैसेज उड़ कर आएगा */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border-t-4 border-green-600">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚕️</div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-500 text-sm">Sign in to manage the portal</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input type="email" placeholder="Email Address" required className="p-4 border rounded-xl bg-gray-50 outline-none focus:border-green-500" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="p-4 border rounded-xl bg-gray-50 outline-none focus:border-green-500" value={password} onChange={e => setPassword(e.target.value)} />
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`p-4 rounded-xl font-bold text-white transition shadow-md ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isLoading ? 'Checking...' : 'Login Securely'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorLogin;