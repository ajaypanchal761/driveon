import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiClock, FiCheckCircle, FiCircle, FiAlertCircle, FiCalendar, FiFilter, FiMoreVertical, FiTrash2, FiFlag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import HeaderTopBar from '../components/HeaderTopBar';
import BottomNav from '../components/BottomNav';

const TasksPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Today');
  const [currentDate] = useState(new Date());

  // Dummy Tasks Data (Enhanced with dates)
  const [tasks, setTasks] = useState([
    { id: 101, title: 'Follow up with Rohan (Innova Enquiry)', time: '10:00 AM', priority: 'High', status: 'Pending', category: 'Sales', date: 'Today', assignedAt: '09:00 AM' },
    { id: 102, title: 'Collect Booking Amount from Amit', time: '02:30 PM', priority: 'High', status: 'Pending', category: 'Payments', date: 'Today', assignedAt: '10:30 AM' },
    { id: 1, title: 'Call vendor about Swift repair', time: '04:00 PM', priority: 'Medium', status: 'Pending', category: 'Maintenance', date: 'Today', assignedAt: '09:15 AM' },
    { id: 2, title: 'Submit Weekly Expense Report', time: '06:00 PM', priority: 'Low', status: 'Completed', category: 'Admin', date: 'Today', assignedAt: 'Yesterday' },
    { id: 3, title: 'Team Meeting', time: '10:00 AM', priority: 'Medium', status: 'Pending', category: 'General', date: 'Tomorrow', assignedAt: 'Yesterday' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' } : task
    ));
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    if (filter === 'Today') filtered = tasks.filter(t => t.date === 'Today');
    if (filter === 'Tomorrow') filtered = tasks.filter(t => t.date === 'Tomorrow');
    if (filter === 'Completed') filtered = tasks.filter(t => t.status === 'Completed');
    return filtered;
  };

  const currentTasks = getFilteredTasks();
  const completedCount = tasks.filter(t => t.status === 'Completed' && t.date === 'Today').length;
  const totalToday = tasks.filter(t => t.date === 'Today').length;
  const progress = totalToday > 0 ? (completedCount / totalToday) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 font-sans selection:bg-blue-100 flex flex-col">
      
      <div className="sticky top-0 z-30">
        {/* HEADER SECTION - COMPACT DASHBOARD STYLE */}
        <div className="bg-[#1C205C] pt-6 pb-12 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

          <HeaderTopBar title="My Tasks" />
          
          {/* Date Display */}
          <div className="mt-4 flex items-center justify-between text-white">
             <div>
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                <h2 className="text-2xl font-bold">{currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</h2>
             </div>
             <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 text-center">
                <span className="block text-2xl font-bold">{completedCount}/{totalToday}</span>
                <span className="text-[10px] uppercase text-blue-200 font-bold">Done</span>
             </div>
          </div>
        </div>

        {/* FILTER TABS - FLOATING */}
        <div className="-mt-6 px-6 z-10 relative">
            <div className="bg-white p-1.5 rounded-2xl shadow-lg border border-gray-100 flex justify-between">
                {['Today', 'Tomorrow', 'Completed'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`
                         flex-1 py-3 rounded-xl text-xs font-bold transition-all relative
                         ${filter === f 
                           ? 'text-[#1C205C]' 
                           : 'text-gray-400 hover:text-gray-600'}
                      `}
                    >
                        {filter === f && (
                          <motion.div 
                            layoutId="activeTab"
                            className="absolute inset-0 bg-blue-50 rounded-xl -z-10"
                          />
                        )}
                        {f} 
                        {/* Badge for counts if needed */}
                        {f === 'Today' && <span className="ml-1 text-[10px] bg-[#1C205C] text-white px-1.5 py-0.5 rounded-full">{totalToday}</span>}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* TASKS LIST */}
      <div className="px-5 mt-6 flex-1 space-y-4">
          <div className="flex justify-between items-center mb-2">
             <h3 className="text-[#1C205C] font-bold text-lg">
                {filter === 'Today' ? 'Assigned for Today' : filter}
             </h3>
             <button className="text-xs font-bold text-blue-500">View All</button>
          </div>

          <AnimatePresence mode="popLayout">
              {currentTasks.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-gray-400 py-12 bg-white rounded-3xl border border-dashed border-gray-200"
                  >
                      <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <FiCheckCircle size={32} className="opacity-20 text-gray-500" />
                      </div>
                      <p className="font-medium text-sm">All caught up!</p>
                      <p className="text-xs mt-1">No tasks pending for {filter.toLowerCase()}.</p>
                  </motion.div>
              ) : (
                  currentTasks.map((task, index) => (
                      <TaskCard key={task.id} task={task} index={index} onToggle={() => toggleTaskStatus(task.id)} />
                  ))
              )}
          </AnimatePresence>
      </div>


      
      <BottomNav />
    </div>
  );
};

const TaskCard = ({ task, onToggle, index }) => {
    const isCompleted = task.status === 'Completed';
    
    // Priority Config
    const priorityConfig = {
      'High': { color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', icon: <FiAlertCircle size={10} /> },
      'Medium': { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', icon: <FiClock size={10} /> },
      'Low': { color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', icon: <FiFlag size={10} /> }
    };

    const pConfig = priorityConfig[task.priority] || priorityConfig['Low'];

    return (
        <motion.div 
           layout
           initial={{ opacity: 0, y: 20 }} 
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: index * 0.05 }}
           className={`
              group bg-white p-4 rounded-2xl shadow-sm border border-gray-50 relative overflow-hidden
              ${isCompleted ? 'opacity-70 bg-gray-50' : ''}
           `}
        >
            {/* Left accent bar for priority */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${pConfig.bg.replace('50', '500')}`}></div>

            <div className="flex gap-4">
                {/* Checkbox Area */}
                <button 
                  onClick={onToggle}
                  className={`
                     shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                     ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200 hover:border-emerald-500'}
                  `}
                >
                    <FiCheckCircle size={14} className={`text-white transition-all duration-300 ${isCompleted ? 'scale-100' : 'scale-0'}`} />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] items-center gap-1 inline-flex uppercase font-bold px-2 py-0.5 rounded-md border ${pConfig.bg} ${pConfig.color} ${pConfig.border}`}>
                            {pConfig.icon} {task.priority}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                           {task.time}
                        </span>
                    </div>

                    <h4 className={`text-sm font-bold text-[#1C205C] leading-relaxed mb-1 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                    </h4>

                    <div className="flex items-center gap-3">
                         <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            {task.category}
                         </span>
                         {task.date === 'Today' && (
                           <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                             Assigned Today
                           </span>
                         )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TasksPage;
