import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import razorpayService from '../../../services/razorpay.service';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../services/api';
import { requestForToken } from '../../../services/firebase';
import {
  MdFolderOpen,
  MdSearch,
  MdAdd,
  MdFilterList,
  MdPhone,
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
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
      </motion.div>
    </div>
  );
};

/**
 * AddStaffModal - Modal for adding new staff members
 */
const AddStaffModal = ({ isOpen, onClose, onSubmit, editingStaff }) => {
  const [step, setStep] = useState(1);
  const modalScrollRef = useRef(null);
  const [salaryMethod, setSalaryMethod] = useState('Monthly');
  const [aadharFile, setAadharFile] = useState(null);
  const [aadharPreview, setAadharPreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const formatLocalDate = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    status: 'Active',
    phone: '',
    email: '',
    password: '',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full Time',
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
      setShowPassword(false);
      if (editingStaff) {
        setFormData({
          name: editingStaff.name || '',
          role: editingStaff.role || '',
          status: editingStaff.status || 'Active',
          phone: editingStaff.phone ? editingStaff.phone.replace(/^\+91\s*/, '') : '',
          email: editingStaff.email || '',
          password: editingStaff.plainTextPassword || '********',
          joiningDate: formatLocalDate(editingStaff.joiningDate || editingStaff.joinDate) || formatLocalDate(new Date()),
          employmentType: editingStaff.employmentType || 'Full Time',
          salary: editingStaff.salary || '',
          workingDays: editingStaff.workingDays || '26',
          absentDeduction: editingStaff.absentDeduction || '',
          halfDayDeduction: editingStaff.halfDayDeduction || '',
          overtimeRate: editingStaff.overtimeRate || ''
        });
        setStep(1);
        setSalaryMethod(editingStaff.salaryMethod || 'Monthly');
        setAadharFile(null);
        setAadharPreview(editingStaff.aadharCard || '');
        setErrors({});
      } else {
        setFormData({
          name: '',
          role: '',
          status: 'Active',
          phone: '',
          email: '',
          password: '',
          joiningDate: formatLocalDate(new Date()),
          employmentType: 'Full Time',
          salary: '',
          workingDays: '26',
          absentDeduction: '',
          halfDayDeduction: '',
          overtimeRate: ''
        });
        setStep(1);
        setSalaryMethod('Monthly');
        setAadharFile(null);
        setAadharPreview('');
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
      salaryMethod,
      aadharFile
    };
    onSubmit(submitData);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
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
              Step {step} of 3: {step === 1 ? 'Basic Details' : step === 2 ? 'Salary Configuration' : 'Final Review'}
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
        <div ref={modalScrollRef} className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Employment</label>
                <ThemedDropdown
                  options={['Full Time', 'Part Time', 'Contract', 'Intern']}
                  value={formData.employmentType}
                  onChange={(val) => setFormData({ ...formData, employmentType: val })}
                  placeholder="Select..."
                  onOpen={() => {
                    if (modalScrollRef.current) {
                      modalScrollRef.current.scrollBy({ top: 150, behavior: 'smooth' });
                    }
                  }}
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    className={`w-full pl-4 pr-10 py-3 bg-white border ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500/20'} rounded-xl focus:ring-2 focus:border-indigo-500 outline-none transition-all text-gray-800`}
                    placeholder={editingStaff ? "Leave blank to keep current" : "Set login password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                </div>
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Aadhar Card Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="aadhar-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setAadharFile(file);
                        setAadharPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <label
                    htmlFor="aadhar-upload"
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 cursor-pointer transition-all text-sm font-medium text-gray-700"
                  >
                    <span className="truncate max-w-[150px]">
                      {aadharFile ? aadharFile.name : "Upload Aadhar..."}
                    </span>
                    <span className="text-indigo-600 font-bold hover:underline shrink-0">Browse</span>
                  </label>
                </div>
                {aadharPreview && (
                  <div className="mt-2 relative w-20 h-12 rounded-lg border overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img src={aadharPreview} alt="Aadhar Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
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
    </div>,
    document.body
  );
};

const ViewStaffModal = ({ isOpen, onClose, staff }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !staff) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
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
            {staff.aadharCard && (
              <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#212c40]/10 flex items-center justify-center text-[#212c40]">
                  <MdVisibility size={18} />
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400 font-bold">Aadhar Card</p>
                    <p className="font-medium text-xs text-indigo-600">Document Uploaded</p>
                  </div>
                  <a
                    href={staff.aadharCard}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:underline bg-indigo-50 px-2.5 py-1 rounded-lg"
                  >
                    View Card
                  </a>
                </div>
              </div>
            )}
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
    </div>,
    document.body
  );
};

export const StaffDirectoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialSearch = urlParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
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
          joinDate: new Date(staff.joiningDate || staff.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
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
      // Fetch FCM Token before creating staff (using Admin's current browser token as initial)
      let fcmToken = null;
      try {
        fcmToken = await requestForToken();
        console.log("FCM Token captured during Staff Creation:", fcmToken);
      } catch (err) {
        console.warn("Could not capture FCM token for new staff:", err);
      }

      const payload = {
        ...newStaff,
        fcmToken: fcmToken,
        platform: 'web'
      };

      // Construct FormData if there is a file to upload
      let requestData = payload;
      let config = {};

      if (newStaff.aadharFile) {
        const formDataObj = new FormData();
        // Append all text fields
        Object.keys(payload).forEach(key => {
          if (key !== 'aadharFile') {
            formDataObj.append(key, payload[key]);
          }
        });
        // Append file
        formDataObj.append('aadharCard', newStaff.aadharFile);
        requestData = formDataObj;
        config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
      }

      if (editingStaff) {
        const response = await api.put(`/crm/staff/${editingStaff.id}`, requestData, config);
        if (response.data.success) {
          fetchStaff();
          setEditingStaff(null);
          toast.success('Staff updated successfully');
        }
      } else {
        const response = await api.post('/crm/staff', requestData, config);
        if (response.data.success) {
          fetchStaff();
          toast.success('Staff created successfully');
        }
      }
    } catch (error) {
      console.error("Error saving staff:", error);
      toast.error(error.response?.data?.message || 'Failed to save staff');
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
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/enquiries/all')}>Home</span>
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
                <th className="p-4">Role</th>
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

// Premium Permission Groups Config
const PERMISSION_GROUPS = {
  attendance: {
    title: 'Attendance',
    permissions: [
      { key: 'attendance.manage', label: 'View & Mark Attendance' }
    ]
  },
  enquiries: {
    title: 'Enquiries',
    permissions: [
      { key: 'enquiries.view', label: 'View Enquiries' }
    ]
  },
  bookings: {
    title: 'Bookings',
    permissions: [
      { key: 'bookings.view', label: 'View Assigned Bookings' }
    ]
  }
};

const AddRoleModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({ 
    role: '', 
    description: '', 
    access: 'Custom',
    permissions: [] 
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          role: initialData.role || '',
          description: initialData.description || '',
          access: initialData.access || 'Custom',
          permissions: initialData.permissions || []
        });
      } else {
        setFormData({ 
          role: '', 
          description: '', 
          access: 'Custom',
          permissions: [] 
        });
      }
    }
  }, [isOpen, initialData]);

  const handlePermissionToggle = (key) => {
    setFormData(prev => {
      const current = prev.permissions || [];
      const updated = current.includes(key)
        ? current.filter(k => k !== key)
        : [...current, key];
      return { ...prev, permissions: updated };
    });
  };

  const handleSectionToggle = (sectionPermissions) => {
    setFormData(prev => {
      const current = prev.permissions || [];
      const groupKeys = sectionPermissions.map(p => p.key);
      const allSelected = groupKeys.every(k => current.includes(k));
      
      let updated;
      if (allSelected) {
        // Deselect all in this section
        updated = current.filter(k => !groupKeys.includes(k));
      } else {
        // Select all in this section (prevent duplicates)
        updated = Array.from(new Set([...current, ...groupKeys]));
      }
      return { ...prev, permissions: updated };
    });
  };

  const handleGlobalToggle = () => {
    setFormData(prev => {
      const current = prev.permissions || [];
      const allKeys = Object.values(PERMISSION_GROUPS).flatMap(g => g.permissions.map(p => p.key));
      const allSelected = allKeys.every(k => current.includes(k));
      
      return {
        ...prev,
        permissions: allSelected ? [] : allKeys
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const allPermissionsList = Object.values(PERMISSION_GROUPS).flatMap(g => g.permissions.map(p => p.key));
  const isAllGlobalSelected = allPermissionsList.every(k => (formData.permissions || []).includes(k));

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">{initialData ? 'Edit Role & Permissions' : 'Add New Role'}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Configure access privileges and platform powers for this role.</p>
                </div>
                <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MdClose size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {/* Row 1: Role Name & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 ml-1">Role Name *</label>
                    <input 
                      required 
                      placeholder="e.g. Telecaller, Driver, HR" 
                      className="w-full mt-1.5 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-[#1C205C] bg-gray-50/50 font-semibold text-gray-800 transition-all" 
                      value={formData.role} 
                      onChange={e => setFormData({ ...formData, role: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 ml-1">Short Description</label>
                    <input 
                      placeholder="Describe role responsibilities..." 
                      className="w-full mt-1.5 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-[#1C205C] bg-gray-50/50 font-semibold text-gray-800 transition-all" 
                      value={formData.description} 
                      onChange={e => setFormData({ ...formData, description: e.target.value })} 
                    />
                  </div>
                </div>

                {/* Permissions Checklist Area */}
                <div className="border-t border-gray-100 pt-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900">Module-wise Access Permissions</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Toggle checkboxes to enable or disable operations for this role.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleGlobalToggle}
                      className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 active:scale-95 transition-all shrink-0 w-fit"
                    >
                      {isAllGlobalSelected ? 'Deselect All' : 'Select All Permissions'}
                    </button>
                  </div>

                  {/* Grid of Permission Groups */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => {
                      const groupKeys = group.permissions.map(p => p.key);
                      const allSelected = groupKeys.every(k => (formData.permissions || []).includes(k));
                      
                      return (
                        <div key={groupKey} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col">
                          {/* Section Header */}
                          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-50">
                            <h5 className="text-xs font-black text-[#1C205C] tracking-wide uppercase">{group.title}</h5>
                            <button
                              type="button"
                              onClick={() => handleSectionToggle(group.permissions)}
                              className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
                            >
                              {allSelected ? 'None' : 'All'}
                            </button>
                          </div>

                          {/* List of Checkboxes */}
                          <div className="space-y-2 flex-1">
                            {group.permissions.map(p => {
                              const isChecked = (formData.permissions || []).includes(p.key);
                              return (
                                <label
                                  key={p.key}
                                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none
                                    ${isChecked 
                                      ? 'bg-indigo-50/40 border-indigo-100 text-indigo-900 shadow-sm shadow-indigo-50' 
                                      : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50/50 hover:border-gray-200'}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handlePermissionToggle(p.key)}
                                    className="rounded text-[#1C205C] focus:ring-indigo-500 border-gray-300 w-4 h-4"
                                  />
                                  <span className="text-xs font-bold">{p.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons (Sticky Footer) */}
              <div className="border-t border-gray-100 p-6 flex items-center justify-end gap-3 bg-gray-50/50 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1C205C] hover:bg-[#2a3550] text-white font-extrabold rounded-xl text-sm transition-all shadow-lg active:scale-95"
                  style={{ backgroundColor: premiumColors.primary.DEFAULT }}
                >
                  {initialData ? 'Update Role' : 'Save Role'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const RoleDetails = ({ role, staffList = [], onBack }) => {
  const navigate = useNavigate();

  // Find assigned staff - exact match (case-insensitive)
  const assignedStaff = staffList.filter(s =>
    s.role && role.role && s.role.toLowerCase() === role.role.toLowerCase()
  ).map(s => ({ ...s, id: s._id || s.id }));

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
            <span>Roles</span> <span>/</span> <span className="text-[#1C205C] font-semibold">Details</span>
          </div>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start justify-between">
          <div>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold tracking-wide uppercase mb-3 inline-block">
              {role.access || 'Custom'} Access
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{role.role}</h2>
            <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">{role.description || 'No description provided.'}</p>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 shrink-0">
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => {
              const groupPermissions = group.permissions;
              const activeCount = groupPermissions.filter(p => (role.permissions || []).includes(p.key)).length;
              
              return (
                <div key={groupKey} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
                    <h4 className="text-xs font-black text-gray-900 tracking-wide uppercase">{group.title}</h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                      {activeCount} / {groupPermissions.length} Active
                    </span>
                  </div>
                  <div className="space-y-2">
                    {groupPermissions.map(p => {
                      const isEnabled = (role.permissions || []).includes(p.key);
                      return (
                        <div key={p.key} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-50/50 hover:bg-gray-50/50 transition-colors">
                          <span className={`text-xs font-semibold ${isEnabled ? 'text-gray-800' : 'text-gray-400 line-through'}`}>{p.label}</span>
                          {isEnabled ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              <MdCheck size={12} /> Enabled
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                              <MdClose size={12} /> Disabled
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                          {staff.name ? staff.name.charAt(0) : 'S'}
                        </div>
                        {staff.name}
                      </td>
                      <td className="p-4 text-gray-500 font-medium text-sm">{staff.employeeId || `STF-${staff.id?.slice(-6) || '000'}`}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${staff.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => navigate(`/crm/staff/directory?search=${encodeURIComponent(staff.name)}`)} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold">View Profile</button>
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
          // Calculate count - exact match
          const count = staffData.filter(s =>
            s.role && s.role.toLowerCase() === role.roleName.toLowerCase()
          ).length;

          return {
            ...role,
            id: role._id,
            role: role.roleName,
            department: role.department,
            access: role.accessLevel,
            count: count,
            permissions: role.permissions || []
          };
        });
        setRolesList(roles);
        
        // Update selectedRole in details if currently open to ensure live changes refresh
        if (selectedRole) {
          const updated = roles.find(r => r.id === selectedRole.id);
          if (updated) setSelectedRole(updated);
        }
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
        accessLevel: data.access || 'Custom',
        category: 'Operations', // Default category
        permissions: data.permissions || []
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
            <span className="hover:text-[#212c40] cursor-pointer transition-colors" onClick={() => navigate('/crm/enquiries/all')}>Home</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fadeIn">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C205C]"></div>
          </div>
        ) : (
          rolesList.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer relative group hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#1C205C]/10 text-[#1C205C] rounded-xl">
                  <MdSecurity size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleEdit(e, role)}
                    className="p-1.5 text-gray-400 hover:text-[#1C205C] hover:bg-[#1C205C]/10 rounded-lg"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button onClick={(e) => handleDelete(e, role.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <MdDelete size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">{role.role}</h3>
              <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">{role.description || 'No description provided.'}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {role.permissions?.length || 0} Powers
                </div>
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
    </AnimatePresence>,
    document.body
  );
};

const ViewLocationModal = ({ isOpen, onClose, data }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
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
    </div>,
    document.body
  );
};

const StaffMonthlyAttendanceModal = ({ isOpen, onClose, staff }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingDay, setUpdatingDay] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [customTime, setCustomTime] = useState('');

  const formatTime12h = (t24) => {
    if (!t24) return undefined;
    const [h, m] = t24.split(':');
    const d = new Date();
    d.setHours(parseInt(h));
    d.setMinutes(parseInt(m));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const parseTime12hTo24h = (t12) => {
    if (!t12 || t12 === '-') return '';
    const [time, modifier] = t12.split(' ');
    if (!modifier) return t12; // already HH:MM
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours) + 12).padStart(2, '0');
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const handleOptionClick = (value) => {
    if (value === 'Present' || value === 'Late') {
      setSelectedStatus(value);
      const existingIn = updatingDay.inTime && updatingDay.inTime !== '-' ? parseTime12hTo24h(updatingDay.inTime) : '';
      setCustomTime(existingIn || (value === 'Present' ? '09:00' : '10:00'));
    } else if (value === 'Half Day') {
      setSelectedStatus(value);
      const existingOut = updatingDay.outTime && updatingDay.outTime !== '-' ? parseTime12hTo24h(updatingDay.outTime) : '';
      setCustomTime(existingOut || '13:30');
    } else {
      handleUpdateStatus(value);
    }
  };

  const handleUpdateStatus = async (statusValue, timeString = null) => {
    if (!updatingDay || !staff?.id) return;
    
    try {
      let formattedTimeStr = undefined;
      if (timeString) {
        formattedTimeStr = formatTime12h(timeString);
      }

      const payload = {
        staffId: staff.id,
        date: new Date(selectedYear, selectedMonth, updatingDay.day, 12, 0, 0).toISOString(),
        status: statusValue,
        ...((statusValue === 'Present' || statusValue === 'Late') && formattedTimeStr && { inTime: formattedTimeStr }),
        ...(statusValue === 'Half Day' && formattedTimeStr && { outTime: formattedTimeStr })
      };
      
      const res = await api.post('/crm/attendance', payload);
      if (res.data.success) {
        toast.success(`Attendance updated to ${statusValue}`);
        fetchPayroll(); // Refresh stats cards and calendar grid immediately!
      }
    } catch (error) {
      console.error("Error updating day attendance:", error);
      toast.error("Failed to update attendance");
    } finally {
      setUpdatingDay(null);
      setSelectedStatus(null);
      setCustomTime('');
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && staff) {
      const now = new Date();
      let initMonth = now.getMonth();
      let initYear = now.getFullYear();
      
      const joinDate = staff.joiningDate ? new Date(staff.joiningDate) : null;
      if (joinDate) {
        const joinYear = joinDate.getFullYear();
        const joinMonth = joinDate.getMonth();
        
        if (initYear < joinYear || (initYear === joinYear && initMonth < joinMonth)) {
          setSelectedYear(joinYear);
          setSelectedMonth(joinMonth);
        } else {
          setSelectedYear(initYear);
          setSelectedMonth(initMonth);
        }
      } else {
        setSelectedYear(initYear);
        setSelectedMonth(initMonth);
      }
    }
  }, [isOpen, staff?.id]);

  useEffect(() => {
    if (isOpen && staff?.id) {
      fetchPayroll();
    }
  }, [selectedMonth, selectedYear, staff?.id, isOpen]);

  const fetchPayroll = async () => {
    if (!staff?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/crm/staff/${staff.id}/payroll`, {
        params: { month: selectedMonth, year: selectedYear }
      });
      if (res.data.success) {
        setPayroll(res.data.data);
      }
    } catch (error) {
      console.error("Payroll fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSalary = async () => {
    if (!payroll || payroll.netPayable <= 0) {
      toast.error('Invalid salary amount');
      return;
    }

    try {
      await razorpayService.processSalaryPayment({
        staffId: staff.id,
        amount: payroll.netPayable,
        baseSalary: payroll.baseSalary,
        deductions: (payroll.absentDeduction || 0) + (payroll.halfDayDeduction || 0),
        month: selectedMonth,
        year: selectedYear,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        onSuccess: (response) => {
          toast.success('Salary processed successfully!');
          fetchPayroll(); // Refresh data
          // Close modal after short delay to show success state
          setTimeout(() => {
            onClose();
            // Optional: Redirect to directory if needed
            // navigate('/crm/staff/directory');
          }, 1500);
        },
        onError: (error) => {
          console.error('Payment Error:', error);
          toast.error('Payment Failed: ' + (error.message || 'Unknown error'));
        }
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment');
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar Grid Data - Enhanced with Weekday Alignment
  const daysInMonth = payroll?.daysInMonth || new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 = Sun

  const calendarGrid = [];
  // Add empty slots for correct weekday alignment
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.push({ day: null, isWeekend: false, isEmpty: true });
  }
  // Add actual days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(selectedYear, selectedMonth, i);
    const log = payroll?.dailyLogs?.find(l => l.day === i);
    calendarGrid.push({
      day: i,
      isWeekend: date.getDay() === 0, // Sunday
      isEmpty: false,
      status: log?.status || (date.getDay() === 0 ? 'Weekend' : 'Pending'),
      inTime: log?.inTime || '-',
      outTime: log?.outTime || '-',
      workHours: log?.workHours || '-'
    });
  }

  if (!isOpen || !staff) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-3xl shadow-2xl bg-white overflow-hidden flex flex-col max-h-[90vh] relative"
      >
        {/* Header */}
        <div className="bg-white px-8 py-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Monthly Attendance</h2>
            <p className="text-gray-500 text-sm">Detailed view for <span className="font-bold text-[#1C205C]">{staff.name}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1C205C]/20"
            >
              {months.map((m, i) => {
                const joinDate = staff?.joiningDate ? new Date(staff.joiningDate) : null;
                const joinYear = joinDate ? joinDate.getFullYear() : null;
                const joinMonth = joinDate ? joinDate.getMonth() : null;
                const disabled = joinYear && selectedYear === joinYear ? i < joinMonth : false;
                return (
                  <option key={i} value={i} disabled={disabled}>
                    {m}
                  </option>
                );
              })}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => {
                const year = parseInt(e.target.value);
                setSelectedYear(year);
                const joinDate = staff?.joiningDate ? new Date(staff.joiningDate) : null;
                const joinYear = joinDate ? joinDate.getFullYear() : null;
                const joinMonth = joinDate ? joinDate.getMonth() : null;
                if (joinYear && joinMonth !== null && year === joinYear && selectedMonth < joinMonth) {
                  setSelectedMonth(joinMonth);
                }
              }}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1C205C]/20"
            >
              {[2024, 2025, 2026].map(yr => {
                const joinDate = staff?.joiningDate ? new Date(staff.joiningDate) : null;
                const joinYear = joinDate ? joinDate.getFullYear() : null;
                const disabled = joinYear ? yr < joinYear : false;
                return (
                  <option key={yr} value={yr} disabled={disabled}>
                    {yr}
                  </option>
                );
              })}
            </select>
            <button
              onClick={onClose}
              className="p-2 ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MdClose size={24} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>

        {loading || !payroll ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="p-8 overflow-y-auto custom-scrollbar">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Total Days</p>
                <h3 className="text-2xl font-bold text-blue-900">{payroll.daysInMonth}</h3>
                <p className="text-xs text-blue-600 font-medium">Month Duration</p>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">Present</p>
                <h3 className="text-2xl font-bold text-green-900">{payroll.presentDays} <span className="text-sm font-medium text-green-600">Days</span></h3>
                <p className="text-xs text-green-600 font-medium">+ {payroll.halfDays} Half Days</p>
              </div>
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Absent</p>
                <h3 className="text-2xl font-bold text-red-900">{payroll.absentDays} <span className="text-sm font-medium text-red-600">Days</span></h3>
                <p className="text-xs text-red-600 font-medium">Unpaid</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Leave</p>
                <h3 className="text-2xl font-bold text-indigo-900">{payroll.leaveDays || 0} <span className="text-sm font-medium text-indigo-600">Days</span></h3>
                <p className="text-xs text-indigo-600 font-medium">Approved Leave</p>
              </div>
            </div>

            <div className="flex justify-center">
              {/* Calendar Grid (Simplified View) */}
              <div className="w-full max-w-md">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm"><MdDateRange /> Daily Log (Overview)</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
                  <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-[10px] font-bold text-gray-400 uppercase">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {calendarGrid.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (!item.isEmpty && item.status !== 'Not Joined') {
                            setUpdatingDay(item);
                          }
                        }}
                        className={`
                            aspect-square rounded-lg flex flex-col items-center justify-center border text-xs font-bold relative group transition-all
                            ${item.isEmpty ? 'bg-transparent border-transparent cursor-default' :
                            item.status === 'Present' || item.status === 'Late' ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm hover:scale-105 cursor-pointer' :
                            item.status === 'Half Day' ? 'bg-amber-500 border-amber-500 text-white shadow-sm hover:scale-105 cursor-pointer' :
                            item.status === 'Absent' ? 'bg-rose-50 border-rose-100 text-rose-500 hover:scale-105 cursor-pointer' :
                            item.status === 'Leave' ? 'bg-indigo-500 border-indigo-500 text-white shadow-sm hover:scale-105 cursor-pointer' :
                            item.status === 'Not Joined' ? 'bg-gray-100 border-gray-200 text-gray-400 hover:scale-105 cursor-default' :
                            item.isWeekend ? 'bg-red-50 border-red-100 text-red-500 hover:scale-105 cursor-pointer' :
                            'bg-white border-gray-100 text-gray-600 hover:scale-105 cursor-pointer'}
                          `}
                      >
                        {!item.isEmpty && (
                          <>
                            <span>{item.day}</span>
                            {/* Premium Interactive Hover Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-44 bg-[#212c40] text-white text-[10px] rounded-xl p-2.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-20 shadow-xl border border-gray-700">
                              <div className="font-bold border-b border-gray-700 pb-1 mb-1 text-center">
                                {months[selectedMonth]} {item.day}, {selectedYear}
                              </div>
                              <div className="space-y-1 text-left">
                                <p className="flex justify-between">
                                  <span className="text-gray-400">Status:</span>
                                  <span className={`font-extrabold ${
                                    item.status === 'Present' || item.status === 'Late' ? 'text-emerald-400' :
                                    item.status === 'Half Day' ? 'text-amber-400' :
                                    item.status === 'Absent' ? 'text-rose-400' :
                                    item.status === 'Leave' ? 'text-blue-400' :
                                    item.status === 'Not Joined' ? 'text-gray-400' :
                                    item.isWeekend ? 'text-red-400' : 'text-gray-400'
                                  }`}>{item.status === 'Late' ? 'Present (Late)' : item.status}</span>
                                </p>
                                {(item.status === 'Present' || item.status === 'Late' || item.status === 'Half Day') && (
                                  <>
                                    <p className="flex justify-between"><span className="text-gray-400">In Time:</span> <span className="font-medium text-gray-200">{item.inTime}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-400">Out Time:</span> <span className="font-medium text-gray-200">{item.outTime}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-400">Duration:</span> <span className="font-medium text-gray-200">{item.workHours}</span></p>
                                  </>
                                )}
                              </div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#212c40]"></div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center italic">Detailed daily status is available in the list view.</p>
                </div>
              </div>


            </div>
          </div>
        )}

        {/* Day Status Update Overlay Popover */}
        {updatingDay && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 transition-all">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 flex flex-col"
            >
              {!selectedStatus ? (
                <>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Update Attendance</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">
                        For {months[selectedMonth]} {updatingDay.day}, {selectedYear}
                      </p>
                    </div>
                    <button 
                      onClick={() => setUpdatingDay(null)}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MdClose size={20} className="text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { value: 'Present', label: 'Present', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100', activeClass: 'bg-emerald-500 text-white border-emerald-500' },
                      { value: 'Late', label: 'Present (Late)', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100', activeClass: 'bg-amber-500 text-white border-amber-500' },
                      { value: 'Absent', label: 'Absent', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100', activeClass: 'bg-rose-500 text-white border-rose-500' },
                      { value: 'Half Day', label: 'Half Day', color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100', activeClass: 'bg-orange-500 text-white border-orange-500' },
                      { value: 'Leave', label: 'Leave', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100', activeClass: 'bg-indigo-500 text-white border-indigo-500', spanFull: true },
                    ].map((option) => {
                      const isSelected = updatingDay.status === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleOptionClick(option.value)}
                          className={`
                            py-3 px-4 rounded-2xl font-bold border text-sm transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02]
                            ${option.spanFull ? 'col-span-2' : ''}
                            ${isSelected ? option.activeClass : option.color}
                          `}
                        >
                          <span className="text-sm font-extrabold">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setUpdatingDay(null)}
                      className="flex-1 py-3 border border-gray-200 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {selectedStatus === 'Half Day' ? 'Enter Out-Time' : 'Enter In-Time'}
                      </h3>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">
                        Setting status to <span className="font-extrabold text-[#1C205C]">{selectedStatus === 'Late' ? 'Present (Late)' : selectedStatus}</span> for {months[selectedMonth]} {updatingDay.day}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedStatus(null);
                        setCustomTime('');
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MdArrowBack size={20} className="text-gray-400" />
                    </button>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 flex flex-col items-center gap-4">
                    <MdAccessTime size={36} className="text-indigo-500" />
                    <div className="w-full">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 text-center">
                        Select Time (HH:MM)
                      </label>
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-center text-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedStatus(null);
                        setCustomTime('');
                      }}
                      className="flex-1 py-3 border border-gray-200 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedStatus, customTime)}
                      className="flex-1 py-3 bg-[#1C205C] text-white rounded-2xl text-xs font-bold hover:bg-[#2a3550] shadow-sm transition-all"
                    >
                      Save Status
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchDataWithRange = async (fromDate, toDate) => {
    setLoading(true);
    try {
      const [staffRes, attRes] = await Promise.all([
        api.get('/crm/staff'),
        api.get(`/crm/attendance?dateFrom=${fromDate}&dateTo=${toDate}`)
      ]);

      let staffData = [];
      if (staffRes.data.success) {
        staffData = staffRes.data.data.staff.map(s => ({
          id: s._id,
          name: s.name,
          role: s.role,
          department: s.department,
          email: s.email,
          phone: s.phone,
          location: s.location,
          joiningDate: s.joiningDate || s.joinDate || s.createdAt
        }));
        setStaffInfoList(staffData);
      }

      let records = [];
      if (attRes.data.success && attRes.data.data?.records) {
        records = attRes.data.data.records;
      }

      const mergedData = staffData.map((staff) => {
        const staffRecords = records.filter(r => (r.staff?._id || r.staff) === staff.id);
        const latestRecord = staffRecords.length > 0 ? staffRecords[0] : null;

        let liveLoc = { status: 'Offline', address: 'Location Unavailable', lat: 0, lng: 0 };
        if (staff.location && staff.location.latitude) {
          const lastUpdate = new Date(staff.location.lastLocationUpdate);
          const now = new Date();
          const diffMins = (now - lastUpdate) / (1000 * 60);
          const isOnline = diffMins < 15;
          liveLoc = {
            status: isOnline ? 'Online' : 'Offline',
            address: staff.location.address || 'Address Unavailable',
            lat: staff.location.latitude,
            lng: staff.location.longitude,
            lastUpdate: lastUpdate
          };
        }
        if (liveLoc.status === 'Offline' && staff.location?.address) {
          liveLoc.address = `Last seen: ${staff.location.address}`;
        }

        // For date range, count present days
        const presentDays = staffRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
        const status = latestRecord?.status || (presentDays > 0 ? 'Present' : 'Absent');

        return {
          id: staff.id,
          staffId: staff.id,
          name: staff.name,
          role: staff.role,
          inTime: latestRecord?.inTime || '-',
          outTime: latestRecord?.outTime || '-',
          status: status,
          workHours: latestRecord?.workHours || (presentDays > 0 ? `${presentDays} day(s)` : '-'),
          recordId: latestRecord?._id,
          location: liveLoc,
          joiningDate: staff.joiningDate
        };
      });
      setAttendanceList(mergedData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (targetDate = null) => {
    setLoading(true);
    try {
      const dateParam = targetDate || new Date().toISOString();
      const [staffRes, attRes] = await Promise.all([
        api.get('/crm/staff'),
        api.get('/crm/attendance?date=' + dateParam)
      ]);


      let staffData = [];
      if (staffRes.data.success) {
        staffData = staffRes.data.data.staff.map(s => ({
          id: s._id,
          name: s.name,
          role: s.role,
          department: s.department,
          email: s.email,
          phone: s.phone,
          location: s.location,
          joiningDate: s.joiningDate || s.joinDate || s.createdAt
        }));
        setStaffInfoList(staffData);
      }

      // Get attendance records (may be empty or fail)
      let records = [];
      if (attRes.data.success && attRes.data.data?.records) {
        records = attRes.data.data.records;
      }

      // Always merge staff with attendance (even if no attendance records)
      const mergedData = staffData.map((staff, index) => {
        const record = records.find(r => (r.staff?._id || r.staff) === staff.id);

        // Live Location Data
        let liveLoc = { status: 'Offline', address: 'Location Unavailable', lat: 0, lng: 0 };

        if (staff.location && staff.location.latitude) {
          const lastUpdate = new Date(staff.location.lastLocationUpdate);
          const now = new Date();
          const diffMins = (now - lastUpdate) / (1000 * 60);
          // Consider "Online" if location was updated within the last 15 minutes
          const isOnline = diffMins < 15;

          liveLoc = {
            status: isOnline ? 'Online' : 'Offline',
            address: staff.location.address || 'Address Unavailable',
            lat: staff.location.latitude,
            lng: staff.location.longitude,
            lastUpdate: lastUpdate
          };
        }

        // Fallback for "Offline" but with known location (show as Offline with address)
        if (liveLoc.status === 'Offline' && staff.location?.address) {
          liveLoc.address = `Last seen: ${staff.location.address}`;
        }

        const mockLoc = liveLoc;

        // Determine attendance status:
        // 1. If attendance record exists in DB, use that status
        // 2. If they have clocked out, show 'Checked Out'
        // 3. If no record, show as 'No Status'
        let attendanceStatus = 'No Status';
        if (record?.status) {
          if (record.inTime && record.outTime && record.outTime !== '-') {
            attendanceStatus = 'Checked Out';
          } else {
            attendanceStatus = record.status;
          }
        }

        // Determine work hours display
        let displayWorkHours = '-';
        if (record?.workHours) {
          displayWorkHours = record.workHours;
        } else if (record?.inTime && !record?.outTime) {
          // Checked in but not checked out - show Running
          displayWorkHours = 'Running';
        }

        return {
          id: staff.id,
          staffId: staff.id,
          name: staff.name,
          role: staff.role,
          inTime: record?.inTime || (liveLoc.status === 'Online' && !record ? 'Active' : '-'),
          outTime: record?.outTime || '-',
          status: attendanceStatus,
          workHours: displayWorkHours,
          recordId: record?._id,
          location: mockLoc,
          joiningDate: staff.joiningDate
        };
      });
      setAttendanceList(mergedData);
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

    // 1. Filter by Role (case-insensitive exact match)
    if (roleFilter !== 'Staff: All') {
      const keyword = roleFilter.toLowerCase();
      data = data.filter(item => item.role.toLowerCase() === keyword);
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

      {/* Date Range Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setShowDatePicker(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Date Range</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
                <input
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
                <input
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (customDateFrom) {
                      const label = customDateTo
                        ? `${customDateFrom} to ${customDateTo}`
                        : customDateFrom;
                      setDateFilter(label);
                      // Fetch with date range
                      if (customDateTo) {
                        fetchDataWithRange(customDateFrom, customDateTo);
                      } else {
                        fetchData(new Date(customDateFrom).toISOString());
                      }
                    }
                    setShowDatePicker(false);
                  }}
                  className="flex-1 py-2 bg-[#1C205C] text-white rounded-xl text-sm font-bold hover:bg-[#2a3550]"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-[#212c40] cursor-pointer transition-colors" onClick={() => navigate('/crm/enquiries/all')}>Home</span>
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
            options={['Staff: All', ...([...new Set(attendanceList.map(item => item.role))].filter(Boolean))]}
            value={roleFilter}
            onChange={(val) => setRoleFilter(val)}
            className="bg-white text-sm"
            width="w-40"
          />
          <ThemedDropdown
            options={['Date: Today', 'Yesterday', 'Select Date']}
            value={dateFilter}
            onChange={(val) => {
              setDateFilter(val);
              if (val === 'Date: Today') {
                fetchData(new Date().toISOString());
              } else if (val === 'Yesterday') {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                fetchData(yesterday.toISOString());
              } else if (val === 'Select Date') {
                setShowDatePicker(true);
              }
            }}
            className="bg-white text-sm"
            width="w-40"
          />
        </div>
        <div className="text-sm text-gray-500 font-medium">
          Total Present: <span className="text-green-600 font-bold">{filteredAttendance.filter(i => ['Present', 'Late', 'Checked Out'].includes(i.status)).length}</span> / <span className="text-gray-800">{filteredAttendance.length}</span>
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
                      {item.status === 'Late' && <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold border border-amber-100">Present (Late)</span>}
                      {item.status === 'Half Day' && <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-bold border border-orange-100">Half Day</span>}
                      {item.status === 'Leave' && <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100">Leave</span>}
                      {item.status === 'Checked Out' && <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold border border-indigo-100">Checked Out</span>}
                      {item.status === 'No Status' && <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-bold border border-gray-200">No Status</span>}
                    </td>
                    <td className="p-4">
                      {item.location?.lat ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingLocation(item)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors
                              ${item.location.status === 'Online'
                                ? 'bg-[#212c40]/10 text-[#212c40] border-[#212c40]/20 hover:bg-[#212c40]/20 animate-pulse'
                                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                              }
                            `}
                          >
                            <MdLocationOn /> {item.location.status === 'Online' ? 'Live' : 'Last SEEN'}
                          </button>
                          {item.location.status === 'Offline' && <span className="text-[10px] text-gray-400 font-medium">Offline</span>}
                        </div>
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
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/enquiries/all')}>Home</span>
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



/**
 * @desc Attendance Settings Page Component
 */
export const AttendanceSettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State for attendance settings
  const [settings, setSettings] = useState({
    officeStartTime: '09:00 AM',
    officeEndTime: '06:00 PM',
    halfDayDeduction: 250,
    absentDeduction: 500,
    lateGracePeriod: 15,
  });

  // Convert 12h to 24h for time input value
  const convert12to24 = (time12h) => {
    if (!time12h) return "09:00";
    try {
      const parts = time12h.split(' ');
      if (parts.length !== 2) return "09:00";
      const [time, modifier] = parts;
      const [hours, minutes] = time.split(':');
      let hr = parseInt(hours, 10);
      if (modifier === 'PM' && hr < 12) {
        hr += 12;
      }
      if (modifier === 'AM' && hr === 12) {
        hr = 0;
      }
      return `${String(hr).padStart(2, '0')}:${minutes}`;
    } catch (e) {
      return "09:00";
    }
  };

  // Convert 24h to 12h for saving to database
  const convert24to12 = (time24h) => {
    if (!time24h) return "09:00 AM";
    try {
      const [hours, minutes] = time24h.split(':');
      let hr = parseInt(hours, 10);
      const modifier = hr >= 12 ? 'PM' : 'AM';
      hr = hr % 12;
      hr = hr ? hr : 12; // the hour '0' should be '12'
      return `${String(hr).padStart(2, '0')}:${minutes} ${modifier}`;
    } catch (e) {
      return "09:00 AM";
    }
  };

  // Fetch current settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/crm/attendance/settings');
        if (response.data && response.data.success) {
          setSettings({
            officeStartTime: response.data.data.officeStartTime || '09:00 AM',
            officeEndTime: response.data.data.officeEndTime || '06:00 PM',
            halfDayDeduction: response.data.data.halfDayDeduction !== undefined ? response.data.data.halfDayDeduction : 250,
            absentDeduction: response.data.data.absentDeduction !== undefined ? response.data.data.absentDeduction : 500,
            lateGracePeriod: response.data.data.lateGracePeriod !== undefined ? response.data.data.lateGracePeriod : 15,
          });
        }
      } catch (error) {
        console.error('Error fetching attendance settings:', error);
        toast.error('Failed to load attendance settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Perform simple validation
      const start24 = convert12to24(settings.officeStartTime);
      const end24 = convert12to24(settings.officeEndTime);
      
      if (start24 >= end24) {
        toast.error('Office end time must be after start time');
        setSaving(false);
        return;
      }

      const response = await api.put('/crm/attendance/settings', settings);
      if (response.data && response.data.success) {
        toast.success('Attendance settings saved successfully!');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Server error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/enquiries/all')}>Home</span>
            <span>/</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/staff/directory')}>Staff</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">Settings</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Settings</h1>
          <p className="text-gray-500 text-sm">Configure global work shift timings and salary deduction multipliers.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-4xl space-y-6">
        {/* Core Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Shift & Office Timings */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <MdAccessTime size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Office Timings</h3>
                <p className="text-xs text-gray-500">Define office hours for lateness and attendance tracking.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Office Start Time</label>
                <div className="relative">
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-gray-800"
                    value={convert12to24(settings.officeStartTime)}
                    onChange={(e) => setSettings({
                      ...settings,
                      officeStartTime: convert24to12(e.target.value)
                    })}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Currently configured: <span className="font-semibold text-indigo-600">{settings.officeStartTime}</span></p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Office End Time (Chutti Time)</label>
                <div className="relative">
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-gray-800"
                    value={convert12to24(settings.officeEndTime)}
                    onChange={(e) => setSettings({
                      ...settings,
                      officeEndTime: convert24to12(e.target.value)
                    })}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Currently configured: <span className="font-semibold text-indigo-600">{settings.officeEndTime}</span></p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Late Grace Period (Minutes)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-gray-800"
                    value={settings.lateGracePeriod}
                    onChange={(e) => setSettings({
                      ...settings,
                      lateGracePeriod: parseInt(e.target.value, 10) || 0
                    })}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Late status is triggered if check-in is after Office Start Time + Grace Period.</p>
              </div>
            </div>
          </div>

          {/* Card 2: Payroll Deduction Configurations */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <MdAttachMoney size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Salary Deductions</h3>
                <p className="text-xs text-gray-500">Specify flat salary penalties for late/leave instances.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Half-Day Absence Deduction (₹)</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm font-medium">₹</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-semibold text-gray-800"
                    placeholder="Enter half-day deduction"
                    value={settings.halfDayDeduction}
                    onChange={(e) => setSettings({
                      ...settings,
                      halfDayDeduction: Number(e.target.value) || 0
                    })}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Charged when staff clocks in late or registers a half-day shift.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Absent / Leave Deduction (₹)</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm font-medium">₹</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-semibold text-gray-800"
                    placeholder="Enter full-day deduction"
                    value={settings.absentDeduction}
                    onChange={(e) => setSettings({
                      ...settings,
                      absentDeduction: Number(e.target.value) || 0
                    })}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Charged for unauthorized leaves or fully marked absent days.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Action Panel */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">
            Changes will take effect instantly for all future payroll computations.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: premiumColors.primary.DEFAULT }}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <MdCheckCircle size={20} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};


