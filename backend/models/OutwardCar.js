import mongoose from 'mongoose';

const outwardCarSchema = new mongoose.Schema(
  {
    originalOutputId: {
      type: String, // from frontend for backward compatibility or unique pseudo ids, e.g. fleet_car_out_timestamp
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: 'OUTWARD',
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

// We define an index on vendorId for faster lookups
outwardCarSchema.index({ vendorId: 1 });

const OutwardCar = mongoose.model('OutwardCar', outwardCarSchema);

export default OutwardCar;
