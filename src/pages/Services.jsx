
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services/all`);
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4fbf7] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-green-800 mb-3">Our Diagnostic Services</h1>
          <p className="text-green-600 font-medium">Safe, accurate & reliable testing.</p>
        </div>

        {loading ? (
          <div className="text-center text-xl font-bold text-green-600">Loading Services... ⏳</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {services.map((srv) => (
              <div key={srv._id} className="bg-white rounded-[2rem] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-shadow border border-green-50">
                <img src={srv.image} alt={srv.name} className="w-full h-32 object-cover rounded-xl mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-1">{srv.name}</h3>
                <p className="text-green-500 font-medium text-sm mb-4">{srv.department}</p>
                <div className="text-2xl font-bold text-gray-800 mb-6">₹{srv.price}</div>
                <Link 
  to={`/services/${srv._id}`} 
  className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
>
  » View Details & Book
</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;