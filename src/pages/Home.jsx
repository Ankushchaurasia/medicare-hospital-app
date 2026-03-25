

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bannerImg from "../assets/BannerImg.png"; 

const Home = () => {
  const navigate = useNavigate();

  const [dbDoctors, setDbDoctors] = useState([]);
  const [dbReviews, setDbReviews] = useState([]);
  
  const [homeData, setHomeData] = useState({
    heroTitle: 'Advanced Healthcare, Compassionate Professionals',
    heroSubtitle: 'Premium Healthcare At Your Fingertips',
    emergencyNumber: '+918299431275'
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/doctors/all`).then(res => res.json()).then(data => setDbDoctors(data)).catch(err => console.log(err));
    fetch(`${import.meta.env.VITE_API_URL}/api/reviews/all`).then(res => res.json()).then(data => setDbReviews(data)).catch(err => console.log(err));

    fetch(`${import.meta.env.VITE_API_URL}/api/settings/content`)
      .then(res => res.json())
      .then(data => { if(data && data.heroTitle) setHomeData(data); })
      .catch(err => console.log(err));
  }, []);

  const handleBookAppointment = () => { navigate('/appointments'); window.scrollTo(0, 0); };
  
  
  const handleEmergencyCall = () => { window.location.href = `tel:${homeData.emergencyNumber}`; };

  const dummyDoctorReviews = [ { id: 1, name: "Dr. Sarah Johnson", role: "Cardiologist", img: "https://randomuser.me/api/portraits/women/44.jpg", text: "The appointment routing system is incredibly efficient. A seamless interface." }, { id: 2, name: "Dr. Robert Martinez", role: "Pediatrician", img: "https://randomuser.me/api/portraits/men/32.jpg", text: "Patient records management is much more organized now." }, { id: 3, name: "Dr. Amanda Lee", role: "Neurologist", img: "https://randomuser.me/api/portraits/women/68.jpg", text: "Highly recommend this platform to all my colleagues." }, { id: 4, name: "Dr. James Wilson", role: "Surgeon", img: "https://randomuser.me/api/portraits/men/46.jpg", text: "Saves me hours of administrative work every week." } ];
  const dummyPatientReviews = [ { id: 1, name: "Michael Chen", role: "Patient", img: "https://randomuser.me/api/portraits/men/22.jpg", text: "Scheduling appointments has never been easier. Very helpful reminders." }, { id: 2, name: "Emily Williams", role: "Patient", img: "https://randomuser.me/api/portraits/women/12.jpg", text: "Finding the right specialist was super fast. Highly satisfied!" }, { id: 3, name: "David Brown", role: "Patient", img: "https://randomuser.me/api/portraits/men/75.jpg", text: "The emergency call feature gave me peace of mind." }, { id: 4, name: "Sophia Davis", role: "Patient", img: "https://randomuser.me/api/portraits/women/33.jpg", text: "Clean UI and very easy to track my medical history." } ];
  
  const displayDoctors = dbDoctors.length > 0 ? dbDoctors.map(d => ({ id: d._id, name: d.name, role: d.specialty, img: d.image || 'https://via.placeholder.com/150', text: d.about || "Dedicated to providing the best healthcare." })) : dummyDoctorReviews;
  const displayReviews = dbReviews.length > 0 ? dbReviews.map(r => ({ id: r._id, name: r.patientName, role: "Patient", img: r.image || 'https://via.placeholder.com/150', text: r.reviewText })) : dummyPatientReviews;

  return (
    <div className="min-h-screen bg-white">
      
     
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="relative overflow-hidden rounded-3xl p-[3px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] group">
          <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] bg-[conic-gradient(transparent,transparent,transparent,#10b981)] animate-[spin_4s_linear_infinite] origin-center -translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative bg-white rounded-[22px] p-8 md:p-12 h-full w-full flex flex-col md:flex-row items-center justify-between z-10">
            <div className="md:w-1/2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl border-2 border-green-500">🩺</div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">MediCare+</h1>
              </div>
              
          
              <p className="text-xl text-gray-500 mb-2">{homeData.heroSubtitle}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-8 leading-tight">{homeData.heroTitle}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm font-medium text-green-800">
                <div className="bg-green-100 px-4 py-2 rounded-full flex items-center gap-2">✔ Certified Specialists</div>
                <div className="bg-green-100 px-4 py-2 rounded-full flex items-center gap-2">🕒 24/7 Availability</div>
                <div className="bg-green-100 px-4 py-2 rounded-full flex items-center gap-2">🛡️ Safe & Secure</div>
                <div className="bg-green-100 px-4 py-2 rounded-full flex items-center gap-2">👥 500+ Doctors</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleBookAppointment} className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition shadow-lg shadow-green-200 flex justify-center items-center gap-2">
                  📅 Book Appointment Now
                </button>
                <button onClick={handleEmergencyCall} className="bg-red-100 text-red-500 border border-red-200 px-6 py-3 rounded-full font-semibold hover:bg-red-200 transition flex justify-center items-center gap-2">
                  📞 Call {homeData.emergencyNumber}
                </button>
              </div>
            </div>
            
          
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-end">
              <img 
                src={`${import.meta.env.VITE_API_URL}/uploads/banner.png?t=${new Date().getTime()}`} 
                alt="Hospital Banner" 
                className="w-full max-w-md object-cover rounded-xl shadow-md"
                onError={(e) => { e.target.src = bannerImg; }} 
              />
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-12 bg-gray-50 overflow-hidden border-y border-gray-100 text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-green-700 mb-8 uppercase tracking-wider">Certified & Excellence</h2>
        <div className="flex overflow-hidden relative w-full max-w-7xl mx-auto">
          <div className="animate-scroll-left flex items-center gap-16 px-8 min-w-full">
            {[1, 2].map((loopSet) => (
              <React.Fragment key={loopSet}>
                <div className="flex flex-col items-center gap-2 min-w-[150px]"><div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-2xl">🏛️</div><span className="text-xs font-semibold text-gray-600">Quality Healthcare</span></div>
                <div className="flex flex-col items-center gap-2 min-w-[150px]"><div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-2xl">⚕️</div><span className="text-xs font-semibold text-gray-600">Medical Council</span></div>
                <div className="flex flex-col items-center gap-2 min-w-[150px]"><div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-2xl">🏥</div><span className="text-xs font-semibold text-gray-600">Ministry of Health</span></div>
                <div className="flex flex-col items-center gap-2 min-w-[150px]"><div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-2xl">📜</div><span className="text-xs font-semibold text-gray-600">Government Approved</span></div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

   
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">Voices of Trust</h2><p className="text-gray-500">Real stories from doctors and patients sharing their positive experiences.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[500px] overflow-hidden">
          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 relative h-full flex flex-col"><h3 className="text-center text-blue-700 font-bold mb-4 flex justify-center items-center gap-2 z-10 bg-blue-50/90 py-2 rounded-lg">👩‍⚕️ Medical Professionals</h3><div className="flex-1 overflow-hidden relative"><div className="absolute top-0 w-full animate-scroll-up flex flex-col gap-4">{[...displayDoctors, ...displayDoctors].map((doc, idx) => (<div key={`doc-${idx}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"><div className="flex items-center gap-3 mb-2"><img src={doc.img} alt={doc.name} className="w-10 h-10 rounded-full object-cover border border-blue-100" /><div><h4 className="font-bold text-sm text-gray-800">{doc.name}</h4><p className="text-[10px] text-gray-500">{doc.role}</p></div><div className="ml-auto text-yellow-400 text-xs">★★★★★</div></div><p className="text-xs text-gray-600 italic">"{doc.text}"</p></div>))}</div></div></div>
          <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100 relative h-full flex flex-col"><h3 className="text-center text-green-700 font-bold mb-4 flex justify-center items-center gap-2 z-10 bg-green-50/90 py-2 rounded-lg">🧑‍💼 Patients</h3><div className="flex-1 overflow-hidden relative"><div className="absolute top-0 w-full animate-scroll-down flex flex-col gap-4">{[...displayReviews, ...displayReviews].map((pat, idx) => (<div key={`pat-${idx}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"><div className="flex items-center gap-3 mb-2"><img src={pat.img} alt={pat.name} className="w-10 h-10 rounded-full object-cover border border-green-100" /><div><h4 className="font-bold text-sm text-gray-800">{pat.name}</h4><p className="text-[10px] text-gray-500">{pat.role}</p></div><div className="ml-auto text-yellow-400 text-xs">★★★★★</div></div><p className="text-xs text-gray-600 italic">"{pat.text}"</p></div>))}</div></div></div>
        </div>
      </section>

    </div>
  );
};

export default Home;