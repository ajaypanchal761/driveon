import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MdPeople,
  MdBuild,
  MdEventAvailable,
  MdCheckCircle,
  MdShowChart,
  MdPieChart,
  MdArrowForward,
  MdAdd,
  MdSearch,
  MdNotifications,
  MdPersonAdd,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { premiumColors } from '../../theme/colors';
import { rgba } from 'polished';
import crmService from '../../services/crm.service';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { onMessageListener } from "../../services/firebase";
import toastUtils from '../../config/toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Listen for notifications
  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        toastUtils.info(`🔔 CRM Update: ${payload.notification.title}`);
        console.log("CRM Notification:", payload);
        // fetchDashboardData(); 
      })
      .catch((err) => console.log("failed: ", err));
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await crmService.getAnalytics();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#212c40]"></div>
      </div>
    );
  }

  const { stats, enquiryPulse, leadPipeline, recentEnquiries } = data;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Top Header Row as per screenshot */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's your operations summary for today.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold text-green-700">System Operational</span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* New Enquiries */}
        <motion.div variants={itemVariants} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
              <MdPeople size={24} />
            </div>
            <div className="text-xs font-bold text-green-500 flex items-center gap-1">
              <MdAdd /> {stats.enquiries.trend}%
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">{stats.enquiries.total}</h3>
            <p className="text-gray-500 text-sm font-medium">New Enquiries</p>
            <p className="text-blue-600 text-xs font-bold mt-1">+{stats.enquiries.today} today</p>
          </div>
        </motion.div>

        {/* Active Repairs */}
        <motion.div variants={itemVariants} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 transition-transform group-hover:scale-110">
              <MdBuild size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">{stats.repairs.active}</h3>
            <p className="text-gray-500 text-sm font-medium">Active Repairs</p>
            <p className="text-orange-600 text-xs font-bold mt-1">In Garage</p>
          </div>
        </motion.div>

        {/* Staff Present */}
        <motion.div variants={itemVariants} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 transition-transform group-hover:scale-110">
              <MdEventAvailable size={24} />
            </div>
            <div className="text-xs font-bold text-green-500 flex items-center gap-1">
              <MdAdd /> 12%
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">{stats.staff.present}<span className="text-gray-400 text-xl font-medium">/{stats.staff.total}</span></h3>
            <p className="text-gray-500 text-sm font-medium">Staff Present</p>
            <p className="text-purple-600 text-xs font-bold mt-1">Today's Attendance</p>
          </div>
        </motion.div>

        {/* Converted Leads */}
        <motion.div variants={itemVariants} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
              <MdCheckCircle size={24} />
            </div>
            <div className="text-xs font-bold text-green-500 flex items-center gap-1">
              <MdAdd /> 12%
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">{stats.conversions.month}</h3>
            <p className="text-gray-500 text-sm font-medium">Converted Leads</p>
            <p className="text-emerald-600 text-xs font-bold mt-1">This Month</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiry Pulse - Line Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Enquiry Pulse</h3>
              <p className="text-xs text-gray-400">Weekly intake vs conversions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div> New
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Converted
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enquiryPulse}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="new"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorNew)"
                  animationDuration={2000}
                />
                <Area
                  type="monotone"
                  dataKey="converted"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorConv)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Lead Pipeline - Donut Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex flex-col items-center"
        >
          <div className="w-full text-left mb-6">
            <h3 className="text-lg font-bold text-gray-900">Lead Pipeline</h3>
            <p className="text-xs text-gray-400">Current status of active leads</p>
          </div>

          <div className="relative w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadPipeline}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {leadPipeline.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-gray-900">{stats.enquiries.total}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Total Leads</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 mt-4">
            {leadPipeline.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Quick Actions & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <MdArrowForward />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { label: 'New Lead', icon: <MdPersonAdd />, color: 'bg-indigo-50 text-indigo-600', path: '/crm/enquiries/new' },
              { label: 'Staff Directory', icon: <MdPeople />, color: 'bg-purple-50 text-purple-600', path: '/crm/staff/directory' },
              { label: 'Vendors', icon: <MdArrowForward />, color: 'bg-orange-50 text-orange-600', path: '/crm/vendors/all' },
              { label: 'Performance', icon: <MdShowChart />, color: 'bg-emerald-50 text-emerald-600', path: '/crm/staff/performance' },
              { label: 'Staff Tasks', icon: <MdArrowForward />, color: 'bg-blue-50 text-blue-600', path: '/crm/staff/tasks' },
              { label: 'Garages', icon: <MdBuild />, color: 'bg-rose-50 text-rose-600', path: '/crm/garage/all' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-2xl transition-transform group-hover:scale-110`}>
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Enquiries</h3>
            <button
              onClick={() => navigate('/crm/enquiries/all')}
              className="text-blue-600 text-xs font-black uppercase tracking-wider flex items-center gap-1 hover:underline"
            >
              View All <MdArrowForward />
            </button>
          </div>

          <div className="space-y-4">
            {recentEnquiries.map((enq, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-gray-500 font-black text-lg">
                  {enq.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{enq.name}</p>
                  <p className="text-xs text-gray-400 font-medium truncate">{enq.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold mb-1">Recently</p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${enq.status === 'New' ? 'bg-blue-50 text-blue-600' :
                    enq.status === 'Converted' ? 'bg-emerald-50 text-emerald-600' :
                      enq.status === 'In Progress' ? 'bg-orange-50 text-orange-600' :
                        'bg-gray-50 text-gray-600'
                    }`}>
                    {enq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
