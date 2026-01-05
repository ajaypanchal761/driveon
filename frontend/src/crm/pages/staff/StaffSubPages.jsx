import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  MdArrowBack,
  MdLocationOn
} from 'react-icons/md';
import { jsPDF } from 'jspdf';
import { premiumColors } from '../../../theme/colors';
import { useStaff } from '../../context/StaffContext';
import ThemedDropdown from '../../../components/common/ThemedDropdown';
import { rgba } from 'polished';

// ... (other imports remain)

// Removed MOCK_STAFF_DATA - now in Context

const StaffPlaceholder = ({ name, size = "md", className = "" }) => {
    const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
    const sizeClasses = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-16 h-16 text-xl" : "w-10 h-10 text-sm";
    
    return (
        <div className={`${sizeClasses} rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold ${className}`}>
            {initials}
        </div>
    );
};

const AddStaffModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const { rolesList } = useStaff();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        department: 'Sales',
        phone: '',
        email: '',
        salaryType: 'Monthly',
        baseMonthlySalary: '',
        dailyRate: '',
        ratePerTrip: '',
        joinDate: new Date().toLocaleDateString('en-GB'),
        status: 'Active',
        workingDays: 26,
        absentDeduction: '',
        halfDayDeduction: '',
        overtimeRate: '',
        employmentType: 'Full Time'
    });

    useEffect(() => {
        if (isOpen) {
            setStep(1); 
            if (initialData) {
                // Sanitize phone number to remove +91 or other chars if present in edit mode
                const sanitizedPhone = initialData.phone ? initialData.phone.replace(/\D/g, '').slice(-10) : '';
                setFormData({...initialData, phone: sanitizedPhone});
            } else {
                setFormData({
                    name: '',
                    role: rolesList.length > 0 ? rolesList[0].role : '',
                    department: 'Sales',
                    phone: '',
                    email: '',
                    salaryType: 'Monthly',
                    baseMonthlySalary: '',
                    dailyRate: '',
                    ratePerTrip: '',
                    joinDate: new Date().toLocaleDateString('en-GB'),
                    status: 'Active',
                    workingDays: 26,
                    absentDeduction: '',
                    halfDayDeduction: '',
                    overtimeRate: '',
                    employmentType: 'Full Time'
                });
            }
        }
    }, [isOpen, initialData, rolesList]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const [errors, setErrors] = useState({});

    // ... (useEffect remains same) ...

    const validateStep1 = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.role) newErrors.role = "Role is required";
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
             newErrors.email = "Invalid email format";
        }

        // Phone validation
        if (!formData.phone) {
             newErrors.phone = "Phone is required";
        } else if (formData.phone.length !== 10) {
             newErrors.phone = "Phone must be exactly 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        let newErrors = {};
        
        // Salary validation based on type
        const salaryValue = formData.salaryType === 'Monthly' ? formData.baseMonthlySalary : 
                           formData.salaryType === 'Daily' ? formData.dailyRate : formData.ratePerTrip;
        
        if (!salaryValue) {
            newErrors.salary = "Amount is required";
        } else if (Number(salaryValue) <= 0) {
            newErrors.salary = "Amount must be greater than 0";
        }

        // Working Days validation
        if (!formData.workingDays) {
            newErrors.workingDays = "Working days required";
        } else if (Number(formData.workingDays) < 1 || Number(formData.workingDays) > 31) {
             newErrors.workingDays = "Invalid days (1-31)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (step === 1) {
            if (validateStep1()) setStep(step + 1);
        } else if (step === 2) {
             if (validateStep2()) setStep(step + 1);
        } else {
            setStep(step + 1);
        }
    };
    const prevStep = () => setStep(step - 1);

    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* ... overlay ... */}
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
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-0 overflow-hidden"
             >
                {/* Header */}
                <div className="bg-white px-6 py-4 flex justify-between items-start border-b border-gray-100 relative">
                     {/* Progress Bar */}
                     <div className="absolute top-0 left-0 h-1 transition-all duration-300" style={{ width: `${(step / 3) * 100}%`, backgroundColor: premiumColors.primary.DEFAULT }}></div>
                     
                     <div>
                        <h3 className="text-xl font-bold text-gray-900">{initialData ? 'Edit Staff' : 'Add New Staff'}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Step {step} of 3: {step === 1 ? 'Basic Details' : step === 2 ? 'Salary Config' : 'Final Review'}</p>
                     </div>
                     <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                         <MdClose size={22} />
                     </button>
                </div>

                <div className="p-6">
                    <form onSubmit={(e) => e.preventDefault()} className="min-h-[350px]">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: BASIC DETAILS */}
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-600 uppercase">Full Name *</label>
                                            <input autoFocus type="text" placeholder="Rajesh Kumar" className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`} value={formData.name} onChange={e => {
                                                setFormData({...formData, name: e.target.value});
                                                if(errors.name) setErrors({...errors, name: null});
                                            }} />
                                            {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-600 uppercase">Role *</label>
                                            <ThemedDropdown
                                                options={rolesList.map(r => r.role)}
                                                value={formData.role}
                                                onChange={val => setFormData({...formData, role: val})}
                                                placeholder="Select Role"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-600 uppercase">Department</label>
                                            <ThemedDropdown
                                                options={['Sales', 'Fleet', 'Garage', 'Administration']}
                                                value={formData.department}
                                                onChange={val => setFormData({...formData, department: val})}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                           <label className="text-[10px] font-bold text-gray-600 uppercase">Status</label>
                                           <ThemedDropdown
                                                options={['Active', 'On Duty', 'Leave', 'Inactive']}
                                                value={formData.status}
                                                onChange={val => setFormData({...formData, status: val})}
                                           />
                                       </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-600 uppercase">Phone *</label>
                                            <div className="relative flex items-center">
                                                <MdPhone className="absolute left-3 text-gray-400 z-10" size={14} />
                                                <span className="absolute left-9 text-gray-500 font-medium text-sm border-r border-gray-300 pr-2 py-0.5 select-none">+91</span>
                                                <input 
                                                    type="text" 
                                                    maxLength="10"
                                                    placeholder="98765 43210" 
                                                    className={`w-full pl-[4.5rem] pr-3 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
                                                    value={formData.phone} 
                                                    onChange={e => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        setFormData({...formData, phone: val});
                                                        if(errors.phone) setErrors({...errors, phone: null});
                                                    }} 
                                                />
                                            </div>
                                            {errors.phone && <p className="text-[10px] text-red-500 font-medium">{errors.phone}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-600 uppercase">Email *</label>
                                            <div className="relative">
                                                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                                <input 
                                                    type="email" 
                                                    placeholder="staff@driveon.com" 
                                                    className={`w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
                                                    value={formData.email} 
                                                    onChange={e => {
                                                        setFormData({...formData, email: e.target.value});
                                                        if(errors.email) setErrors({...errors, email: null});
                                                    }} 
                                                />
                                            </div>
                                            {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-600 uppercase">Joining Date</label>
                                            <div className="relative">
                                                <input type="text" placeholder="dd-mm-yyyy" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" value={formData.joinDate} />
                                                <MdAccessTime className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                           <label className="text-[10px] font-bold text-gray-600 uppercase">Employment</label>
                                           <ThemedDropdown
                                                options={['Full Time', 'Part Time', 'Contract', 'Internship']}
                                                value={formData.employmentType}
                                                onChange={val => setFormData({...formData, employmentType: val})}
                                                position="up"
                                           />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: SALARY CONFIG */}
                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-5"
                                >
                                    {/* Salary Method Toggle */}
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                        <label className="text-[10px] font-bold text-indigo-800 uppercase mb-2 block">Salary Method</label>
                                        <div className="flex gap-2">
                                            {['Monthly', 'Daily', 'Per Trip'].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setFormData({...formData, salaryType: type})}
                                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all
                                                        ${formData.salaryType === type 
                                                            ? 'text-white shadow-md' 
                                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                                                    style={{
                                                        backgroundColor: formData.salaryType === type ? premiumColors.primary.DEFAULT : undefined,
                                                        boxShadow: formData.salaryType === type ? `0 4px 6px -1px ${rgba(premiumColors.primary.DEFAULT, 0.2)}` : undefined
                                                    }}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Dynamic Fields based on Salary Type */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-600 uppercase">
                                                {formData.salaryType === 'Monthly' ? 'Base Monthly Salary (₹) *' : formData.salaryType === 'Daily' ? 'Daily Rate (₹) *' : 'Rate Per Trip (₹) *'}
                                            </label>
                                            <input 
                                                type="number" 
                                                className={`w-full px-3 py-2 bg-white border rounded-lg text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 transition-all ${errors.salary ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
                                                value={formData.salaryType === 'Monthly' ? formData.baseMonthlySalary : formData.salaryType === 'Daily' ? formData.dailyRate : formData.ratePerTrip}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (formData.salaryType === 'Monthly') setFormData({...formData, baseMonthlySalary: val});
                                                    else if (formData.salaryType === 'Daily') setFormData({...formData, dailyRate: val});
                                                    else setFormData({...formData, ratePerTrip: val});
                                                    if(errors.salary) setErrors({...errors, salary: null});
                                                }}
                                            />
                                            {errors.salary && <p className="text-[10px] text-red-500 font-medium">{errors.salary}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-600 uppercase">Working Days *</label>
                                            <input 
                                                type="number" 
                                                className={`w-full px-3 py-2 bg-white border rounded-lg text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 transition-all ${errors.workingDays ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
                                                value={formData.workingDays}
                                                onChange={e => {
                                                    setFormData({...formData, workingDays: e.target.value})
                                                    if(errors.workingDays) setErrors({...errors, workingDays: null});
                                                }}
                                            />
                                            {errors.workingDays && <p className="text-[10px] text-red-500 font-medium">{errors.workingDays}</p>}
                                        </div>
                                    </div>

                                    {/* Additional Deductions (Colored Inputs) */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500">Absent Deduction/Day</label>
                                            <div className="relative">
                                                <input type="number" className="w-full px-3 py-2 pl-6 bg-rose-50 border border-rose-100 rounded-lg text-sm text-rose-800 font-bold focus:outline-none" value={formData.absentDeduction} onChange={e => setFormData({...formData, absentDeduction: e.target.value})} />
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-rose-400 text-xs">₹</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500">Half Day Deduction</label>
                                            <div className="relative">
                                                <input type="number" className="w-full px-3 py-2 pl-6 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-800 font-bold focus:outline-none" value={formData.halfDayDeduction} onChange={e => setFormData({...formData, halfDayDeduction: e.target.value})} />
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-orange-400 text-xs">₹</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500">Overtime Rate/Hr</label>
                                            <div className="relative">
                                                <input type="number" className="w-full px-3 py-2 pl-6 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800 font-bold focus:outline-none" value={formData.overtimeRate} onChange={e => setFormData({...formData, overtimeRate: e.target.value})} />
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-green-400 text-xs">₹</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start border border-blue-100">
                                        <div className="mt-0.5 text-blue-600 font-bold text-xs">NB:</div>
                                        <p className="text-xs text-blue-800">
                                            These rules will be locked and used to auto-calculate salary every month. Manual editing of salary is disabled to ensure accuracy.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: REVIEW (Placeholder) */}
                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-4 text-center py-6"
                                >
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MdCheckCircle size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900">All Set!</h4>
                                    <p className="text-gray-500 text-sm px-8">
                                        You are about to add <span className="font-bold text-gray-800">{formData.name}</span> as a <span className="font-bold text-gray-800">{formData.role}</span>.
                                    </p>
                                    <div className="bg-gray-50 rounded-xl p-4 mt-4 text-left text-sm space-y-2 border border-gray-100">
                                        <div className="flex justify-between"><span>Salary Type:</span> <span className="font-bold">{formData.salaryType}</span></div>
                                        <div className="flex justify-between"><span>Base Pay:</span> <span className="font-bold">₹{formData.baseMonthlySalary || formData.dailyRate || formData.ratePerTrip}</span></div>
                                        <div className="flex justify-between"><span>Phone:</span> <span className="font-bold">{formData.phone}</span></div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-5 border-t border-gray-100 flex justify-between bg-gray-50 items-center">
                    {step > 1 ? (
                        <button onClick={prevStep} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors text-sm border border-gray-200 bg-white">
                            Back
                        </button>
                    ) : (
                        <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:text-red-500 transition-colors text-sm">
                            Cancel
                        </button>
                    )}

                    {step < 3 ? (
                        <button 
                            onClick={nextStep} 
                            className="px-8 py-2.5 rounded-xl font-bold text-white shadow-md transition-all text-sm flex items-center gap-2"
                            style={{ backgroundColor: premiumColors.primary.DEFAULT, boxShadow: `0 4px 6px -1px ${rgba(premiumColors.primary.DEFAULT, 0.2)}` }}
                        >
                            Next Step
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className="px-8 py-2.5 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 shadow-md transition-all text-sm flex items-center gap-2">
                             Confirm & Add
                        </button>
                    )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
 };

const ViewStaffModal = ({ isOpen, onClose, staff }) => {
    if (!staff) return null;
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
             className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="h-24 relative" style={{ background: `linear-gradient(to right, ${premiumColors.primary.DEFAULT}, ${rgba(premiumColors.primary.DEFAULT, 0.8)})` }}>
                     <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors">
                        <MdClose size={20} />
                     </button>
                </div>
                <div className="px-6 pb-6 -mt-12 relative">
                     <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg mb-4">
                        <div className="w-full h-full rounded-xl flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1), color: premiumColors.primary.DEFAULT }}>
                             {staff.name.charAt(0)}
                        </div>
                     </div>
                     
                     <div className="mb-6">
                        <span 
                            className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border mb-2 inline-block"
                            style={{ 
                                backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1), 
                                color: premiumColors.primary.DEFAULT,
                                borderColor: rgba(premiumColors.primary.DEFAULT, 0.2)
                            }}
                        >
                             {staff.role}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{staff.name}</h2>
                        <p className="text-gray-500 font-medium">{staff.department} Department</p>
                     </div>

                     <div className="space-y-4">
                         <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm">
                                 <MdPhone size={18} />
                             </div>
                             <div>
                                 <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                                 <p className="text-sm font-bold text-gray-800">{staff.phone}</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm">
                                 <MdEmail size={18} />
                             </div>
                             <div>
                                 <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                                 <p className="text-sm font-bold text-gray-800">{staff.email}</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm">
                                 <MdAttachMoney size={18} />
                             </div>
                             <div>
                                 <p className="text-xs text-gray-400 font-bold uppercase">Salary Structure</p>
                                 <p className="text-sm font-bold text-gray-800">
                                     {staff.salaryType === 'Monthly' ? `₹ ${staff.baseMonthlySalary} / Month` : 
                                      staff.salaryType === 'Daily' ? `₹ ${staff.dailyRate} / Day` : 
                                      `₹ ${staff.ratePerTrip} / Trip`}
                                 </p>
                             </div>
                         </div>
                     </div>
                     
                     <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                         <span>Member since {staff.joinDate}</span>
                         <span className={`px-2 py-0.5 rounded text-xs font-bold border ${staff.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                             {staff.status}
                         </span>
                     </div>
                </div>
            </motion.div>
         </div>
       )}
     </AnimatePresence>
    );
 };

export const StaffDirectoryPage = () => {
    const navigate = useNavigate();
    const { staffList, addStaff, updateStaff, deleteStaff } = useStaff();
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    // staffList is now from context
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [viewStaff, setViewStaff] = useState(null); // Full View Modal State
    const [activeMenu, setActiveMenu] = useState(null); // Track open menu
  
    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const filteredStaff = staffList.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            staff.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = deptFilter === 'All' || deptFilter === `Dept: ${deptFilter}` || staff.department === deptFilter;
      return matchesSearch && matchesDept;
    });

    const handleAddStaff = (newStaffData) => {
        if (editingStaff) {
            updateStaff(editingStaff.id, newStaffData);
            setEditingStaff(null);
        } else {
            addStaff(newStaffData);
        }
    };

    const handleDeletStaff = (id) => {
        if(window.confirm("Are you sure you want to delete this staff member?")) {
            deleteStaff(id);
        }
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
        <AddStaffModal 
            isOpen={isAddModalOpen} 
            onClose={() => { setIsAddModalOpen(false); setEditingStaff(null); }} 
            onSubmit={handleAddStaff} 
            initialData={editingStaff}
        />

        <ViewStaffModal 
            isOpen={!!viewStaff} 
            onClose={() => setViewStaff(null)} 
            staff={viewStaff} 
        />
        
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
            onClick={() => { setEditingStaff(null); setIsAddModalOpen(true); }}
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
           <div className="relative w-full md:w-auto min-w-[200px]">
              <ThemedDropdown 
                options={['All', 'Sales', 'Fleet', 'Garage', 'Administration']}
                value={deptFilter}
                onChange={setDeptFilter}
              />
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
                <th className="p-4">Salary Config</th>
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
                  <td className="p-4">
                     {staff.salaryType === 'Monthly' && (
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900">₹ {staff.baseMonthlySalary}</span>
                            <span className="text-[10px] text-gray-400 font-medium uppercase">Monthly</span>
                        </div>
                     )}
                     {staff.salaryType === 'Daily' && (
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900">₹ {staff.dailyRate}</span>
                            <span className="text-[10px] text-gray-400 font-medium uppercase">/ Day</span>
                        </div>
                     )}
                     {staff.salaryType === 'Per Trip' && (
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900">₹ {staff.ratePerTrip}</span>
                            <span className="text-[10px] text-gray-400 font-medium uppercase">/ Trip</span>
                        </div>
                     )}
                  </td>
                  <td className="p-4 text-gray-500">
                    {staff.joinDate}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(staff.status)}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                        onClick={() => setViewStaff(staff)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors mr-2"
                        title="View Details"
                    >
                      <MdVisibility size={18} />
                    </button>
                    
                    <div className="relative inline-block text-left">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenu(activeMenu === staff.id ? null : staff.id);
                            }}
                            className={`p-2 rounded-lg transition-colors ${activeMenu === staff.id ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                        >
                          <MdMoreVert size={18} />
                        </button>
                        
                        {activeMenu === staff.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 origin-top-right animate-scaleIn">
                                <button 
                                    onClick={() => {
                                        setEditingStaff(staff);
                                        setIsAddModalOpen(true);
                                        setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 flex items-center gap-2"
                                >
                                    <MdEdit size={16} /> Edit Details
                                </button>
                                <button 
                                    onClick={() => handleDeletStaff(staff.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <MdDelete size={16} /> Delete Staff
                                </button>
                            </div>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };


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
                  <ThemedDropdown 
                    options={['Basic', 'Intermediate', 'Full Access']}
                    value={formData.access}
                    onChange={val => setFormData({...formData, access: val})}
                    width="w-full"
                    position="up"
                  />
                  <button 
                    type="submit" 
                    className="w-full text-white py-2 rounded-xl font-bold transition-colors"
                    style={{ backgroundColor: premiumColors.primary.DEFAULT }}
                  >
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

    // Find assigned staff using context
    const { staffList } = useStaff();
    const assignedStaff = staffList.filter(s => role.staffIds?.includes(s.id));

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
                        <span>Roles</span> <span>/</span> <span className="font-medium" style={{ color: premiumColors.primary.DEFAULT }}>Details</span>
                    </div>
                </div>
            </div>

            {/* Hero Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-bl-full -mr-16 -mt-16 pointer-events-none" style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.05) }}></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start justify-between">
                    <div>
                        <span 
                            className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3 inline-block"
                            style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1), color: premiumColors.primary.DEFAULT }}
                        >
                            {role.access} Access
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{role.role}</h2>
                        <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">{role.description}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100" style={{ color: premiumColors.primary.DEFAULT }}>
                            <MdGroup size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{role.staffIds?.length || 0}</p>
                            <p className="text-sm text-gray-500 font-medium">Active Staff</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200">
                <button 
                  onClick={() => setActiveTab('permissions')}
                  className={`pb-3 text-sm font-bold transition-colors relative`}
                  style={{ color: activeTab === 'permissions' ? premiumColors.primary.DEFAULT : undefined }}
                >
                    Permissions & Access
                    {activeTab === 'permissions' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: premiumColors.primary.DEFAULT }} />}
                </button>
                <button 
                  onClick={() => setActiveTab('staff')}
                  className={`pb-3 text-sm font-bold transition-colors relative`}
                  style={{ color: activeTab === 'staff' ? premiumColors.primary.DEFAULT : undefined }}
                >
                    Assigned Staff ({role.staffIds?.length || 0})
                    {activeTab === 'staff' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: premiumColors.primary.DEFAULT }} />}
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
                                                 <div 
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                                                    style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1), color: premiumColors.primary.DEFAULT }}
                                                 >
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
                                                <button className="text-sm font-bold hover:opacity-80 transition-opacity" style={{ color: premiumColors.primary.DEFAULT }}>View Profile</button>
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
  const { rolesList, addRole, updateRole, deleteRole } = useStaff();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // For Details Page

  const handleSaveRole = (data) => {
      if (editingRole) {
          updateRole(editingRole.id, data);
      } else {
          addRole(data);
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
          deleteRole(id);
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
            <span className="hover:text-gray-900 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
            <span>/</span> 
            <span className="hover:text-gray-900 cursor-pointer transition-colors" onClick={() => navigate('/crm/staff/directory')}>Staff</span> 
            <span>/</span> 
            <span className="font-medium" style={{ color: premiumColors.primary.DEFAULT }}>Roles</span>
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
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1), color: premiumColors.primary.DEFAULT }}
                  >
                     <MdSecurity size={24} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                        onClick={(e) => handleEdit(e, role)}
                        className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                        style={{ ':hover': { color: premiumColors.primary.DEFAULT } }}
                     >
                        <MdEdit size={18} />
                     </button>
                     <button 
                        onClick={(e) => handleDelete(e, role.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                     >
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
                     <MdGroup size={16} /> {role.staffIds?.length || 0} Staff
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

const CustomTimePicker = ({ value, onChange, label }) => {
    // Value format expected: "09:00 AM" or ""
    const [hour, setHour] = useState('09');
    const [minute, setMinute] = useState('00');
    const [period, setPeriod] = useState('AM');

    useEffect(() => {
        if (value && value.includes(' ')) {
            const [time, per] = value.split(' ');
            const [h, m] = time.split(':');
            setHour(h);
            setMinute(m);
            setPeriod(per);
        }
    }, [value]);

    const handleChange = (type, val) => {
        let newH = hour;
        let newM = minute;
        let newP = period;

        if (type === 'hour') newH = val;
        if (type === 'minute') newM = val;
        if (type === 'period') newP = val;

        setHour(newH);
        setMinute(newM);
        setPeriod(newP);
        
        onChange(`${newH}:${newM} ${newP}`);
    };

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    return (
        <div>
            <label className="text-xs font-bold text-gray-500 ml-1 mb-1 block">{label}</label>
            <div className="flex gap-2">
                <ThemedDropdown 
                    options={hours} 
                    value={hour} 
                    onChange={(val) => handleChange('hour', val)} 
                    width="w-20"
                    placeholder="HH"
                />
                <span className="text-gray-400 font-bold self-center">:</span>
                <ThemedDropdown 
                    options={minutes} 
                    value={minute} 
                    onChange={(val) => handleChange('minute', val)} 
                    width="w-20"
                    placeholder="MM"
                />
                <ThemedDropdown 
                    options={['AM', 'PM']} 
                    value={period} 
                    onChange={(val) => handleChange('period', val)} 
                    width="w-20"
                    placeholder="AM/PM"
                />
            </div>
        </div>
    );
};

const MarkAttendanceModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({ name: 'Rajesh Kumar', status: 'Present', inTime: '', outTime: '' });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    status: initialData.status,
                    inTime: initialData.inTime !== '-' ? initialData.inTime : '09:00 AM', // Default or existing
                    outTime: initialData.outTime !== '-' ? initialData.outTime : '06:00 PM' // Default or existing
                });
            } else {
                setFormData({ name: 'Rajesh Kumar', status: 'Present', inTime: '09:00 AM', outTime: '06:00 PM' });
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
                   <ThemedDropdown 
                     className="w-full"
                     value={formData.name} 
                     onChange={val => setFormData({...formData, name: val})}
                     // disabled is not directly supported by ThemedDropdown props yet, but we can't disable it easily without modifying the component. 
                     // For now, we will treat it as enabled or just ignore if it's strictly required. 
                     // However, ThemedDropdown doesn't have a 'disabled' prop in the snippet I saw. 
                     // If initialData is present, maybe we just render a div instead or keep it interactive but strictly 'Rajesh' etc.
                     // Actually, better to just render the name as text if editing.
                     options={['Rajesh Kumar', 'Vikram Singh', 'Amit Bhardwaj', 'Priya Sharma']}
                   />

                   <div className="grid grid-cols-1 gap-4">
                        <CustomTimePicker 
                            label="In Time" 
                            value={formData.inTime} 
                            onChange={(val) => setFormData({...formData, inTime: val})}
                        />
                        <CustomTimePicker 
                            label="Out Time" 
                            value={formData.outTime} 
                            onChange={(val) => setFormData({...formData, outTime: val})}
                        />
                   </div>

                   <div className="flex gap-2">
                       {['Present', 'Absent', 'Late'].map(status => (
                           <button 
                             key={status}
                             onClick={() => setFormData({...formData, status})}
                             className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${formData.status === status ? 'text-white' : 'bg-white text-gray-600 border-gray-200'}`}
                             style={{ 
                                 backgroundColor: formData.status === status ? premiumColors.primary.DEFAULT : undefined,
                                 borderColor: formData.status === status ? premiumColors.primary.DEFAULT : undefined
                             }}
                           >
                               {status}
                           </button>
                       ))}
                   </div>
                   <button 
                    onClick={handleSubmit} 
                    className="w-full text-white py-2 rounded-xl font-bold transition-colors"
                    style={{ backgroundColor: premiumColors.primary.DEFAULT }}
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

 export const AttendancePage = () => {
     const navigate = useNavigate();
     const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
     const [attendanceList, setAttendanceList] = useState(MOCK_ATTENDANCE_DATA);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [editingAttendance, setEditingAttendance] = useState(null);
     const [dateFilter, setDateFilter] = useState('Date: Today');
     const [roleFilter, setRoleFilter] = useState('Staff: All');
     const [searchTerm, setSearchTerm] = useState('');

     const [viewLocationModal, setViewLocationModal] = useState(null);

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
         // No parsing needed now, native format is AM/PM
          const parseTime = (tStr) => {
             if (!tStr || tStr === '-') return '09:00 AM'; // Default fallbacks
             return tStr; 
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
         
         {/* View Location Modal */}
         <AnimatePresence>
            {viewLocationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setViewLocationModal(null)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                    >
                        <div className="bg-[#1C205C] p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center gap-2">
                                <MdLocationOn /> Staff Location
                            </h3>
                            <button onClick={() => setViewLocationModal(null)} className="hover:bg-white/10 p-1 rounded-full"><MdClose /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#1C205C] font-bold text-lg">
                                    {viewLocationModal.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">{viewLocationModal.name}</h4>
                                    <p className="text-sm text-gray-500">Last seen: {new Date(viewLocationModal.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Current Address</label>
                                <p className="text-gray-800 font-medium leading-relaxed">{viewLocationModal.address}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Latitude</label>
                                    <p className="text-gray-800 font-mono text-sm">{viewLocationModal.coords?.lat?.toFixed(6)}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Longitude</label>
                                    <p className="text-gray-800 font-mono text-sm">{viewLocationModal.coords?.long?.toFixed(6)}</p>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${viewLocationModal.coords?.lat},${viewLocationModal.coords?.long}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                                >
                                    Open in Google Maps
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
         </AnimatePresence>

         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div>
             <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
               <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
               <span>/</span> 
               <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/staff/directory')}>Staff</span> 
               <span>/</span> 
               <span className="text-gray-800 font-medium">Attendance</span>
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
                <div className="w-36">
                    <ThemedDropdown 
                        options={['Staff: All', 'Sales', 'Drivers']}
                        value={roleFilter}
                        onChange={setRoleFilter}
                    />
                </div>
                <div className="w-40">
                    <ThemedDropdown 
                        options={['Date: Today', 'Yesterday', 'Select Date']}
                        value={dateFilter}
                        onChange={setDateFilter}
                    />
                </div>
            </div>
            <div className="text-sm text-gray-500 font-medium">
               Total Present: <span className="text-green-600 font-bold">{filteredAttendance.filter(i => i.status === 'Present').length}</span> / <span className="text-gray-800">{filteredAttendance.length}</span>
            </div>
         </div>
   
         {/* Table */}
         <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
           <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider font-bold" style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.05), color: premiumColors.primary.DEFAULT }}>
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
                   <td className="p-4 text-right flex items-center justify-end gap-2">
                     {/* Location View Button for Demo */}
                     {item.id === 1 && (
                        <button 
                            onClick={() => {
                                const locData = localStorage.getItem('emp_latest_location');
                                if (locData) {
                                    const parsed = JSON.parse(locData);
                                    setViewLocationModal(parsed);
                                } else {
                                    alert('No location data available yet. Please clock-in from Employee App first.');
                                }
                            }}
                            className="px-3 py-1.5 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:opacity-90"
                            style={{ backgroundColor: premiumColors.primary.DEFAULT }}
                            title="View Live Location"
                        >
                            <MdLocationOn size={14} /> Location
                        </button>
                     )}
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
                             className="text-gray-400 text-xs font-bold transition-colors"
                             style={{ ':hover': { color: premiumColors.primary.DEFAULT } }}
                             onMouseEnter={(e) => e.currentTarget.style.color = premiumColors.primary.DEFAULT}
                             onMouseLeave={(e) => e.currentTarget.style.color = ''}
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
];

export const SalaryPage = () => {
    const navigate = useNavigate();
    const { staffList } = useStaff();
    const [salaryList, setSalaryList] = useState(MOCK_SALARY_DATA);
    const [monthFilter, setMonthFilter] = useState('Month: December');
    const [staffFilter, setStaffFilter] = useState('Staff: All');
    const [searchTerm, setSearchTerm] = useState('');

    // Check for staff with completed cycles (Due for Payment)
    useEffect(() => {
        const existingIds = new Set(salaryList.map(item => item.id));

        const dueStaff = staffList.filter(staff => !existingIds.has(staff.id))
            .map(staff => {
                let baseAmount = "0";
                if (staff.salaryType === 'Monthly') baseAmount = staff.baseMonthlySalary;
                else if (staff.salaryType === 'Daily') baseAmount = staff.dailyRate;
                else if (staff.salaryType === 'Per Trip') baseAmount = staff.ratePerTrip;
                
                // Simple formatting
                const formattedBase = `₹ ${parseInt(baseAmount || 0).toLocaleString('en-IN')}`;

                return {
                    id: staff.id,
                    name: staff.name,
                    role: staff.role,
                    baseSalary: formattedBase,
                    deductions: "₹ 0",
                    netPay: formattedBase,
                    status: "Pending",
                    paymentDate: "-",
                    // Add flag to indicate this was auto-added due to cycle completion
                    isCycleComplete: true 
                };
            });

        if (dueStaff.length > 0) {
            setSalaryList(prev => [...prev, ...dueStaff]);
        }
    }, [staffList]);

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
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
           </div>
           <div className="flex gap-3 w-full md:w-auto">
              <div className="w-36">
                  <ThemedDropdown 
                    options={['Staff: All', 'Sales', 'Drivers']}
                    value={staffFilter}
                    onChange={setStaffFilter}
                  />
              </div>
              <div className="w-44">
                  <ThemedDropdown 
                    options={['Month: December', 'November', 'October']}
                    value={monthFilter}
                    onChange={setMonthFilter}
                  />
              </div>
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
    const { staffList } = useStaff();
    const [formData, setFormData] = useState({ name: staffList[0]?.name || '', amount: '' });

    useEffect(() => {
        if (isOpen && staffList.length > 0) {
            setFormData({ name: staffList[0].name, amount: '' });
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
             className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
            >
               <h3 className="text-xl font-bold mb-4">New Advance</h3>
               <div className="space-y-4">
                   <ThemedDropdown 
                       options={staffList.map(s => s.name)}
                       value={formData.name}
                       onChange={val => setFormData({...formData, name: val})}
                       placeholder="Select Staff Member"
                   />
                   <input 
                    type="number"
                    placeholder="Amount (₹)" 
                    className="w-full p-2 border rounded-xl"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                   />
                   <button 
                    onClick={() => { if(formData.amount) { onSubmit(formData); onClose(); } }} 
                    className="w-full text-white py-2 rounded-xl font-bold transition-colors"
                    style={{ backgroundColor: premiumColors.primary.DEFAULT }}
                   >
                       Submit Request
                   </button>
               </div>
            </motion.div>
         </div>
       )}
     </AnimatePresence>
    );
 };

const AddRepaymentModal = ({ isOpen, onClose, onSubmit, selectedEntry }) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setNote('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (amount && !isNaN(amount)) {
            onSubmit(parseFloat(amount), note);
            onClose();
        }
    };

    if (!selectedEntry) return null;

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
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Add Repayment</h3>
                        <p className="text-sm text-gray-500 mb-6">Recording repayment for <span className="font-bold text-gray-800">{selectedEntry.name}</span></p>
                        
                        <div className="space-y-4">
                            <div 
                                className="p-3 border rounded-xl mb-4"
                                style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.05), borderColor: rgba(premiumColors.primary.DEFAULT, 0.1) }}
                            >
                                <div className="flex justify-between text-xs font-bold uppercase mb-1" style={{ color: premiumColors.primary.DEFAULT }}>
                                    <span>Remaining Balance</span>
                                    <span>{selectedEntry.balance}</span>
                                </div>
                                <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.2) }}>
                                    <div 
                                        className="h-full transition-all duration-500" 
                                        style={{ 
                                            width: `${(parseFloat(selectedEntry.paid.replace(/[^\d.]/g, '')) / parseFloat(selectedEntry.amount.replace(/[^\d.]/g, ''))) * 100}%`,
                                            backgroundColor: premiumColors.primary.DEFAULT
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Repayment Amount (₹)</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter amount" 
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors font-bold text-gray-800" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Confirmation / Note</label>
                                <textarea 
                                    placeholder="e.g. Paid via UPI" 
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm" 
                                    rows="2"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={onClose} 
                                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSubmit} 
                                    className="flex-2 py-2.5 text-white rounded-xl font-bold shadow-md transition-all active:scale-95"
                                    style={{ backgroundColor: premiumColors.primary.DEFAULT, shadowColor: rgba(premiumColors.primary.DEFAULT, 0.3) }}
                                >
                                    Confirm Payment
                                </button>
                            </div>
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
     const [statusFilter, setStatusFilter] = useState('Status: Active');
     const [advancesList, setAdvancesList] = useState(MOCK_ADVANCES_DATA);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
     const [selectedEntry, setSelectedEntry] = useState(null);
 
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
 
     const handleRepayment = (amount, note) => {
         if(amount && selectedEntry) {
             setAdvancesList(advancesList.map(item => {
                 if(item.id === selectedEntry.id) {
                     const currentPaid = parseFloat(item.paid.replace(/[^\d.]/g, ''));
                     const total = parseFloat(item.amount.replace(/[^\d.]/g, ''));
                     const newPaid = currentPaid + parseFloat(amount);
                     const newBalance = Math.max(0, total - newPaid);
                     return {
                         ...item,
                         paid: `₹ ${newPaid.toLocaleString('en-IN')}`,
                         balance: `₹ ${newBalance.toLocaleString('en-IN')}`,
                         status: newBalance <= 0 ? 'Paid Off' : 'Active'
                     };
                 }
                 return item;
             }));
             console.log(`Note recorded for STF-${selectedEntry.id}: ${note}`);
         }
     };

     const openRepaymentModal = (entry) => {
         setSelectedEntry(entry);
         setIsRepaymentModalOpen(true);
     };
   
     const filteredAdvances = advancesList.filter(item => {
         const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
         if (statusFilter === 'All History') return matchesSearch;
         if (statusFilter === 'Status: Active') return matchesSearch && item.status === 'Active';
         if (statusFilter === 'Paid Off') return matchesSearch && item.status === 'Paid Off';
         return matchesSearch;
     });
 
     return (
       <div className="space-y-6">
          <AddAdvanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddAdvance} />
          <AddRepaymentModal
            isOpen={isRepaymentModalOpen} 
            onClose={() => setIsRepaymentModalOpen(false)} 
            onSubmit={handleRepayment} 
            selectedEntry={selectedEntry} 
          />
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div>
             <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
               <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
               <span>/</span> 
               <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/staff/directory')}>Staff</span> 
               <span>/</span> 
               <span className="text-gray-800 font-medium">Advances</span>
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
              <div className="flex gap-3 w-40">
                 <ThemedDropdown 
                    options={['Status: Active', 'Paid Off', 'All History']}
                    value={statusFilter}
                    onChange={setStatusFilter}
                  />
              </div>
         </div>
   
         {/* Table */}
         <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
           <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider font-bold" style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.05), color: premiumColors.primary.DEFAULT }}>
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
                      {item.status === 'Active' && <span className="px-2 py-1 rounded text-xs font-bold border" style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1), color: premiumColors.primary.DEFAULT, borderColor: rgba(premiumColors.primary.DEFAULT, 0.1) }}>Active</span>}
                      {item.status === 'Paid Off' && <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold border border-gray-200"><MdCheck size={14} /> Paid Off</span>}
                   </td>
                   <td className="p-4 text-right">
                     {item.status === 'Active' && (
                         <button 
                            onClick={() => openRepaymentModal(item)}
                             className="text-xs font-bold transition-colors"
                             style={{ color: premiumColors.primary.DEFAULT }}
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
                   <ThemedDropdown 
                       options={['Rajesh Kumar', 'Vikram Singh', 'Amit Bhardwaj']}
                       value={formData.name}
                       onChange={val => setFormData({...formData, name: val})}
                   />
                   <ThemedDropdown 
                       options={[
                           { label: '5 - Excellent', value: '5' },
                           { label: '4 - Very Good', value: '4' },
                           { label: '3 - Good', value: '3' },
                           { label: '2 - Needs Improvement', value: '2' },
                           { label: '1 - Poor', value: '1' }
                       ]}
                       value={formData.rating}
                       onChange={val => setFormData({...formData, rating: val})}
                   />
                   <textarea 
                     placeholder="Feedback Summary..." 
                     className="w-full p-2 border rounded-xl h-24"
                     value={formData.summary}
                     onChange={e => setFormData({...formData, summary: e.target.value})}
                   />
                    <button 
                        onClick={() => { onSubmit(formData); onClose(); setFormData({name: 'Rajesh Kumar', rating: '5', summary: ''}) }} 
                        className="w-full text-white py-2 rounded-xl font-bold transition-colors"
                        style={{ backgroundColor: premiumColors.primary.DEFAULT }}
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
                <div className="w-36">
                    <ThemedDropdown 
                        options={['Staff: All', 'Sales', 'Drivers']}
                        value={staffFilter}
                        onChange={setStaffFilter}
                    />
                </div>
                <div className="w-36">
                    <ThemedDropdown 
                        options={['Year: 2025', '2024']}
                        value="Year: 2025" // Mock state for year as it was uncontrolled before
                        onChange={() => {}} // Mock handler
                    />
                </div>
             </div>
         </div>
   
         {/* Table */}
         <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-gray-100 text-xs uppercase tracking-wider font-bold" style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.05), color: premiumColors.primary.DEFAULT }}>
                 <th className="p-4">Staff Member</th>
                 <th className="p-4">Rating</th>
                 <th className="p-4">Review Date</th>
                 <th className="p-4">Feedback Summary</th>
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
                   <ThemedDropdown 
                       options={['Amit B. (Mechanic)', 'Vikram S. (Driver)', 'Rajesh K. (Sales)']}
                       value={formData.assignedTo}
                       onChange={val => setFormData({...formData, assignedTo: val})}
                   />
                   <ThemedDropdown 
                       options={['Low', 'Medium', 'High', 'Critical']}
                       value={formData.priority}
                       onChange={val => setFormData({...formData, priority: val})}
                   />
                   <button 
                    onClick={() => { onSubmit(formData); onClose(); setFormData({title: '', assignedTo: 'Amit B. (Mechanic)', priority: 'Medium'}) }} 
                    className="w-full text-white py-2 rounded-xl font-bold transition-colors"
                    style={{ backgroundColor: premiumColors.primary.DEFAULT }}
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
         <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddTask} />
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
             <div className="flex gap-3 w-full md:w-auto">
                <div className="w-44">
                    <ThemedDropdown 
                        options={['Assigned To: All', 'Sales', 'Garage']}
                        value={assignedToFilter}
                        onChange={setAssignedToFilter}
                    />
                </div>
                <div className="w-40">
                    <ThemedDropdown 
                        options={['Status: Pending', 'Completed', 'All']}
                        value={statusFilter}
                        onChange={setStatusFilter}
                    />
                </div>
             </div>
            </div>
         </div>
   
         {/* Table */}
         <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
           <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider font-bold" style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.05), color: premiumColors.primary.DEFAULT }}>
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
           
           {filteredTasksList.length === 0 && (
              <div className="p-10 text-center text-gray-500">No tasks found.</div>
           )}
         </div>
       </div>
     );
 };

