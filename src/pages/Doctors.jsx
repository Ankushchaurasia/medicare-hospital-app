

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/doctors/all');
        const data = await response.json();
        setDoctors(data.filter(doc => doc.isAvailable)); // सिर्फ उपलब्ध डॉक्टर दिखाएं
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4fbf7] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-green-800 mb-3">Our Medical Experts</h1>
          <p className="text-green-600 font-medium">Find your ideal doctor by name or specialization</p>
        </div>

        {loading ? (
          <div className="text-center text-xl font-bold text-green-600">Loading Doctors... ⏳</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {doctors.map((doc) => (
              <div key={doc._id} className="bg-white rounded-[2rem] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-shadow border border-green-50">
                <img src={doc.image} alt={doc.name} className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-[#eaf8f1]" />
                <h3 className="text-xl font-bold text-gray-800 mb-1">{doc.name}</h3>
                <p className="text-green-500 font-medium text-sm mb-4">{doc.specialty}</p>
                <div className="bg-[#f0fdf4] text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  🎖️ {doc.experience} Experience
                </div>
                {/* यह लिंक अब प्रोफाइल पेज पर ले जाएगा */}
                <Link to={`/doctor/${doc._id}`} className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-md flex items-center justify-center">
                  » View Profile & Book
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;