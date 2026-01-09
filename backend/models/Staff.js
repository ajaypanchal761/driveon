import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Staff name is required'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            trim: true,
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            enum: ['Sales', 'Fleet', 'Garage', 'Administration', 'Finance'],
            default: 'Sales',
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
        },
        status: {
            type: String,
            enum: ['Active', 'On Duty', 'Leave'],
            default: 'Active',
        },
        joinDate: {
            type: Date,
            default: Date.now,
        },
        avatar: {
            type: String,
        },
        salary: {
            type: Number,
            default: 0,
        },
        salaryMethod: {
            type: String,
            enum: ['Monthly', 'Daily', 'Per Trip'],
            default: 'Monthly',
        },
        workingDays: {
            type: Number,
            default: 26,
        },
        absentDeduction: {
            type: Number,
            default: 0,
        },
        halfDayDeduction: {
            type: Number,
            default: 0,
        },
        overtimeRate: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;
