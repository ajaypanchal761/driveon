import mongoose from 'mongoose';

/**
 * Add-On Services Schema
 * Stores prices for optional add-on services (Driver, Bodyguard, Gunmen, Bouncer)
 */
const addOnServicesSchema = new mongoose.Schema(
  {
    driver: {
      type: Number,
      required: true,
      default: 500,
      min: [0, 'Driver price cannot be negative'],
    },
    bodyguard: {
      type: Number,
      required: true,
      default: 1000,
      min: [0, 'Bodyguard price cannot be negative'],
    },
    gunmen: {
      type: Number,
      required: true,
      default: 1500,
      min: [0, 'Gunmen price cannot be negative'],
    },
    bouncer: {
      type: Number,
      required: true,
      default: 800,
      min: [0, 'Bouncer price cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Create a singleton document (only one price configuration)
addOnServicesSchema.statics.getPrices = async function () {
  let prices = await this.findOne();
  if (!prices) {
    // Create default prices if none exist
    prices = await this.create({
      driver: 500,
      bodyguard: 1000,
      gunmen: 1500,
      bouncer: 800,
    });
  }
  return prices;
};

addOnServicesSchema.statics.updatePrices = async function (newPrices) {
  let prices = await this.findOne();
  if (!prices) {
    prices = await this.create(newPrices);
  } else {
    Object.assign(prices, newPrices);
    await prices.save();
  }
  return prices;
};

const AddOnServices = mongoose.model('AddOnServices', addOnServicesSchema);

export default AddOnServices;

