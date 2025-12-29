import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdFolderOpen, 
  MdSearch, 
  MdAdd, 
  MdFilterList, 
  MdPhone, 
  MdEmail, 
  MdVisibility, 
  MdMoreVert,
  MdEdit,
  MdDelete,
  MdSecurity,
  MdGroup,
  MdAccessTime,
  MdEventAvailable,
  MdAttachMoney,
  MdReceipt,
  MdStar,
  MdAssignment,
  MdFlag,
  MdCheckCircle,
  MdCheck,
  MdClose,
  MdArrowBack
} from 'react-icons/md';
import { jsPDF } from 'jspdf';
import { premiumColors } from '../../../theme/colors';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for Staff Directory
const MOCK_STAFF_DATA = [
  { id: 1, name: "Rajesh Kumar", role: "Sales Manager", department: "Sales", phone: "+91 98765 43210", email: "rajesh@example.com", status: "Active", joinDate: "12 Jan 2023" },
  { id: 2, name: "Vikram Singh", role: "Senior Driver", department: "Fleet", phone: "+91 99887 76655", email: "vikram@example.com", status: "On Duty", joinDate: "05 Mar 2023" },
  { id: 3, name: "Amit Bhardwaj", role: "Head Mechanic", department: "Garage", phone: "+91 91234 56789", email: "amit@example.com", status: "Leave", joinDate: "20 Jun 2024" },
  { id: 4, name: "Priya Sharma", role: "Admin Executive", department: "Administration", phone: "+91 98989 89898", email: "priya@example.com", status: "Active", joinDate: "01 Feb 2024" },
  { id: 5, name: "Suresh Raina", role: "Driver", department: "Fleet", phone: "+91 77788 99900", email: "suresh@example.com", status: "On Duty", joinDate: "15 Aug 2023" },
];

/**
 * Generic Placeholder for Staff Sub-Pages
 */
const StaffPlaceholder = ({ title, subtitle }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
         <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-400 mb-4">
            <MdFolderOpen size={40} />
         </div>
         <h3 className="text-xl font-semibold text-gray-700">Module: {title}</h3>
         <p className="text-gray-500 max-w-sm mt-2">
            This "Staff Operations" module page is ready. It will contain specific features for "{title}".
         </p>
      </div>
    </div>
  );
};

// --- Modals ---

const AddStaffModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'Sales',
    phone: '',
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({ name: '', role: '', department: 'Sales', phone: '', email: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Add New Staff</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MdClose size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Rahul Verma"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. Sales Executive"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                  >
                    <option>Sales</option>
                    <option>Fleet</option>
                    <option>Garage</option>
                    <option>Administration</option>
                    <option>Finance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      placeholder="+91..."
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      required
                      type="email" 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const StaffDirectoryPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const [staffList, setStaffList] = useState(MOCK_STAFF_DATA);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
    const filteredStaff = staffList.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            staff.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = deptFilter === 'All' || deptFilter === `Dept: ${deptFilter}` || staff.department === deptFilter;
      return matchesSearch && matchesDept;
    });

    const handleAddStaff = (newStaff) => {
        setStaffList([{
            id: Date.now(),
            ...newStaff,
            status: "Active",
            joinDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        }, ...staffList]);
    };
  
    const getStatusBadge = (status) => {
      switch(status) {
        case 'Active': return <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-bold border border-green-100">Active</span>;
        case 'On Duty': return <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">On Duty</span>;
        case 'Leave': return <span className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-100">Leave</span>;
        default: return <span className="px-2 py-1 rounded bg-gray-50 text-gray-700 text-xs font-bold border border-gray-100">{status}</span>;
      }
    };
  
    return (
      <div className="space-y-6">
        <AddStaffModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddStaff} />
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Staff</span> <span>/</span> <span className="text-gray-800 font-medium">Directory</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Directory</h1>
            <p className="text-gray-500 text-sm">Manage all staff members and their details</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors"
            style={{ backgroundColor: premiumColors.primary.DEFAULT }}
          >
            <MdAdd size={20} />
            Add New Staff
          </button>
        </div>
  
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-96">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search Name, Role..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="relative w-full md:w-auto min-w-[150px]">
              <select 
                className="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option>All</option>
                <option>Sales</option>
                <option>Fleet</option>
                <option>Garage</option>
                <option>Administration</option>
              </select>
              <MdFilterList className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
           </div>
        </div>
  
        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Staff Name</th>
                <th className="p-4">Role & Dept</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{staff.name}</div>
                    <div className="text-xs text-gray-400">ID: STF-{1000 + staff.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{staff.role}</div>
                    <div className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit mt-0.5 font-semibold">
                      {staff.department}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MdPhone size={14} className="text-gray-400" /> {staff.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-0.5">
                      <MdEmail size={14} className="text-gray-400" /> {staff.email}
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">
                    {staff.joinDate}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(staff.status)}
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <MdVisibility size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MdMoreVert size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
// Mock Data for Roles
const MOCK_ROLES_DATA = [
  { id: 1, role: "Admin", access: "Full Access", count: 2, description: "Complete control over all modules and settings." },
  { id: 2, role: "Sales Manager", access: "Leads, Bookings, Reports", count: 3, description: "Can manage enquiries, bookings and view sales reports." },
  { id: 3, role: "Fleet Manager", access: "Cars, Garage, Drivers", count: 1, description: "Manages vehicle inventory, maintenance and drivers." },
  { id: 4, role: "Driver", access: "Trip App Only", count: 15, description: "Limited access to assigned trips and basic profile." },
  { id: 5, role: "Accountant", access: "Finance, Salary, Invoices", count: 1, description: "Manages expenses, income, and staff payroll." },
];

const AddRoleModal = ({ isOpen, onClose, onSubmit, initialData }) => {
   const [formData, setFormData] = useState({ role: '', description: '', access: 'Basic' });

   useEffect(() => {
     if (isOpen) {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ role: '', description: '', access: 'Basic' });
        }
     }
   }, [isOpen, initialData]);

   const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      onClose();
   };

   return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
           <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
           >
              <h3 className="text-xl font-bold mb-4">{initialData ? 'Edit Role' : 'Add New Role'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                  <input required placeholder="Role Name" className="w-full p-2 border rounded-xl" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                  <textarea placeholder="Description" className="w-full p-2 border rounded-xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  <select className="w-full p-2 border rounded-xl" value={formData.access} onChange={e => setFormData({...formData, access: e.target.value})}>
                      <option>Basic</option>
                      <option>Intermediate</option>
                      <option>Full Access</option>
                  </select>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700">
                      {initialData ? 'Update Role' : 'Save Role'}
                  </button>
              </form>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
   );
};

const RoleDetails = ({ role, onBack }) => {
    // Mock Permissions based on access level
    const permissions = role.access === 'Full Access' 
        ? ['Create/Edit/Delete Staff', 'Manage Roles', 'View Financial Reports', 'Manage Bookings', 'Edit Content']
        : role.access === 'Intermediate'
        ? ['View Staff Directory', 'Manage Bookings', 'View Basic Reports']
        : ['View Assigned Tasks', 'Mark Attendance'];

    // Find assigned staff
    const assignedStaff = MOCK_STAFF_DATA.filter(s => 
        s.role.toLowerCase().includes(role.role.toLowerCase()) || 
        role.role.toLowerCase().includes(s.role.toLowerCase())
    );

    const [activeTab, setActiveTab] = useState('permissions');

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-white hover:bg-gray-50 text-gray-600 rounded-xl border border-gray-200 transition-colors shadow-sm">
                    <MdArrowBack size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{role.role}</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Roles</span> <span>/</span> <span className="text-indigo-600 font-medium">Details</span>
                    </div>
                </div>
            </div>

            {/* Hero Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start justify-between">
                    <div>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold tracking-wide uppercase mb-3 inline-block">
                            {role.access} Access
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{role.role}</h2>
                        <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">{role.description}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm border border-gray-100">
                            <MdGroup size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{assignedStaff.length}</p>
                            <p className="text-sm text-gray-500 font-medium">Active Staff</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200">
                <button 
                  onClick={() => setActiveTab('permissions')}
                  className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'permissions' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Permissions & Access
                    {activeTab === 'permissions' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />}
                </button>
                <button 
                  onClick={() => setActiveTab('staff')}
                  className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'staff' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Assigned Staff ({assignedStaff.length})
                    {activeTab === 'staff' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />}
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
                {activeTab === 'permissions' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {permissions.map((perm, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <MdCheckCircle className="text-green-500" size={20} />
                                <span className="font-medium text-gray-700">{perm}</span>
                            </div>
                        ))}
                         <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl border-dashed">
                             <span className="text-gray-400 font-medium italic text-sm">+ Add more specific permissions in Settings</span>
                         </div>
                    </motion.div>
                )}

                {activeTab === 'staff' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {assignedStaff.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Staff ID</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {assignedStaff.map(staff => (
                                        <tr key={staff.id} className="hover:bg-gray-50/50">
                                            <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                                                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs">
                                                     {staff.name.charAt(0)}
                                                 </div>
                                                {staff.name}
                                            </td>
                                            <td className="p-4 text-gray-500 font-medium text-sm">STF-{1000 + staff.id}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold border ${staff.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                                    {staff.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-bold">View Profile</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-10 text-center text-gray-500">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-3">
                                    <MdGroup size={32} />
                                </div>
                                <p>No staff members currently assigned to this role.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export const RolesPage = () => {
  const navigate = useNavigate();
  // Calculate dynamic counts
  const rolesWithCounts = MOCK_ROLES_DATA.map(role => {
      const count = MOCK_STAFF_DATA.filter(s => 
          s.role.toLowerCase().includes(role.role.toLowerCase()) || 
          role.role.toLowerCase().includes(s.role.toLowerCase())
      ).length;
      return { ...role, count }; // Override static count
  });

  const [rolesList, setRolesList] = useState(rolesWithCounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // For Details Page


  const handleSaveRole = (data) => {
      if (editingRole) {
          setRolesList(rolesList.map(r => r.id === editingRole.id ? { ...r, ...data } : r));
      } else {
          setRolesList([...rolesList, { id: Date.now(), ...data, count: 0 }]);
      }
      setIsModalOpen(false);
      setEditingRole(null);
  };

  const handleEdit = (e, role) => {
      e.stopPropagation(); // Prevent opening details
      setEditingRole(role);
      setIsModalOpen(true);
  };

  const handleDelete = (e, id) => {
      e.stopPropagation(); // Prevent opening details
      if(window.confirm('Delete this role?')) {
          setRolesList(rolesList.filter(r => r.id !== id));
      }
  };

  const openAddModal = () => {
      setEditingRole(null);
      setIsModalOpen(true);
  };

  if (selectedRole) {
      return <RoleDetails role={selectedRole} onBack={() => setSelectedRole(null)} />;
  }

  return (
    <div className="space-y-6">
      <AddRoleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSaveRole} 
        initialData={editingRole}
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Home</span> <span>/</span> <span>Staff</span> <span>/</span> <span className="text-gray-800 font-medium">Roles</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-500 text-sm">Define what each staff member can see and do.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors"
          style={{ backgroundColor: premiumColors.primary.DEFAULT }}
        >
          <MdAdd size={20} />
          Add New Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {rolesList.map((role) => (
            <div 
                key={role.id} 
                onClick={() => setSelectedRole(role)}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer relative group hover:-translate-y-1"
            >
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                     <MdSecurity size={24} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                        onClick={(e) => handleEdit(e, role)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                     >
                        <MdEdit size={18} />
                     </button>
                     <button onClick={(e) => handleDelete(e, role.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <MdDelete size={18} />
                     </button>
                  </div>
               </div>
               
               <h3 className="text-lg font-bold text-gray-900 mb-1">{role.role}</h3>
               <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">{role.description}</p>
               
               <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded">
                     {role.access}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                     <MdGroup size={16} /> {role.count} Staff
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};
// Mock Data for Attendance
const MOCK_ATTENDANCE_DATA = [
  { id: 1, name: "Rajesh Kumar", role: "Sales Manager", inTime: "09:00 AM", outTime: "-", status: "Present", workHours: "Running" },
  { id: 2, name: "Vikram Singh", role: "Driver", inTime: "08:30 AM", outTime: "08:00 PM", status: "Present", workHours: "11h 30m" },
  { id: 3, name: "Amit Bhardwaj", role: "Mechanic", inTime: "-", outTime: "-", status: "Absent", workHours: "-" },
  { id: 4, name: "Priya Sharma", role: "Admin", inTime: "09:15 AM", outTime: "-", status: "Late", workHours: "Running" },
];

const MarkAttendanceModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({ name: 'Rajesh Kumar', status: 'Present', inTime: '', outTime: '' });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    status: initialData.status,
                    inTime: initialData.inTime !== '-' ? initialData.inTime : '',
                    outTime: initialData.outTime !== '-' ? initialData.outTime : ''
                });
            } else {
                setFormData({ name: 'Rajesh Kumar', status: 'Present', inTime: '', outTime: '' });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };
 
    return (
     <AnimatePresence>
       {isOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
           />
            <motion.div
             initial={{ scale: 0.95, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.95, opacity: 0 }}
             className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
            >
               <h3 className="text-xl font-bold mb-4">{initialData ? 'Edit Attendance' : 'Mark Attendance'}</h3>
               <div className="space-y-4">
                   <select 
                     className="w-full p-2 border rounded-xl" 
                     value={formData.name} 
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     disabled={!!initialData} // Disable name change on edit
                   >
                       <option>Rajesh Kumar</option>
                       <option>Vikram Singh</option>
                       <option>Amit Bhardwaj</option>
                       <option>Priya Sharma</option>
                   </select>

                   <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 ml-1">In Time</label>
                            <input 
                                type="time" 
                                className="w-full p-2 border rounded-xl bg-gray-50"
                                value={formData.inTime} 
                                onChange={e => setFormData({...formData, inTime: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 ml-1">Out Time</label>
                            <input 
                                type="time" 
                                className="w-full p-2 border rounded-xl bg-gray-50"
                                value={formData.outTime} 
                                onChange={e => setFormData({...formData, outTime: e.target.value})}
                            />
                        </div>
                   </div>

                   <div className="flex gap-2">
                       {['Present', 'Absent', 'Late'].map(status => (
                           <button 
                             key={status}
                             onClick={() => setFormData({...formData, status})}
                             className={`flex-1 py-2 rounded-xl text-sm font-bold border ${formData.status === status ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'}`}
                           >
                               {status}
                           </button>
                       ))}
                   </div>
                   <button onClick={handleSubmit} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700">
                       {initialData ? 'Update Attendance' : 'Submit'}
                   </button>
               </div>
            </motion.div>
         </div>
       )}
     </AnimatePresence>
    );
 };

 export const AttendancePage = () => {
     const navigate = useNavigate();
     const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
     const [attendanceList, setAttendanceList] = useState(MOCK_ATTENDANCE_DATA);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [editingAttendance, setEditingAttendance] = useState(null);
     const [dateFilter, setDateFilter] = useState('Date: Today');
     const [roleFilter, setRoleFilter] = useState('Staff: All');

     // Filter Logic
     const getFilteredAttendance = () => {
         let data = [...attendanceList];

         // 1. Filter by Role
         if (roleFilter !== 'Staff: All') {
             const keyword = roleFilter === 'Drivers' ? 'Driver' : 'Sales';
             data = data.filter(item => item.role.includes(keyword));
         }

         // 2. Filter by Date (Mocking different data for "Yesterday")
         if (dateFilter === 'Yesterday') {
             // Return a simulated "Yesterday" historical view
             return data.map(item => ({
                 ...item,
                 status: 'Present',
                 inTime: '09:00 AM',
                 outTime: '06:00 PM',
                 workHours: '9h 0m',
                 id: item.id + 999 // Ensure unique key if mixed
             }));
         } else if (dateFilter === 'Select Date') {
             return []; // Show empty or handle specific date picker logic ideally
         }

         return data;
     };

     const filteredAttendance = getFilteredAttendance();
     
     const handleMarkAttendance = (data) => {
         // Format times for display if entered manually
         // Note: Input 'time' type gives "HH:MM" (24h). We might want "hh:mm AM" for consistency, but for now simple string is ok or simple conversion.
         const formatTime = (t) => {
             if (!t) return '-';
             const [h, m] = t.split(':');
             const d = new Date();
             d.setHours(h);
             d.setMinutes(m);
             return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
         };

         const newInTime = data.inTime.includes('M') ? data.inTime : formatTime(data.inTime);
         const newOutTime = data.outTime.includes('M') ? data.outTime : formatTime(data.outTime);

         if (editingAttendance) {
             setAttendanceList(attendanceList.map(item => 
                 item.id === editingAttendance.id 
                 ? { ...item, status: data.status, inTime: newInTime, outTime: newOutTime } 
                 : item
             ));
         } else {
             // Check if already exists to update, else add (Mock logic: just update if name matches, else add new)
            const existingId = attendanceList.findIndex(a => a.name === data.name);
            if (existingId !== -1) {
                 const newList = [...attendanceList];
                 newList[existingId] = { 
                     ...newList[existingId], 
                     status: data.status, 
                     inTime: newInTime !== '-' ? newInTime : newList[existingId].inTime,
                     outTime: newOutTime !== '-' ? newOutTime : newList[existingId].outTime
                 };
                 setAttendanceList(newList);
            } else {
                 setAttendanceList([{
                     id: Date.now(),
                     name: data.name,
                     role: "Staff", // Default
                     inTime: newInTime,
                     outTime: newOutTime,
                     status: data.status,
                     workHours: "0h 0m"
                 }, ...attendanceList]);
            }
         }
         
         setEditingAttendance(null);
         setIsModalOpen(false);
     };

     const handleEditClick = (item) => {
         // Convert "09:00 AM" back to "09:00" for input
         const parseTime = (tStr) => {
            if (!tStr || tStr === '-') return '';
            const [time, modifier] = tStr.split(' ');
            let [hours, minutes] = time.split(':');
            if (hours === '12') {
                hours = '00';
            }
            if (modifier === 'PM') {
                hours = parseInt(hours, 10) + 12;
            }
            return `${hours}:${minutes}`;
         };

         setEditingAttendance({
             ...item,
             inTime: parseTime(item.inTime),
             outTime: parseTime(item.outTime)
         });
         setIsModalOpen(true);
     };

     const openAddModal = () => {
         setEditingAttendance(null);
         setIsModalOpen(true);
     };

 
     const handleMarkTime = (id, type) => {
         const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
         setAttendanceList(attendanceList.map(item => {
             if (item.id === id) {
                 return { ...item, [type === 'in' ? 'inTime' : 'outTime']: time, status: 'Present' };
             }
             return item;
         }));
     };
   
     return (
       <div className="space-y-6">
         <MarkAttendanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleMarkAttendance} />
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div>
             <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
               <span>Home</span> <span>/</span> <span>Staff</span> <span>/</span> <span className="text-gray-800 font-medium">Attendance</span>
             </div>
             <h1 className="text-2xl font-bold text-gray-900">Attendance Tracker</h1>
             <p className="text-gray-500 text-sm">Today: {currentDate}</p>
           </div>
           <button 
             onClick={openAddModal}
             className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors"
             style={{ backgroundColor: premiumColors.primary.DEFAULT }}
           >
             <MdEventAvailable size={20} />
             Mark Attendance
           </button>
         </div>
   
         {/* Filters */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 w-full md:w-auto">
               <select 
                 className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer"
                 value={roleFilter}
                 onChange={(e) => setRoleFilter(e.target.value)}
               >
                 <option>Staff: All</option>
                 <option>Sales</option>
                 <option>Drivers</option>
               </select>
               <select 
                 className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer"
                 value={dateFilter}
                 onChange={(e) => setDateFilter(e.target.value)}
               >
                 <option>Date: Today</option>
                 <option>Yesterday</option>
                 <option>Select Date</option>
               </select>
            </div>
            <div className="text-sm text-gray-500 font-medium">
               Total Present: <span className="text-green-600 font-bold">{filteredAttendance.filter(i => i.status === 'Present').length}</span> / <span className="text-gray-800">{filteredAttendance.length}</span>
            </div>
         </div>
   
         {/* Table */}
         <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-blue-50/30 border-b border-blue-100 text-xs uppercase tracking-wider text-blue-800 font-bold">
                 <th className="p-4">Staff Member</th>
                 <th className="p-4">Role</th>
                 <th className="p-4">In Time</th>
                 <th className="p-4">Out Time</th>
                 <th className="p-4">Work Hours</th>
                 <th className="p-4">Status</th>
                 <th className="p-4 text-right">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 text-sm">
               {filteredAttendance.length > 0 ? (
                 filteredAttendance.map((item) => (
                 <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                   <td className="p-4">
                     <div className="font-bold text-gray-900">{item.name}</div>
                   </td>
                   <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold border border-gray-200">
                          {item.role}
                      </span>
                   </td>
                   <td className="p-4 font-medium text-gray-700">
                     {item.inTime !== '-' ? <span className="flex items-center gap-1"><MdAccessTime size={14} className="text-green-500" /> {item.inTime}</span> : '-'}
                   </td>
                   <td className="p-4 font-medium text-gray-700">
                     {item.outTime !== '-' ? <span className="flex items-center gap-1"><MdAccessTime size={14} className="text-red-500" /> {item.outTime}</span> : '-'}
                   </td>
                   <td className="p-4 text-gray-600">
                     {item.workHours}
                   </td>
                   <td className="p-4">
                      {item.status === 'Present' && <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-100">Present</span>}
                      {item.status === 'Absent' && <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-bold border border-red-100">Absent</span>}
                      {item.status === 'Late' && <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold border border-amber-100">Late</span>}
                   </td>
                   <td className="p-4 text-right">
                     {item.inTime === '-' ? (
                         <button 
                            onClick={() => handleMarkTime(item.id, 'in')}
                            className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-lg text-xs font-bold hover:bg-green-100"
                         >
                             Mark In
                         </button>
                     ) : item.outTime === '-' ? (
                         <button 
                            onClick={() => handleMarkTime(item.id, 'out')}
                            className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100"
                         >
                             Mark Out
                         </button>
                     ) : (
                         <button 
                            onClick={() => handleEditClick(item)}
                            className="text-gray-400 hover:text-indigo-600 text-xs font-bold"
                         >
                             Edit
                         </button>
                     )}
                   </td>
                 </tr>
                ))
                ) : (
                   <tr>
                       <td colSpan="7" className="p-8 text-center text-gray-400 text-sm">
                           No attendance records found for this selection.
                       </td>
                   </tr>
                )}
              </tbody>
           </table>
         </div>
       </div>
     );
 };
// Mock Data for Salary
const MOCK_SALARY_DATA = [
  { id: 1, name: "Rajesh Kumar", role: "Sales Manager", baseSalary: "₹ 25,000", deductions: "₹ 1,000", netPay: "₹ 24,000", status: "Paid", paymentDate: "01 Dec 2025" },
  { id: 2, name: "Vikram Singh", role: "Driver", baseSalary: "₹ 18,000", deductions: "₹ 500", netPay: "₹ 17,500", status: "Pending", paymentDate: "-" },
  { id: 3, name: "Amit Bhardwaj", role: "Mechanic", baseSalary: "₹ 20,000", deductions: "₹ 0", netPay: "₹ 20,000", status: "Processing", paymentDate: "-" },
];

export const SalaryPage = () => {
    const navigate = useNavigate();
    const [salaryList, setSalaryList] = useState(MOCK_SALARY_DATA);
    const [monthFilter, setMonthFilter] = useState('Month: December');
    const [staffFilter, setStaffFilter] = useState('Staff: All');

    const handlePayNow = (id) => {
        setSalaryList(salaryList.map(item => {
            if (item.id === id) {
                return { 
                    ...item, 
                    status: 'Paid', 
                    paymentDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
                };
            }
            return item;
        }));
    };

    const handleGeneratePayslips = () => {
        const pendingCount = salaryList.filter(i => i.status !== 'Paid').length;
        if(pendingCount > 0) {
            alert(`Generating payslips for ${salaryList.length - pendingCount} paid staff members... (Skipping ${pendingCount} pending/processing)`);
        } else {
            alert(`Generating payslips for all staff for ${monthFilter}... Success!`);
        }
    };

    const handleDownloadSlip = (item) => {
        const doc = new jsPDF();

        // Helper to formatting currency for PDF (removes symbol)
        const formatCurrency = (str) => {
            return str.replace('₹', 'Rs. ').replace(/[^a-zA-Z0-9., ]/g, ''); 
        };

        // Header
        doc.setFillColor(28, 32, 92); // premiumColors.primary (#1C205C)
        doc.rect(0, 0, 220, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("DriveOn CRM", 20, 20);
        doc.setFontSize(14);
        doc.text("Official Payslip", 20, 30);

        // Reset Text Color
        doc.setTextColor(0, 0, 0);

        // Employee Details
        doc.setFontSize(16);
        doc.text("Employee Details", 20, 60);
        doc.setLineWidth(0.5);
        doc.line(20, 63, 190, 63);

        doc.setFontSize(12);
        doc.text(`Name: ${item.name}`, 20, 75);
        doc.text(`Role: ${item.role || 'Staff'}`, 20, 85);
        doc.text(`Month: ${monthFilter.replace('Month: ', '')}`, 120, 75);
        doc.text(`Payment Date: ${item.paymentDate}`, 120, 85);

        // Salary Breakdown
        doc.setFontSize(16);
        doc.text("Salary Breakdown", 20, 110);
        doc.line(20, 113, 190, 113);

        doc.setFontSize(12);
        doc.text(`Base Salary:`, 20, 125);
        doc.text(`${formatCurrency(item.baseSalary)}`, 150, 125, { align: 'right' });

        doc.text(`Deductions:`, 20, 135);
        doc.setTextColor(220, 38, 38); // Red for deductions
        doc.text(`- ${formatCurrency(item.deductions)}`, 150, 135, { align: 'right' });
        doc.setTextColor(0, 0, 0);

        doc.setLineWidth(0.2);
        doc.line(20, 145, 150, 145);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Net Pay:`, 20, 155);
        doc.setTextColor(22, 163, 74); // Green for net pay
        doc.text(`${formatCurrency(item.netPay)}`, 150, 155, { align: 'right' });

        // Footer
        doc.setTextColor(150, 150, 150);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Generated via DriveOn CRM System", 105, 280, { align: 'center' });
        doc.text("This is a computer generated document and does not require signature.", 105, 285, { align: 'center' });

        // Save
        doc.save(`Payslip_${item.name.replace(/ /g, '_')}_${monthFilter.replace('Month: ', '')}.pdf`);
    };

    const getFilteredSalary = () => {
        let data = [...salaryList];
        if (staffFilter !== 'Staff: All') {
            const keyword = staffFilter === 'Drivers' ? 'Driver' : 'Sales';
            data = data.filter(item => item.role && item.role.includes(keyword));
        }
        return data;
    };

    const filteredSalary = getFilteredSalary();
  
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Staff</span> <span>/</span> <span className="text-gray-800 font-medium">Salary</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Salary Management</h1>
            <p className="text-gray-500 text-sm">Manage payrolls and generate payslips.</p>
          </div>

        </div>
  
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="flex gap-3 w-full md:w-auto">
              <select className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer">
                <option>Staff: All</option>
                <option>Sales</option>
                <option>Drivers</option>
              </select>
              <select 
                className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
              >
                <option>Month: December</option>
                <option>November</option>
                <option>October</option>
              </select>
           </div>
           
           <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
               <span>Total Payout: <b className="text-gray-900">₹ 61,500</b></span>
               <span className="h-4 w-px bg-gray-300"></span>
               <span>Pending: <b className="text-orange-600">₹ {salaryList.filter(i=>i.status==='Pending').reduce((acc, curr) => acc + parseInt(curr.netPay.replace(/[^\d]/g, '')), 0).toLocaleString('en-IN')}</b></span>
           </div>
        </div>
  
        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-50/30 border-b border-green-100 text-xs uppercase tracking-wider text-green-800 font-bold">
                <th className="p-4">Staff Name</th>
                <th className="p-4">Base Salary</th>
                <th className="p-4">Deductions</th>
                <th className="p-4">Net Pay</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredSalary.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.name}</div>
                  </td>
                  <td className="p-4 text-gray-700 font-medium">
                    {item.baseSalary}
                  </td>
                  <td className="p-4 text-red-600 font-medium">
                    - {item.deductions}
                  </td>
                  <td className="p-4 font-bold text-green-700">
                    {item.netPay}
                  </td>
                  <td className="p-4">
                     {item.status === 'Paid' && <span className="flex items-center gap-1 text-xs font-bold text-green-600"><MdCheck size={14} /> Paid on {item.paymentDate}</span>}
                     {item.status === 'Pending' && <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-bold border border-orange-100">Pending</span>}
                     {item.status === 'Processing' && <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100">Processing</span>}
                  </td>
                  <td className="p-4 text-right">
                    {item.status === 'Paid' ? (
                        <button 
                            onClick={() => handleDownloadSlip(item)}
                            className="text-indigo-600 hover:underline text-xs font-bold"
                        >
                            Download Slip
                        </button>
                    ) : (
                        <button 
                            onClick={() => handlePayNow(item.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 shadow-sm"
                        >
                            Pay Now
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};
// Mock Data for Advances
const MOCK_ADVANCES_DATA = [
  { id: 1, name: "Vikram Singh", amount: "₹ 10,000", paid: "₹ 2,000", balance: "₹ 8,000", status: "Active", date: "15 Dec 2025" },
  { id: 2, name: "Amit Bhardwaj", amount: "₹ 5,000", paid: "₹ 5,000", balance: "₹ 0", status: "Paid Off", date: "10 Nov 2025" },
  { id: 3, name: "Suresh Raina", amount: "₹ 15,000", paid: "₹ 5,000", balance: "₹ 10,000", status: "Active", date: "01 Dec 2025" },
];

const AddAdvanceModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ name: 'Vikram Singh', amount: '' });
 
    return (
     <AnimatePresence>
       {isOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
           />
            <motion.div
             initial={{ scale: 0.95, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.95, opacity: 0 }}
             className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
            >
               <h3 className="text-xl font-bold mb-4">New Advance</h3>
               <div className="space-y-4">
                   <select className="w-full p-2 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}>
                       <option>Vikram Singh</option>
                       <option>Suresh Raina</option>
                       <option>Amit Bhardwaj</option>
                   </select>
                   <input 
                    type="number"
                    placeholder="Amount (₹)" 
                    className="w-full p-2 border rounded-xl"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                   />
                   <button onClick={() => { onSubmit(formData); onClose(); setFormData({name: 'Vikram Singh', amount: ''}) }} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700">Submit Request</button>
               </div>
            </motion.div>
         </div>
       )}
     </AnimatePresence>
    );
 };
 
 export const AdvancesPage = () => {
     const navigate = useNavigate();
     const [searchTerm, setSearchTerm] = useState('');
     const [advancesList, setAdvancesList] = useState(MOCK_ADVANCES_DATA);
     const [isModalOpen, setIsModalOpen] = useState(false);
 
     const handleAddAdvance = (data) => {
         setAdvancesList([...advancesList, {
             id: Date.now(),
             name: data.name,
             amount: `₹ ${parseInt(data.amount).toLocaleString('en-IN')}`,
             paid: "₹ 0",
             balance: `₹ ${parseInt(data.amount).toLocaleString('en-IN')}`,
             status: "Active",
             date: new Date().toLocaleDateString('en-GB')
         }]);
     };
 
     const handleRepayment = (id) => {
         const amount = prompt("Enter Repayment Amount:");
         if(amount) {
             setAdvancesList(advancesList.map(item => {
                 if(item.id === id) {
                     const currentPaid = parseInt(item.paid.replace(/[^\d]/g, ''));
                     const total = parseInt(item.amount.replace(/[^\d]/g, ''));
                     const newPaid = currentPaid + parseInt(amount);
                     const newBalance = total - newPaid;
                     return {
                         ...item,
                         paid: `₹ ${newPaid.toLocaleString('en-IN')}`,
                         balance: `₹ ${newBalance.toLocaleString('en-IN')}`,
                         status: newBalance <= 0 ? 'Paid Off' : 'Active'
                     };
                 }
                 return item;
             }));
         }
     };
   
     const filteredAdvances = advancesList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
 
     return (
       <div className="space-y-6">
         <AddAdvanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddAdvance} />
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div>
             <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
               <span>Home</span> <span>/</span> <span>Staff</span> <span>/</span> <span className="text-gray-800 font-medium">Advances</span>
             </div>
             <h1 className="text-2xl font-bold text-gray-900">Advances & Loans</h1>
             <p className="text-gray-500 text-sm">Track salary advances and repayment status.</p>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors"
             style={{ backgroundColor: premiumColors.primary.DEFAULT }}
           >
             <MdAdd size={20} />
             New Advance
           </button>
         </div>
   
         {/* Filters */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:w-96">
                 <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input 
                     type="text" 
                     placeholder="Search Staff Name..." 
                     className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                 />
             </div>
             <div className="flex gap-3">
                <select className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer">
                  <option>Status: Active</option>
                  <option>Paid Off</option>
                  <option>All History</option>
                </select>
             </div>
         </div>
   
         {/* Table */}
         <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-orange-50/30 border-b border-orange-100 text-xs uppercase tracking-wider text-orange-800 font-bold">
                 <th className="p-4">Staff Member</th>
                 <th className="p-4">Total Advance</th>
                 <th className="p-4">Repaid</th>
                 <th className="p-4">Balance Due</th>
                 <th className="p-4">Status</th>
                 <th className="p-4 text-right">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 text-sm">
               {filteredAdvances.map((item) => (
                 <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                   <td className="p-4">
                     <div className="font-bold text-gray-900">{item.name}</div>
                     <div className="text-xs text-gray-500">Taken on {item.date}</div>
                   </td>
                   <td className="p-4 text-gray-900 font-bold">
                     {item.amount}
                   </td>
                   <td className="p-4 text-green-600 font-medium">
                     {item.paid}
                   </td>
                   <td className="p-4 font-bold text-red-600">
                     {item.balance}
                   </td>
                   <td className="p-4">
                      {item.status === 'Active' && <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100">Active</span>}
                      {item.status === 'Paid Off' && <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold border border-gray-200"><MdCheck size={14} /> Paid Off</span>}
                   </td>
                   <td className="p-4 text-right">
                     {item.status === 'Active' && (
                         <button 
                            onClick={() => handleRepayment(item.id)}
                            className="text-indigo-600 hover:text-indigo-800 text-xs font-bold"
                         >
                             Add Repayment
                         </button>
                     )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
           
           {filteredAdvances.length === 0 && (
              <div className="p-10 text-center text-gray-500">No active advances found.</div>
           )}
         </div>
       </div>
     );
 };
// Mock Data for Performance
const MOCK_PERFORMANCE_DATA = [
  { id: 1, name: "Rajesh Kumar", role: "Sales Manager", rating: 5, date: "10 Dec 2025", summary: "Excellent sales target met. Converted 15 leads this month.", reviewer: "Manager" },
  { id: 2, name: "Vikram Singh", role: "Driver", rating: 4, date: "15 Nov 2025", summary: "Safe driving, punctual. Needs to improve cleanliness.", reviewer: "Fleet Mgr" },
  { id: 3, name: "Amit Bhardwaj", role: "Mechanic", rating: 3, date: "20 Oct 2025", summary: "Good technical skills but needs to improve repair speed.", reviewer: "Garage Head" },
];

const AddReviewModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ name: 'Rajesh Kumar', rating: '5', summary: '' });
 
    return (
     <AnimatePresence>
       {isOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
           />
            <motion.div
             initial={{ scale: 0.95, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.95, opacity: 0 }}
             className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
               <h3 className="text-xl font-bold mb-4">New Performance Review</h3>
               <div className="space-y-4">
                   <select className="w-full p-2 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}>
                       <option>Rajesh Kumar</option>
                       <option>Vikram Singh</option>
                       <option>Amit Bhardwaj</option>
                   </select>
                   <select className="w-full p-2 border rounded-xl" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})}>
                       <option value="5">5 - Excellent</option>
                       <option value="4">4 - Very Good</option>
                       <option value="3">3 - Good</option>
                       <option value="2">2 - Needs Improvement</option>
                       <option value="1">1 - Poor</option>
                   </select>
                   <textarea 
                     placeholder="Feedback Summary..." 
                     className="w-full p-2 border rounded-xl h-24"
                     value={formData.summary}
                     onChange={e => setFormData({...formData, summary: e.target.value})}
                   />
                   <button onClick={() => { onSubmit(formData); onClose(); setFormData({name: 'Rajesh Kumar', rating: '5', summary: ''}) }} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700">Display Review</button>
               </div>
            </motion.div>
         </div>
       )}
     </AnimatePresence>
    );
 };
 
 export const PerformancePage = () => {
     const navigate = useNavigate();
     const [performanceList, setPerformanceList] = useState(MOCK_PERFORMANCE_DATA);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [staffFilter, setStaffFilter] = useState('Staff: All');

     const getFilteredPerformance = () => {
         let data = [...performanceList];
         if (staffFilter !== 'Staff: All') {
             const keyword = staffFilter === 'Drivers' ? 'Driver' : 'Sales';
             data = data.filter(item => item.role && item.role.includes(keyword));
         }
         return data;
     };

     const filteredPerformanceList = getFilteredPerformance();
 
     const handleAddReview = (data) => {
         setPerformanceList([{
             id: Date.now(),
             ...data,
             role: "Staff Member", // Mock
             date: new Date().toLocaleDateString('en-GB'),
             reviewer: "You"
         }, ...performanceList]);
     };
     
     return (
       <div className="space-y-6">
         <AddReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddReview} />
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div>
             <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
               <span>Home</span> <span>/</span> <span>Staff</span> <span>/</span> <span className="text-gray-800 font-medium">Performance</span>
             </div>
             <h1 className="text-2xl font-bold text-gray-900">Performance Review</h1>
             <p className="text-gray-500 text-sm">Staff ratings and feedback history.</p>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors"
             style={{ backgroundColor: premiumColors.primary.DEFAULT }}
           >
             <MdAdd size={20} />
             New Review
           </button>
         </div>
   
         {/* Filters */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 w-full md:w-auto">
               <select 
                 className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer"
                 value={staffFilter}
                 onChange={(e) => setStaffFilter(e.target.value)}
               >
                 <option>Staff: All</option>
                 <option>Sales</option>
                 <option>Drivers</option>
               </select>
               <select className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer">
                 <option>Year: 2025</option>
                 <option>2024</option>
               </select>
            </div>
         </div>
   
         {/* Table */}
         <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-purple-50/30 border-b border-purple-100 text-xs uppercase tracking-wider text-purple-800 font-bold">
                 <th className="p-4">Staff Member</th>
                 <th className="p-4">Rating</th>
                 <th className="p-4">Review Date</th>
                 <th className="p-4">Feedback Summary</th>
                 <th className="p-4 text-right">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 text-sm">
               {filteredPerformanceList.map((item) => (
                 <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                   <td className="p-4">
                     <div className="font-bold text-gray-900">{item.name}</div>
                     <div className="text-xs text-gray-500">{item.role}</div>
                   </td>
                   <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-400">
                         {[...Array(5)].map((_, i) => (
                             <MdStar key={i} size={16} className={i < item.rating ? "text-amber-400" : "text-gray-200"} />
                         ))}
                         <span className="text-gray-600 text-xs font-bold ml-1">({item.rating}/5)</span>
                      </div>
                   </td>
                   <td className="p-4 text-gray-600 font-medium">
                     {item.date}
                     <div className="text-xs text-gray-400">by {item.reviewer}</div>
                   </td>
                   <td className="p-4 text-gray-600 italic">
                     "{item.summary}"
                   </td>
                   <td className="p-4 text-right">
                     <button className="text-indigo-600 hover:underline text-xs font-bold">Full Report</button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
           

           
           {filteredPerformanceList.length === 0 && (
              <div className="p-10 text-center text-gray-500">No performance reviews found.</div>
           )}
         </div>
       </div>
     );
 };
// Mock Data for Tasks
const MOCK_TASKS_DATA = [
  { id: 1, title: "Car Inspection (Thar)", assignedTo: "Amit B. (Mechanic)", dueDate: "Today, 5 PM", priority: "High", status: "Pending" },
  { id: 2, title: "Document Collection", assignedTo: "Vikram S. (Driver)", dueDate: "Tomorrow", priority: "Medium", status: "Pending" },
  { id: 3, title: "Lead Follow-ups", assignedTo: "Rajesh K. (Sales)", dueDate: "Overdue", priority: "Critical", status: "Pending" },
  { id: 4, title: "Office Cleaning", assignedTo: "Priya S. (Admin)", dueDate: "Today, 6 PM", priority: "Low", status: "Done" },
];

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ title: '', assignedTo: 'Amit B. (Mechanic)', priority: 'Medium' });
 
    return (
     <AnimatePresence>
       {isOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
           />
            <motion.div
             initial={{ scale: 0.95, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.95, opacity: 0 }}
             className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
               <h3 className="text-xl font-bold mb-4">Assign New Task</h3>
               <div className="space-y-4">
                   <input 
                     type="text" 
                     placeholder="Task Title" 
                     className="w-full p-2 border rounded-xl"
                     value={formData.title}
                     onChange={e => setFormData({...formData, title: e.target.value})}
                   />
                   <select className="w-full p-2 border rounded-xl" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
                       <option>Amit B. (Mechanic)</option>
                       <option>Vikram S. (Driver)</option>
                       <option>Rajesh K. (Sales)</option>
                   </select>
                   <select className="w-full p-2 border rounded-xl" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                       <option>Low</option>
                       <option>Medium</option>
                       <option>High</option>
                       <option>Critical</option>
                   </select>
                   <button onClick={() => { onSubmit(formData); onClose(); setFormData({title: '', assignedTo: 'Amit B. (Mechanic)', priority: 'Medium'}) }} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700">Assign Task</button>
               </div>
            </motion.div>
         </div>
       )}
     </AnimatePresence>
    );
 };
 
 export const StaffTasksPage = () => {
     const navigate = useNavigate();
     const [tasksList, setTasksList] = useState(MOCK_TASKS_DATA);
     const [isModalOpen, setIsModalOpen] = useState(false);
 
     const handleAddTask = (data) => {
         setTasksList([{
             id: Date.now(),
             ...data,
             dueDate: "Tomorrow, 5 PM",
             status: "Pending"
         }, ...tasksList]);
     };
 
     const handleMarkDone = (id) => {
         setTasksList(tasksList.map(t => t.id === id ? { ...t, status: 'Done' } : t));
     };
     
     const getPriorityColor = (priority) => {
         switch(priority) {
             case 'Critical': return 'text-red-700 bg-red-100 border-red-200';
             case 'High': return 'text-orange-700 bg-orange-100 border-orange-200';
             case 'Medium': return 'text-blue-700 bg-blue-100 border-blue-200';
             default: return 'text-gray-600 bg-gray-100 border-gray-200';
         }
     };
 
     return (
       <div className="space-y-6">
         <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddTask} />
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div>
             <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
               <span>Home</span> <span>/</span> <span>Staff</span> <span>/</span> <span className="text-gray-800 font-medium">Tasks</span>
             </div>
             <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
             <p className="text-gray-500 text-sm">Assign and track work allocation.</p>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors"
             style={{ backgroundColor: premiumColors.primary.DEFAULT }}
           >
             <MdAssignment size={20} />
             Assign New Task
           </button>
         </div>
   
         {/* Filters */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 w-full md:w-auto">
               <select className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer">
                 <option>Assigned To: All</option>
                 <option>Sales</option>
                 <option>Garage</option>
               </select>
               <select className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer">
                 <option>Status: Pending</option>
                 <option>Completed</option>
                 <option>All</option>
               </select>
            </div>
         </div>
   
         {/* Table */}
         <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-indigo-50/30 border-b border-indigo-100 text-xs uppercase tracking-wider text-indigo-800 font-bold">
                 <th className="p-4">Task Details</th>
                 <th className="p-4">Assigned To</th>
                 <th className="p-4">Due Date</th>
                 <th className="p-4">Priority</th>
                 <th className="p-4 text-right">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 text-sm">
               {tasksList.map((item) => (
                 <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                   <td className="p-4">
                     <div className="font-bold text-gray-900">{item.title}</div>
                     <div className="text-xs text-gray-500 mt-0.5">ID: TSK-{100 + item.id}</div>
                   </td>
                   <td className="p-4 font-medium text-gray-700">
                     {item.assignedTo}
                   </td>
                   <td className="p-4">
                      <span className={`font-semibold ${item.dueDate === 'Overdue' ? 'text-red-600' : 'text-gray-700'}`}>
                         {item.dueDate}
                      </span>
                   </td>
                   <td className="p-4">
                      <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded text-xs font-bold border ${getPriorityColor(item.priority)}`}>
                         <MdFlag size={12} /> {item.priority}
                      </span>
                   </td>
                   <td className="p-4 text-right">
                     {item.status === 'Pending' ? (
                         <button 
                            onClick={() => handleMarkDone(item.id)}
                            className="flex items-center gap-1 ml-auto px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                         >
                             <MdCheckCircle size={14} /> Mark Done
                         </button>
                     ) : (
                         <span className="text-gray-400 text-xs font-medium italic">Completed</span>
                     )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
           
           {tasksList.length === 0 && (
              <div className="p-10 text-center text-gray-500">No tasks found.</div>
           )}
         </div>
       </div>
     );
 };
