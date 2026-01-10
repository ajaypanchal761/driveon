// Enquiries List Page
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiArrowLeft, FiCalendar, FiX } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderTopBar from '../components/HeaderTopBar';
import EnquiryCard from '../components/EnquiryCard';
import BottomNav from '../components/BottomNav';
import DateRangeModal from '../components/DateRangeModal';
import { isWithinInterval, parse, startOfDay, endOfDay, format } from 'date-fns';
import api from '../../services/api';
import { toast } from 'react-hot-toast';



const EnquiriesListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'All');
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start: null, end: null });
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Enquiries
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const response = await api.get('/crm/enquiries');
        if (response.data.success) {
          // Map backend data to component format
          const mappedEnquiries = response.data.data.enquiries.map(enq => ({
            id: enq._id,
            name: enq.name,
            phone: enq.phone,
            status: enq.status,
            date: enq.createdAt ? format(new Date(enq.createdAt), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            createdAt: enq.createdAt // Keep original for date usage if needed
          }));
          setEnquiries(mappedEnquiries);
        }
      } catch (error) {
        console.error('Error fetching enquiries:', error);
        toast.error('Failed to load enquiries');
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  // Filter Logic
  const filteredEnquiries = enquiries.filter(enquiry => {
    // 1. Tab Filter
    if (activeTab !== 'All' && enquiry.status !== activeTab) return false;

    // 2. Date Filter
    if (dateFilter.start && dateFilter.end) {
      const enquiryDate = startOfDay(new Date(enquiry.date)); // Simple parsing for now
      const start = startOfDay(dateFilter.start);
      const end = endOfDay(dateFilter.end);

      return isWithinInterval(enquiryDate, { start, end });
    }

    return true;
  });

  const handleDateApply = ({ start, end }) => {
    setDateFilter({ start, end });
  };

  const clearDateFilter = () => {
    setDateFilter({ start: null, end: null });
  };

  const tabs = ['All', 'Pending', 'Closed', 'Converted'];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 font-sans selection:bg-blue-100">

      {/* HEADER */}
      <div className="bg-[#1C205C] pt-12 pb-6 px-6 rounded-b-[30px] shadow-lg sticky top-0 z-50">
        <HeaderTopBar
          title="Enquiries"
          rightAction={
            <div className="relative">
              <button
                onClick={() => setIsDateModalOpen(true)}
                className={`p-2.5 rounded-full transition-all ${dateFilter.start ? 'bg-amber-500 text-white shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                <FiCalendar size={20} />
              </button>
              {dateFilter.start && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1C205C]"></span>
              )}
            </div>
          }
        />

        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all
                 ${activeTab === tab
                  ? 'bg-white text-[#1C205C] shadow-md'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* LIST CONTENT */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Showing {filteredEnquiries.length} {activeTab}
            {dateFilter.start && <span className="text-blue-600 block sm:inline sm:ml-1 mt-1 sm:mt-0 font-normal normal-case">(Filtered by Date)</span>}
          </p>

          {dateFilter.start && (
            <button onClick={clearDateFilter} className="text-red-500 text-xs font-bold flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-full">
              <FiX /> Clear Dates
            </button>
          )}
        </div>

        <motion.div layout className="space-y-4">
          <AnimatePresence mode='wait'>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C205C]"></div>
              </div>
            ) : filteredEnquiries.length > 0 ? (
              filteredEnquiries.map(enquiry => (
                <EnquiryCard key={enquiry.id} enquiry={enquiry} onClick={() => navigate(`/employee/enquiries/${enquiry.id}`)} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-16 text-gray-400 flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiSearch className="text-3xl opacity-50" />
                </div>
                <p className="font-bold text-gray-500">No enquiries found</p>
                <p className="text-xs mt-1">Try changing fields or filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* DATE RANGE MODAL */}
      <DateRangeModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onApply={handleDateApply}
      />



      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  );
};

export default EnquiriesListPage;
