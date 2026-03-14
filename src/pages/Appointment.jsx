
// import React, { useState, useEffect } from 'react';
// import { useUser, SignInButton } from '@clerk/clerk-react';

// const Appointment = () => {
//   const { isSignedIn, user } = useUser();

//   const [doctors, setDoctors] = useState([]);
//   const [generatedBill, setGeneratedBill] = useState(null); 
//   const [isProcessing, setIsProcessing] = useState(false); 

//   const [form, setForm] = useState({
//     name: user?.fullName || '', 
//     phone: '', 
//     date: '', 
//     time: '', 
//     doctorId: ''
//   });

//   useEffect(() => {
//     fetch('http://localhost:5000/api/doctors/all')
//       .then(res => res.json())
//       .then(data => setDoctors(data))
//       .catch(err => console.log(err));
//   }, []);

//   const selectedDoctor = doctors.find(d => d._id === form.doctorId);
//   const feeAmount = selectedDoctor ? selectedDoctor.fee : 500; 
//   const handlePaymentAndBooking = async (e) => {
//     e.preventDefault();
//     if (!form.doctorId) return alert("Please select a Doctor first!");

//     setIsProcessing(true);

    
//     setTimeout(async () => {
      
//       const fakeTxnId = "TXN_" + Math.floor(Math.random() * 1000000000); // Jaise TXN_847362819

//       const appointmentData = {
//         name: form.name,
//         phone: form.phone,
//         date: form.date,
//         time: form.time,
//         doctorName: selectedDoctor.name,
//         department: selectedDoctor.specialty,
//         fee: feeAmount,
//         paymentStatus: 'Paid ✅',
//         transactionId: fakeTxnId,
//         adminEmail: selectedDoctor.adminEmail || '' 
//       };

     
//       setGeneratedBill(appointmentData);
//       setIsProcessing(false);

     
//       try {
//         await fetch('http://localhost:5000/api/appointments/add', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(appointmentData)
//         });
//       } catch (error) {
//         console.log("Database Save Error:", error);
//       }

//     }, 1500); 
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
//       <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
//         <div className="bg-green-600 p-8 text-center text-white">
//           <h1 className="text-3xl font-bold mb-2">Book Your Appointment</h1>
//           <p className="text-green-100">Quick, safe, and secure online booking (Demo Mode)</p>
//         </div>

//         <div className="p-8">
        
//           {!isSignedIn ? (
//             <div className="text-center py-10 flex flex-col items-center">
//               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">🔒</div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
//               <p className="text-gray-500 mb-6">You must be logged in as a patient to book an appointment.</p>
              
//               <SignInButton mode="modal">
//                 <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-green-700 transition shadow-lg flex items-center gap-2">
//                   <span>🔐</span> Login to Continue
//                 </button>
//               </SignInButton>
//             </div>
//           ) : (
          
//             <form onSubmit={handlePaymentAndBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              
//               <div className="flex flex-col"><label className="text-sm font-bold text-gray-600 mb-2">Patient Name *</label><input type="text" required className="p-4 border rounded-xl outline-none focus:border-green-500 bg-gray-50" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
//               <div className="flex flex-col"><label className="text-sm font-bold text-gray-600 mb-2">Phone Number *</label><input type="tel" required className="p-4 border rounded-xl outline-none focus:border-green-500 bg-gray-50" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
//               <div className="flex flex-col"><label className="text-sm font-bold text-gray-600 mb-2">Select Date *</label><input type="date" required className="p-4 border rounded-xl outline-none focus:border-green-500 bg-gray-50" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
//               <div className="flex flex-col"><label className="text-sm font-bold text-gray-600 mb-2">Select Time *</label><input type="time" required className="p-4 border rounded-xl outline-none focus:border-green-500 bg-gray-50" value={form.time} onChange={e => setForm({...form, time: e.target.value})} /></div>
              
//               <div className="flex flex-col md:col-span-2">
//                 <label className="text-sm font-bold text-gray-600 mb-2">Choose Doctor *</label>
//                 <select required className="p-4 border rounded-xl outline-none focus:border-green-500 bg-white" value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})}>
//                   <option value="" disabled>-- Select a Doctor --</option>
//                   {doctors.filter(d => d.isAvailable).map(doc => (<option key={doc._id} value={doc._id}>{doc.name} ({doc.specialty}) - Fee: ₹{doc.fee}</option>))}
//                 </select>
//               </div>

//               <div className="md:col-span-2 bg-green-50 p-6 rounded-xl border border-green-100 flex justify-between items-center mt-4">
//                 <div><p className="text-sm text-green-800 font-bold">Consultation Fee</p><p className="text-xs text-green-600">Simulated Payment for Testing</p></div>
//                 <div className="text-3xl font-black text-green-700">₹{feeAmount}</div>
//               </div>

//               <div className="md:col-span-2 mt-2">
//                 <button type="submit" disabled={isProcessing} className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition text-lg flex justify-center items-center gap-2 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
//                   {isProcessing ? 'Processing Payment...' : `Pay ₹${feeAmount} & Confirm Booking`}
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>

//     {/* //for billing */}
//       {generatedBill && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            
//             <div className="bg-green-600 p-6 text-center text-white">
//               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
//                 <span className="text-3xl">✅</span>
//               </div>
//               <h2 className="text-2xl font-bold tracking-wide">Payment Successful</h2>
//               <p className="text-green-100 text-sm mt-1">Your appointment is confirmed!</p>
//             </div>

//             <div className="p-6 bg-[#f8fdfa] border-b-2 border-dashed border-gray-200" id="printable-bill">
//               <div className="flex justify-between items-center mb-6">
//                 <div><h3 className="text-xl font-bold text-gray-800">MediCare+</h3><p className="text-xs text-gray-500">Official Payment Receipt</p></div>
//                 <div className="text-right"><p className="text-xs text-gray-400">Date: {new Date().toLocaleDateString()}</p><p className="text-[10px] text-gray-400 font-mono mt-1">TXN: {generatedBill.transactionId}</p></div>
//               </div>

//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Patient Name:</span><span className="font-bold text-gray-800">{generatedBill.name}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Phone No:</span><span className="font-bold text-gray-800">{generatedBill.phone}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Doctor/Dept:</span><span className="font-bold text-blue-600">{generatedBill.doctorName}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Schedule:</span><span className="font-bold text-gray-800">{generatedBill.date} | {generatedBill.time}</span></div>
//                 <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Status:</span><span className="font-bold text-green-600">{generatedBill.paymentStatus}</span></div>
//                 <div className="flex justify-between pt-2 mt-4 items-center"><span className="text-gray-600 font-bold uppercase tracking-wider">Total Paid</span><span className="text-3xl font-black text-green-600">₹{generatedBill.fee}</span></div>
//               </div>
//             </div>

//             <div className="p-6 bg-white flex gap-4">
//               <button onClick={() => window.print()} className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-2 shadow-md">🖨️ Print Bill</button>
//               <button onClick={() => { setGeneratedBill(null); window.location.href = '/my-bookings'; }} className="flex-1 bg-green-100 text-green-700 font-bold py-3 rounded-xl hover:bg-green-200 transition">Close</button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default Appointment;
import React, { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import toast, { Toaster } from 'react-hot-toast'; // 🟢 Smooth Notification

const Appointment = () => {
  const { isSignedIn, user } = useUser();

  const [doctors, setDoctors] = useState([]);
  const [generatedBill, setGeneratedBill] = useState(null); 
  const [isProcessing, setIsProcessing] = useState(false); 

  const [form, setForm] = useState({
    name: user?.fullName || '', 
    phone: '', 
    date: '', 
    time: '', 
    doctorId: ''
  });

  useEffect(() => {
    // 🟢 वापस Localhost कर दिया गया है
    fetch('http://localhost:5000/api/doctors/all')
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => {
        console.log(err);
        toast.error("Failed to load doctors.");
      });
  }, []);

  const selectedDoctor = doctors.find(d => d._id === form.doctorId);
  const feeAmount = selectedDoctor ? selectedDoctor.fee : 500; 
  
  const handlePaymentAndBooking = async (e) => {
    e.preventDefault();
    
    // 🟢 Alert हटाकर Toast लगा दिया (Smooth Error)
    if (!form.doctorId) {
      return toast.error("Please select a Doctor first!");
    }

    setIsProcessing(true);
    toast.loading("Processing payment...", { id: "payment" }); // 🟢 लोडिंग मैसेज

    setTimeout(async () => {
      
      const fakeTxnId = "TXN_" + Math.floor(Math.random() * 1000000000);

      const appointmentData = {
        name: form.name,
        phone: form.phone,
        date: form.date,
        time: form.time,
        doctorName: selectedDoctor.name,
        department: selectedDoctor.specialty,
        fee: feeAmount,
        paymentStatus: 'Paid ✅',
        transactionId: fakeTxnId,
        adminEmail: selectedDoctor.adminEmail || '' 
      };

      setGeneratedBill(appointmentData);
      setIsProcessing(false);
      
      toast.dismiss("payment"); // 🟢 लोडिंग मैसेज हटाना
      toast.success("Payment Successful!"); // 🟢 सक्सेस मैसेज

      try {
        // 🟢 वापस Localhost कर दिया गया है
        await fetch('http://localhost:5000/api/appointments/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData)
        });
      } catch (error) {
        console.log("Database Save Error:", error);
      }

    }, 1500); 
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      
      {/* 🟢 Toaster लगाना ज़रूरी है ताकि मैसेज स्क्रीन पर दिख सकें */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="bg-green-600 p-8 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Book Your Appointment</h1>
          <p className="text-green-100">Quick, safe, and secure online booking (Demo Mode)</p>
        </div>

        <div className="p-8">
        
          {!isSignedIn ? (
            <div className="text-center py-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">🔒</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
              <p className="text-gray-500 mb-6">You must be logged in as a patient to book an appointment.</p>
              
              <SignInButton mode="modal">
                <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-green-700 transition shadow-lg flex items-center gap-2">
                  <span>🔐</span> Login to Continue
                </button>
              </SignInButton>
            </div>
          ) : (
          
            <form onSubmit={handlePaymentAndBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              
              <div className="flex flex-col"><label className="text-sm font-bold text-gray-600 mb-2">Patient Name *</label><input type="text" required className="p-4 border rounded-xl outline-none focus:border-green-500 bg-gray-50" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="flex flex-col"><label className="text-sm font-bold text-gray-600 mb-2">Phone Number *</label><input type="tel" required className="p-4 border rounded-xl outline-none focus:border-green-500 bg-gray-50" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div className="flex flex-col"><label className="text-sm font-bold text-gray-600 mb-2">Select Date *</label><input type="date" required className="p-4 border rounded-xl outline-none focus:border-green-500 bg-gray-50" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              <div className="flex flex-col"><label className="text-sm font-bold text-gray-600 mb-2">Select Time *</label><input type="time" required className="p-4 border rounded-xl outline-none focus:border-green-500 bg-gray-50" value={form.time} onChange={e => setForm({...form, time: e.target.value})} /></div>
              
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-bold text-gray-600 mb-2">Choose Doctor *</label>
                <select required className="p-4 border rounded-xl outline-none focus:border-green-500 bg-white" value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})}>
                  <option value="" disabled>-- Select a Doctor --</option>
                  {doctors.filter(d => d.isAvailable).map(doc => (<option key={doc._id} value={doc._id}>{doc.name} ({doc.specialty}) - Fee: ₹{doc.fee}</option>))}
                </select>
              </div>

              <div className="md:col-span-2 bg-green-50 p-6 rounded-xl border border-green-100 flex justify-between items-center mt-4">
                <div><p className="text-sm text-green-800 font-bold">Consultation Fee</p><p className="text-xs text-green-600">Simulated Payment for Testing</p></div>
                <div className="text-3xl font-black text-green-700">₹{feeAmount}</div>
              </div>

              <div className="md:col-span-2 mt-2">
                <button type="submit" disabled={isProcessing} className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition text-lg flex justify-center items-center gap-2 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
                  {isProcessing ? 'Processing Payment...' : `Pay ₹${feeAmount} & Confirm Booking`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

    {/* //for billing */}
      {generatedBill && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            
            <div className="bg-green-600 p-6 text-center text-white">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold tracking-wide">Payment Successful</h2>
              <p className="text-green-100 text-sm mt-1">Your appointment is confirmed!</p>
            </div>

            <div className="p-6 bg-[#f8fdfa] border-b-2 border-dashed border-gray-200" id="printable-bill">
              <div className="flex justify-between items-center mb-6">
                <div><h3 className="text-xl font-bold text-gray-800">MediCare+</h3><p className="text-xs text-gray-500">Official Payment Receipt</p></div>
                <div className="text-right"><p className="text-xs text-gray-400">Date: {new Date().toLocaleDateString()}</p><p className="text-[10px] text-gray-400 font-mono mt-1">TXN: {generatedBill.transactionId}</p></div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Patient Name:</span><span className="font-bold text-gray-800">{generatedBill.name}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Phone No:</span><span className="font-bold text-gray-800">{generatedBill.phone}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Doctor/Dept:</span><span className="font-bold text-blue-600">{generatedBill.doctorName}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Schedule:</span><span className="font-bold text-gray-800">{generatedBill.date} | {generatedBill.time}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Status:</span><span className="font-bold text-green-600">{generatedBill.paymentStatus}</span></div>
                <div className="flex justify-between pt-2 mt-4 items-center"><span className="text-gray-600 font-bold uppercase tracking-wider">Total Paid</span><span className="text-3xl font-black text-green-600">₹{generatedBill.fee}</span></div>
              </div>
            </div>

            <div className="p-6 bg-white flex gap-4">
              <button onClick={() => window.print()} className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-2 shadow-md">🖨️ Print Bill</button>
              <button onClick={() => { setGeneratedBill(null); window.location.href = '/my-bookings'; }} className="flex-1 bg-green-100 text-green-700 font-bold py-3 rounded-xl hover:bg-green-200 transition">Close</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
export default Appointment;