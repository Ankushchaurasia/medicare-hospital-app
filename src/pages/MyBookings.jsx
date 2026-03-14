
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

 
  const handleTrackBooking = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return alert("Please enter a valid phone number!");
    
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/track/${phone}`);
      const data = await res.json();
      setBookings(data);
      setHasSearched(true);
    } catch (err) {
      console.log("Tracking Error:", err);
      alert("Server Error! Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4fbf7] py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
   
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-green-50 text-center mb-10">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">📱</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Track Your Bookings</h1>
          <p className="text-gray-500 mb-8">Enter your registered mobile number to view your appointment history & receipts.</p>
          
          <form onSubmit={handleTrackBooking} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="tel" 
              required
              placeholder="Enter Mobile Number" 
              className="flex-1 p-4 border-2 border-green-100 rounded-xl outline-none focus:border-green-500 bg-gray-50 text-center sm:text-left font-bold tracking-wide"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading}
              className={`px-8 py-4 rounded-xl font-bold text-white shadow-md transition-transform active:scale-95 ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {loading ? 'Tracking...' : 'Track Now'}
            </button>
          </form>
        </div>

     
        {hasSearched && !loading && (
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-6 px-2">Records for: +91 {phone}</h2>
            
            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Found</h3>
                <p className="text-gray-500 mb-6">We couldn't find any records associated with this mobile number.</p>
                <Link to="/doctors" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-green-700 transition">
                  Book a New Appointment
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-3xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow relative overflow-hidden">
                    
                    {/* Status Badge */}
                    <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-xs font-bold text-white shadow-sm
                      ${booking.status === 'Accepted' ? 'bg-green-500' : booking.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}
                    `}>
                      {booking.status}
                    </div>

                    <div className="mb-4 pt-2">
                      <h3 className="text-xl font-bold text-gray-800">{booking.doctorName || booking.department}</h3>
                      <p className="text-sm font-semibold text-green-600">{booking.doctorName ? booking.department : 'Lab Test / Service'}</p>
                    </div>

                    <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-2xl text-sm border border-gray-100">
                      <div className="flex justify-between"><span className="text-gray-500">Patient:</span><span className="font-bold text-gray-700">{booking.name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-bold text-gray-800">{booking.date}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Time:</span><span className="font-bold text-gray-800">{booking.time}</span></div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 mt-2"><span className="text-gray-500 font-semibold">Amount Paid:</span><span className="font-black text-green-600">₹{booking.fee}</span></div>
                    </div>

                    <button 
                      onClick={() => setSelectedBill(booking)} 
                      className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold py-3 rounded-xl transition flex justify-center items-center gap-2 border border-blue-200"
                    >
                      🧾 View / Print Receipt
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

   {/* billlogic */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
            
            <div className="bg-green-600 p-6 text-center text-white relative">
              <button onClick={() => setSelectedBill(null)} className="absolute top-4 right-4 text-white text-xl font-bold hover:text-gray-200">✕</button>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold tracking-wide">Booking Receipt</h2>
              <p className="text-green-100 text-sm mt-1">Status: {selectedBill.status}</p>
            </div>

            <div className="p-6 bg-[#f8fdfa] border-b-2 border-dashed border-gray-200" id="printable-bill">
              <div className="flex justify-between items-center mb-6">
                <div><h3 className="text-xl font-bold text-gray-800">MediCare+</h3><p className="text-xs text-gray-500">Official Payment Receipt</p></div>
                <div className="text-right"><p className="text-xs text-gray-400">Date: {new Date(selectedBill.createdAt).toLocaleDateString()}</p><p className="text-[10px] text-gray-400 font-mono mt-1">TXN: {selectedBill.transactionId}</p></div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Patient Name:</span><span className="font-bold text-gray-800">{selectedBill.name}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Phone No:</span><span className="font-bold text-gray-800">{selectedBill.phone}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Doctor/Service:</span><span className="font-bold text-blue-600">{selectedBill.doctorName || selectedBill.department}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Schedule:</span><span className="font-bold text-gray-800">{selectedBill.date} | {selectedBill.time}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Payment:</span><span className="font-bold text-green-600">{selectedBill.paymentMethod || 'Online'} ({selectedBill.paymentStatus})</span></div>
                
                <div className="flex justify-between pt-2 mt-4 items-center">
                  <span className="text-gray-600 font-bold uppercase tracking-wider">Total Amount</span>
                  <span className="text-3xl font-black text-green-600">₹{selectedBill.fee}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white flex gap-4">
              <button onClick={() => window.print()} className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-2 shadow-md">
                🖨️ Print Bill
              </button>
              <button onClick={() => setSelectedBill(null)} className="flex-1 bg-green-100 text-green-700 font-bold py-3 rounded-xl hover:bg-green-200 transition">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookings;