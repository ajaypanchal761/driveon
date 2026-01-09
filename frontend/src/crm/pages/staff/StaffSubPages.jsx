import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
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
  MdDateRange,
  MdAttachMoney,
  MdReceipt,
  MdStar,
  MdAssignment,
  MdFlag,
  MdCheckCircle,
  MdCheck,
  MdClose,
  MdArrowBack,
  MdLocationOn,
  MdMap
} from 'react-icons/md';
import { jsPDF } from 'jspdf';
import { premiumColors } from '../../../theme/colors';
import { motion, AnimatePresence } from 'framer-motion';
import ThemedDropdown from '../../components/ThemedDropdown';

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


const StaffActionMenu = ({ staff, onEdit, onDelete, onChangeStatus, isOpen, onClose }) => {
  if (!isOpen) return null;

  const statuses = ['Active', 'On Duty', 'Leave'];

  return (
    <div className="relative">
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => { onEdit(staff); onClose(); }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#212c40]/5 hover:text-[#212c40] flex items-center gap-2 transition-colors font-medium"
        >
          <MdEdit size={16} /> Edit Details
        </button>
        <button
          onClick={() => { onDelete(staff.id); onClose(); }}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
        >
          <MdDelete size={16} /> Delete Staff
        </button>

        <div className="border-t border-gray-50 my-1"></div>
        <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Change Status</div>

        {statuses.map(status => (
          <button
            key={status}
            onClick={() => { onChangeStatus(staff.id, status); onClose(); }}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors font-medium
                            ${staff.status === status ? 'text-[#212c40] bg-[#212c40]/10' : 'text-gray-600 hover:bg-gray-50'}
                        `}
          >
            <div className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-green-500' :
              status === 'On Duty' ? 'bg-blue-500' : 'bg-red-500'
              }`} />
            {status}
            {staff.status === status && <MdCheck className="ml-auto" size={14} />}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

/**
 * AddStaffModal - Modal for adding new staff members
 */
const AddStaffModal = ({ isOpen, onClose, onSubmit, editingStaff }) => {
  const [step, setStep] = useState(1);
  const [salaryMethod, setSalaryMethod] = useState('Monthly');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    status: 'Active',
    phone: '',
    phone: '',
    email: '',
    password: '',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: '',
    salary: '',
    workingDays: '26',
    absentDeduction: '',
    halfDayDeduction: '',
    overtimeRate: ''
  });

  const [errors, setErrors] = useState({});
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchRoles = async () => {
        try {
          const response = await api.get('/crm/roles');
          if (response.data.success) {
            setAvailableRoles(response.data.data.roles.map(r => r.roleName));
          }
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      };
      fetchRoles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (editingStaff) {
        setFormData({
          name: editingStaff.name || '',
          role: editingStaff.role || '',
          status: editingStaff.status || 'Active',
          phone: editingStaff.phone ? editingStaff.phone.replace(/^\+91\s*/, '') : '',
          email: editingStaff.email || '',
          password: '',
          joiningDate: editingStaff.joinDate ? new Date(editingStaff.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          employmentType: editingStaff.employmentType || '',
          salary: editingStaff.salary || '',
          workingDays: editingStaff.workingDays || '26',
          absentDeduction: editingStaff.absentDeduction || '',
          halfDayDeduction: editingStaff.halfDayDeduction || '',
          overtimeRate: editingStaff.overtimeRate || ''
        });
        setStep(1);
        setSalaryMethod(editingStaff.salaryMethod || 'Monthly');
        setErrors({});
      } else {
        setFormData({
          name: '',
          role: '',
          status: 'Active',
          phone: '',
          phone: '',
          email: '',
          password: '',
          joiningDate: new Date().toISOString().split('T')[0],
          employmentType: '',
          salary: '',
          workingDays: '26',
          absentDeduction: '',
          halfDayDeduction: '',
          overtimeRate: ''
        });
        setStep(1);
        setSalaryMethod('Monthly');
        setErrors({});
      }
    }
  }, [isOpen, editingStaff]);

  // Auto-calculation of deductions removed as per user request
  // useEffect(() => { ... }, []);

  const validateStep1 = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    if (!formData.email) newErrors.email = "Email is required";
    if (!editingStaff && !formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};
    if (salaryMethod === 'Monthly') {
      if (!formData.salary) newErrors.salary = "Base salary is required for monthly staff";
      if (!formData.workingDays) newErrors.workingDays = "Working days are required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(step + 1);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      phone: `+91 ${formData.phone}`,
      salaryMethod
    };
    onSubmit(submitData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl shadow-2xl bg-white overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-white px-8 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10 hidden md:flex">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {step} of 3: {step === 1 ? 'Basic Details' : step === 2 ? 'Salary Config' : 'Final Review'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdClose size={24} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        {/* Mobile Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10 md:hidden">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{editingStaff ? 'Edit Staff' : 'Add Staff'}</h2>
            <p className="text-xs text-gray-500">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full"><MdClose size={20} /></button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  className={`w-full px-4 py-3 bg-white border ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500/20'} rounded-xl focus:ring-2 focus:border-indigo-500 outline-none transition-all font-medium text-gray-800`}
                  placeholder="Rajesh Kumar"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
              </div>

              <div className="col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Role *</label>
                <div className={`${errors.role ? 'border border-red-300 rounded-xl' : ''}`}>
                  <ThemedDropdown
                    options={availableRoles.length > 0 ? availableRoles : ['Sales Manager', 'Driver', 'Mechanic', 'Accountant', 'Admin Executive']}
                    value={formData.role}
                    onChange={(val) => {
                      setFormData({ ...formData, role: val });
                      if (errors.role) setErrors({ ...errors, role: null });
                    }}
                    placeholder="Select Role"
                    className="w-full"
                  />
                </div>
                {errors.role && <p className="text-red-500 text-xs mt-1 font-medium">{errors.role}</p>}
              </div>



              <div className="col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Status</label>
                <ThemedDropdown
                  options={['Active', 'Inactive', 'On Leave']}
                  value={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val })}
                  placeholder="Select Status"
                />
              </div>

              <div className="col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">+91</span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) });
                      if (errors.phone) setErrors({ ...errors, phone: null });
                    }}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500/20'} rounded-xl focus:bg-white focus:ring-2 focus:border-indigo-500 outline-none transition-all font-mono text-gray-800`}
                    placeholder="98765 43210"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
              </div>

              <div className="col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500/20'} rounded-xl focus:bg-white focus:ring-2 focus:border-indigo-500 outline-none transition-all text-gray-800`}
                  placeholder="rajesh@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
              </div>

              <div className="col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Password {editingStaff ? '(Optional)' : '*'}</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  className={`w-full px-4 py-3 bg-white border ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500/20'} rounded-xl focus:ring-2 focus:border-indigo-500 outline-none transition-all text-gray-800`}
                  placeholder={editingStaff ? "Leave blank to keep current" : "Set login password"}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
              </div>

              <div className="col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Joining Date</label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-800"
                />
              </div>

              <div className="col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Employment</label>
                <ThemedDropdown
                  options={['Full Time', 'Part Time', 'Contract', 'Intern']}
                  value={formData.employmentType}
                  onChange={(val) => setFormData({ ...formData, employmentType: val })}
                  placeholder="Select..."
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <label className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3 block">Salary Method</label>
                <div className="grid grid-cols-3 gap-4">
                  {['Monthly', 'Daily', 'Per Trip'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSalaryMethod(method)}
                      className={`
                        py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-sm
                        ${salaryMethod === method
                          ? 'bg-[#1C205C] text-white shadow-indigo-200 transform scale-[1.02]'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}
                      `}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {salaryMethod === 'Monthly' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Base Monthly Salary (₹) *</label>
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => {
                        setFormData({ ...formData, salary: e.target.value });
                        if (errors.salary) setErrors({ ...errors, salary: null });
                      }}
                      className={`w-full px-4 py-3 bg-white border ${errors.salary ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500/20'} rounded-xl focus:ring-2 focus:border-indigo-500 outline-none transition-all font-bold text-lg text-gray-900`}
                      placeholder="45000"
                    />
                    {errors.salary && <p className="text-red-500 text-xs mt-1 font-medium">{errors.salary}</p>}
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Working Days *</label>
                    <input
                      type="number"
                      value={formData.workingDays}
                      onChange={(e) => {
                        setFormData({ ...formData, workingDays: e.target.value });
                        if (errors.workingDays) setErrors({ ...errors, workingDays: null });
                      }}
                      className={`w-full px-4 py-3 bg-white border ${errors.workingDays ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500/20'} rounded-xl focus:ring-2 focus:border-indigo-500 outline-none transition-all font-bold text-lg text-gray-900`}
                      placeholder="26"
                    />
                    {errors.workingDays && <p className="text-red-500 text-xs mt-1 font-medium">{errors.workingDays}</p>}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
                <MdVisibility className="shrink-0 mt-0.5" size={18} />
                <p><strong>NB:</strong> These rules will be locked and used to auto-calculate salary every month. Manual editing of salary is disabled to ensure accuracy.</p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                <MdCheckCircle className="text-green-500" size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">All Set!</h2>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                You are about to add <span className="font-bold text-gray-800">{formData.name}</span> as a <span className="font-bold text-gray-800">{formData.role}</span>.
              </p>

              <div className="w-full bg-gray-50 rounded-2xl border border-gray-100 p-6 text-left grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Salary Type</label>
                  <p className="font-bold text-gray-900 text-lg">{salaryMethod}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Base Pay</label>
                  <p className="font-bold text-gray-900 text-lg">₹{formData.salary || '0'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
                  <p className="font-bold text-gray-900 text-lg font-mono">+91 {formData.phone}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-100 p-6 flex justify-between items-center z-10">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="px-6 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-xl bg-[#1C205C] text-white font-bold shadow-lg shadow-indigo-200 hover:bg-[#2a306e] transition-all transform hover:-translate-y-0.5"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all transform hover:-translate-y-0.5"
            >
              Confirm & Add
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ViewStaffModal = ({ isOpen, onClose, staff }) => {
  if (!isOpen || !staff) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl shadow-2xl bg-white overflow-hidden"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Staff Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <MdClose size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#212c40]/10 flex items-center justify-center text-[#212c40] text-2xl font-bold border-2 border-white shadow-sm">
              {staff.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{staff.name}</h3>
              <span className="px-2.5 py-1 bg-[#212c40]/10 text-[#212c40] rounded-lg text-xs font-bold uppercase tracking-wide">
                {staff.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Department</p>
              <p className="text-gray-800 font-medium">{staff.department}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border ${staff.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                staff.status === 'On Duty' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                  'bg-red-100 text-red-700 border-red-200'
                }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Active' ? 'bg-green-500' :
                  staff.status === 'On Duty' ? 'bg-blue-500' : 'bg-red-500'
                  }`}></div>
                {staff.status}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#212c40]/10 flex items-center justify-center text-[#212c40]">
                <MdPhone size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold">Phone</p>
                <p className="font-medium font-mono">{staff.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#212c40]/10 flex items-center justify-center text-[#212c40]">
                <MdEmail size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold">Email</p>
                <p className="font-medium">{staff.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#212c40]/10 flex items-center justify-center text-[#212c40]">
                <MdAccessTime size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold">Joined On</p>
                <p className="font-medium">{staff.joinDate || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const StaffDirectoryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingStaff, setViewingStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crm/staff');
      if (response.data.success) {
        setStaffList(response.data.data.staff.map(staff => ({
          ...staff,
          id: staff._id, // Map _id to id for frontend compatibility
          joinDate: new Date(staff.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        })));
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || deptFilter === `Dept: ${deptFilter}` || staff.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleAddStaff = async (newStaff) => {
    try {
      if (editingStaff) {
        const response = await api.put(`/crm/staff/${editingStaff.id}`, newStaff);
        if (response.data.success) {
          fetchStaff();
          setEditingStaff(null);
        }
      } else {
        const response = await api.post('/crm/staff', newStaff);
        if (response.data.success) {
          fetchStaff();
        }
      }
    } catch (error) {
      console.error("Error saving staff:", error);
    }
  };

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleViewClick = (staff) => {
    setViewingStaff(staff);
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const response = await api.delete(`/crm/staff/${staffId}`);
        if (response.data.success) {
          fetchStaff(); // Refresh list
        }
      } catch (error) {
        console.error("Error deleting staff:", error);
      }
    }
  };

  const handleChangeStatus = async (staffId, newStatus) => {
    try {
      const response = await api.put(`/crm/staff/${staffId}`, { status: newStatus });
      if (response.data.success) {
        setStaffList(staffList.map(s =>
          s.id === staffId ? { ...s, status: newStatus } : s
        ));
      }
      setActiveMenuId(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-bold border border-green-100">Active</span>;
      case 'On Duty': return <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">On Duty</span>;
      case 'Leave': return <span className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-100">Leave</span>;
      default: return <span className="px-2 py-1 rounded bg-gray-50 text-gray-700 text-xs font-bold border border-gray-100">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <ViewStaffModal
        isOpen={!!viewingStaff}
        onClose={() => setViewingStaff(null)}
        staff={viewingStaff}
      />
      <AddStaffModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingStaff(null); }}
        onSubmit={handleAddStaff}
        editingStaff={editingStaff} // Pass editingStaff if your modal supports it (it seems StaffFormModal does, but AddStaffModal might not. Let's check.)
      />
      {/* Note: I am assuming AddStaffModal is the one used. But wait, there is StaffFormModal too. */}
      {/* Looking at original code: <AddStaffModal isOpen={isModalOpen} ... /> line 474. */}
      {/* And AddStaffModal definition at line 268 does NOT take editingStaff prop. StaffFormModal does. */}
      {/* However, my mandate is 'ui ko mat bigadna'. If I switch to StaffFormModal, UI changes. */}
      {/* I will stick to AddStaffModal but I will update it separately if needed or just handle Add. */}
      {/* Wait, handleEditClick sets editingStaff, but AddStaffModal doesn't use it. */}
      {/* I will use the existing AddStaffModal but injecting initial data if editing? */}
      {/* Actually, looking at line 69 StaffFormModal... it seems unused in StaffDirectoryPage (line 474 uses AddStaffModal). */}
      {/* I will create a wrapper or modify AddStaffModal to accept initialData if I want Edit to work properly? */}
      {/* Or, since the user asks to connect functionality, and Edit is part of it. */}
      {/* I will proceed with AddStaffModal for now and ensure Add works perfectly. The Edit functionality might require updating the Modal component slightly or using the other one. */}
      {/* Let's double check handleEditClick usage. It opens modal. But modal doesn't populate. */}
      {/* I will update AddStaffModal to accept `initialData` to support Edit without changing UI. */}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span>
            <span>/</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/staff/directory')}>Staff</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">Directory</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Directory</h1>
          <p className="text-gray-500 text-sm">Manage all staff members and their details</p>
        </div>
        <button
          onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
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
          <ThemedDropdown
            options={['All', 'Sales', 'Fleet', 'Garage', 'Administration']}
            value={deptFilter}
            onChange={(val) => setDeptFilter(val)}
            className="w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Staff Name</th>
                <th className="p-4">Role & Dept</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Salary</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{staff.name}</div>
                    <div className="text-xs text-gray-400">ID: STF-{String(staff.id).slice(-4)}</div>
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
                  <td className="p-4 font-medium text-gray-900">
                    ₹ {(Number(staff.salary || staff.baseSalary || 0) - Number(staff.absentDeduction || 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(staff.status)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewClick(staff)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === staff.id ? null : staff.id)}
                          className={`p-2 rounded-xl transition-all shadow-sm border border-transparent 
                                        ${activeMenuId === staff.id ? 'bg-[#212c40] text-white shadow-lg shadow-gray-200' : 'text-gray-400 hover:text-gray-800 hover:bg-white hover:border-gray-200'}
                                    `}
                        >
                          <MdMoreVert size={18} />
                        </button>
                        <StaffActionMenu
                          staff={staff}
                          isOpen={activeMenuId === staff.id}
                          onClose={() => setActiveMenuId(null)}
                          onEdit={handleEditClick}
                          onDelete={handleDeleteStaff}
                          onChangeStatus={handleChangeStatus}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}


              {!loading && filteredStaff.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
              <input required placeholder="Role Name" className="w-full p-2 border rounded-xl" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
              <textarea placeholder="Description" className="w-full p-2 border rounded-xl" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              <ThemedDropdown
                options={['Basic', 'Intermediate', 'Full Access']}
                value={formData.access}
                onChange={(val) => setFormData({ ...formData, access: val })}
                className="bg-white"
              />
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

const RoleDetails = ({ role, staffList = [], onBack }) => {
  // Mock Permissions based on access level
  const permissions = role.access === 'Full Access'
    ? ['Create/Edit/Delete Staff', 'Manage Roles', 'View Financial Reports', 'Manage Bookings', 'Edit Content']
    : role.access === 'Intermediate'
      ? ['View Staff Directory', 'Manage Bookings', 'View Basic Reports']
      : ['View Assigned Tasks', 'Mark Attendance'];

  // Find assigned staff
  const assignedStaff = staffList.filter(s =>
    (s.role && role.role && s.role.toLowerCase().includes(role.role.toLowerCase())) ||
    (s.role && role.role && role.role.toLowerCase().includes(s.role.toLowerCase()))
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
  const [rolesList, setRolesList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // For Details Page

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, staffRes] = await Promise.all([
        api.get('/crm/roles'),
        api.get('/crm/staff')
      ]);

      let staffData = [];
      if (staffRes.data.success) {
        staffData = staffRes.data.data.staff;
        setStaffList(staffData);
      }

      if (rolesRes.data.success) {
        const roles = rolesRes.data.data.roles.map(role => {
          // Calculate count
          const count = staffData.filter(s =>
            (s.role && s.role.toLowerCase() === role.roleName.toLowerCase()) ||
            (s.role && role.roleName.toLowerCase().includes(s.role.toLowerCase()))
          ).length;

          return {
            ...role,
            id: role._id,
            role: role.roleName,
            access: role.accessLevel,
            count: count
          };
        });
        setRolesList(roles);
      }
    } catch (error) {
      console.error("Error fetching roles/staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async (data) => {
    try {
      // Map frontend fields to backend fields
      const payload = {
        roleName: data.role,
        description: data.description,
        accessLevel: data.access,
        category: 'Operations' // Default or add field if needed
      };

      if (editingRole) {
        const response = await api.put(`/crm/roles/${editingRole.id}`, payload);
        if (response.data.success) {
          fetchData(); // Refresh to recalculate everything
        }
      } else {
        const response = await api.post('/crm/roles', payload);
        if (response.data.success) {
          fetchData();
        }
      }
      setIsModalOpen(false);
      setEditingRole(null);
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleEdit = (e, role) => {
    e.stopPropagation(); // Prevent opening details
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent opening details
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        const response = await api.delete(`/crm/roles/${id}`);
        if (response.data.success) {
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  const openAddModal = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  if (selectedRole) {
    return <RoleDetails role={selectedRole} staffList={staffList} onBack={() => setSelectedRole(null)} />;
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
            <span className="hover:text-[#212c40] cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span>
            <span>/</span>
            <span className="hover:text-[#212c40] cursor-pointer transition-colors" onClick={() => navigate('/crm/staff/directory')}>Staff</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">Roles</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-500 text-sm">Define what each staff member can see and do.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-medium shadow-sm hover:bg-[#2a3550] transition-colors"
          style={{ backgroundColor: premiumColors.primary.DEFAULT }}
        >
          <MdAdd size={20} />
          Add New Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#212c40]"></div>
          </div>
        ) : (
          rolesList.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer relative group hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#212c40]/10 text-[#212c40] rounded-xl">
                  <MdSecurity size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleEdit(e, role)}
                    className="p-1.5 text-gray-400 hover:text-[#212c40] hover:bg-[#212c40]/10 rounded-lg"
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
          ))
        )}
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

const MarkAttendanceModal = ({ isOpen, onClose, onSubmit, initialData, staffList = [] }) => {
  const [formData, setFormData] = useState({ staffId: '', status: 'Present', inTime: '', outTime: '' });

  useEffect(() => {
    if (isOpen) {
      if (initialData && initialData.staffId) {
        setFormData({
          staffId: initialData.staffId,
          status: initialData.status,
          inTime: initialData.inTime !== '-' ? initialData.inTime : '',
          outTime: initialData.outTime !== '-' ? initialData.outTime : ''
        });
      } else {
        // Default to first staff if available
        const defaultStaff = staffList.length > 0 ? staffList[0].id : '';
        setFormData({ staffId: defaultStaff, status: 'Present', inTime: '', outTime: '' });
      }
    }
  }, [isOpen, initialData, staffList]);

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
            <h3 className="text-xl font-bold mb-4 text-[#212c40]">{initialData ? 'Edit Attendance' : 'Mark Attendance'}</h3>
            <div className="space-y-4">
              <ThemedDropdown
                options={staffList.map(staff => ({ value: staff.id, label: staff.name }))}
                value={formData.staffId}
                onChange={(val) => setFormData({ ...formData, staffId: val })}
                disabled={!!initialData}
                placeholder="Select Staff"
                className="bg-white"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 ml-1">In Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#212c40]/20 focus:border-[#212c40]"
                    value={formData.inTime}
                    onChange={e => setFormData({ ...formData, inTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 ml-1">Out Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#212c40]/20 focus:border-[#212c40]"
                    value={formData.outTime}
                    onChange={e => setFormData({ ...formData, outTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {['Present', 'Absent', 'Late'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFormData({ ...formData, status })}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${formData.status === status ? 'bg-[#212c40] text-white border-[#212c40]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-[#212c40] text-white py-3 rounded-xl font-bold hover:bg-[#2a3550] shadow-lg shadow-gray-200 transition-all active:scale-95"
              >
                {initialData ? 'Update Attendance' : 'Submit'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ViewLocationModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl shadow-2xl bg-white overflow-hidden flex flex-col"
      >
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MdLocationOn className="text-red-500" /> Live Location Tracker
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MdClose size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 bg-white space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#212c40]/10 flex items-center justify-center text-[#212c40] font-bold text-xl shrink-0">
              {data.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{data.name}</h3>
              <p className="text-sm text-gray-500">{data.role}</p>

              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 flex gap-3 items-start">
                <MdLocationOn className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Current Location</p>
                  <p className="text-gray-800 font-medium text-sm mt-0.5">{data.location?.address || 'Location not available'}</p>
                  <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Updated Just Now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StaffMonthlyAttendanceModal = ({ isOpen, onClose, staff }) => {
  if (!isOpen || !staff) return null;

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock Data Generators
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  
  const baseSalary = 25000; // Mock base salary if not in staff object
  const workingDaysReq = 26;
  
  // Generating Mock Daily Status
  const attendanceHistory = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(selectedYear, selectedMonth, day);
    const dayOfWeek = date.getDay();
    let status = 'Present';
    
    // Logic: Sundays are Week Offs. Random Absents.
    if (dayOfWeek === 0) status = 'Week Off';
    else if (Math.random() > 0.9) status = 'Absent';
    else if (Math.random() > 0.95) status = 'Half Day';

    // Future dates
    if (date > new Date()) status = '-';

    return { day, date: date.toDateString(), status };
  });

  // Calculate Stats
  const presentDays = attendanceHistory.filter(d => d.status === 'Present').length;
  const halfDays = attendanceHistory.filter(d => d.status === 'Half Day').length;
  const absentDays = attendanceHistory.filter(d => d.status === 'Absent').length;
  const weekOffs = attendanceHistory.filter(d => d.status === 'Week Off').length;
  
  // Salary Calc
  const perDaySalary = baseSalary / workingDaysReq;
  const deduction = (absentDays * perDaySalary) + (halfDays * (perDaySalary / 2));
  const finalSalary = Math.max(0, baseSalary - deduction);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-3xl shadow-2xl bg-white overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-white px-8 py-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10">
          <div>
             <h2 className="text-2xl font-bold text-gray-900">Monthly Attendance & Payroll</h2>
             <p className="text-gray-500 text-sm">Detailed view for <span className="font-bold text-[#1C205C]">{staff.name}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1C205C]/20"
            >
              {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1C205C]/20"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
            <button
              onClick={onClose}
              className="p-2 ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MdClose size={24} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
           {/* Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Total Days</p>
                  <h3 className="text-2xl font-bold text-blue-900">{daysInMonth}</h3>
                  <p className="text-xs text-blue-600 font-medium">{weekOffs} Week Offs</p>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                  <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">Present</p>
                  <h3 className="text-2xl font-bold text-green-900">{presentDays} <span className="text-sm font-medium text-green-600">Days</span></h3>
                  <p className="text-xs text-green-600 font-medium">+ {halfDays} Half Days</p>
              </div>
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Absent</p>
                  <h3 className="text-2xl font-bold text-red-900">{absentDays} <span className="text-sm font-medium text-red-600">Days</span></h3>
                  <p className="text-xs text-red-600 font-medium">Unpaid Leaves</p>
              </div>
              <div className="bg-[#1C205C] p-4 rounded-2xl border border-[#1C205C] text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><MdAttachMoney size={48} /></div>
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">Est. Salary</p>
                  <h3 className="text-2xl font-bold">₹ {Math.round(finalSalary).toLocaleString()}</h3>
                   <p className="text-xs text-indigo-300 font-medium">Base: ₹ {baseSalary.toLocaleString()}</p>
              </div>
           </div>

           <div className="flex flex-col lg:flex-row gap-8">
              {/* Calendar Grid */}
              <div className="flex-1">
                 <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><MdDateRange /> Daily Log</h4>
                 <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                    <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-400 uppercase">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty slots for start of month - Simplified for now assuming starts on appropriate day or just 1st */}
                        {attendanceHistory.map((day) => (
                            <div 
                                key={day.day} 
                                className={`
                                    aspect-square rounded-xl flex flex-col items-center justify-center border text-xs font-bold relative group cursor-pointer transition-all hover:scale-105
                                    ${day.status === 'Present' ? 'bg-white border-green-200 text-green-700 shadow-sm' : 
                                      day.status === 'Absent' ? 'bg-red-50 border-red-100 text-red-600' :
                                      day.status === 'Half Day' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                                      day.status === 'Week Off' ? 'bg-gray-100 border-gray-200 text-gray-400' : 
                                      'bg-gray-50 border-gray-100 text-gray-300'}
                                `}
                            >
                                <span className={day.status === '-' ? 'opacity-50' : ''}>{day.day}</span>
                                {day.status === 'Present' && <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1"></div>}
                                {day.status === 'Absent' && <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1"></div>}
                                {day.status === 'Half Day' && <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1"></div>}

                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 bg-[#1C205C] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                    {day.status}
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>

              {/* Salary Breakdown Details */}
              <div className="w-full lg:w-80">
                 <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><MdReceipt /> Salary Breakdown</h4>
                 <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Base Salary</span>
                        <span className="font-bold text-gray-900">₹ {baseSalary.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-px bg-gray-100"></div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Working Days</span>
                        <span className="font-bold text-gray-900">{workingDaysReq}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Per Day Rate</span>
                        <span className="font-bold text-gray-900">₹ {Math.round(perDaySalary).toLocaleString()}</span>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl space-y-2 mt-2 border border-red-100">
                        <div className="flex justify-between items-center text-xs text-red-600 font-medium">
                            <span>Absent Deduction ({absentDays})</span>
                            <span>- ₹ {Math.round(absentDays * perDaySalary).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-orange-600 font-medium">
                            <span>Half Day Deduction ({halfDays})</span>
                            <span>- ₹ {Math.round(halfDays * (perDaySalary / 2)).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="w-full h-px bg-gray-100"></div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-bold">Net Payable</span>
                        <span className="font-bold text-xl text-[#1C205C]">₹ {Math.round(finalSalary).toLocaleString()}</span>
                    </div>
                    <button className="w-full py-3 mt-2 bg-[#1C205C] text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-[#2a3550] transition-colors">
                        Process Salary
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export const AttendancePage = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const [attendanceList, setAttendanceList] = useState([]);
  const [staffInfoList, setStaffInfoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingMonthly, setViewingMonthly] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [viewingLocation, setViewingLocation] = useState(null);
  const [dateFilter, setDateFilter] = useState('Date: Today');
  const [roleFilter, setRoleFilter] = useState('Staff: All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [staffRes, attRes] = await Promise.all([
        api.get('/crm/staff'),
        api.get('/crm/attendance?date=' + new Date().toISOString())
      ]);

      let staffData = [];
      if (staffRes.data.success) {
        staffData = staffRes.data.data.staff.map(s => ({
          id: s._id,
          name: s.name,
          role: s.role,
          department: s.department
        }));
        setStaffInfoList(staffData);
      }

      if (attRes.data.success) {
        const records = attRes.data.data.records;
        // Merge staff with attendance
        const mergedData = staffData.map((staff, index) => {
          const record = records.find(r => r.staff._id === staff.id || r.staff === staff.id);

          // MOCK LOCATION DATA SIMULATION
          const mockLocations = [
            { status: 'Online', address: '24/7, Connaught Place, New Delhi', lat: 28.6139, lng: 77.2090 },
            { status: 'Online', address: 'Tech Park, Sector 62, Noida', lat: 28.6280, lng: 77.3780 },
            { status: 'Offline', address: 'Last seen: Home (2 hrs ago)', lat: 0, lng: 0 },
            { status: 'Online', address: 'Cyber City, Gurugram', lat: 28.4595, lng: 77.0266 },
            { status: 'Offline', address: 'Offline', lat: 0, lng: 0 }
          ];
          const mockLoc = mockLocations[index % mockLocations.length];

          return {
            id: staff.id, // Use staff ID as row ID mostly, or record ID if exists? 
            // Better to use record ID if exists, but we want to show ALL staff.
            // Let's use staff ID for key, and track record ID separately if needed.
            // Actually existing UI uses 'id' for key.
            staffId: staff.id,
            name: staff.name,
            role: staff.role,
            inTime: record?.inTime || '-',
            outTime: record?.outTime || '-',
            status: record?.status || 'Absent', // Default to Absent if no record
            workHours: record?.workHours || '-',
            recordId: record?._id,
            location: mockLoc
          };
        });
        setAttendanceList(mergedData);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const getFilteredAttendance = () => {
    let data = [...attendanceList];

    // Search Filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(item =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.role.toLowerCase().includes(lowerSearch)
      );
    }

    // 1. Filter by Role
    if (roleFilter !== 'Staff: All') {
      const keyword = roleFilter === 'Drivers' ? 'Driver' : 'Sales';
      data = data.filter(item => item.role.includes(keyword));
    }

    // 2. Filter by Date (Mocking different data for "Yesterday")
    if (dateFilter === 'Yesterday') {
      // Ideally fetch from backend for yesterday
      return [];
    } else if (dateFilter === 'Select Date') {
      return [];
    }

    return data;
  };

  const filteredAttendance = getFilteredAttendance();

  const handleMarkAttendance = async (data) => {
    // Format times for display if entered manually
    const formatTime = (t) => {
      if (!t) return undefined;
      const [h, m] = t.split(':');
      const d = new Date();
      d.setHours(h);
      d.setMinutes(m);
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const newInTime = data.inTime?.includes(':') && !data.inTime.includes('M') ? formatTime(data.inTime) : data.inTime;
    const newOutTime = data.outTime?.includes(':') && !data.outTime.includes('M') ? formatTime(data.outTime) : data.outTime;

    // Calculate work hours if both times present
    // Simple calc for now or let backend do it? backend schema has workHours string.
    // Let's just send what we have.

    try {
      const payload = {
        staffId: data.staffId,
        date: new Date(),
        status: data.status,
        inTime: newInTime || undefined,
        outTime: newOutTime || undefined
      };

      const response = await api.post('/crm/attendance', payload);
      if (response.data.success) {
        fetchData();
      }

    } catch (err) {
      console.error("Error saving attendance", err);
    }

    setEditingAttendance(null);
    setIsModalOpen(false);
  };

  const handleEditClick = (item) => {
    // Convert "09:00 AM" back to "09:00" for input
    const parseTime = (tStr) => {
      if (!tStr || tStr === '-') return '';
      const [time, modifier] = tStr.split(' ');
      if (!modifier) return tStr; // already HH:MM?
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


  const handleMarkTime = async (id, type) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Find current record locally to preserve other fields
    const currentRecord = attendanceList.find(a => a.id === id);
    if (!currentRecord) return;

    const payload = {
      staffId: currentRecord.staffId,
      date: new Date(),
      status: 'Present', // If marking time, they are present
      inTime: type === 'in' ? time : (currentRecord.inTime !== '-' ? currentRecord.inTime : undefined),
      outTime: type === 'out' ? time : (currentRecord.outTime !== '-' ? currentRecord.outTime : undefined)
    };

    // Calculate duration if marking out
    if (type === 'out' && payload.inTime) {
      // rough calc
      // ... skipping complex calc for brevity, backend stores string
      // can add simple logic here if needed or relying on backend? Backend just stores string.
    }

    try {
      await api.post('/crm/attendance', payload);
      fetchData();
    } catch (e) {
      console.error("Error marking time", e);
    }
  };

  return (
    <div className="space-y-6">
      <MarkAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleMarkAttendance}
        initialData={editingAttendance}
        staffList={staffInfoList}
      />

      <ViewLocationModal
        isOpen={!!viewingLocation}
        onClose={() => setViewingLocation(null)}
        data={viewingLocation}
      />

      <StaffMonthlyAttendanceModal
        isOpen={!!viewingMonthly}
        onClose={() => setViewingMonthly(null)}
        staff={viewingMonthly}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-[#212c40] cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span>
            <span>/</span>
            <span className="hover:text-[#212c40] cursor-pointer transition-colors" onClick={() => navigate('/crm/staff/directory')}>Staff</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">Attendance</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Tracker</h1>
          <p className="text-gray-500 text-sm">Today: {currentDate}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search name or role..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <ThemedDropdown
            options={['Staff: All', 'Sales', 'Drivers']}
            value={roleFilter}
            onChange={(val) => setRoleFilter(val)}
            className="bg-white text-sm"
            width="w-40"
          />
          <ThemedDropdown
            options={['Date: Today', 'Yesterday', 'Select Date']}
            value={dateFilter}
            onChange={(val) => setDateFilter(val)}
            className="bg-white text-sm"
            width="w-40"
          />
        </div>
        <div className="text-sm text-gray-500 font-medium">
          Total Present: <span className="text-green-600 font-bold">{filteredAttendance.filter(i => i.status === 'Present').length}</span> / <span className="text-gray-800">{filteredAttendance.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#212c40]/5 border-b border-[#212c40]/10 text-xs uppercase tracking-wider text-[#212c40] font-bold">
                <th className="p-4">Staff Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Work Hours</th>
                <th className="p-4">Status</th>
                <th className="p-4">Live Location</th>
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
                    <td className="p-4 text-gray-600">
                      {item.workHours}
                    </td>
                    <td className="p-4">
                      {item.status === 'Present' && <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-100">Present</span>}
                      {item.status === 'Absent' && <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-bold border border-red-100">Absent</span>}
                      {item.status === 'Late' && <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold border border-amber-100">Late</span>}
                    </td>
                    <td className="p-4">
                      {item.location?.status === 'Online' ? (
                        <button
                          onClick={() => setViewingLocation(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#212c40]/10 text-[#212c40] rounded-lg text-xs font-bold border border-[#212c40]/20 hover:bg-[#212c40]/20 transition-colors animate-pulse"
                        >
                          <MdLocationOn /> Location
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div> Offline
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                           onClick={() => setViewingMonthly(item)}
                           className="text-[#1C205C] hover:text-[#2a3550] text-xs font-bold bg-[#1C205C]/5 hover:bg-[#1C205C]/10 px-2.5 py-1.5 rounded-lg transition-colors border border-[#1C205C]/10"
                        >
                           Monthly View
                        </button>
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-400 text-sm">
                      No attendance records found for this selection.
                    </td>
                  </tr>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
  const [salaryList, setSalaryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState('December 2025');
  const [staffFilter, setStaffFilter] = useState('Staff: All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [monthFilter]); // Refetch when month changes

  const fetchData = async () => {
    setLoading(true);
    // TEMPORARY: Dummy Data as per user request to demonstrate flow
    const MOCK_SALARY_DATA = [
      {
        id: '101',
        staffId: 's1',
        name: 'Ravi Mishra',
        role: 'Senior Driver',
        baseSalary: '₹ 25,000',
        deductions: '₹ 500',
        netPay: '₹ 24,500',
        status: 'Pending',
        paymentDate: '-', // Not paid yet
        isNew: true,
        month: 'December 2025'
      },
      {
        id: '102',
        staffId: 's2',
        name: 'Anita Desai',
        role: 'Sales Executive',
        baseSalary: '₹ 30,000',
        deductions: '₹ 0',
        netPay: '₹ 30,000',
        status: 'Paid',
        paymentDate: '01 Jan 2026',
        isNew: false,
        month: 'December 2025'
      },
      {
        id: '103',
        staffId: 's3',
        name: 'Vikram Singh',
        role: 'Mechanic',
        baseSalary: '₹ 18,000',
        deductions: '₹ 200',
        netPay: '₹ 17,800',
        status: 'Pending',
        paymentDate: '-',
        isNew: true,
        month: 'December 2025'
      }
    ];

    setTimeout(() => {
      setSalaryList(MOCK_SALARY_DATA);
      setLoading(false);
    }, 500); // Simulate network delay
  };

  const handlePayNow = async (item) => {
    // Simulate payment processing
    if (window.confirm(`Confirm payment of ${item.netPay} to ${item.name}?`)) {
      const updatedList = salaryList.map(s => {
        if (s.id === item.id) {
          return {
            ...s,
            status: 'Paid',
            paymentDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          };
        }
        return s;
      });
      setSalaryList(updatedList);
    }
  };

  const handleGeneratePayslips = () => {
    const pendingCount = salaryList.filter(i => i.status !== 'Paid').length;
    if (pendingCount > 0) {
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

  const filteredSalary = salaryList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStaff = true;
    if (staffFilter !== 'Staff: All') {
      const keyword = staffFilter === 'Drivers' ? 'Driver' : 'Sales';
      matchesStaff = item.role && item.role.includes(keyword);
    }

    return matchesSearch && matchesStaff;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span>
            <span>/</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/staff/directory')}>Staff</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">Salary</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Management</h1>
          <p className="text-gray-500 text-sm">Manage payrolls and generate payslips.</p>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search staff name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <ThemedDropdown
            options={['Staff: All', 'Sales', 'Drivers']}
            value={staffFilter}
            onChange={(val) => setStaffFilter(val)}
            className="bg-white text-sm"
            width="w-40"
          />
          <ThemedDropdown
            options={['December 2025', 'November 2025', 'October 2025']}
            value={monthFilter}
            onChange={(val) => setMonthFilter(val)}
            className="bg-white text-sm"
            width="w-40"
          />
        </div>
        <div className="text-sm font-medium flex gap-4">
          <div>Total Payout: <span className="text-gray-900 font-bold">₹ {salaryList.filter(s => s.status === 'Paid').reduce((acc, curr) => acc + curr.rawNet, 0).toLocaleString()}</span></div>
          <div>Pending: <span className="text-orange-600 font-bold">₹ {salaryList.filter(s => s.status !== 'Paid').reduce((acc, curr) => acc + curr.rawNet, 0).toLocaleString()}</span></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
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
              {filteredSalary.length > 0 ? (
                filteredSalary.map((item) => (
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
                          className="text-indigo-600 text-xs font-bold hover:underline"
                        >
                          Download Slip
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePayNow(item)}
                          className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-green-700 transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400 text-sm">
                    No payroll records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Mock Data for Performance - Removed for Backend Integration
// const MOCK_PERFORMANCE_DATA = [...];

const AddReviewModal = ({ isOpen, onClose, onSubmit, staffList = [] }) => {
  const [formData, setFormData] = useState({ staffId: '', rating: '5', summary: '' });

  // Reset or set default staff when modal opens
  useEffect(() => {
    if (isOpen && staffList.length > 0 && !formData.staffId) {
      setFormData(prev => ({ ...prev, staffId: staffList[0].id }));
    }
  }, [isOpen, staffList]);

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
              <ThemedDropdown
                options={staffList.map(staff => ({ value: staff.id, label: staff.name }))}
                value={formData.staffId}
                onChange={(val) => setFormData({ ...formData, staffId: val })}
                placeholder="Select Staff"
                className="bg-white"
              />
              <ThemedDropdown
                options={[
                  { value: '5', label: '5 - Excellent' },
                  { value: '4', label: '4 - Very Good' },
                  { value: '3', label: '3 - Good' },
                  { value: '2', label: '2 - Needs Improvement' },
                  { value: '1', label: '1 - Poor' }
                ]}
                value={formData.rating}
                onChange={(val) => setFormData({ ...formData, rating: val })}
                className="bg-white"
              />
              <textarea
                placeholder="Feedback Summary..."
                className="w-full p-2 border rounded-xl h-24"
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
              />
              <button
                onClick={() => {
                  onSubmit(formData);
                  onClose();
                  setFormData({ staffId: staffList.length > 0 ? staffList[0].id : '', rating: '5', summary: '' })
                }}
                className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700"
              >
                Display Review
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const PerformancePage = () => {
  const navigate = useNavigate();
  const [performanceList, setPerformanceList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffFilter, setStaffFilter] = useState('Staff: All');
  const [yearFilter, setYearFilter] = useState('Year: 2025');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [perfRes, staffRes] = await Promise.all([
        api.get('/crm/performance'),
        api.get('/crm/staff')
      ]);

      if (staffRes.data.success) {
        setStaffList(staffRes.data.data.staff.map(s => ({
          id: s._id,
          name: s.name
        })));
      }

      if (perfRes.data.success) {
        const formatted = perfRes.data.data.reviews.map(review => ({
          id: review._id,
          name: review.staff?.name || 'Unknown Staff',
          role: review.staff?.role || '-',
          rating: review.rating,
          date: new Date(review.reviewDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          summary: review.feedback,
          reviewer: review.reviewedBy || 'Admin'
        }));
        setPerformanceList(formatted);
      }

    } catch (error) {
      console.error("Error fetching performance reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (data) => {
    try {
      const payload = {
        staff: data.staffId,
        rating: parseInt(data.rating),
        feedback: data.summary,
        reviewedBy: 'Admin',
        reviewDate: new Date()
      };
      const response = await api.post('/crm/performance', payload);
      if (response.data.success) {
        fetchData();
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const filteredPerformance = performanceList.filter(item => {
    if (staffFilter === 'Staff: All') return true;
    return true; // Simplified filter to match simplified mock logic or extend if real filters needed
  });

  return (
    <div className="space-y-6">
      <AddReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddReview} staffList={staffList} />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span>
            <span>/</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/staff/directory')}>Staff</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">Performance</span>
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
          <ThemedDropdown
            options={['Staff: All', 'Sales', 'Drivers']}
            value={staffFilter}
            onChange={(val) => setStaffFilter(val)}
            className="bg-white text-sm"
            width="w-40"
          />
          <ThemedDropdown
            options={['Year: 2025', '2024']}
            value={yearFilter}
            onChange={(val) => setYearFilter(val)}
            className="bg-white text-sm"
            width="w-40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-50/30 border-b border-purple-100 text-xs uppercase tracking-wider text-purple-800 font-bold">
                <th className="p-4">Staff Member</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review Date</th>
                <th className="p-4">Feedback Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredPerformance.map((item) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
// Mock Data for Tasks
// Mock Data for Tasks - Removed for Backend Integration
// const MOCK_TASKS_DATA = [...];

const AddTaskModal = ({ isOpen, onClose, onSubmit, staffList = [] }) => {
  const [formData, setFormData] = useState({ title: '', assignedTo: '', priority: 'Medium' });

  // Reset or set default staff when modal opens
  useEffect(() => {
    if (isOpen && staffList.length > 0 && !formData.assignedTo) {
      setFormData(prev => ({ ...prev, assignedTo: staffList[0].id }));
    }
  }, [isOpen, staffList]);

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
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              <ThemedDropdown
                options={staffList.map(staff => ({ value: staff.id, label: `${staff.name} (${staff.role})` }))}
                value={formData.assignedTo}
                onChange={(val) => setFormData({ ...formData, assignedTo: val })}
                placeholder="Select Staff"
                className="bg-white"
              />
              <ThemedDropdown
                options={['Low', 'Medium', 'High', 'Critical']}
                value={formData.priority}
                onChange={(val) => setFormData({ ...formData, priority: val })}
                className="bg-white"
              />
              <button
                onClick={() => {
                  onSubmit(formData);
                  onClose();
                  setFormData({ title: '', assignedTo: staffList.length > 0 ? staffList[0].id : '', priority: 'Medium' });
                }}
                className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700"
              >
                Assign Task
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const StaffTasksPage = () => {
  const navigate = useNavigate();
  const [tasksList, setTasksList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, staffRes] = await Promise.all([
        api.get('/crm/staff-tasks'),
        api.get('/crm/staff')
      ]);

      if (staffRes.data.success) {
        setStaffList(staffRes.data.data.staff.map(s => ({
          id: s._id,
          name: s.name,
          role: s.role
        })));
      }

      if (tasksRes.data.success) {
        const formatted = tasksRes.data.data.tasks.map(task => ({
          id: task._id,
          title: task.title,
          assignedTo: task.assignedTo ? `${task.assignedTo.name} (${task.assignedTo.role})` : 'Unassigned',
          dueDate: new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          priority: task.priority,
          status: task.status
        }));
        setTasksList(formatted);
      }

    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (data) => {
    try {
      // Set due date to tomorrow same time by default since no date picker in UI
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);
      dueDate.setHours(17, 0, 0, 0); // Default to 5 PM tomorrow

      const payload = {
        title: data.title,
        assignedTo: data.assignedTo,
        priority: data.priority,
        dueDate: dueDate,
        status: 'Pending'
      };
      const response = await api.post('/crm/staff-tasks', payload);
      if (response.data.success) {
        fetchData();
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleMarkDone = async (id) => {
    try {
      const response = await api.put(`/crm/staff-tasks/${id}`, { status: 'Done' });
      if (response.data.success) {
        fetchData();
      }
    } catch (error) {
      console.error("Error marking task done:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'High': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'Medium': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const [assignedToFilter, setAssignedToFilter] = useState('Assigned To: All');
  const [statusFilter, setStatusFilter] = useState('Status: Pending');

  const getFilteredTasks = () => {
    let data = [...tasksList];

    // Filter by Assigned To
    if (assignedToFilter !== 'Assigned To: All') {
      if (assignedToFilter === 'Sales') {
        data = data.filter(item => item.assignedTo.includes('Sales'));
      } else if (assignedToFilter === 'Garage') {
        data = data.filter(item => item.assignedTo.includes('Mechanic')); // Assuming Garage = Mechanic
      }
    }

    // Filter by Status
    if (statusFilter !== 'All') {
      const status = statusFilter === 'Status: Pending' ? 'Pending' : 'Done';
      data = data.filter(item => item.status === status);
    }

    return data;
  };

  const filteredTasksList = getFilteredTasks();

  return (
    <div className="space-y-6">
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddTask} staffList={staffList} />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span>
            <span>/</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/staff/directory')}>Staff</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">Tasks</span>
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
          <ThemedDropdown
            options={['Assigned To: All', 'Sales', 'Garage']}
            value={assignedToFilter}
            onChange={(val) => setAssignedToFilter(val)}
            className="bg-white text-sm"
            width="w-44"
          />
          <ThemedDropdown
            options={['Status: Pending', 'Completed', 'All']}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            className="bg-white text-sm"
            width="w-40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
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
              {filteredTasksList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">ID: {item.id.substring(item.id.length - 6).toUpperCase()}</div>
                  </td>
                  <td className="p-4 font-medium text-gray-700">
                    {item.assignedTo}
                  </td>
                  <td className="p-4">
                    <span className={`font-semibold ${item.dueDate.includes('Overdue') ? 'text-red-600' : 'text-gray-700'}`}>
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
        )}

        {!loading && filteredTasksList.length === 0 && (
          <div className="p-10 text-center text-gray-500">No tasks found.</div>
        )}
      </div>
    </div>
  );
};

