import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiPhone, FiMessageCircle, FiClock, FiCalendar, 
  FiMapPin, FiCheckCircle, FiPlus, FiMoreVertical 
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

// Dummy Data Lookup (Simulating API)
const getEnquiryData = (id) => ({
  id,
  name: "Rahul Sharma",
  phone: "+91 98765 43210",
  email: "rahul.sharma@example.com",
  location: "Indore, MP",
  carInterest: "Toyota Innova Crysta",
  budget: "15-18 Lakhs",
  status: "Pending",
  created: "Oct 24, 2023 • 10:30 AM",
  timeline: [
    { id: 1, type: "call", note: "Called customer. Interested in top model. Will visit showroom tomorrow.", date: "Today, 11:00 AM", author: "You" },
    { id: 2, type: "status", note: "Status changed to Pending", date: "Yesterday, 4:00 PM", author: "System" },
    { id: 3, type: "create", note: "Enquiry created via Website", date: "Oct 24, 10:30 AM", author: "System" },
  ]
});

const EnquiryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = getEnquiryData(id);
  const [activeTab, setActiveTab] = useState('Timeline');

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans selection:bg-blue-100 flex flex-col">
      
      {/* HEADER */}
      <div className="bg-[#1C205C] pt-10 pb-20 px-6 rounded-b-[40px] shadow-lg relative z-10">
        <div className="flex justify-between items-center text-white mb-6">
           <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
             <FiArrowLeft size={20} />
           </button>
           <h1 className="text-lg font-bold tracking-wide">Enquiry Details</h1>
           <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
             <FiMoreVertical size={20} />
           </button>
        </div>

        <div className="flex flex-col items-center">
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-[#1C205C] shadow-lg mb-3">
             {data.name.charAt(0)}
           </div>
           <h2 className="text-2xl font-bold text-white mb-1">{data.name}</h2>
           <div className="flex items-center gap-2 opacity-80 text-white text-sm font-light">
              <FiMapPin size={12} /> {data.location}
           </div>
           <div className="mt-4 flex gap-3">
              <button onClick={() => window.open(`tel:${data.phone}`)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-semibold transition-all">
                <FiPhone /> Call
              </button>
              <button onClick={() => window.open(`https://wa.me/${data.phone.replace(/[^0-9]/g, '')}`)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full text-white text-sm font-semibold transition-all shadow-lg">
                <FaWhatsapp /> WhatsApp
              </button>
           </div>
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="-mt-12 px-6 flex-1 pb-24">
         <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]"
         >
            {/* TABS */}
           <div className="flex border-b border-gray-100">
              <button 
                onClick={() => setActiveTab('Overview')}
                className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-all ${activeTab === 'Overview' ? 'border-[#1C205C] text-[#1C205C]' : 'border-transparent text-gray-400'}`}
              >Overview</button>
              <button 
                onClick={() => setActiveTab('Timeline')}
                className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-all ${activeTab === 'Timeline' ? 'border-[#1C205C] text-[#1C205C]' : 'border-transparent text-gray-400'}`}
              >Timeline</button>
           </div>

           <div className="p-6">
              {activeTab === 'Overview' ? (
                <div className="space-y-6">
                   <InfoItem icon={<FiCheckCircle />} label="Status" value={data.status} badge />
                   <InfoItem icon={<FiCar />} label="Interested Car" value={data.carInterest} />
                   <InfoItem icon={<FiCreditCard />} label="Budget" value={data.budget} />
                   <InfoItem icon={<FiPhone />} label="Phone" value={data.phone} />
                   <InfoItem icon={<FiMail />} label="Email" value={data.email} />
                   <InfoItem icon={<FiCalendar />} label="Created On" value={data.created} />
                </div>
              ) : (
                <div className="space-y-6 relative">
                   <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-gray-100"></div>
                   {data.timeline.map((item) => (
                      <div key={item.id} className="flex gap-4 relative">
                         <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center z-10 border-4 border-white shadow-sm
                           ${item.type === 'call' ? 'bg-blue-100 text-blue-600' : 
                             item.type === 'status' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}
                         >
                           {item.type === 'call' ? <FiPhone size={16} /> : 
                            item.type === 'status' ? <FiCheckCircle size={16} /> : <FiClock size={16} />}
                         </div>
                         <div className="pb-4">
                            <p className="text-gray-800 text-sm font-medium leading-relaxed">{item.note}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">{item.author}</span>
                               <span className="text-[10px] text-gray-400">{item.date}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              )}
           </div>
         </motion.div>
      </div>

      {/* FLOAT ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50 rounded-t-[30px] flex gap-3">
         <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#1C205C] font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
           <FiMessageCircle /> Message
         </button>
         <button className="flex-1 bg-[#1C205C] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
           <FiPlus /> Add Follow-up
         </button>
      </div>

    </div>
  );
};

const InfoItem = ({ icon, label, value, badge }) => (
  <div className="flex items-start gap-4">
    <div className="mt-0.5 text-gray-400 text-lg">{icon}</div>
    <div className="flex-1 pb-4 border-b border-gray-50">
       <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">{label}</span>
       {badge ? (
         <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{value}</span>
       ) : (
         <span className="text-gray-800 font-semibold text-base">{value}</span>
       )}
    </div>
  </div>
);

// Mocks for unused icons
const FiCar = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M18.5 10l-6-7-6 7H2v7h20v-7h-3.5z"></path></svg>;
const FiCreditCard = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
const FiMail = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;

export default EnquiryDetailsPage;
