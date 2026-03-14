

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ServiceBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [generatedBill, setGeneratedBill] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);


  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [patientDetails, setPatientDetails] = useState({ name: '', age: '', phone: '', gender: 'Male' });

  const timeSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:30 PM', '05:00 PM'];

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/services/${id}`);
        const data = await response.json();
        setService(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [id]);

 
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !patientDetails.name || !patientDetails.phone) {
      alert("Please fill all details, select date and time.");
      return;
    }

    if (paymentMethod === 'Online') {
      const confirmPayment = window.confirm(`Redirecting to Payment Gateway to pay ₹${service.price}. Click OK to simulate success.`);
      if (!confirmPayment) return;
    }

    setIsProcessing(true);

 
    const fakeTxnId = paymentMethod === 'Online' 
      ? "TXN_" + Math.floor(Math.random() * 1000000000) 
      : "CASH_" + Math.floor(Math.random() * 1000000000);

    const bookingData = {
      name: patientDetails.name,
      phone: patientDetails.phone,
      age: patientDetails.age,
      gender: patientDetails.gender,
      department: `Service: ${service.name} (${service.department})`, 
      date: selectedDate,
      time: selectedTime,
      fee: service.price,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'Online' ? 'Paid ✅' : 'Pending (Cash)',
      transactionId: fakeTxnId,
      status: 'Pending'
    };

    try {
   
      const res = await fetch('http://localhost:5000/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      
      if (data.success || data._id) {
        
        setGeneratedBill(bookingData);
      } else {
        alert("❌ Error booking: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error. Booking failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-2xl font-bold text-green-600">Loading Service... ⏳</div>;
  if (!service) return <div className="min-h-screen flex justify-center items-center text-2xl font-bold text-red-600">Service not found!</div>;

  return (
    <div className="min-h-screen bg-[#f4fbf7] py-12 px-6 relative">
      <div className="max-w-6xl mx-auto">
        
       
        <Link to="/services" className="inline-block mb-6 text-green-600 font-bold hover:text-green-800 transition">← Back to Services</Link>

       
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-green-50 flex flex-col md:flex-row gap-10 mb-10">
          <div className="md:w-1/3">
            <img src={service.image || 'https://via.placeholder.com/400x300'} alt={service.name} className="w-full h-64 object-cover rounded-3xl shadow-sm" />
          </div>
          <div className="md:w-2/3 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">{service.name}</h1>
            <div className="mb-6"><span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">{service.department} Department</span></div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Test/Service Cost</h3>
              <p className="text-4xl font-black text-green-600">₹{service.price}</p>
            </div>
            <p className="text-gray-600 text-sm">Please arrive 15 minutes before your scheduled time for preparation.</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-green-50">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">📅 Schedule This Test/Service</h2>
          <div className="flex flex-col lg:flex-row gap-12">
            
          
            <div className="lg:w-1/2 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">🗓️ Select Date *</h3>
                <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full p-4 border rounded-xl focus:border-green-500 outline-none" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">⏰ Available Slots *</h3>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map(time => (
                    <button key={time} onClick={() => setSelectedTime(time)} className={`py-3 px-4 border rounded-xl font-semibold transition ${selectedTime === time ? 'bg-green-500 text-white border-green-500 shadow-md' : 'border-green-200 text-green-700 hover:bg-green-50'}`}>{time}</button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">👤 Patient Details *</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" required className="border p-3 rounded-lg bg-gray-50 outline-none" value={patientDetails.name} onChange={e => setPatientDetails({...patientDetails, name: e.target.value})} />
                  <input type="number" placeholder="Age" className="border p-3 rounded-lg bg-gray-50 outline-none" value={patientDetails.age} onChange={e => setPatientDetails({...patientDetails, age: e.target.value})} />
                  <input type="tel" placeholder="Mobile Number" required className="border p-3 rounded-lg bg-gray-50 outline-none" value={patientDetails.phone} onChange={e => setPatientDetails({...patientDetails, phone: e.target.value})} />
                  <select className="border p-3 rounded-lg bg-gray-50 outline-none" value={patientDetails.gender} onChange={e => setPatientDetails({...patientDetails, gender: e.target.value})}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
            </div>

          
            <div className="lg:w-1/2 bg-[#f0fdf4] p-8 rounded-3xl border border-green-100 h-fit">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between"><span className="text-gray-600">Service:</span><span className="font-bold text-gray-800">{service.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Date & Time:</span><span className="font-bold text-gray-800">{selectedDate || '-'} | {selectedTime || '-'}</span></div>
                <div className="flex justify-between border-t border-green-200 pt-4"><span className="text-lg font-bold text-gray-800">Total Amount:</span><span className="text-2xl font-extrabold text-green-600">₹{service.price}</span></div>
              </div>
              <div className="mb-8">
                <h4 className="font-bold text-gray-700 mb-3">Payment Method</h4>
                <div className="flex gap-4">
                  <button onClick={() => setPaymentMethod('Cash')} className={`flex-1 py-3 rounded-xl font-bold border transition ${paymentMethod === 'Cash' ? 'bg-gray-800 text-white border-gray-800 shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>💵 Pay at Desk</button>
                  <button onClick={() => setPaymentMethod('Online')} className={`flex-1 py-3 rounded-xl font-bold border transition ${paymentMethod === 'Online' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>💳 Pay Online</button>
                </div>
              </div>
              <button onClick={handleBooking} disabled={isProcessing} className={`w-full text-white font-bold py-4 rounded-xl text-lg shadow-md transition-transform ${isProcessing ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600 active:scale-95'}`}>
                {isProcessing ? 'Processing...' : 'Confirm Service Booking'}
              </button>
            </div>
          </div>
        </div>
   

      </div>

   {/* billlogic */}
      {generatedBill && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
            
            <div className="bg-purple-600 p-6 text-center text-white">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold tracking-wide">Booking Confirmed</h2>
              <p className="text-purple-100 text-sm mt-1">Your service has been scheduled!</p>
            </div>

            <div className="p-6 bg-[#f8fdfa] border-b-2 border-dashed border-gray-200" id="printable-bill">
              <div className="flex justify-between items-center mb-6">
                <div><h3 className="text-xl font-bold text-gray-800">MediCare+</h3><p className="text-xs text-gray-500">Official Booking Receipt</p></div>
                <div className="text-right"><p className="text-xs text-gray-400">Date: {new Date().toLocaleDateString()}</p><p className="text-[10px] text-gray-400 font-mono mt-1">ID: {generatedBill.transactionId}</p></div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Patient Name:</span><span className="font-bold text-gray-800">{generatedBill.name}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Phone No:</span><span className="font-bold text-gray-800">{generatedBill.phone}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Service:</span><span className="font-bold text-purple-600">{service.name}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Schedule:</span><span className="font-bold text-gray-800">{generatedBill.date} | {generatedBill.time}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Payment:</span><span className="font-bold text-purple-600">{generatedBill.paymentMethod} ({generatedBill.paymentStatus})</span></div>
                
                <div className="flex justify-between pt-2 mt-4 items-center">
                  <span className="text-gray-600 font-bold uppercase tracking-wider">Total Amount</span>
                  <span className="text-3xl font-black text-purple-600">₹{generatedBill.fee}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white flex gap-4">
              <button onClick={() => window.print()} className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-2 shadow-md">
                🖨️ Print Bill
              </button>
              <button onClick={() => { setGeneratedBill(null); navigate('/'); }} className="flex-1 bg-purple-100 text-purple-700 font-bold py-3 rounded-xl hover:bg-purple-200 transition">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ServiceBooking;