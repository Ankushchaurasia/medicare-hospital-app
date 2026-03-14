


import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Nayi States (Bill dikhane aur loading ke liye)
  const [generatedBill, setGeneratedBill] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- BOOKING STATES ---
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash'); 
  const [patientDetails, setPatientDetails] = useState({
    name: '', age: '', phone: '', gender: 'Male'
  });
  
  const [selectedServiceOptions, setSelectedServiceOptions] = useState('');

  const timeSlots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/doctors/${id}`);
        const data = await response.json();
        setDoctor(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

//  billlogic
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !patientDetails.name || !patientDetails.phone) {
      alert("Please fill all details, select date and time.");
      return;
    }

    if (paymentMethod === 'Online') {
      const confirmPayment = window.confirm(`Redirecting to Payment Gateway to pay ₹${doctor.fee}. Click OK to simulate successful payment.`);
      if (!confirmPayment) return; 
    }

    setIsProcessing(true); 

    setTimeout(async () => {
      const fakeTxnId = paymentMethod === 'Online' 
        ? "TXN_" + Math.floor(Math.random() * 1000000000) 
        : "CASH_" + Math.floor(Math.random() * 1000000000);

      const bookingData = {
        name: patientDetails.name,
        phone: patientDetails.phone,
        age: patientDetails.age,
        gender: patientDetails.gender,
        doctorName: doctor.name,
        department: selectedServiceOptions ? `${doctor.specialty} (+ ${selectedServiceOptions})` : doctor.specialty,
        date: selectedDate,
        time: selectedTime,
        fee: doctor.fee,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'Online' ? 'Paid ✅' : 'Pending (Cash)',
        transactionId: fakeTxnId,
        status: 'Pending',
        adminEmail: doctor.adminEmail || '' 
      };

     
      setGeneratedBill(bookingData);
      setIsProcessing(false);

      try {
        await fetch('http://localhost:5000/api/appointments/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });
      } catch (error) {
        console.error("Save Error:", error);
      }
    }, 1500); 
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-2xl font-bold text-green-600">Loading Profile... ⏳</div>;
  if (!doctor) return <div className="min-h-screen flex justify-center items-center text-2xl font-bold text-red-600">Doctor not found!</div>;

  return (
    <div className="min-h-screen bg-[#f4fbf7] py-12 px-6 relative">
      <div className="max-w-6xl mx-auto">
        
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-green-50 flex flex-col md:flex-row gap-10 mb-10">
          <div className="flex flex-col items-center md:w-1/3">
            <img src={doctor.image} alt={doctor.name} className="w-48 h-48 rounded-full object-cover border-4 border-[#eaf8f1] mb-6 shadow-sm" />
            <div className="flex gap-4 w-full justify-center">
              <div className="bg-red-50 text-red-500 px-5 py-3 rounded-2xl text-center shadow-sm">
                <p className="font-bold text-xl">{doctor.successRate || '90%'}</p>
                <p className="text-xs font-semibold uppercase tracking-wider">Success</p>
              </div>
              <div className="bg-yellow-50 text-yellow-600 px-5 py-3 rounded-2xl text-center shadow-sm">
                <p className="font-bold text-xl">{doctor.experience}</p>
                <p className="text-xs font-semibold uppercase tracking-wider">Experience</p>
              </div>
            </div>
          </div>
          <div className="md:w-2/3 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">{doctor.name}</h1>
            <div className="mb-8"><span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">{doctor.specialty}</span></div>
            <div className="grid grid-cols-2 gap-y-8 gap-x-6 mb-8">
              <div><h3 className="text-xs font-bold text-green-600 uppercase mb-1">🎓 Qualifications</h3><p className="font-semibold">{doctor.qualifications}</p></div>
              <div><h3 className="text-xs font-bold text-green-600 uppercase mb-1">📍 Location</h3><p className="font-semibold">{doctor.location}</p></div>
              <div><h3 className="text-xs font-bold text-green-600 uppercase mb-1">🕒 Consultation Fee</h3><p className="font-bold text-xl text-gray-800">₹{doctor.fee}</p></div>
              <div><h3 className="text-xs font-bold text-green-600 uppercase mb-1">🔵 Availability</h3><p className={`font-bold ${doctor.isAvailable ? 'text-green-600' : 'text-red-500'}`}>{doctor.isAvailable ? 'Available' : 'Unavailable'}</p></div>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">ℹ️ About Doctor</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{doctor.about}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-green-50">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">📅 Book Your Appointment</h2>
          
          <div className="flex flex-col lg:flex-row gap-12">
            
       
            <div className="lg:w-1/2 space-y-8">
              
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-700 mb-4">🩺 Department & Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Department</label>
                    <input type="text" readOnly value={doctor.specialty} className="w-full border p-3 rounded-lg bg-white text-gray-500 font-bold outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Need specific test? (Optional)</label>
                    <select 
                      className="w-full border border-gray-200 p-3 rounded-lg bg-white outline-none focus:border-green-500 text-sm"
                      value={selectedServiceOptions}
                      onChange={(e) => setSelectedServiceOptions(e.target.value)}
                    >
                      <option value="">Just Regular Consultation</option>
                      <option value="Blood Test">Blood Test</option>
                      <option value="X-Ray Scan">X-Ray Scan</option>
                      <option value="ECG / Heart Checkup">ECG / Heart Checkup</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">🗓️ Select Date *</h3>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]} 
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">⏰ Available Time Slots *</h3>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map(time => (
                    <button 
                      key={time} 
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 border rounded-xl font-semibold transition ${selectedTime === time ? 'bg-green-500 text-white border-green-500 shadow-md' : 'border-green-200 text-green-700 hover:bg-green-50'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">👤 Patient Details *</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" required className="border p-3 rounded-lg bg-gray-50 focus:border-green-500 outline-none" value={patientDetails.name} onChange={e => setPatientDetails({...patientDetails, name: e.target.value})} />
                  <input type="number" placeholder="Age" className="border p-3 rounded-lg bg-gray-50 focus:border-green-500 outline-none" value={patientDetails.age} onChange={e => setPatientDetails({...patientDetails, age: e.target.value})} />
                  <input type="tel" placeholder="Mobile Number" required className="border p-3 rounded-lg bg-gray-50 focus:border-green-500 outline-none" value={patientDetails.phone} onChange={e => setPatientDetails({...patientDetails, phone: e.target.value})} />
                  <select className="border p-3 rounded-lg bg-gray-50 focus:border-green-500 outline-none" value={patientDetails.gender} onChange={e => setPatientDetails({...patientDetails, gender: e.target.value})}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
            </div>

           
            <div className="lg:w-1/2 bg-[#f0fdf4] p-8 rounded-3xl border border-green-100 h-fit">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between"><span className="text-gray-600">Selected Doctor:</span><span className="font-bold text-gray-800">{doctor.name}</span></div>
                {selectedServiceOptions && (
                  <div className="flex justify-between"><span className="text-gray-600">Extra Test:</span><span className="font-bold text-blue-600">{selectedServiceOptions}</span></div>
                )}
                <div className="flex justify-between"><span className="text-gray-600">Selected Date:</span><span className="font-bold text-gray-800">{selectedDate || 'Not selected'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Selected Time:</span><span className="font-bold text-gray-800">{selectedTime || 'Not selected'}</span></div>
                <div className="flex justify-between border-t border-green-200 pt-4"><span className="text-lg font-bold text-gray-800">Consultation Fee:</span><span className="text-2xl font-extrabold text-green-600">₹{doctor.fee}</span></div>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-gray-700 mb-3">Payment Method</h4>
                <div className="flex gap-4">
                  <button onClick={() => setPaymentMethod('Cash')} className={`flex-1 py-3 rounded-xl font-bold border transition ${paymentMethod === 'Cash' ? 'bg-gray-800 text-white border-gray-800 shadow-md' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                    💵 Pay at Hospital
                  </button>
                  <button onClick={() => setPaymentMethod('Online')} className={`flex-1 py-3 rounded-xl font-bold border transition ${paymentMethod === 'Online' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                    💳 Pay Online
                  </button>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                disabled={!doctor.isAvailable || isProcessing}
                className={`w-full block text-white text-center font-bold py-4 rounded-xl text-lg shadow-md transition-transform ${(!doctor.isAvailable || isProcessing) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 active:scale-95'}`}
              >
                {isProcessing ? 'Processing...' : (!doctor.isAvailable ? 'Doctor Currently Unavailable' : 'Confirm & Book Appointment')}
              </button>
            </div>
          </div>
        </div>
      </div>
 {/* billlogic */}
      {generatedBill && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
            
            <div className="bg-green-600 p-6 text-center text-white">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold tracking-wide">Booking Confirmed</h2>
              <p className="text-green-100 text-sm mt-1">Your appointment has been scheduled!</p>
            </div>

            <div className="p-6 bg-[#f8fdfa] border-b-2 border-dashed border-gray-200" id="printable-bill">
              <div className="flex justify-between items-center mb-6">
                <div><h3 className="text-xl font-bold text-gray-800">MediCare+</h3><p className="text-xs text-gray-500">Official Booking Receipt</p></div>
                <div className="text-right"><p className="text-xs text-gray-400">Date: {new Date().toLocaleDateString()}</p><p className="text-[10px] text-gray-400 font-mono mt-1">ID: {generatedBill.transactionId}</p></div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Patient Name:</span><span className="font-bold text-gray-800">{generatedBill.name}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Phone No:</span><span className="font-bold text-gray-800">{generatedBill.phone}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Doctor/Dept:</span><span className="font-bold text-blue-600">{generatedBill.doctorName}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Schedule:</span><span className="font-bold text-gray-800">{generatedBill.date} | {generatedBill.time}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Payment:</span><span className="font-bold text-green-600">{generatedBill.paymentMethod} ({generatedBill.paymentStatus})</span></div>
                
                <div className="flex justify-between pt-2 mt-4 items-center">
                  <span className="text-gray-600 font-bold uppercase tracking-wider">Total Amount</span>
                  <span className="text-3xl font-black text-green-600">₹{generatedBill.fee}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white flex gap-4">
              <button onClick={() => window.print()} className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-2 shadow-md">
                🖨️ Print Bill
              </button>
              <button onClick={() => { setGeneratedBill(null); navigate('/'); }} className="flex-1 bg-green-100 text-green-700 font-bold py-3 rounded-xl hover:bg-green-200 transition">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorProfile;