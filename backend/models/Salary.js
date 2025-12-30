import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema(
    {
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true,
        },
        month: {
            type: String, // e.g., "December 2025"
            required: true,
        },
        baseSalary: {
            type: Number,
            required: true,
        },
        deductions: {
            type: Number,
            default: 0,
        },
        netPay: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Paid', 'Pending', 'Processing'],
            default: 'Pending',
        },
        paidDate: {
            type: Date,
        },
        advanceAmount: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

const Salary = mongoose.model('Salary', salarySchema);

export default Salary;
