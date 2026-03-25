
import React, { useState } from 'react';

const Contact = () => {
  const medicalData = {
    "Cardiology": ["ECG", "Echocardiogram", "Heart Checkup", "Angiography"],
    "Orthopedics": ["X-Ray", "Bone Density Test", "Joint Pain Consultation", "Physiotherapy"],
    "Pathology": ["Blood Sugar Test", "Full Blood Count", "Lipid Profile", "Thyroid Test"],
    "General Medicine": ["Viral Fever Treatment", "Blood Pressure Check", "General Checkup"],
    "Pediatrics": ["Vaccination", "Child Growth Tracking", "Fever/Cold"]
  };
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleWhatsApp = () => {
    const phoneNumber = "7307520789"; 
    const text = `*New Inquiry*%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Email:* ${formData.email}%0A*Department:* ${selectedDept}%0A*Service:* ${selectedService}%0A*Message:* ${formData.message}`;
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  const handleSendToAdmin = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill Name, Email, and Message fields.");
      return;
    }
    const adminMessageData = {
      name: formData.name,
      email: formData.email,
      subject: `Inquiry for: ${selectedDept || 'General'} ${selectedService ? '- ' + selectedService : ''}`,
      message: `Phone: ${formData.phone}\n\nMessage: ${formData.message}`
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminMessageData)
      });
      const data = await res.json();
      
      if (data.success) {
        alert("✅ Message Sent to Admin Successfully!");
        setFormData({ name: '', email: '', phone: '', message: '' });
        setSelectedDept('');
        setSelectedService('');
      } else {
        alert("❌ Failed to send message.");
      }
    } catch (error) {
      alert("❌ Server Error. Please check your backend.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf8f1] to-white py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left Form */}
        <div className="flex-1 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-green-50">
          <h2 className="text-3xl font-serif font-bold text-green-800 mb-2">Contact Our Clinic</h2>
          <p className="text-sm text-green-600 italic mb-8">Fill the form — connect with us instantly via WhatsApp or send a message to our Admin Desk.</p>

          <form className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">👤 Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full name" className="w-full border border-green-200 p-3 rounded-full outline-none focus:border-green-500 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">✉️ Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@domain.com" className="w-full border border-green-200 p-3 rounded-full outline-none focus:border-green-500 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">📞 Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="1234567890" className="w-full border border-green-200 p-3 rounded-full outline-none focus:border-green-500 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">📍 Department</label>
                <select value={selectedDept} onChange={(e) => { setSelectedDept(e.target.value); setSelectedService(''); }} className="w-full border border-green-200 p-3 rounded-full outline-none focus:border-green-500 text-sm bg-white">
                  <option value="">Select Department</option>
                  {Object.keys(medicalData).map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">🩺 Service</label>
              <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} disabled={!selectedDept} className={`w-full border p-3 rounded-full outline-none text-sm transition ${!selectedDept ? 'border-gray-200 bg-gray-50 text-gray-400' : 'border-green-200 focus:border-green-500 bg-white'}`}>
                <option value="">{selectedDept ? "Select Service" : "Select Department first"}</option>
                {selectedDept && medicalData[selectedDept].map((service, index) => (
                  <option key={index} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">💬 Message</label>
              <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Describe your concern briefly..." rows="4" className="w-full border border-green-200 p-4 rounded-2xl outline-none focus:border-green-500 text-sm resize-none"></textarea>
            </div>

     {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button type="button" onClick={handleWhatsApp} className="bg-[#00a884] text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-green-200 flex-1 flex justify-center items-center gap-2 hover:bg-[#008f6f] transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </button>
              
              {/* 👇 YAHAN BADLAAV HAI (SEND TO ADMIN) 👇 */}
              <button type="button" onClick={handleSendToAdmin} className="bg-green-700 text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-green-200 flex-1 flex justify-center items-center gap-2 hover:bg-green-800 transition">
                ✉️ Send to Admin
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Panels */}
        <div className="md:w-[40%] flex flex-col gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-50">
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-3">Visit Our Clinic</h3>
            <p className="text-sm text-gray-600 mb-4">Gomtinagar, Lucknow, Uttar Pradesh</p>
            <div className="text-sm text-gray-600 space-y-2">
              <p className="flex items-center gap-2">📞 +91 7307520789</p>
              <p className="flex items-center gap-2">✉️ ac2682004@gmail.com</p>
            </div>
          </div>
          <div className="bg-white p-2 rounded-3xl shadow-sm border border-green-50 overflow-hidden relative h-[250px]">
             <a href="https://www.google.com/maps/search/?api=1&query=Gomtinagar,+Lucknow,+Uttar+Pradesh" target="_blank" rel="noopener noreferrer" className="absolute top-4 left-4 z-10 bg-white px-3 py-1 rounded shadow text-blue-500 text-xs font-bold border border-blue-100 flex items-center gap-1 cursor-pointer hover:bg-gray-50 transition">
               Open in Maps ↗
             </a>
             <iframe title="Clinic Location" src="https://maps.google.com/maps?q=Gomtinagar,Lucknow&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0, borderRadius: '1rem' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <div className="bg-[#a7f3d0] p-6 rounded-3xl shadow-sm border border-green-200">
            <h3 className="font-bold text-green-900 mb-1">Clinic Hours</h3>
            <p className="text-green-800 text-sm">Mon - Sat: 9:00 AM - 6:00 PM</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;