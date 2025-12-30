import mongoose from 'mongoose';

const vendorTransactionSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        referenceId: {
            type: String,
            unique: true,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ['Payout', 'Commission'],
            required: true,
        },
        status: {
            type: String,
            enum: ['Completed', 'Processing', 'Failed'],
            default: 'Processing',
        },
        remarks: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const VendorTransaction = mongoose.model('VendorTransaction', vendorTransactionSchema);

export default VendorTransaction;
