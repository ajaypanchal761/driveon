import mongoose from 'mongoose';

const outwardBookingSchema = new mongoose.Schema(
  {
    originalBookingId: {
      type: String, // e.g. fleet_booking_timestamp
      required: true,
      unique: true
    },
    carId: {
      type: String, // originalOutputId
      required: true,
    },
    carName: {
      type: String,
      required: true,
    },
    carType: {
      type: String,
    },
    carOwnerName: {
      type: String,
    },
    customerName: {
      type: String,
      required: true,
    },
    licenseImage: {
      type: String,
    },
    aadhaarImage: {
      type: String,
    },
    fromDate: {
      type: String, // ISO date string
      required: true,
    },
    toDate: {
      type: String, // ISO date string
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      default: 'Cash',
    },
    paymentStatus: {
      type: String,
      default: 'pending',
    },
    paidAmount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const OutwardBooking = mongoose.model('OutwardBooking', outwardBookingSchema);

export default OutwardBooking;
