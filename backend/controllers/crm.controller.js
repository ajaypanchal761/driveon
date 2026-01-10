import mongoose from 'mongoose';
import Enquiry from '../models/Enquiry.js';
import Car from '../models/Car.js';
import Admin from '../models/Admin.js';
import CRMTask from '../models/CRMTask.js';
import Booking from '../models/Booking.js';
import Staff from '../models/Staff.js';
import CRMRole from '../models/CRMRole.js';
import Attendance from '../models/Attendance.js';
import Salary from '../models/Salary.js';
import AdvanceLoan from '../models/AdvanceLoan.js';
import PerformanceReview from '../models/PerformanceReview.js';
import StaffWorkTask from '../models/StaffWorkTask.js';
import CarDocument from '../models/CarDocument.js';
import AccidentCase from '../models/AccidentCase.js';
import Garage from '../models/Garage.js';
import CarExpense from '../models/CarExpense.js';
import RepairJob from '../models/RepairJob.js';
import InventoryItem from '../models/InventoryItem.js';
import Vendor from '../models/Vendor.js';
import VendorTransaction from '../models/VendorTransaction.js';
import VendorHistory from '../models/VendorHistory.js';
import Transaction from '../models/Transaction.js';
import Invoice from '../models/Invoice.js';
import ExpenseCategory from '../models/ExpenseCategory.js';
import City from '../models/City.js';
import { uploadImage } from '../services/cloudinary.service.js';
import razorpayService from '../services/razorpay.service.js';

/**
 * @desc    Get All Enquiries (with filters)
 * @route   GET /api/crm/enquiries
 * @access  Admin
 */
export const getEnquiries = async (req, res) => {
    try {
        const { status, search, startDate, endDate } = req.query;
        let query = {};

        if (status && status !== 'Status: All' && status !== 'Show: All') {
            query.status = status;
        }

        if (search) {
            // Find car IDs that match the search brand or model
            const Car = mongoose.model('Car');
            const matchingCars = await Car.find({
                $or: [
                    { brand: { $regex: search, $options: 'i' } },
                    { model: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            const carIds = matchingCars.map(car => car._id);

            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { carInterested: { $in: carIds } }
            ];

            // Only add regex on carInterested if search is a valid string for regex
            // This handles legacy string entries like "Alto 800 C2"
            try {
                query.$or.push({ carInterested: { $regex: search, $options: 'i' } });
            } catch (e) {
                // Ignore if regex fails
            }
        }

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        let enquiries = await Enquiry.find(query)
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        // Safe manual population for carInterested (handles mixture of ObjectIds and Strings)
        const carIdsToFetch = enquiries
            .filter(enq => enq.carInterested && mongoose.Types.ObjectId.isValid(enq.carInterested))
            .map(enq => enq.carInterested);

        if (carIdsToFetch.length > 0) {
            const cars = await mongoose.model('Car').find({ _id: { $in: carIdsToFetch } }).select('brand model').lean();
            const carMap = cars.reduce((acc, car) => {
                acc[car._id.toString()] = car;
                return acc;
            }, {});

            enquiries = enquiries.map(enq => {
                if (enq.carInterested && mongoose.Types.ObjectId.isValid(enq.carInterested)) {
                    const carData = carMap[enq.carInterested.toString()];
                    if (carData) {
                        enq.carInterested = carData;
                    }
                }
                return enq;
            });
        }

        res.status(200).json({
            success: true,
            count: enquiries.length,
            data: { enquiries }
        });
    } catch (error) {
        console.error('Get enquiries error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching enquiries',
            error: error.message
        });
    }
};

/**
 * @desc    Create New Enquiry
 * @route   POST /api/crm/enquiries
 * @access  Admin
 */
export const createEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.create(req.body);

        res.status(201).json({
            success: true,
            data: { enquiry }
        });
    } catch (error) {
        console.error('Create enquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating enquiry',
            error: error.message
        });
    }
};

/**
 * @desc    Update Enquiry
 * @route   PUT /api/crm/enquiries/:id
 * @access  Admin
 */
export const updateEnquiry = async (req, res) => {
    try {
        let enquiry = await Enquiry.findById(req.params.id);

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: 'Enquiry not found'
            });
        }

        enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: { enquiry }
        });
    } catch (error) {
        console.error('Update enquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating enquiry',
            error: error.message
        });
    }
};

/**
 * @desc    Get Single Enquiry Details
 * @route   GET /api/crm/enquiries/:id
 * @access  Admin
 */
export const getEnquiryDetails = async (req, res) => {
    try {
        let enquiry = await Enquiry.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .lean();

        if (enquiry && enquiry.carInterested && mongoose.Types.ObjectId.isValid(enquiry.carInterested)) {
            const carData = await mongoose.model('Car').findById(enquiry.carInterested).select('brand model year registrationNumber color carType').lean();
            if (carData) {
                enquiry.carInterested = carData;
            }
        }

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: 'Enquiry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { enquiry }
        });
    } catch (error) {
        console.error('Get enquiry details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching enquiry details',
            error: error.message
        });
    }
};

/**
 * @desc    Get All Cars (Simple list for Dropdowns)
 * @route   GET /api/crm/cars-simple
 * @access  Admin
 */
export const getAllCarsSimple = async (req, res) => {
    try {
        const cars = await Car.find().select('brand model registrationNumber').sort({ brand: 1 });
        const formatted = cars.map(car => ({
            value: car._id,
            label: `${car.brand} ${car.model} (${car.registrationNumber})`
        }));
        res.status(200).json({ success: true, data: { cars: formatted } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get All CRM Tasks
 * @route   GET /api/crm/tasks
 * @access  Admin
 */
export const getTasks = async (req, res) => {
    try {
        const { date, status } = req.query;
        let query = {};

        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.dueDate = { $gte: start, $lte: end };
        }

        if (status) {
            query.status = status;
        }

        const tasks = await CRMTask.find(query)
            .populate('enquiryId', 'name phone carInterested')
            .populate('assignedTo', 'name')
            .sort({ dueDate: 1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: { tasks }
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching tasks',
            error: error.message
        });
    }
};

/**
 * @desc    Create New Task/Follow-up
 * @route   POST /api/crm/tasks
 * @access  Admin
 */
export const createTask = async (req, res) => {
    try {
        const task = await CRMTask.create(req.body);

        res.status(201).json({
            success: true,
            data: { task }
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating task',
            error: error.message
        });
    }
};

/**
 * @desc    Update Task
 * @route   PUT /api/crm/tasks/:id
 * @access  Admin
 */
export const updateTask = async (req, res) => {
    try {
        let task = await CRMTask.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        task = await CRMTask.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: { task }
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating task',
            error: error.message
        });
    }
};

/**
 * @desc    Get Active Bookings for CRM Dashboard
 * @route   GET /api/crm/bookings/active
 * @access  Admin
 */
export const getActiveBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'active' })
            .populate('user', 'name phone')
            .populate('car', 'brand model registrationNumber images')
            .sort({ 'tripEnd.date': 1 });

        const formatted = bookings.map(b => ({
            id: b._id,
            vehicle: `${b.car.brand} ${b.car.model}`,
            vehicleImage: b.car.images.find(img => img.isPrimary)?.url || b.car.images[0]?.url,
            regNumber: b.car.registrationNumber,
            customer: b.user.name,
            phone: b.user.phone,
            dateRange: `${new Date(b.tripStart.date).toLocaleDateString()} - ${new Date(b.tripEnd.date).toLocaleDateString()}`,
            status: 'Ongoing',
            amount: b.pricing.finalPrice
        }));

        res.status(200).json({
            success: true,
            data: { bookings: formatted }
        });
    } catch (error) {
        console.error('Get active bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching active bookings',
            error: error.message
        });
    }
};

/**
 * @desc    Get Upcoming Bookings for CRM
 * @route   GET /api/crm/bookings/upcoming
 * @access  Admin
 */
export const getUpcomingBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            status: { $in: ['confirmed', 'pending'] },
            'tripStart.date': { $gte: new Date() }
        })
            .populate('user', 'name phone')
            .populate('car', 'brand model registrationNumber images')
            .sort({ 'tripStart.date': 1 });

        const formatted = bookings.map(b => {
            const now = new Date();
            const start = new Date(b.tripStart.date);
            const diffMs = start - now;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            let startsIn = '';
            if (diffDays > 0) startsIn = `${diffDays} Days`;
            else if (diffHours > 0) startsIn = `${diffHours} Hours`;
            else startsIn = 'Soon';

            return {
                id: b._id,
                vehicle: `${b.car.brand} ${b.car.model}`,
                vehicleImage: b.car.images.find(img => img.isPrimary)?.url || b.car.images[0]?.url,
                regNumber: b.car.registrationNumber,
                customer: b.user.name,
                phone: b.user.phone,
                dateRange: `${new Date(b.tripStart.date).toLocaleDateString()} - ${new Date(b.tripEnd.date).toLocaleDateString()}`,
                status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
                startsIn: startsIn,
                amount: b.pricing.finalPrice
            };
        });

        res.status(200).json({
            success: true,
            data: { bookings: formatted }
        });
    } catch (error) {
        console.error('Get upcoming bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching upcoming bookings',
            error: error.message
        });
    }
};

/**
 * @desc    Get CRM Dashboard Analytics
 * @route   GET /api/crm/analytics
 * @access  Admin
 */
export const getCRMAnalytics = async (req, res) => {
    try {
        const totalEnquiries = await Enquiry.countDocuments();
        const convertedCount = await Enquiry.countDocuments({ status: 'Converted' });
        const lostCount = await Enquiry.countDocuments({ status: 'Closed' });

        const conversionRate = totalEnquiries > 0 ? (convertedCount / totalEnquiries) * 100 : 0;

        // Source Distribution
        const sourceData = await Enquiry.aggregate([
            { $group: { _id: "$source", value: { $sum: 1 } } },
            { $project: { name: "$_id", value: 1, _id: 0 } }
        ]);

        // Vehicle Interest
        const vehicleInterest = await Enquiry.aggregate([
            { $group: { _id: "$carInterested", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $addFields: {
                    carObjId: {
                        $convert: {
                            input: "$_id",
                            to: "objectId",
                            onError: null,
                            onNull: null
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'cars',
                    localField: 'carObjId',
                    foreignField: '_id',
                    as: 'carDetails'
                }
            },
            {
                $project: {
                    name: {
                        $cond: {
                            if: { $gt: [{ $size: "$carDetails" }, 0] },
                            then: {
                                $concat: [
                                    { $arrayElemAt: ["$carDetails.brand", 0] },
                                    " ",
                                    { $arrayElemAt: ["$carDetails.model", 0] }
                                ]
                            },
                            else: "$_id"
                        }
                    },
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // Growth Trend (Weekly for last 4 weeks)
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        const growthTrend = await Enquiry.aggregate([
            { $match: { createdAt: { $gte: fourWeeksAgo } } },
            {
                $group: {
                    _id: {
                        week: { $floor: { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 604800000] } }
                    },
                    enquiries: { $sum: 1 },
                    conversions: {
                        $sum: { $cond: [{ $eq: ["$status", "Converted"] }, 1, 0] }
                    }
                }
            },
            { $sort: { "_id.week": -1 } },
            {
                $project: {
                    week: { $concat: ["Week ", { $toString: { $subtract: [4, "$_id.week"] } }] },
                    enquiries: 1,
                    conversions: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalEnquiries,
                convertedCount,
                lostCount,
                conversionRate: conversionRate.toFixed(2),
                sourceData,
                vehicleInterest,
                growthTrend
            }
        });
    } catch (error) {
        console.error('Get CRM analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching CRM analytics',
            error: error.message
        });
    }
};

/**
 * @desc    Get All Staff
 * @route   GET /api/crm/staff
 * @access  Admin
 */
export const getStaff = async (req, res) => {
    try {
        const { search, department } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } }
            ];
        }

        if (department && department !== 'All') {
            query.department = department;
        }

        const staff = await Staff.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: staff.length,
            data: { staff }
        });
    } catch (error) {
        console.error('Get staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching staff',
            error: error.message
        });
    }
};

/**
 * @desc    Create Staff
 * @route   POST /api/crm/staff
 * @access  Admin
 */
export const createStaff = async (req, res) => {
    try {
        let staffData = { ...req.body };

        // Handle Avatar Upload if file is present
        if (req.file) {
            const uploadResult = await uploadImage(req.file, { folder: 'crm/staff' });
            staffData.avatar = uploadResult.secure_url;
        }

        // Generate employeeId if not present (Simple generation: STF- + last 4 digits of timestamp + random)
        if (!staffData.employeeId) {
            staffData.employeeId = `STF-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 100)}`;
        }

        const staff = await Staff.create(staffData);
        res.status(201).json({
            success: true,
            data: { staff }
        });
    } catch (error) {
        console.error('Create staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating staff',
            error: error.message
        });
    }
};

/**
 * @desc    Update Staff
 * @route   PUT /api/crm/staff/:id
 * @access  Admin
 */
export const updateStaff = async (req, res) => {
    try {
        let staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff not found' });
        }

        const updateData = { ...req.body };

        // Handle Avatar Upload if file is present
        if (req.file) {
            const uploadResult = await uploadImage(req.file, { folder: 'crm/staff' });
            staff.avatar = uploadResult.secure_url;
        }

        // Update fields
        Object.keys(updateData).forEach((key) => {
            // Skip password if it's empty string (from frontend placeholder)
            if (key === 'password') {
                if (updateData[key] && updateData[key].trim() !== '') {
                    staff[key] = updateData[key];
                }
            } else if (key !== '_id' && key !== 'employeeId' && key !== 'createdAt' && key !== 'updatedAt') {
                // Prevent updating immutable fields
                staff[key] = updateData[key];
            }
        });

        await staff.save();

        res.status(200).json({
            success: true,
            data: { staff }
        });
    } catch (error) {
        console.error('Update staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating staff',
            error: error.message
        });
    }
};

/**
 * @desc    Delete Staff
 * @route   DELETE /api/crm/staff/:id
 * @access  Admin
 */
export const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);

        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Staff deleted successfully'
        });
    } catch (error) {
        console.error('Delete staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting staff',
            error: error.message
        });
    }
};

/**
 * @desc    Get All Roles
 * @route   GET /api/crm/roles
 * @access  Admin
 */
export const getRoles = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) {
            query.category = category;
        }
        const roles = await CRMRole.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: roles.length,
            data: { roles }
        });
    } catch (error) {
        console.error('Get roles error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching roles',
            error: error.message
        });
    }
};

/**
 * @desc    Create Role
 * @route   POST /api/crm/roles
 * @access  Admin
 */
export const createRole = async (req, res) => {
    try {
        const role = await CRMRole.create(req.body);
        res.status(201).json({
            success: true,
            data: { role }
        });
    } catch (error) {
        console.error('Create role error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating role',
            error: error.message
        });
    }
};

/**
 * @desc    Update Role
 * @route   PUT /api/crm/roles/:id
 * @access  Admin
 */
export const updateRole = async (req, res) => {
    try {
        const role = await CRMRole.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        res.status(200).json({
            success: true,
            data: { role }
        });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating role',
            error: error.message
        });
    }
};

/**
 * @desc    Delete Role
 * @route   DELETE /api/crm/roles/:id
 * @access  Admin
 */
export const deleteRole = async (req, res) => {
    try {
        const role = await CRMRole.findByIdAndDelete(req.params.id);

        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Role deleted successfully'
        });
    } catch (error) {
        console.error('Delete role error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting role',
            error: error.message
        });
    }
};

/**
 * @desc    Get Attendance Records
 * @route   GET /api/crm/attendance
 * @access  Admin
 */
export const getAttendance = async (req, res) => {
    try {
        const { date, staffId } = req.query;
        let query = {};

        if (date) {
            const searchDate = new Date(date);
            searchDate.setHours(0, 0, 0, 0);
            query.date = searchDate;
        }

        if (staffId) {
            query.staff = staffId;
        }

        const records = await Attendance.find(query)
            .populate('staff', 'name role department')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: records.length,
            data: { records }
        });
    } catch (error) {
        console.error('Get attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching attendance',
            error: error.message
        });
    }
};

/**
 * @desc    Mark Attendance
 * @route   POST /api/crm/attendance
 * @access  Admin
 */
export const markAttendance = async (req, res) => {
    try {
        const { staffId, date, status, inTime, outTime, workHours } = req.body;

        const searchDate = new Date(date || Date.now());
        searchDate.setHours(0, 0, 0, 0);

        let attendance = await Attendance.findOneAndUpdate(
            { staff: staffId, date: searchDate },
            {
                status,
                inTime,
                outTime,
                workHours
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            data: { attendance }
        });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error marking attendance',
            error: error.message
        });
    }
};

/**
 * @desc    Get Team Presence Summary
 * @route   GET /api/crm/team-presence
 * @access  Admin/Staff
 */
export const getTeamPresence = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Total Staff (Active) - excluding Resigned if applicable, but for now counting all as per schema defaults
        const totalStaff = await Staff.countDocuments({ status: { $ne: 'Resigned' } });

        // 2. Present Today (Present or Late)
        const presentCount = await Attendance.countDocuments({
            date: today,
            status: { $in: ['Present', 'Late'] }
        });

        // 3. On Leave (Status is 'Leave')
        // Note: Staff status might be 'Leave' regardless of daily attendance check, or we check if there is an attendance logic for leave.
        // For accurate daily checking: typically if someone is on leave, there might be an attendance record with status 'Absent' or specific 'Leave'.
        // However, given the schema has Staff status 'Leave', we'll rely on that for "On Leave" count.
        const leaveCount = await Staff.countDocuments({ status: 'Leave' });

        // 4. Absent (Total - Present - Leave)
        // This logic assumes everyone else is absent.
        const absentCount = Math.max(0, totalStaff - presentCount - leaveCount);

        // 5. Get some avatars of present staff for the UI (limit 5)
        const presentAttendances = await Attendance.find({
            date: today,
            status: { $in: ['Present', 'Late'] }
        }).select('staff').limit(5);

        const presentStaffDetails = await Staff.find({
            _id: { $in: presentAttendances.map(a => a.staff) }
        }).select('employeeId name avatar status'); // Selecting minimal fields

        // Map to format suitable for UI (U1, U2 etc from employeeId or create short code)
        const presentStaffMapped = presentStaffDetails.map(s => ({
            id: s._id,
            shortName: s.employeeId || s.name.substring(0, 2).toUpperCase(),
            name: s.name,
            avatar: s.avatar
        }));

        res.status(200).json({
            success: true,
            data: {
                total: totalStaff,
                present: presentCount,
                absent: absentCount,
                leave: leaveCount,
                activeStaff: presentStaffMapped
            }
        });

    } catch (error) {
        console.error('Get team presence error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching team presence',
            error: error.message
        });
    }
};

/**
 * @desc    Get Payroll Records
 * @route   GET /api/crm/payroll
 * @access  Admin
 */
export const getPayroll = async (req, res) => {
    try {
        const { month, staffId } = req.query;
        let query = {};

        if (month) {
            query.month = month;
        }

        if (staffId) {
            query.staff = staffId;
        }

        const payroll = await Salary.find(query)
            .populate('staff', 'name role department baseSalary')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payroll.length,
            data: { payroll }
        });
    } catch (error) {
        console.error('Get payroll error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching payroll',
            error: error.message
        });
    }
};

/**
 * @desc    Create Payroll Record
 * @route   POST /api/crm/payroll
 * @access  Admin
 */
export const createPayroll = async (req, res) => {
    try {
        const { staff, month, baseSalary, deductions, netPay, status, advanceAmount } = req.body;

        const salary = await Salary.create({
            staff,
            month,
            baseSalary,
            deductions: deductions || 0,
            netPay,
            status: status || 'Pending',
            advanceAmount: advanceAmount || 0,
            paidDate: status === 'Paid' ? new Date() : undefined
        });

        res.status(201).json({
            success: true,
            data: { salary }
        });
    } catch (error) {
        console.error('Create payroll error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating payroll',
            error: error.message
        });
    }
};

/**
 * @desc    Update Salary Status / Process Payment
 * @route   PUT /api/crm/payroll/:id
 * @access  Admin
 */
export const updatePayrollStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const updateData = { status };
        if (status === 'Paid') {
            updateData.paidDate = new Date();
        }

        const salary = await Salary.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!salary) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        res.status(200).json({
            success: true,
            data: { salary }
        });
    } catch (error) {
        console.error('Update payroll error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating payroll',
            error: error.message
        });
    }
};

/**
 * @desc    Get All Advances & Loans
 * @route   GET /api/crm/advances
 * @access  Admin
 */
export const getAdvances = async (req, res) => {
    try {
        const { status, staffId } = req.query;
        let query = {};
        if (status) query.status = status;
        if (staffId) query.staff = staffId;

        const advances = await AdvanceLoan.find(query)
            .populate('staff', 'name role department')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: advances.length,
            data: { advances }
        });
    } catch (error) {
        console.error('Get advances error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching advances',
            error: error.message
        });
    }
};

/**
 * @desc    Create New Advance
 * @route   POST /api/crm/advances
 * @access  Admin
 */
export const createAdvance = async (req, res) => {
    try {
        const advance = await AdvanceLoan.create(req.body);
        res.status(201).json({
            success: true,
            data: { advance }
        });
    } catch (error) {
        console.error('Create advance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating advance',
            error: error.message
        });
    }
};

/**
 * @desc    Add Repayment to Advance
 * @route   POST /api/crm/advances/:id/repay
 * @access  Admin
 */
export const addRepayment = async (req, res) => {
    try {
        const { amount, note } = req.body;
        const advance = await AdvanceLoan.findById(req.params.id);

        if (!advance) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        advance.repaidAmount += Number(amount);
        advance.repayments.push({ amount, note, date: new Date() });

        if (advance.repaidAmount >= advance.totalAmount) {
            advance.status = 'Closed';
        }

        await advance.save();

        res.status(200).json({
            success: true,
            data: { advance }
        });
    } catch (error) {
        console.error('Add repayment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error adding repayment',
            error: error.message
        });
    }
};

/**
 * @desc    Get Performance Reviews
 * @route   GET /api/crm/performance
 * @access  Admin
 */
export const getPerformanceReviews = async (req, res) => {
    try {
        const { staffId, year } = req.query;
        let query = {};
        if (staffId) query.staff = staffId;
        if (year) {
            const start = new Date(`${year}-01-01`);
            const end = new Date(`${year}-12-31`);
            query.reviewDate = { $gte: start, $lte: end };
        }

        const reviews = await PerformanceReview.find(query)
            .populate('staff', 'name role department')
            .sort({ reviewDate: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: { reviews }
        });
    } catch (error) {
        console.error('Get performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching performance reviews',
            error: error.message
        });
    }
};

/**
 * @desc    Create Performance Review
 * @route   POST /api/crm/performance
 * @access  Admin
 */
export const createPerformanceReview = async (req, res) => {
    try {
        const review = await PerformanceReview.create(req.body);
        res.status(201).json({
            success: true,
            data: { review }
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating performance review',
            error: error.message
        });
    }
};

/**
 * @desc    Get Staff Work Tasks
 * @route   GET /api/crm/staff-tasks
 * @access  Admin
 */
export const getStaffWorkTasks = async (req, res) => {
    try {
        const { assignedTo, status } = req.query;
        let query = {};
        if (assignedTo) query.assignedTo = assignedTo;
        if (status) query.status = status;

        const tasks = await StaffWorkTask.find(query)
            .populate('assignedTo', 'name role department')
            .sort({ dueDate: 1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: { tasks }
        });
    } catch (error) {
        console.error('Get staff tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching staff tasks',
            error: error.message
        });
    }
};

/**
 * @desc    Create Staff Work Task
 * @route   POST /api/crm/staff-tasks
 * @access  Admin
 */
export const createStaffWorkTask = async (req, res) => {
    try {
        const task = await StaffWorkTask.create(req.body);
        res.status(201).json({
            success: true,
            data: { task }
        });
    } catch (error) {
        console.error('Create staff task error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating staff task',
            error: error.message
        });
    }
};

/**
 * @desc    Update Staff Work Task Status
 * @route   PUT /api/crm/staff-tasks/:id
 * @access  Admin
 */
export const updateStaffWorkTask = async (req, res) => {
    try {
        const task = await StaffWorkTask.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({
            success: true,
            data: { task }
        });
    } catch (error) {
        console.error('Update staff task error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating staff task',
            error: error.message
        });
    }
};

/**
 * @desc    Get All Car Documents
 * @route   GET /api/crm/car-documents
 * @access  Admin
 */
export const getCarDocuments = async (req, res) => {
    try {
        const { carId, type, status } = req.query;
        let query = {};
        if (carId) query.car = carId;
        if (type && type !== 'All') query.type = type;
        if (status && status !== 'All') query.status = status;

        const docs = await CarDocument.find(query)
            .populate('car', 'brand model registrationNumber')
            .sort({ expiryDate: 1 });

        res.status(200).json({
            success: true,
            count: docs.length,
            data: { docs }
        });
    } catch (error) {
        console.error('Get docs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching documents',
            error: error.message
        });
    }
};

/**
 * @desc    Upload Car Document
 * @route   POST /api/crm/car-documents
 * @access  Admin
 */
export const uploadCarDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const { car, docName, type, expiryDate } = req.body;

        const uploadResult = await uploadImage(req.file, {
            folder: 'crm/car-docs',
            resource_type: 'auto' // Important for PDFs/Docs
        });

        const carDoc = await CarDocument.create({
            car,
            docName,
            type,
            expiryDate,
            documentUrl: uploadResult.secure_url,
            cloudinaryPublicId: uploadResult.public_id,
            status: new Date(expiryDate) < new Date() ? 'Expired' : 'Valid'
        });

        res.status(201).json({
            success: true,
            data: { carDoc }
        });
    } catch (error) {
        console.error('Upload doc error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error uploading document',
            error: error.message
        });
    }
};

/**
 * @desc    Create Fast Booking
 * @route   POST /api/crm/fast-booking
 * @access  Admin
 */
export const createFastBooking = async (req, res) => {
    try {
        const { carId, userId, startDate, endDate, startTime, endTime } = req.body;

        // Fetch car details to get pricing
        const car = await mongoose.model('Car').findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }

        // Calculate days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        const basePrice = car.pricing?.perDay || 0;
        const totalPrice = basePrice * diffDays;

        const booking = await Booking.create({
            user: userId, // Assuming user exists (Walk-in user ID)
            car: carId,
            tripStart: {
                location: 'Main Office',
                date: startDate,
                time: startTime || '10:00 AM'
            },
            tripEnd: {
                location: 'Main Office',
                date: endDate,
                time: endTime || '10:00 AM'
            },
            totalDays: diffDays,
            pricing: {
                basePrice: basePrice,
                totalPrice: totalPrice,
                finalPrice: totalPrice
            },
            paymentOption: 'full',
            paymentStatus: 'pending',
            status: 'confirmed',
            tripStatus: 'not_started'
        });

        res.status(201).json({
            success: true,
            data: { booking }
        });
    } catch (error) {
        console.error('Fast booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating fast booking',
            error: error.message
        });
    }
};

/**
 * @desc    Report New Accident
 * @route   POST /api/crm/accidents
 * @access  Admin
 */
export const reportAccident = async (req, res) => {
    try {
        let evidence = [];

        // Handle Multiple Evidence Uploads
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => uploadImage(file, { folder: 'crm/accidents' }));
            const results = await Promise.all(uploadPromises);
            evidence = results.map(res => ({
                url: res.secure_url,
                publicId: res.public_id
            }));
        }

        const accidentData = {
            ...req.body,
            evidence
        };

        const accident = await AccidentCase.create(accidentData);

        res.status(201).json({
            success: true,
            data: { accident }
        });
    } catch (error) {
        console.error('Report accident error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error reporting accident',
            error: error.message
        });
    }
};

/**
 * @desc    Get All Accident Cases
 * @route   GET /api/crm/accidents
 * @access  Admin
 */
export const getAccidentCases = async (req, res) => {
    try {
        const { status, carId, severity } = req.query;
        let query = {};

        if (status) query.status = status;
        if (carId) query.car = carId;
        if (severity && severity !== 'All') query.severity = severity;

        const cases = await AccidentCase.find(query)
            .populate('car', 'brand model registrationNumber')
            .sort({ incidentDate: -1 });

        res.status(200).json({
            success: true,
            count: cases.length,
            data: { cases }
        });
    } catch (error) {
        console.error('Get accidents error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching accident cases',
            error: error.message
        });
    }
};

/**
 * @desc    Update/Settle Accident Case
 * @route   PUT /api/crm/accidents/:id
 * @access  Admin
 */
export const updateAccidentCase = async (req, res) => {
    try {
        const { status, finalCost, recoveredAmount } = req.body;

        let updateData = { ...req.body };

        if (status === 'Settled' || status === 'Full Recovery') {
            updateData.settledAt = new Date();
        }

        const accident = await AccidentCase.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!accident) {
            return res.status(404).json({ success: false, message: 'Case not found' });
        }

        res.status(200).json({
            success: true,
            data: { accident }
        });
    } catch (error) {
        console.error('Update accident error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating accident case',
            error: error.message
        });
    }
};

/**
 * @desc    Get Accident Loss & Recovery Summary
 * @route   GET /api/crm/reports/accident-summary
 * @access  Admin
 */
export const getAccidentSummary = async (req, res) => {
    try {
        const stats = await AccidentCase.aggregate([
            {
                $group: {
                    _id: null,
                    totalLoss: { $sum: "$finalCost" },
                    recoveredAmount: { $sum: "$recoveredAmount" }
                }
            }
        ]);

        const result = stats[0] || { totalLoss: 0, recoveredAmount: 0 };
        const unrecoveredLoss = result.totalLoss - result.recoveredAmount;

        // Top Loss Vehicles
        const topLossVehicles = await AccidentCase.aggregate([
            {
                $group: {
                    _id: "$car",
                    totalLoss: { $sum: "$finalCost" }
                }
            },
            { $sort: { totalLoss: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "cars",
                    localField: "_id",
                    foreignField: "_id",
                    as: "carDetails"
                }
            },
            { $unwind: "$carDetails" }
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalLoss: result.totalLoss,
                    recoveredAmount: result.recoveredAmount,
                    unrecoveredLoss: unrecoveredLoss,
                    recoveryPercentage: result.totalLoss > 0 ? (result.recoveredAmount / result.totalLoss * 100).toFixed(1) : 0
                },
                topLossVehicles
            }
        });
    } catch (error) {
        console.error('Accident summary error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get Active Bookings (CRM View)
 * @route   GET /api/crm/bookings/active-details
 * @access  Admin
 */
export const getActiveBookingsDetails = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'active' })
            .populate('car', 'brand model registrationNumber images')
            .populate('user', 'name phone')
            .sort({ 'tripEnd.date': 1 });

        res.status(200).json({
            success: true,
            data: { bookings }
        });
    } catch (error) {
        console.error('Active bookings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get Payment Collection Status
 * @route   GET /api/crm/finance/payments
 * @access  Admin
 */
export const getPaymentStatus = async (req, res) => {
    try {
        const payments = await Booking.find()
            .select('bookingId user pricing paidAmount paymentStatus createdAt')
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { payments }
        });
    } catch (error) {
        console.error('Payment status error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get Profitability Analysis per Vehicle
 * @route   GET /api/crm/reports/profitability
 * @access  Admin
 */
export const getProfitabilityAnalysis = async (req, res) => {
    try {
        // 1. Get Revenue per Car from Bookings
        const revenueData = await Booking.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: "$car",
                    totalRevenue: { $sum: "$pricing.finalPrice" }
                }
            }
        ]);

        // 2. Get Expenses per Car (Fuel, Maintenance, etc.)
        const expenseData = await CarExpense.aggregate([
            {
                $group: {
                    _id: { car: "$car", type: "$type" },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Merge logic would go here depending on how frontend wants the shape
        // For simplicity, returning raw aggregated data
        res.status(200).json({
            success: true,
            data: { revenueData, expenseData }
        });
    } catch (error) {
        console.error('Profitability error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Garage Management (CRUD)
 */
export const getGarages = async (req, res) => {
    try {
        const garages = await Garage.find().sort({ name: 1 });
        res.json({ success: true, data: { garages } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createGarage = async (req, res) => {
    try {
        let garageData = { ...req.body };
        if (req.file) {
            const uploadResult = await uploadImage(req.file, { folder: 'crm/garages' });
            garageData.logo = uploadResult.secure_url;
        }
        const garage = await Garage.create(garageData);
        res.status(201).json({ success: true, data: { garage } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateGarage = async (req, res) => {
    try {
        const garage = await Garage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: { garage } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteGarage = async (req, res) => {
    try {
        await Garage.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Garage deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Repair Jobs Management
 */
export const getActiveRepairs = async (req, res) => {
    try {
        const repairs = await RepairJob.find({ status: { $nin: ['Completed', 'Cancelled'] } })
            .populate('car', 'brand model registrationNumber')
            .populate('garage', 'name')
            .sort({ updatedAt: -1 });
        res.json({ success: true, data: { repairs } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getRepairLogs = async (req, res) => {
    try {
        const logs = await RepairJob.find({ status: 'Completed' })
            .populate('car', 'brand model registrationNumber')
            .populate('garage', 'name')
            .sort({ completedAt: -1 });
        res.json({ success: true, data: { logs } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createRepairJob = async (req, res) => {
    try {
        const repair = await RepairJob.create(req.body);
        res.status(201).json({ success: true, data: { repair } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteRepairJob = async (req, res) => {
    try {
        await RepairJob.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Repair job deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateRepairJob = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // Handle completion logic if status is changed to Completed
        if (updateData.status === 'Completed') {
            updateData.completedAt = new Date();
            updateData.progress = 100;
        }

        const repair = await RepairJob.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate('car', 'brand model registrationNumber')
            .populate('garage', 'name');

        res.json({ success: true, data: { repair } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Inventory Management
 */
export const getInventory = async (req, res) => {
    try {
        const items = await InventoryItem.find().sort({ category: 1, name: 1 });
        res.json({ success: true, data: { items } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createInventoryItem = async (req, res) => {
    try {
        const item = await InventoryItem.create(req.body);
        res.status(201).json({ success: true, data: { item } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createCarExpense = async (req, res) => {
    try {
        const expense = await CarExpense.create(req.body);
        res.status(201).json({ success: true, data: { expense } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Vendor Management
 */
export const onboardVendor = async (req, res) => {
    try {
        let vendorData = { ...req.body };
        if (req.file) {
            const uploadResult = await uploadImage(req.file, { folder: 'crm/vendors' });
            vendorData.profileImage = uploadResult.secure_url;
        }
        const vendor = await Vendor.create(vendorData);

        // Log history
        await VendorHistory.create({
            vendor: vendor._id,
            action: 'Partnered',
            detail: `Joined as ${vendor.type}`,
            status: 'Verified'
        });

        res.status(201).json({ success: true, data: { vendor } });
    } catch (error) {
        console.error('Onboard vendor error:', error);
        res.status(500).json({ success: false, message: 'Server error onboarding vendor' });
    }
};

export const getVendorDirectory = async (req, res) => {
    try {
        const vendors = await Vendor.find().sort({ createdAt: -1 });
        res.json({ success: true, count: vendors.length, data: { vendors } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateVendor = async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (req.file) {
            const uploadResult = await uploadImage(req.file, { folder: 'crm/vendors' });
            updateData.profileImage = uploadResult.secure_url;
        }

        const vendor = await Vendor.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ success: true, data: { vendor } });
    } catch (error) {
        console.error('Update vendor error:', error);
        res.status(500).json({ success: false, message: 'Server error updating vendor' });
    }
};

export const deleteVendor = async (req, res) => {
    try {
        await Vendor.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Vendor deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error deleting vendor' });
    }
};

export const getVendorSettlements = async (req, res) => {
    try {
        const transactions = await VendorTransaction.find()
            .populate('vendor', 'name isVerified')
            .sort({ date: -1 });

        // Calculate stats
        const stats = await VendorTransaction.aggregate([
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const summary = {
            payouts: stats.find(s => s._id === 'Payout')?.total || 0,
            commissions: stats.find(s => s._id === 'Commission')?.total || 0,
            paidThisMonth: 0 // Logic for current month
        };

        res.json({ success: true, data: { transactions, summary } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getVendorHistory = async (req, res) => {
    try {
        const history = await VendorHistory.find()
            .populate('vendor', 'name')
            .sort({ date: -1 });
        res.json({ success: true, data: { history } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getFleetUtilization = async (req, res) => {
    try {
        // Logic to calculate utilization per vendor-owned car
        // This would involve looking up bookings per car
        const cars = await Car.find({ ownerType: 'Vendor' }).populate('owner', 'name');

        // Mocking structure for now
        const report = cars.map(car => ({
            vendor: car.owner?.name,
            vehicle: `${car.brand} ${car.model}`,
            plates: car.registrationNumber,
            trips: 0,
            revenue: 0,
            utilization: 0
        }));

        res.json({ success: true, data: { report } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get Financial Overview (Income Overview Screen)
 * @route   GET /api/crm/finance/income-overview
 */
export const getIncomeOverview = async (req, res) => {
    try {
        const totalRevenue = await Transaction.aggregate([
            { $match: { type: 'Cash In' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const activeRentals = await Booking.countDocuments({ status: 'active' });

        // Weekly Revenue Trend (Last 7 days)
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const weeklyTrend = await Transaction.aggregate([
            { $match: { type: 'Cash In', date: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dayOfWeek: "$date" },
                    revenue: { $sum: "$amount" }
                }
            }
        ]);

        // Revenue Sources Breakdown
        const sources = await Transaction.aggregate([
            { $match: { type: 'Cash In' } },
            { $group: { _id: "$category", value: { $sum: "$amount" } } }
        ]);

        res.json({
            success: true,
            data: {
                totalRevenue: totalRevenue[0]?.total || 0,
                activeRentals,
                avgDailyIncome: (totalRevenue[0]?.total || 0) / 30, // simplified
                weeklyTrend,
                sources
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get Expense Tracking Data
 * @route   GET /api/crm/finance/expenses
 */
export const getExpenseTracking = async (req, res) => {
    try {
        const stats = await Transaction.aggregate([
            { $match: { type: 'Cash Out' } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } }
        ]);

        const totalExpenses = stats.reduce((acc, curr) => acc + curr.total, 0);

        res.json({
            success: true,
            data: {
                totalExpenses,
                breakdown: stats,
                fuelCost: stats.find(s => s._id === 'Fuel')?.total || 0,
                maintenance: stats.find(s => s._id === 'Maintenance')?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get Pending Payments (Receivables & Payables)
 * @route   GET /api/crm/finance/pending-payments
 */
export const getPendingPayments = async (req, res) => {
    try {
        const pending = await Invoice.find({ status: 'Pending' }).sort({ dueDate: 1 });
        res.json({ success: true, data: { pending } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const settleInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, { status: 'Settled' }, { new: true });

        // When settled, create a Transaction record
        await Transaction.create({
            type: invoice.type === 'Receivable' ? 'Cash In' : 'Cash Out',
            category: 'Other', // Or link to invoice category
            amount: invoice.amount,
            paymentMethod: 'UPI', // Default for now
            description: `Settlement: ${invoice.title}`,
            referenceId: invoice.referenceId
        });

        res.json({ success: true, data: { invoice } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get Profit & Loss Data
 * @route   GET /api/crm/finance/pl-overview
 */
export const getPLOverview = async (req, res) => {
    try {
        const monthlyData = await Transaction.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$date" }, year: { $year: "$date" } },
                    revenue: { $sum: { $cond: [{ $eq: ["$type", "Cash In"] }, "$amount", 0] } },
                    expenses: { $sum: { $cond: [{ $eq: ["$type", "Cash Out"] }, "$amount", 0] } }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.json({ success: true, data: { monthlyData } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get Cash Flow Trend & Transactions
 * @route   GET /api/crm/finance/cash-flow
 */
export const getCashFlow = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 }).limit(20);

        const summary = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    balance: {
                        $sum: { $cond: [{ $eq: ["$type", "Cash In"] }, "$amount", { $subtract: [0, "$amount"] }] }
                    },
                    netCashFlow: {
                        $sum: { $cond: [{ $eq: ["$type", "Cash In"] }, "$amount", { $subtract: [0, "$amount"] }] } // Simplified logic
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                transactions,
                currentBalance: summary[0]?.balance || 0,
                netCashFlow: summary[0]?.netCashFlow || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get Daily Operations Report
 * @route   GET /api/crm/reports/daily-operations
 */
export const getDailyOperationsReport = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalBookings = await Booking.countDocuments({ createdAt: { $gte: today } });

        const revenueToday = await Transaction.aggregate([
            { $match: { type: 'Cash In', date: { $gte: today } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const cancellations = await Booking.countDocuments({ status: 'cancelled', updatedAt: { $gte: today } });

        // Hourly Performance (08:00 to 20:00)
        const hourlyPerformance = await Booking.aggregate([
            { $match: { createdAt: { $gte: today } } },
            {
                $group: {
                    _id: { $hour: "$createdAt" },
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalBookings,
                revenueToday: revenueToday[0]?.total || 0,
                avgTripTime: "4.5 Hrs", // Mocked as specifically requested structure
                cancellations,
                hourlyPerformance
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get Monthly Performance Report
 * @route   GET /api/crm/reports/monthly-performance
 */
export const getMonthlyPerformance = async (req, res) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Weekly Breakdown (Revenue vs Expenses)
        const weeklyBreakdown = await Transaction.aggregate([
            { $match: { date: { $gte: startOfMonth } } },
            {
                $group: {
                    _id: {
                        week: { $floor: { $divide: [{ $subtract: ["$date", startOfMonth] }, 604800000] } },
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Revenue Distribution by Service Type
        // Assuming categories in Transaction like 'Rental', 'Chauffeur', 'Subscription'
        const distribution = await Transaction.aggregate([
            { $match: { type: 'Cash In', date: { $gte: startOfMonth } } },
            { $group: { _id: "$category", value: { $sum: "$amount" } } }
        ]);

        res.json({
            success: true,
            data: {
                weeklyBreakdown,
                distribution
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get Annual Year Report
 * @route   GET /api/crm/reports/annual-review
 */
export const getAnnualReport = async (req, res) => {
    try {
        const startOfYear = new Date();
        startOfYear.setMonth(0, 1);
        startOfYear.setHours(0, 0, 0, 0);

        const yearlyData = await Transaction.aggregate([
            { $match: { date: { $gte: startOfYear } } },
            {
                $group: {
                    _id: { month: { $month: "$date" } },
                    revenue: { $sum: { $cond: [{ $eq: ["$type", "Cash In"] }, "$amount", 0] } },
                    expenses: { $sum: { $cond: [{ $eq: ["$type", "Cash Out"] }, "$amount", 0] } }
                }
            },
            { $sort: { "_id.month": 1 } }
        ]);

        res.json({ success: true, data: { yearlyData } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Expense Category Management
 */
export const getExpenseCategories = async (req, res) => {
    try {
        const categories = await ExpenseCategory.find();

        // Populate transaction counts for each category
        const categoriesWithStats = await Promise.all(categories.map(async (cat) => {
            const count = await Transaction.countDocuments({ category: cat.name });
            return {
                ...cat._doc,
                transactionCount: count
            };
        }));

        res.json({ success: true, data: { categories: categoriesWithStats } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createExpenseCategory = async (req, res) => {
    try {
        const category = await ExpenseCategory.create(req.body);
        res.status(201).json({ success: true, data: { category } });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteExpenseCategory = async (req, res) => {
    try {
        await ExpenseCategory.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    City & Location Management
 */
export const getCities = async (req, res) => {
    try {
        const cities = await City.find().sort({ createdAt: -1 });
        res.json({ success: true, count: cities.length, data: { cities } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createCity = async (req, res) => {
    try {
        const city = await City.create(req.body);
        res.status(201).json({ success: true, data: { city } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateCity = async (req, res) => {
    try {
        const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: { city } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteCity = async (req, res) => {
    try {
        await City.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'City deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Smart Command Center - Dashboard Alerts
 * @route   GET /api/crm/dashboard/alerts
 */
export const getDashboardAlerts = async (req, res) => {
    try {
        // Salary Pending
        const salaryPending = await Salary.countDocuments({ status: 'Pending' });

        // Insurance Expiring (within 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const insuranceExpiring = await CarDocument.countDocuments({
            type: 'Insurance',
            expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
        });

        // Active Accidents
        const activeAccidents = await AccidentCase.countDocuments({ status: 'Active' });

        // Cars Idle > 5 Days
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        const idleCars = await Car.countDocuments({
            status: 'Available',
            lastBookingDate: { $lte: fiveDaysAgo }
        });

        // Garage Bills Pending
        const garageBillsPending = await CarExpense.countDocuments({
            category: 'Repair',
            paymentStatus: 'Pending'
        });

        // Vendor Payments Due
        const vendorPaymentsDue = await VendorTransaction.countDocuments({
            type: 'Payout',
            status: 'Processing'
        });

        res.json({
            success: true,
            data: {
                alerts: [
                    {
                        title: 'Salary Pending',
                        description: 'Staff members awaiting payment',
                        count: salaryPending,
                        type: 'warning',
                        action: 'payroll'
                    },
                    {
                        title: 'Insurance Expiring',
                        description: 'Renew before 5th Jan',
                        count: insuranceExpiring,
                        type: 'warning',
                        action: 'documents'
                    },
                    {
                        title: 'Active Accidents',
                        description: '2 cases in recovery tracking',
                        count: activeAccidents,
                        type: 'error',
                        action: 'accidents'
                    },
                    {
                        title: 'Car Idle > 5 Days',
                        description: 'Assign them to new bookings',
                        count: idleCars,
                        type: 'info',
                        action: 'cars'
                    },
                    {
                        title: 'Garage Bill Pending',
                        description: 'Check Active Repairs',
                        count: garageBillsPending,
                        type: 'warning',
                        action: 'garage'
                    },
                    {
                        title: 'Vendor Payment Due',
                        description: `Rs. 15,000 pending for Garage A`,
                        count: vendorPaymentsDue,
                        type: 'error',
                        action: 'vendors'
                    }
                ]
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get Staff Monthly Payroll Details
 * @route   GET /api/crm/staff/:id/payroll
 * @access  Admin
 */
export const getStaffPayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const { month, year } = req.query;

        // Default to current month/year if not provided
        const now = new Date();
        const targetMonth = month !== undefined ? parseInt(month) : now.getMonth();
        const targetYear = year ? parseInt(year) : now.getFullYear();

        const staff = await Staff.findById(id);
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff not found' });
        }

        const baseSalary = staff.salary || 0;

        // Calculate total days in the month
        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

        // Calculations
        // Per Day Salary (Base / Total Days) - Do not round
        const perDaySalary = daysInMonth > 0 ? (baseSalary / daysInMonth) : 0;

        // Half Day Salary (Per Day / 2) - Do not round
        const halfDaySalary = perDaySalary / 2;

        // Fetch Attendance Records
        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

        const records = await Attendance.find({
            staff: id,
            date: { $gte: startDate, $lte: endDate }
        });

        // Compute days from records
        let presentCount = 0;
        let halfDayCount = 0;
        let absentCount = 0;
        let extraWorkAmount = 0;
        let totalExtraMinutes = 0;

        // Helper to parse "Xh Ym"
        const parseWorkHours = (str) => {
            if (!str) return 0;
            const match = str.match(/(\d+)h\s*(\d+)m/);
            if (!match) {
                // Try just hours if format differs
                const hoursMatch = str.match(/(\d+)h/);
                if (hoursMatch) return parseInt(hoursMatch[1]) * 60;
                return 0;
            }
            return (parseInt(match[1]) * 60) + parseInt(match[2]);
        };

        const recordsMap = {};
        records.forEach(r => {
            const day = new Date(r.date).getDate();
            recordsMap[day] = r;
        });

        for (let day = 1; day <= daysInMonth; day++) {
            const record = recordsMap[day];

            if (record) {
                const durationMinutes = parseWorkHours(record.workHours);
                let status = record.status;

                // Dynamic Status Calculation based on user request rules
                // "Working hours hamesha 9 hours fix rahenge"
                // Logic suggestion:
                // > 9 hours -> Overtime
                // < 4.5 hours -> Half Day (Assumption based on standard practice)
                // Else -> Present

                // Only override status if duration is available. If manual status 'Absent', keep it.
                if (status !== 'Absent' && durationMinutes > 0) {
                    if (durationMinutes > 540) { // > 9 hours
                        status = 'Present'; // Count as Present
                        const extraMinutes = durationMinutes - 540;
                        totalExtraMinutes += extraMinutes;

                        // Overtime Rate: (Per Day Salary / 9 hours / 60 minutes) per minute
                        const perMinuteRate = (perDaySalary / 9) / 60;
                        extraWorkAmount += (extraMinutes * perMinuteRate);

                    } else if (durationMinutes < 270) { // < 4.5 hours
                        status = 'Half Day';
                    } else {
                        status = 'Present';
                    }
                }

                if (status === 'Present' || status === 'Late') {
                    presentCount++;
                } else if (status === 'Half Day') {
                    halfDayCount++;
                } else {
                    absentCount++;
                }
            } else {
                // Key assumption: No record = Absent
                // (Unless future date? But payroll usually viewed for past/current)
                // For current month, future days are effectively "Absent" until worked, or ignored?
                // User requirement: "Month ke Total Days" -> implies we assume full month calculation.
                // If distinct logic needed for "Future days", user didn't specify.
                // "Month change karte hi salary... auto-update".
                // We will count them as absent to show potential deduction, OR
                // maybe only count up to today?
                // "Net Payable" usually implies "to date" or "projected".
                // "Estimated Salary aur Net Salary Final calculated... hongi"
                // I will count all non-records as Absent for the month view to show "If you don't show up, this is the deduction".
                // Effectively "Projected Salary assuming absent for rest of month" vs "Earned so far".
                // BUT "Base Salary - Absent" implies starting full and deducting.
                // So treating future days as Absent reduces Net Pay.
                // Is this desired?
                // Maybe check if day > Today?
                // User said "Estimated Salary same hogi jo Net Payable Salary hai".
                // Usually Estimated = Projected (assuming Present for future).
                // Net Payable = Earned (Absent for future).
                // User wants them SAME.
                // This implies strict calculation based on RECORDS.
                // If I am on Day 1, and Day 2-31 are absent, my salary is 1/31 of Base.
                // This is correct for "Net Payable".
                // So I will count all missing records as Absent.
                absentCount++;
            }
        }

        const absentDeduction = absentCount * perDaySalary;
        const halfDayDeduction = halfDayCount * halfDaySalary;

        const netPayable = baseSalary - absentDeduction - halfDayDeduction + extraWorkAmount;

        res.status(200).json({
            success: true,
            data: {
                baseSalary,
                daysInMonth,
                presentDays: presentCount,
                halfDays: halfDayCount,
                absentDays: absentCount,
                perDaySalary,
                halfDaySalary,
                absentDeduction,
                halfDayDeduction,
                extraWorkAmount,
                netPayable,
                month: targetMonth,
                year: targetYear,
                totalExtraMinutes // Debugging/Info
            }
        });
    } catch (error) {
        console.error('Get Staff Payroll Error:', error);
        res.status(500).json({ success: false, message: 'Server error calculating payroll' });
    }
};

/**
 * @desc    Create Razorpay Order for Staff Salary
 * @route   POST /api/crm/staff/salary/create-order
 * @access  Admin
 */
export const createSalaryPaymentOrder = async (req, res) => {
    try {
        const { amount, staffId, month, year, description } = req.body;

        if (!amount || !staffId) {
            return res.status(400).json({ success: false, message: 'Amount and Staff ID are required' });
        }

        // Generate transaction ID
        const transactionId = razorpayService.generateTransactionId('SAL');

        // Create Razorpay order
        const order = await razorpayService.createOrder({
            amount: parseFloat(amount),
            receipt: `sal_${staffId.slice(-4)}_${Date.now()}`,
            notes: {
                staff_id: staffId,
                month: month,
                year: year,
                transaction_id: transactionId,
                payment_type: 'staff_salary',
                description: description || 'Staff Salary Payment'
            }
        });

        res.status(200).json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                transactionId,
                key: process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (error) {
        console.error('Create Salary Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
};

/**
 * @desc    Verify Salary Payment
 * @route   POST /api/crm/staff/salary/verify
 * @access  Admin
 */
export const verifySalaryPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            staffId,
            amount,
            month,
            year,
            baseSalary,
            deductions
        } = req.body;

        // Verify signature
        const isValid = razorpayService.verifySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

        // Format month string, e.g., "January 2024"
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        // Handle month as number (0-11) or string
        let monthName = month;
        if (!isNaN(month) && parseInt(month) >= 0 && parseInt(month) <= 11) {
            monthName = monthNames[parseInt(month)];
        }
        const monthString = `${monthName} ${year}`;

        // Create or Update Salary Record
        // Check if record exists
        let payroll = await Salary.findOne({ staff: staffId, month: monthString });

        const transactionData = {
            transactionId: req.body.transaction_id || razorpayService.generateTransactionId('SAL'),
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amount: amount,
            status: 'success',
            paymentMethod: 'razorpay',
            paymentDate: new Date()
        };

        if (payroll) {
            payroll.status = 'Paid';
            payroll.paidDate = new Date();
            payroll.netPay = amount;
            // Push new transaction
            payroll.transactions.push(transactionData);
            await payroll.save();
        } else {
            payroll = await Salary.create({
                staff: staffId,
                month: monthString,
                baseSalary: baseSalary || amount,
                deductions: deductions || 0,
                netPay: amount,
                status: 'Paid',
                paidDate: new Date(),
                transactions: [transactionData]
            });
        }

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully and payroll recorded',
            data: payroll
        });

    } catch (error) {
        console.error('Verify Salary Payment Error:', error);
        res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
};
