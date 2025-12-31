import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Initial Mock Data ---

const INITIAL_STAFF = [
  { id: 1, name: "Rajesh Kumar", role: "Sales Manager", department: "Sales", phone: "+91 98765 43210", email: "rajesh@example.com", status: "Active", joinDate: "12 Jan 2023", salaryType: "Monthly", baseMonthlySalary: "45000", workingDays: 26 },
  { id: 2, name: "Vikram Singh", role: "Senior Driver", department: "Fleet", phone: "+91 99887 76655", email: "vikram@example.com", status: "On Duty", joinDate: "05 Mar 2023", salaryType: "Monthly", baseMonthlySalary: "22000", workingDays: 26 },
  { id: 3, name: "Amit Bhardwaj", role: "Head Mechanic", department: "Garage", phone: "+91 91234 56789", email: "amit@example.com", status: "Leave", joinDate: "20 Jun 2024", salaryType: "Daily", dailyRate: "800" },
  { id: 4, name: "Priya Sharma", role: "Admin Executive", department: "Administration", phone: "+91 98989 89898", email: "priya@example.com", status: "Active", joinDate: "01 Feb 2024", salaryType: "Monthly", baseMonthlySalary: "30000", workingDays: 26 },
  { id: 5, name: "Suresh Raina", role: "Driver", department: "Fleet", phone: "+91 77788 99900", email: "suresh@example.com", status: "On Duty", joinDate: "15 Aug 2023", salaryType: "Per Trip", ratePerTrip: "500" },
];

const INITIAL_ROLES = [
  { id: 1, role: "Admin", access: "Full Access", description: "Complete control over all modules and settings.", staffIds: [] },
  { id: 2, role: "Sales Manager", access: "Leads, Bookings, Reports", description: "Can manage enquiries, bookings and view sales reports.", staffIds: [1] },
  { id: 3, role: "Fleet Manager", access: "Cars, Garage, Drivers", description: "Manages vehicle inventory, maintenance and drivers.", staffIds: [] },
  { id: 4, role: "Driver", access: "Trip App Only", description: "Limited access to assigned trips and basic profile.", staffIds: [5] }, // Note: Vikram is "Senior Driver" not "Driver" strictly by string, let's fix logic
  { id: 5, role: "Accountant", access: "Finance, Salary, Invoices", description: "Manages expenses, income, and staff payroll.", staffIds: [] },
  // Adding specific roles for existing staff to match string exactly or logic will be string based
  { id: 6, role: "Senior Driver", access: "Trip App Only", description: "Senior driver privileges.", staffIds: [2] },
  { id: 7, role: "Head Mechanic", access: "Garage", description: "Manage mechanics.", staffIds: [3] },
  { id: 8, role: "Admin Executive", access: "Admin", description: "Assistant.", staffIds: [4] },
];

const StaffContext = createContext();

export const useStaff = () => {
    const context = useContext(StaffContext);
    if (!context) {
        throw new Error('useStaff must be used within a StaffProvider');
    }
    return context;
};

export const StaffProvider = ({ children }) => {
    const [staffList, setStaffList] = useState(INITIAL_STAFF);
    const [rolesList, setRolesList] = useState(INITIAL_ROLES);

    // Sync Roles staffIds on mount and when staff changes (Auto-link logic)
    // The requirement says: "staffIds array in role should update automatically when staff is added"
    // We can derive this OR maintain it. Maintaining it means updating rolesList state.
    
    // Helper to calculate staff IDs for a role name
    const getStaffIdsForRole = (roleName, currentStaffList) => {
        return currentStaffList
            .filter(staff => staff.role.toLowerCase() === roleName.toLowerCase())
            .map(staff => staff.id);
    };

    // Effect to auto-sync staffIds in roles whenever staffList changes
    useEffect(() => {
        setRolesList(currentRoles => {
            return currentRoles.map(role => ({
                ...role,
                staffIds: getStaffIdsForRole(role.role, staffList)
            }));
        });
    }, [staffList]);

    const addStaff = (newStaffData) => {
        const newStaff = {
            id: Date.now(),
            ...newStaffData,
            status: newStaffData.status || "Active",
            joinDate: newStaffData.joinDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        setStaffList(prev => [newStaff, ...prev]);
        // The useEffect will handle updating the Role's staffIds
    };

    const updateStaff = (id, updatedData) => {
        setStaffList(prev => prev.map(staff => staff.id === id ? { ...staff, ...updatedData } : staff));
    };

    const deleteStaff = (id) => {
        setStaffList(prev => prev.filter(staff => staff.id !== id));
    };

    const addRole = (newRoleData) => {
        const newRole = {
            id: Date.now(),
            ...newRoleData,
            staffIds: [] // New role starts empty (or we could scan staffList for existing matches)
        };
        // Scan for existing staff that might match this new role name
        newRole.staffIds = getStaffIdsForRole(newRole.role, staffList);
        
        setRolesList(prev => [...prev, newRole]);
    };

    const updateRole = (id, updatedData) => {
        setRolesList(prev => prev.map(role => role.id === id ? { ...role, ...updatedData } : role));
    };

    const deleteRole = (id) => {
        setRolesList(prev => prev.filter(role => role.id !== id));
    };

    return (
        <StaffContext.Provider value={{
            staffList,
            rolesList,
            addStaff,
            updateStaff,
            deleteStaff,
            addRole,
            updateRole,
            deleteRole
        }}>
            {children}
        </StaffContext.Provider>
    );
};
