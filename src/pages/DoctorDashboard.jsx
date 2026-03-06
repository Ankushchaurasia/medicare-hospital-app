

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appointments'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentRole = localStorage.getItem('adminRole') || 'Admin';
  const currentEmail = localStorage.getItem('adminEmail') || '';

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [reviews, setReviews] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [adminList, setAdminList] = useState([]); 

  const [homeData, setHomeData] = useState({ heroTitle: '', heroSubtitle: '', emergencyNumber: '' });
  const [logoFile, setLogoFile] = useState(null); 
  const [bannerFile, setBannerFile] = useState(null);

  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false); 
  const [selectedPatient, setSelectedPatient] = useState(null); 
  const [showPatientModal, setShowPatientModal] = useState(false);

  const [docForm, setDocForm] = useState({ name: '', specialty: '', successRate: '', experience: '', qualifications: '', location: '', fee: '', about: '' });
  const [docImageFile, setDocImageFile] = useState(null); 
  const [srvForm, setSrvForm] = useState({ name: '', department: '', price: '', duration: '', description: '' });
  const [srvImageFile, setSrvImageFile] = useState(null); 
  const [revForm, setRevForm] = useState({ patientName: '', reviewText: '', rating: 5 });
  const [revImageFile, setRevImageFile] = useState(null);
  const [certForm, setCertForm] = useState({ title: '' });
  const [certImageFile, setCertImageFile] = useState(null);
  const [adminForm, setAdminForm] = useState({ email: '', password: '', role: 'Admin' }); 

  useEffect(() => {
    fetchAppointments(); fetchDoctors(); fetchServices(); fetchMessages(); 
    if (currentRole === 'Superadmin') {
      fetchReviews(); fetchCertifications(); fetchAdmins();
      fetchHomeContent();
    }
  }, [currentRole]);

  const fetchAppointments = async () => { try { const res = await fetch('http://localhost:5000/api/appointments/all'); setAppointments(await res.json()); } catch (err) {} };
  const fetchDoctors = async () => { try { const res = await fetch('http://localhost:5000/api/doctors/all'); setDoctors(await res.json()); } catch (err) {} };
  const fetchServices = async () => { try { const res = await fetch('http://localhost:5000/api/services/all'); setServices(await res.json()); } catch (err) {} };
  const fetchMessages = async () => { try { const res = await fetch('http://localhost:5000/api/messages/all'); setMessages(await res.json()); } catch (err) {} };
  const fetchReviews = async () => { try { const res = await fetch('http://localhost:5000/api/reviews/all'); setReviews(await res.json()); } catch (err) {} };
  const fetchCertifications = async () => { try { const res = await fetch('http://localhost:5000/api/certifications/all'); setCertifications(await res.json()); } catch (err) {} };
  const fetchAdmins = async () => { try { const res = await fetch('http://localhost:5000/api/admins/all'); setAdminList(await res.json()); } catch (err) {} };
  const fetchHomeContent = async () => { try { const res = await fetch('http://localhost:5000/api/settings/content'); const data = await res.json(); setHomeData(data); } catch (err) {} };

  const myDoctorProfile = doctors.find(doc => doc.adminEmail === currentEmail);
  const visibleDoctors = currentRole === 'Superadmin' ? doctors : doctors.filter(doc => doc.adminEmail === currentEmail);
  const visibleAppointments = currentRole === 'Superadmin' ? appointments : appointments.filter(app => myDoctorProfile && (app.doctorName === myDoctorProfile.name || app.department === myDoctorProfile.name));
  const pendingAppointmentsCount = visibleAppointments.filter(app => app.status === 'Pending').length;
  const unreadMessagesCount = messages.filter(msg => !msg.isRead).length;

  const handleStatusUpdate = async (id, status) => { await fetch(`http://localhost:5000/api/appointments/update/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); fetchAppointments(); };
  const handleDeleteAppointment = async (id) => { if(window.confirm("Delete this appointment?")) { await fetch(`http://localhost:5000/api/appointments/delete/${id}`, { method: 'DELETE' }); fetchAppointments(); } };
  const toggleDoctorAvailability = async (id) => { await fetch(`http://localhost:5000/api/doctors/toggle/${id}`, { method: 'PUT' }); fetchDoctors(); };
  const markMessageRead = async (id) => { await fetch(`http://localhost:5000/api/messages/mark-read/${id}`, { method: 'PUT' }); fetchMessages(); };
  const handleDeleteDoctor = async (id) => { if(window.confirm("Delete this Doctor?")) { await fetch(`http://localhost:5000/api/doctors/delete/${id}`, { method: 'DELETE' }); fetchDoctors(); } };
  const toggleCertVisibility = async (id) => { await fetch(`http://localhost:5000/api/certifications/toggle/${id}`, { method: 'PUT' }); fetchCertifications(); };
  const handleDeleteCert = async (id) => { if(window.confirm("Delete this certificate?")) { await fetch(`http://localhost:5000/api/certifications/delete/${id}`, { method: 'DELETE' }); fetchCertifications(); } };
  const handleToggleAdminRole = async (id) => { await fetch(`http://localhost:5000/api/admins/toggle-role/${id}`, { method: 'PUT' }); fetchAdmins(); };
  const handleDeleteAdmin = async (id) => { if(window.confirm("Remove this Admin permanently?")) { await fetch(`http://localhost:5000/api/admins/delete/${id}`, { method: 'DELETE' }); fetchAdmins(); } };
  const handleDeleteService = async (id) => { if(window.confirm("Are you sure you want to delete this Service?")) { await fetch(`http://localhost:5000/api/services/delete/${id}`, { method: 'DELETE' }); fetchServices(); } };

  const handleDeleteReview = async (id) => { if(window.confirm("Are you sure you want to delete this review?")) { try { const res = await fetch(`http://localhost:5000/api/reviews/delete/${id}`, { method: 'DELETE' }); if(res.ok) fetchReviews(); } catch (error) { console.log("Error:", error); } } };

  // 🟢 NEW: MESSAGE DELETE FUNCTION
  const handleDeleteMessage = async (id) => {
    if(window.confirm("Are you sure you want to delete this message?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/delete/${id}`, { method: 'DELETE' });
        if(res.ok) {
          fetchMessages(); // Delete hone ke baad list ko refresh karega
        } else {
          alert("Failed to delete message");
        }
      } catch (error) {
        console.log("Error deleting message:", error);
      }
    }
  };

  const handleAddDoctor = async (e) => { e.preventDefault(); const fd = new FormData(); Object.keys(docForm).forEach(k => fd.append(k, docForm[k])); if (docImageFile) fd.append('image', docImageFile); fd.append('adminEmail', currentEmail); try { const res = await fetch('http://localhost:5000/api/doctors/add', { method: 'POST', body: fd }); const data = await res.json(); if (data.success) { alert("✅ Doctor Added!"); setShowDoctorModal(false); setDocImageFile(null); setDocForm({ name: '', specialty: '', successRate: '', experience: '', qualifications: '', location: '', fee: '', about: '' }); fetchDoctors(); } else { alert("❌ Error: " + data.message); } } catch (error) { alert("Server Error!"); } };
  const handleAddService = async (e) => { e.preventDefault(); const fd = new FormData(); Object.keys(srvForm).forEach(k => fd.append(k, srvForm[k])); if (srvImageFile) fd.append('image', srvImageFile); const res = await fetch('http://localhost:5000/api/services/add', { method: 'POST', body: fd }); if (res.ok) { setShowServiceModal(false); setSrvImageFile(null); setSrvForm({ name: '', department: '', price: '', duration: '', description: '' }); fetchServices(); } };
  const handleAddReview = async (e) => { e.preventDefault(); const fd = new FormData(); fd.append('patientName', revForm.patientName); fd.append('reviewText', revForm.reviewText); fd.append('rating', revForm.rating); if (revImageFile) fd.append('image', revImageFile); const res = await fetch('http://localhost:5000/api/reviews/add', { method: 'POST', body: fd }); if (res.ok) { setShowReviewModal(false); setRevImageFile(null); fetchReviews(); } };
  const handleAddCert = async (e) => { e.preventDefault(); if(!certImageFile) return alert("Photo is required!"); const fd = new FormData(); fd.append('title', certForm.title); fd.append('image', certImageFile); const res = await fetch('http://localhost:5000/api/certifications/add', { method: 'POST', body: fd }); if(res.ok) { alert("✅ Added!"); setShowCertModal(false); setCertImageFile(null); setCertForm({title: ''}); fetchCertifications(); } };
  const handleAddAdmin = async (e) => { e.preventDefault(); try { const res = await fetch('http://localhost:5000/api/admins/add', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(adminForm) }); const data = await res.json(); if(data.success) { alert("✅ Admin Created!"); setShowAdminModal(false); fetchAdmins(); setAdminForm({email:'', password:'', role:'Admin'}); } else alert("❌ " + data.message); } catch(err) { alert("Server Error"); } };

  const handleUploadLogo = async (e) => { e.preventDefault(); if (!logoFile) return alert("Select logo!"); const fd = new FormData(); fd.append('logo', logoFile); const res = await fetch('http://localhost:5000/api/settings/upload-logo', { method: 'POST', body: fd }); if (res.ok) alert("✅ Logo Updated! (Refresh to see changes)"); };
  const handleUploadBanner = async (e) => { e.preventDefault(); if (!bannerFile) return alert("Select banner image!"); const fd = new FormData(); fd.append('banner', bannerFile); const res = await fetch('http://localhost:5000/api/settings/upload-banner', { method: 'POST', body: fd }); if (res.ok) alert("✅ Banner Updated! (Refresh to see changes)"); };
  
  const handleUpdateHomeContent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/settings/content/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(homeData) });
      if (res.ok) alert("✅ Home Data Updated Successfully!");
    } catch (err) { alert("Error updating data!"); }
  };

  const handleLogout = () => { 
    localStorage.removeItem('adminRole'); 
    localStorage.removeItem('adminEmail'); 
    navigate('/'); 
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      <div className="md:hidden absolute top-0 left-0 w-full bg-white shadow-sm z-30 flex justify-between items-center p-4">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-3xl text-green-800">☰</button>
        <h2 className="text-lg font-bold text-green-800 flex items-center gap-2"><span className="text-2xl">⚕️</span> {currentRole}</h2>
      </div>

      <aside className={`fixed md:relative top-0 left-0 h-full w-64 bg-green-900 text-white flex flex-col shadow-2xl z-40 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 flex flex-col border-b border-green-800 pt-16 md:pt-6">
          <div className="flex items-center justify-between mb-2"><h2 className="text-xl font-extrabold tracking-wide">Panel</h2><button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-2xl text-green-300">✕</button></div>
          <span className="text-xs text-green-300 font-bold bg-green-800 px-2 py-1 rounded w-max">{currentRole}</span>
        </div>
        
        <nav className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
          <button onClick={() => {setActiveTab('appointments'); setIsSidebarOpen(false)}} className={`p-4 text-left rounded-xl font-semibold ${activeTab === 'appointments' ? 'bg-green-700' : 'hover:bg-green-800'}`}>📅 Appointments {pendingAppointmentsCount > 0 && <span className="float-right bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{pendingAppointmentsCount}</span>}</button>
          <button onClick={() => {setActiveTab('doctors'); setIsSidebarOpen(false)}} className={`p-4 text-left rounded-xl font-semibold ${activeTab === 'doctors' ? 'bg-green-700' : 'hover:bg-green-800'}`}>👨‍⚕️ My Profile / Doctors</button>
          <button onClick={() => {setActiveTab('services'); setIsSidebarOpen(false)}} className={`p-4 text-left rounded-xl font-semibold ${activeTab === 'services' ? 'bg-green-700' : 'hover:bg-green-800'}`}>🩺 Services</button>
          <button onClick={() => {setActiveTab('messages'); setIsSidebarOpen(false)}} className={`p-4 text-left rounded-xl font-semibold ${activeTab === 'messages' ? 'bg-green-700' : 'hover:bg-green-800'}`}>✉️ Messages {unreadMessagesCount > 0 && <span className="float-right bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{unreadMessagesCount}</span>}</button>
          
          {currentRole === 'Superadmin' && (
            <>
              <button onClick={() => {setActiveTab('reviews'); setIsSidebarOpen(false)}} className={`p-4 text-left rounded-xl font-semibold ${activeTab === 'reviews' ? 'bg-green-700' : 'hover:bg-green-800'}`}>⭐ Reviews</button>
              <button onClick={() => {setActiveTab('certifications'); setIsSidebarOpen(false)}} className={`p-4 text-left rounded-xl font-semibold ${activeTab === 'certifications' ? 'bg-green-700' : 'hover:bg-green-800'}`}>🏅 Certifications</button>
              <button onClick={() => {setActiveTab('settings'); setIsSidebarOpen(false)}} className={`p-4 text-left rounded-xl font-semibold ${activeTab === 'settings' ? 'bg-green-700' : 'hover:bg-green-800'}`}>⚙️ Settings</button>
              <button onClick={() => {setActiveTab('manage-admins'); setIsSidebarOpen(false)}} className={`p-4 text-left rounded-xl font-bold mt-2 border border-red-500/30 ${activeTab === 'manage-admins' ? 'bg-red-700 text-white' : 'text-red-300 hover:bg-red-900/50'}`}>🛡️ Manage Admins</button>
            </>
          )}
        </nav>
        <button onClick={handleLogout} className="m-4 p-4 bg-red-500 hover:bg-red-600 rounded-xl font-bold transition">🚪 Logout</button>
      </aside>

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto bg-gray-50 relative">
        {activeTab === 'appointments' && ( <div className="max-w-7xl mx-auto"><h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">{currentRole === 'Superadmin' ? 'All Appointments' : 'My Appointments'}</h1><div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto"><table className="w-full text-left min-w-[700px]"><thead><tr className="bg-gray-100 text-gray-600 text-sm uppercase"><th className="p-4 font-bold">Patient</th><th className="p-4 font-bold">Details</th><th className="p-4 font-bold">Status</th><th className="p-4 font-bold text-center">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{visibleAppointments.length === 0 ? (<tr><td colSpan="4" className="p-6 text-center text-gray-500 font-bold">No appointments found.</td></tr>) : (visibleAppointments.map((app) => (<tr key={app._id} className="hover:bg-gray-50"><td className="p-4"><p className="font-bold">{app.name}</p><p className="text-xs text-gray-500">📞 {app.phone}</p></td><td className="p-4"><p className="font-semibold">{app.date} | {app.time}</p><p className="text-xs text-blue-600 font-medium">{app.department || app.doctorName}</p></td><td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'Accepted' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{app.status || 'Pending'}</span></td><td className="p-4 text-center space-x-2"><button onClick={() => { setSelectedPatient(app); setShowPatientModal(true); }} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">View</button>{(app.status === 'Pending' || !app.status) && (<><button onClick={() => handleStatusUpdate(app._id, 'Accepted')} className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded">Accept</button><button onClick={() => handleStatusUpdate(app._id, 'Rejected')} className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded">Reject</button></>)}{currentRole === 'Superadmin' && <button onClick={() => handleDeleteAppointment(app._id)} className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded">Delete</button>}</td></tr>)))}</tbody></table></div></div> )}
        {activeTab === 'doctors' && ( <div className="max-w-7xl mx-auto"><div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"><h1 className="text-2xl md:text-3xl font-bold text-gray-800">{currentRole === 'Superadmin' ? 'Manage Doctors' : 'My Profile'}</h1>{currentRole === 'Superadmin' && <button onClick={() => setShowDoctorModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold w-full md:w-auto">+ Add New Doctor</button>}{currentRole === 'Admin' && !myDoctorProfile && <button onClick={() => setShowDoctorModal(true)} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold w-full md:w-auto shadow-md">👤 Create My Profile</button>}</div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{visibleDoctors.length === 0 && currentRole === 'Admin' ? (<div className="col-span-full bg-white p-10 text-center rounded-2xl border-2 border-dashed border-gray-300"><h3 className="text-xl font-bold text-gray-600 mb-2">Profile Not Found</h3><p className="text-gray-500">Please create your profile to receive appointments.</p></div>) : (visibleDoctors.map(doc => (<div key={doc._id} className="bg-white p-6 text-center rounded-2xl shadow-sm border border-gray-100 relative"><div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold ${doc.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{doc.isAvailable ? 'Online' : 'Offline'}</div>{currentRole === 'Superadmin' && <button onClick={() => handleDeleteDoctor(doc._id)} className="absolute top-4 left-4 text-red-400 hover:text-red-600 text-lg">🗑️</button>}<img src={doc.image || 'https://via.placeholder.com/150'} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-gray-50"/><h3 className="font-bold text-lg text-gray-800">{doc.name}</h3><p className="text-sm text-blue-600 font-bold mb-4">{doc.specialty}</p><button onClick={() => toggleDoctorAvailability(doc._id)} className={`w-full py-2 rounded-lg font-bold text-sm transition shadow-sm ${doc.isAvailable ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-500 text-white hover:bg-green-600'}`}>{doc.isAvailable ? 'Set as Offline' : 'Set as Online'}</button></div>)))}</div></div> )}
        {activeTab === 'services' && ( <div className="max-w-7xl mx-auto"><div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"><h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Services</h1><button onClick={() => setShowServiceModal(true)} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold w-full md:w-auto">+ Add New Service</button></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{services.map(srv => (<div key={srv._id} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 relative group"><button onClick={() => handleDeleteService(srv._id)} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 shadow-md transition z-10 opacity-100">🗑️</button><img src={srv.image || 'https://via.placeholder.com/300'} className="w-full h-32 object-cover rounded-xl mb-4" /><h3 className="font-bold text-xl text-gray-800">{srv.name}</h3><p className="text-sm text-gray-500 mb-2">{srv.department}</p><p className="text-xl font-black text-green-600">₹{srv.price}</p></div>))}</div></div> )}
        
        {/* 🟢 MESSAGES TAB UPDATED WITH DELETE BUTTON 🟢 */}
        {activeTab === 'messages' && ( 
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">User Messages</h1>
            <div className="grid gap-4">
              {messages.map((msg) => (
                <div key={msg._id} className={`p-6 rounded-2xl shadow-sm border relative ${msg.isRead ? 'bg-white' : 'bg-[#f4fbf7] border-green-200'}`}>
                  
                  {/* 👇 Delete Button 👇 */}
                  <button onClick={() => handleDeleteMessage(msg._id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-xl transition-colors">
                    🗑️
                  </button>

                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2 pr-8">
                    <div>
                      <h3 className="font-bold text-lg">{msg.name} <span className="text-sm font-normal text-gray-500">({msg.email})</span></h3>
                      <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                    {!msg.isRead && <button onClick={() => markMessageRead(msg._id)} className="text-sm bg-green-500 text-white px-4 py-1.5 rounded-full font-bold w-max">Mark Read</button>}
                  </div>
                  <h4 className="font-bold text-gray-700 mb-1">Subject: {msg.subject}</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm">{msg.message}</p>
                </div>
              ))}
            </div>
          </div> 
        )}

        {currentRole === 'Superadmin' && (
          <>
            {activeTab === 'reviews' && ( <div className="max-w-7xl mx-auto"><div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"><h1 className="text-2xl md:text-3xl font-bold text-gray-800">Voices of Trust (Reviews)</h1><button onClick={() => setShowReviewModal(true)} className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold w-full md:w-auto">+ Add Review</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{reviews.map(rev => (<div key={rev._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"><img src={rev.image || 'https://via.placeholder.com/100'} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-green-100" /><div className="flex-1"><div className="text-yellow-400 text-sm mb-1">{"★".repeat(rev.rating)}</div><p className="text-gray-600 italic mb-2 text-sm">"{rev.reviewText}"</p><h4 className="font-bold text-gray-800">- {rev.patientName}</h4></div><button onClick={() => handleDeleteReview(rev._id)} className="text-red-500 hover:text-red-700 font-bold text-xl">🗑️</button></div>))}</div></div> )}
            {activeTab === 'certifications' && ( <div className="max-w-7xl mx-auto"><div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"><h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Certifications</h1><button onClick={() => setShowCertModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 w-full md:w-auto">+ Add Certificate</button></div><div className="grid grid-cols-2 md:grid-cols-4 gap-6">{certifications.map(cert => (<div key={cert._id} className="bg-white p-6 text-center rounded-2xl shadow-sm border border-gray-100 relative"><div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-bold ${cert.isVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{cert.isVisible ? 'Visible' : 'Hidden'}</div><button onClick={() => handleDeleteCert(cert._id)} className="absolute top-2 left-2 text-red-400 hover:text-red-600 text-lg">🗑️</button><img src={cert.image} className="w-16 h-16 mx-auto mb-3 object-contain"/><h3 className="font-bold text-sm text-gray-800 mb-3">{cert.title}</h3><button onClick={() => toggleCertVisibility(cert._id)} className={`w-full py-1.5 rounded-lg font-bold text-xs ${cert.isVisible ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-500 text-white hover:bg-green-600'}`}>{cert.isVisible ? 'Hide' : 'Show'}</button></div>))}</div></div> )}
            {activeTab === 'manage-admins' && ( <div className="max-w-7xl mx-auto"><div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"><h1 className="text-2xl md:text-3xl font-bold text-gray-800">Control Panel (Admins)</h1><button onClick={() => setShowAdminModal(true)} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-red-700 w-full md:w-auto">+ Create New Admin</button></div><div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto"><table className="w-full text-left min-w-[500px]"><thead className="bg-gray-100 text-gray-600"><tr><th className="p-4 font-bold">Email (ID)</th><th className="p-4 font-bold">Role</th><th className="p-4 font-bold text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{adminList.map(admin => (<tr key={admin._id} className="hover:bg-gray-50"><td className="p-4 font-bold text-gray-800">{admin.email}</td><td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${admin.role === 'Superadmin' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>{admin.role}</span></td><td className="p-4 text-right space-x-2">{admin.email !== currentEmail ? (<><button onClick={() => handleToggleAdminRole(admin._id)} className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded hover:bg-gray-300">Change Role</button><button onClick={() => handleDeleteAdmin(admin._id)} className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded hover:bg-red-200">Remove Access</button></>) : (<span className="text-xs text-gray-400 font-bold px-3">You (Current)</span>)}</td></tr>))}</tbody></table></div></div> )}
            
            {activeTab === 'settings' && ( 
              <div className="max-w-5xl mx-auto pb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Website Settings</h1>
                
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                  <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">✏️ Edit Home Page Data</h2>
                  <form onSubmit={handleUpdateHomeContent} className="flex flex-col gap-4">
                    <div><label className="text-xs font-bold text-gray-500 mb-1">Main Hero Title</label><input type="text" className="w-full p-3 border rounded-xl bg-gray-50 font-bold" value={homeData.heroTitle} onChange={e => setHomeData({...homeData, heroTitle: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-gray-500 mb-1">Hero Subtitle</label><textarea className="w-full p-3 border rounded-xl bg-gray-50 resize-none" rows="2" value={homeData.heroSubtitle} onChange={e => setHomeData({...homeData, heroSubtitle: e.target.value})}></textarea></div>
                    <div><label className="text-xs font-bold text-gray-500 mb-1">Emergency Phone Number</label><input type="text" className="w-full p-3 border rounded-xl bg-gray-50 font-bold" value={homeData.emergencyNumber} onChange={e => setHomeData({...homeData, emergencyNumber: e.target.value})} /></div>
                    <button type="submit" className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-md w-full md:w-max mt-2">Save Text Content</button>
                  </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">🖼️ Update Website Logo</h2>
                    <form onSubmit={handleUploadLogo} className="flex flex-col gap-4">
                      <input type="file" accept="image/*" required onChange={(e) => setLogoFile(e.target.files[0])} className="p-3 border rounded-xl bg-gray-50 outline-none" />
                      <button type="submit" className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-md">Update Logo</button>
                    </form>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">📸 Update Home Banner</h2>
                    <form onSubmit={handleUploadBanner} className="flex flex-col gap-4">
                      <input type="file" accept="image/*" required onChange={(e) => setBannerFile(e.target.files[0])} className="p-3 border rounded-xl bg-gray-50 outline-none" />
                      <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-md">Update Banner Image</button>
                    </form>
                  </div>
                </div>
              </div> 
            )}
          </>
        )}

        {/* MODALS */}
        {showAdminModal && (<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-sm"><h2 className="text-2xl font-bold mb-6">Create Admin Access</h2><form onSubmit={handleAddAdmin} className="flex flex-col gap-4"><input type="email" placeholder="Admin Email" required className="p-3 border rounded-xl outline-none bg-gray-50" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} /><input type="text" placeholder="Set Password" required className="p-3 border rounded-xl outline-none bg-gray-50" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} /><select className="p-3 border rounded-xl bg-white outline-none" value={adminForm.role} onChange={e => setAdminForm({...adminForm, role: e.target.value})}><option value="Admin">Normal Admin</option><option value="Superadmin">Superadmin (Full Access)</option></select><div className="flex gap-4 mt-2"><button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl flex-1 font-bold">Create</button><button type="button" onClick={() => setShowAdminModal(false)} className="bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl flex-1 font-bold">Cancel</button></div></form></div></div>)}
        {showDoctorModal && (<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto"><div className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-2xl my-8"><h2 className="text-2xl font-bold mb-6">{currentRole === 'Superadmin' ? 'Add New Doctor' : 'Create My Profile'}</h2><form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" placeholder="Name (e.g. Dr. John) *" required className="border p-3 rounded-xl bg-gray-50" value={docForm.name} onChange={(e) => setDocForm({...docForm, name: e.target.value})} /><input type="text" placeholder="Specialty *" required className="border p-3 rounded-xl bg-gray-50" value={docForm.specialty} onChange={(e) => setDocForm({...docForm, specialty: e.target.value})} /><div className="flex flex-col justify-center"><label className="text-xs font-bold text-gray-500 mb-1">Upload Photo *</label><input type="file" accept="image/*" required className="border p-2 rounded-xl bg-gray-50" onChange={(e) => setDocImageFile(e.target.files[0])} /></div><input type="text" placeholder="Success Rate" className="border p-3 rounded-xl bg-gray-50" value={docForm.successRate} onChange={(e) => setDocForm({...docForm, successRate: e.target.value})} /><input type="text" placeholder="Experience *" required className="border p-3 rounded-xl bg-gray-50" value={docForm.experience} onChange={(e) => setDocForm({...docForm, experience: e.target.value})} /><input type="text" placeholder="Qualifications *" required className="border p-3 rounded-xl bg-gray-50" value={docForm.qualifications} onChange={(e) => setDocForm({...docForm, qualifications: e.target.value})} /><input type="text" placeholder="Location *" required className="border p-3 rounded-xl bg-gray-50" value={docForm.location} onChange={(e) => setDocForm({...docForm, location: e.target.value})} /><input type="number" placeholder="Consultation Fee (₹) *" required className="border p-3 rounded-xl bg-gray-50" value={docForm.fee} onChange={(e) => setDocForm({...docForm, fee: e.target.value})} /><textarea placeholder="About Doctor..." required className="border p-3 rounded-xl resize-none md:col-span-2 bg-gray-50" rows="3" value={docForm.about} onChange={(e) => setDocForm({...docForm, about: e.target.value})}></textarea><div className="flex gap-4 mt-4 md:col-span-2"><button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex-1">Save Profile</button><button type="button" onClick={() => setShowDoctorModal(false)} className="bg-gray-200 px-6 py-3 rounded-xl font-bold flex-1">Cancel</button></div></form></div></div>)}
        {showCertModal && (<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-sm"><h2 className="text-2xl font-bold mb-6">Add Certificate</h2><form onSubmit={handleAddCert} className="flex flex-col gap-4"><input type="text" placeholder="Title" required className="p-3 border rounded-xl bg-gray-50" value={certForm.title} onChange={e => setCertForm({title: e.target.value})} /><input type="file" accept="image/*" required className="p-2 border rounded-xl bg-gray-50" onChange={e => setCertImageFile(e.target.files[0])} /><div className="flex gap-4 mt-2"><button type="submit" className="bg-blue-600 text-white px-4 py-3 rounded-xl flex-1 font-bold">Save</button><button type="button" onClick={() => setShowCertModal(false)} className="bg-gray-200 px-4 py-3 rounded-xl flex-1 font-bold">Cancel</button></div></form></div></div>)}
        {showPatientModal && selectedPatient && (<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"><div className="bg-green-800 p-4 text-white flex justify-between"><h2 className="text-xl font-bold">Booking Details</h2><button onClick={() => setShowPatientModal(false)} className="text-2xl">✕</button></div><div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"><p><b>Name:</b> {selectedPatient.name}</p><p><b>Phone:</b> {selectedPatient.phone}</p><p><b>For:</b> {selectedPatient.doctorName || selectedPatient.department}</p><p><b>Time:</b> {selectedPatient.date} | {selectedPatient.time}</p><p><b>Fee:</b> ₹{selectedPatient.fee}</p><p><b>Payment:</b> {selectedPatient.paymentMethod}</p></div></div></div>)}
        {showServiceModal && (<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-md"><h2 className="text-2xl font-bold mb-6">Add New Service</h2><form onSubmit={handleAddService} className="flex flex-col gap-4"><input type="text" placeholder="Service Name" required className="border p-3 rounded-xl bg-gray-50" value={srvForm.name} onChange={e => setSrvForm({...srvForm, name: e.target.value})} /><input type="text" placeholder="Department" required className="border p-3 rounded-xl bg-gray-50" value={srvForm.department} onChange={e => setSrvForm({...srvForm, department: e.target.value})} /><input type="file" accept="image/*" required className="border p-2 rounded-xl bg-gray-50" onChange={e => setSrvImageFile(e.target.files[0])} /><input type="number" placeholder="Price (₹)" required className="border p-3 rounded-xl bg-gray-50" value={srvForm.price} onChange={e => setSrvForm({...srvForm, price: e.target.value})} /><div className="flex gap-4 mt-2"><button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold flex-1">Save Service</button><button type="button" onClick={() => setShowServiceModal(false)} className="bg-gray-200 px-6 py-3 rounded-xl font-bold flex-1">Cancel</button></div></form></div></div>)}
        {showReviewModal && (<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-md"><h2 className="text-2xl font-bold mb-6">Add Patient Review</h2><form onSubmit={handleAddReview} className="flex flex-col gap-4"><input type="text" placeholder="Patient Name" required className="p-3 border rounded-xl bg-gray-50" value={revForm.patientName} onChange={e => setRevForm({...revForm, patientName: e.target.value})} /><input type="file" accept="image/*" className="p-2 border rounded-xl bg-gray-50" onChange={e => setRevImageFile(e.target.files[0])} /><textarea placeholder="Review Text..." required rows="3" className="p-3 border rounded-xl resize-none bg-gray-50" value={revForm.reviewText} onChange={e => setRevForm({...revForm, reviewText: e.target.value})}></textarea><select className="p-3 border rounded-xl bg-white" value={revForm.rating} onChange={e => setRevForm({...revForm, rating: Number(e.target.value)})}> <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option><option value="4">⭐⭐⭐⭐ (4 Stars)</option><option value="3">⭐⭐⭐ (3 Stars)</option></select><div className="flex gap-4 mt-2"><button type="submit" className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold flex-1">Save Review</button><button type="button" onClick={() => setShowReviewModal(false)} className="bg-gray-200 px-6 py-3 rounded-xl font-bold flex-1">Cancel</button></div></form></div></div>)}
      </main>
    </div>
  );
};
export default DoctorDashboard;