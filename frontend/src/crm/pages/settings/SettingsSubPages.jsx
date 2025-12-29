import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  MdLocationCity, 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdAttachMoney, 
  MdLabel, 
  MdRule, 
  MdSecurity, 
  MdCheckCircle, 
  MdNotificationsActive,
  MdFlashOn,
  MdClose,
  MdGroup
} from 'react-icons/md';
import { premiumColors } from '../../../theme/colors';
import { rgba } from 'polished';

// --- Shared Components ---

const Toggle = ({ enabled, onToggle }) => (
    <div 
        onClick={onToggle}
        className={`w-12 h-7 rounded-full flex items-center p-1 cursor-pointer transition-colors`}
        style={{ backgroundColor: enabled ? premiumColors.primary.DEFAULT : '#e0e3e8' }}
    >
        <motion.div 
            layout 
            className="w-5 h-5 bg-white rounded-full shadow-sm"
        />
    </div>
);

const SettingCard = ({ title, subtitle, children, className = "" }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}
    >
        <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {children}
    </motion.div>
);

// --- Mock Data ---

const MOCK_CITIES = [
    { id: 1, name: "Chandigarh", state: "UT", status: true, hubs: 4 },
    { id: 2, name: "Delhi NCR", state: "Delhi", status: true, hubs: 12 },
    { id: 3, name: "Ludhiana", state: "Punjab", status: false, hubs: 2 },
    { id: 4, name: "Manali", state: "Himachal", status: true, hubs: 1 },
];

const EXPENSE_CATS = [
    { id: 1, name: "Fuel", icon: "⛽", color: "bg-orange-50 text-orange-600" },
    { id: 2, name: "Maintenance", icon: "🔧", color: "bg-blue-50 text-blue-600" },
    { id: 3, name: "Salary", icon: "💰", color: "bg-green-50 text-green-600" },
    { id: 4, name: "Office Rent", icon: "🏢", color: "bg-purple-50 text-purple-600" },
    { id: 5, name: "Marketing", icon: "📢", color: "bg-indigo-50 text-indigo-600" },
];

const ROLES_DATA = [
    { id: 1, role: "Super Admin", users: 2, access: "Full Access", avatars: ["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2"] },
    { id: 2, role: "Fleet Manager", users: 4, access: "Cars, Bookings, Garage", avatars: ["https://i.pravatar.cc/150?u=3", "https://i.pravatar.cc/150?u=4", "https://i.pravatar.cc/150?u=5", "https://i.pravatar.cc/150?u=6"] },
    { id: 3, role: "Accountant", users: 1, access: "Finance, Reports", avatars: ["https://i.pravatar.cc/150?u=7"] },
    { id: 4, role: "Support Staff", users: 8, access: "Bookings (Read Only)", avatars: ["https://i.pravatar.cc/150?u=8", "https://i.pravatar.cc/150?u=9", "https://i.pravatar.cc/150?u=10"] },
];

const AddRoleModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    const [roleName, setRoleName] = useState('');
    const [accessLevel, setAccessLevel] = useState('Read Only');

    // Effect to populate fields when initialData changes (for editing)
    React.useEffect(() => {
        if (initialData) {
            setRoleName(initialData.role);
            setAccessLevel(initialData.access);
        } else {
            setRoleName('');
            setAccessLevel('Read Only');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ roleName, accessLevel, id: initialData?.id });
        setRoleName('');
        setAccessLevel('Read Only');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">{initialData ? 'Edit Role' : 'Add New Role'}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                             <MdClose size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Role Name</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="e.g. Sales Manager"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Access Level</label>
                            <select 
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={accessLevel}
                                onChange={(e) => setAccessLevel(e.target.value)}
                            >
                                <option>Full Access</option>
                                <option>Read Only</option>
                                <option>Custom</option>
                                <option>Cars, Bookings, Garage</option>
                                <option>Finance, Reports</option>
                                <option>Bookings (Read Only)</option>
                            </select>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl">Cancel</button>
                            <button 
                                type="submit" 
                                className="px-5 py-2.5 text-white font-bold rounded-xl shadow-lg hover:bg-opacity-90 transition-all"
                                style={{ backgroundColor: premiumColors.primary.DEFAULT }}
                            >
                                {initialData ? 'Save Changes' : 'Create Role'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// --- Overview Page ---
export const SettingsOverviewPage = () => {
    const navigate = useNavigate();

    const menuItems = [
        { title: "Locations", desc: "Cities & Hubs Management", icon: MdLocationCity, path: '/crm/settings/locations' },
        { title: "Expenses", desc: "Expense Categories", icon: MdAttachMoney, path: '/crm/settings/expenses' },
        { title: "Salary Rules", desc: "Payroll Configurations", icon: MdAttachMoney, path: '/crm/settings/salary' },
        { title: "Team Access", desc: "Roles & Permissions", icon: MdSecurity, path: '/crm/settings/roles' },
        { title: "Automations", desc: "Workflow Rules", icon: MdFlashOn, path: '/crm/settings/automation' },
        { title: "Alerts", desc: "System Notifications", icon: MdNotificationsActive, path: '/crm/settings/alerts' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: premiumColors.primary.DEFAULT }}>Settings Dashboard</h1>
                <p className="text-gray-500 text-sm">Central control panel for your CRM.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item, i) => (
                    <motion.div 
                        key={i}
                        onClick={() => navigate(item.path)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 flex items-center gap-4 cursor-pointer hover:shadow-xl transition-all"
                    >
                        <div 
                            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                            style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1), color: premiumColors.primary.DEFAULT }}
                        >
                            <item.icon />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">{item.title}</h3>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// --- Pages ---

export const LocationsPage = () => {
    const [cities, setCities] = useState(MOCK_CITIES);

    const toggleCity = (id) => {
        setCities(cities.map(c => c.id === id ? { ...c, status: !c.status } : c));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                 <div>
                     <h1 className="text-2xl font-bold" style={{ color: premiumColors.primary.DEFAULT }}>Cities & Locations</h1>
                     <p className="text-gray-500 text-sm">Manage operational cities and pickup hubs.</p>
                 </div>
                 <button 
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: premiumColors.primary.DEFAULT, boxShadow: `0 4px 14px ${rgba(premiumColors.primary.DEFAULT, 0.4)}` }}
                 >
                     <MdAdd size={20} /> Add City
                 </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities.map((city) => (
                    <motion.div 
                        key={city.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        className={`p-6 rounded-2xl border shadow-sm relative overflow-hidden group transition-all`}
                        style={{ borderColor: city.status ? rgba(premiumColors.primary.DEFAULT, 0.2) : '#f0f0f0', backgroundColor: 'white' }}
                    >
                        <div 
                            className={`absolute top-0 right-0 p-10 rounded-bl-full opacity-50`}
                            style={{ background: city.status ? `linear-gradient(135deg, ${rgba(premiumColors.primary.DEFAULT, 0.05)}, transparent)` : 'transparent' }}
                        ></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div 
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner`}
                                    style={{ 
                                        backgroundColor: city.status ? rgba(premiumColors.primary.DEFAULT, 0.1) : '#f3f4f6', 
                                        color: city.status ? premiumColors.primary.DEFAULT : '#9ca3af' 
                                    }}
                                >
                                    <MdLocationCity size={24} />
                                </div>
                                <Toggle enabled={city.status} onToggle={() => toggleCity(city.id)} />
                            </div>
                            <h3 className={`text-xl font-bold ${city.status ? 'text-gray-900' : 'text-gray-500'}`}>{city.name}</h3>
                            <p className="text-sm text-gray-500">{city.state}</p>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span 
                                    className={`text-xs font-bold px-2 py-1 rounded-md`}
                                    style={{ 
                                        backgroundColor: city.status ? rgba(premiumColors.primary.DEFAULT, 0.1) : '#f3f4f6', 
                                        color: city.status ? premiumColors.primary.DEFAULT : '#6b7280' 
                                    }}
                                >
                                    {city.hubs} Hubs
                                </span>
                                <button className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors"><MdEdit /></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export const ExpenseCategoriesPage = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
             <div>
                 <h1 className="text-2xl font-bold" style={{ color: premiumColors.primary.DEFAULT }}>Expense Categories</h1>
                 <p className="text-gray-500 text-sm">Classify your outgoing payments.</p>
             </div>
             <button 
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all"
                style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1), color: premiumColors.primary.DEFAULT }}
             >
                 <MdAdd size={20} /> New Category
             </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {EXPENSE_CATS.map(cat => (
                <motion.div 
                    key={cat.id}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-all"
                    style={{ borderColor: 'transparent' }}
                >
                    <div 
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3`}
                        style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.05) }}
                    >
                        {cat.icon}
                    </div>
                    <h4 className="font-bold text-gray-800">{cat.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">12 Transactions</p>
                </motion.div>
            ))}
        </div>
    </div>
);

export const SalaryRulesPage = () => (
    <div className="space-y-6">
        <div>
             <h1 className="text-2xl font-bold text-gray-900">Salary & Deduction Rules</h1>
             <p className="text-gray-500 text-sm">Configure payroll parameters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingCard title="Base Salary Structure" subtitle="Default payout settings">
                 <div className="space-y-4">
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                         <span className="text-gray-700 font-medium">Driver Daily Allowance</span>
                         <span className="font-bold" style={{ color: premiumColors.primary.DEFAULT }}>₹ 500 / day</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                         <span className="text-gray-700 font-medium">Overtime Rate</span>
                         <span className="font-bold" style={{ color: premiumColors.primary.DEFAULT }}>₹ 100 / hr</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                         <span className="text-gray-700 font-medium">Night Halt Charge</span>
                         <span className="font-bold" style={{ color: premiumColors.primary.DEFAULT }}>₹ 300 / night</span>
                     </div>
                 </div>
            </SettingCard>

            <SettingCard title="Deduction Logic" subtitle="Auto-deduct based on events">
                 <div className="space-y-4">
                     <div className="flex justify-between items-center">
                         <div>
                             <h4 className="font-bold text-gray-800">Late Arrival</h4>
                             <p className="text-xs text-red-500">Deduct ₹50 per 30 mins</p>
                         </div>
                         <Toggle enabled={true} />
                     </div>
                     <div className="flex justify-between items-center">
                         <div>
                             <h4 className="font-bold text-gray-800">Traffic Violation</h4>
                             <p className="text-xs text-red-500">100% Challan Amount</p>
                         </div>
                         <Toggle enabled={true} />
                     </div>
                 </div>
            </SettingCard>
        </div>
    </div>
);

export const RolesAccessPage = () => {
    const [roles, setRoles] = useState(ROLES_DATA);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const handleSaveRole = ({ roleName, accessLevel, id }) => {
        if (id) {
            // Edit existing role
            setRoles(roles.map(r => r.id === id ? { ...r, role: roleName, access: accessLevel } : r));
        } else {
            // Add new role
            const newRole = {
                id: roles.length + 1,
                role: roleName,
                users: 0,
                access: accessLevel,
                avatars: []
            };
            setRoles([...roles, newRole]);
        }
        setIsModalOpen(false);
        setEditingRole(null);
    };

    const openEditModal = (role) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingRole(null);
        setIsModalOpen(true);
    };

    return (
    <div className="space-y-6">
        <AddRoleModal 
            isOpen={isModalOpen} 
            onClose={() => { setIsModalOpen(false); setEditingRole(null); }} 
            onSave={handleSaveRole} 
            initialData={editingRole}
        />

        <div className="flex justify-between items-end">
             <div>
                 <h1 className="text-2xl font-bold" style={{ color: premiumColors.primary.DEFAULT }}>Roles & Permissions</h1>
                 <p className="text-gray-500 text-sm">Control who sees what.</p>
             </div>
             <button 
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-xl font-bold shadow-lg transition-transform active:scale-95"
                style={{ backgroundColor: premiumColors.primary.DEFAULT, boxShadow: `0 4px 14px ${rgba(premiumColors.primary.DEFAULT, 0.4)}` }}
             >
                 <MdSecurity size={18} /> Add Role
             </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <table className="w-full text-left border-collapse">
                 <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                     <tr>
                         <th className="px-6 py-4">Role Name</th>
                         <th className="px-6 py-4">Active Users</th>
                         <th className="px-6 py-4">Access Level</th>
                         <th className="px-6 py-4 text-right">Action</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-sm">
                     {roles.map((role) => (
                         <tr key={role.id} className="hover:bg-gray-50 transition-colors group">
                             <td className="px-6 py-4 font-bold" style={{ color: premiumColors.primary.DEFAULT }}>{role.role}</td>
                             <td className="px-6 py-4">
                                 <div className="flex -space-x-2">
                                     {role.avatars && role.avatars.length > 0 ? (
                                         role.avatars.slice(0, 3).map((avatar, i) => (
                                             <img 
                                                key={i} 
                                                src={avatar} 
                                                alt="User" 
                                                className="w-9 h-9 rounded-full border-2 border-white object-cover"
                                             />
                                         ))
                                     ) : (
                                        <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-400">
                                            <MdGroup />
                                        </div>
                                     )}
                                     {role.users > 3 && (
                                        <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                                            +{role.users - 3}
                                        </div>
                                     )}
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-gray-600 font-medium">{role.access}</td>
                             <td className="px-6 py-4 text-right">
                                 <button 
                                    onClick={() => openEditModal(role)}
                                    className="font-bold text-xs hover:underline" 
                                    style={{ color: premiumColors.primary.DEFAULT }}
                                 >
                                    Edit Perms
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

export const AlertsLimitsPage = () => (
    <div className="space-y-6">
        <div>
             <h1 className="text-2xl font-bold text-gray-900">System Alerts</h1>
             <p className="text-gray-500 text-sm">Set thresholds for automated notifications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {[
                 { title: "Low Fuel Alert", desc: "Notify when fuel drops below 15%", enabled: true, icon: MdNotificationsActive, color: "text-orange-500" },
                 { title: "Speed Limit Warning", desc: "Notify if car exceeds 100 km/h", enabled: true, icon: MdFlashOn, color: "text-red-500" },
                 { title: "Payment Due Reminder", desc: "Email client 2 days before due date", enabled: false, icon: MdAttachMoney, color: "text-green-500" },
                 { title: "Maintenance Due", desc: "Alert 500km before service schedule", enabled: true, icon: MdRule, color: "text-blue-500" },
             ].map((alert, i) => (
                 <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                     <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${alert.color}`}>
                         <alert.icon size={24} />
                     </div>
                     <div className="flex-1">
                         <div className="flex justify-between items-start">
                             <h4 className="font-bold text-gray-900">{alert.title}</h4>
                             <Toggle enabled={alert.enabled} />
                         </div>
                         <p className="text-sm text-gray-500 mt-1">{alert.desc}</p>
                     </div>
                 </div>
             ))}
        </div>
    </div>
);

