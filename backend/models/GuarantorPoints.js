import mongoose from 'mongoose';

/**
 * Guarantor Points Schema
 * Tracks points allocated to guarantors for each booking
 * Points = 10% of booking amount, divided equally among all guarantors
 */
const guarantorPointsSchema = new mongoose.Schema(
  {
    // Booking reference
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking is required'],
      index: true,
    },

    // Guarantor user who received points
    guarantor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Guarantor is required'],
      index: true,
    },

    // Guarantor request reference
    guarantorRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GuarantorRequest',
      required: true,
      index: true,
    },

    // Booking amount (at time of points allocation)
    bookingAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Total guarantor pool (10% of booking amount)
    totalPoolAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Number of guarantors at time of allocation
    totalGuarantors: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Points allocated to this specific guarantor
    pointsAllocated: {
      type: Number,
      required: true,
      min: 0,
    },

    // Points status
    status: {
      type: String,
      enum: ['active', 'reversed', 'cancelled'],
      default: 'active',
      index: true,
    },

    // Reversal details (if points were reversed)
    reversedAt: {
      type: Date,
    },
    reversalReason: {
      type: String,
      trim: true,
    },

    // Booking status at time of allocation
    bookingStatusAtAllocation: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
guarantorPointsSchema.index({ guarantor: 1, status: 1 });
guarantorPointsSchema.index({ booking: 1, status: 1 });

guarantorPointsSchema.index({ createdAt: -1 });

// Prevent duplicate points for same booking and guarantor
guarantorPointsSchema.index({ booking: 1, guarantor: 1, status: 1 }, { unique: true, sparse: true });

const GuarantorPoints = mongoose.model('GuarantorPoints', guarantorPointsSchema);

export default GuarantorPoints;

