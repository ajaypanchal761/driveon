import AddOnServices from '../models/AddOnServices.js';
import CustomAddOnService from '../models/CustomAddOnService.js';

/**
 * @desc    Get add-on services prices (Public)
 * @route   GET /api/addon-services/prices
 * @access  Public
 */
export const getAddOnServicesPrices = async (req, res) => {
  try {
    const prices = await AddOnServices.getPrices();
    
    res.json({
      success: true,
      data: {
        driver: prices.driver,
        bodyguard: prices.bodyguard,
        gunmen: prices.gunmen,
        bouncer: prices.bouncer,
      },
    });
  } catch (error) {
    console.error('Error fetching add-on services prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch add-on services prices',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get add-on services prices (Admin)
 * @route   GET /api/admin/addon-services/prices
 * @access  Private (Admin)
 */
export const getAdminAddOnServicesPrices = async (req, res) => {
  try {
    const prices = await AddOnServices.getPrices();
    
    res.json({
      success: true,
      data: {
        driver: prices.driver,
        bodyguard: prices.bodyguard,
        gunmen: prices.gunmen,
        bouncer: prices.bouncer,
      },
    });
  } catch (error) {
    console.error('Error fetching add-on services prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch add-on services prices',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update add-on services prices (Admin)
 * @route   PUT /api/admin/addon-services/prices
 * @access  Private (Admin)
 */
export const updateAddOnServicesPrices = async (req, res) => {
  try {
    const { driver, bodyguard, gunmen, bouncer } = req.body;

    // Validate prices
    const prices = {};
    if (driver !== undefined) {
      if (typeof driver !== 'number' || driver < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid driver price',
        });
      }
      prices.driver = driver;
    }

    if (bodyguard !== undefined) {
      if (typeof bodyguard !== 'number' || bodyguard < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bodyguard price',
        });
      }
      prices.bodyguard = bodyguard;
    }

    if (gunmen !== undefined) {
      if (typeof gunmen !== 'number' || gunmen < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid gunmen price',
        });
      }
      prices.gunmen = gunmen;
    }

    if (bouncer !== undefined) {
      if (typeof bouncer !== 'number' || bouncer < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bouncer price',
        });
      }
      prices.bouncer = bouncer;
    }

    if (Object.keys(prices).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No prices provided to update',
      });
    }

    const updatedPrices = await AddOnServices.updatePrices(prices);

    res.json({
      success: true,
      message: 'Add-on services prices updated successfully',
      data: {
        driver: updatedPrices.driver,
        bodyguard: updatedPrices.bodyguard,
        gunmen: updatedPrices.gunmen,
        bouncer: updatedPrices.bouncer,
      },
    });
  } catch (error) {
    console.error('Error updating add-on services prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update add-on services prices',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};



// ============ Custom Add-On Services CRUD ============

/**
 * @desc    Get all custom add-on services
 * @route   GET /api/admin/addon-services/custom
 * @access  Public
 */
export const getCustomAddOnServices = async (req, res) => {
  try {
    const services = await CustomAddOnService.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { services } });
  } catch (error) {
    console.error('Error fetching custom services:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
};

/**
 * @desc    Create custom add-on service
 * @route   POST /api/admin/addon-services/custom
 * @access  Private (Admin)
 */
export const createCustomAddOnService = async (req, res) => {
  try {
    const { name, phone, email, address, pricePerUnit } = req.body;

    if (!name || !phone || !email || !pricePerUnit) {
      return res.status(400).json({ success: false, message: 'Name, Phone, Email and Price are required' });
    }

    if (phone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Phone must be 10 digits' });
    }

    const service = await CustomAddOnService.create({ name, phone, email, address, pricePerUnit });
    res.status(201).json({ success: true, data: { service } });
  } catch (error) {
    console.error('Error creating custom service:', error);
    res.status(500).json({ success: false, message: 'Failed to create service' });
  }
};

/**
 * @desc    Update custom add-on service
 * @route   PUT /api/admin/addon-services/custom/:id
 * @access  Private (Admin)
 */
export const updateCustomAddOnService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await CustomAddOnService.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: { service } });
  } catch (error) {
    console.error('Error updating custom service:', error);
    res.status(500).json({ success: false, message: 'Failed to update service' });
  }
};

/**
 * @desc    Delete custom add-on service
 * @route   DELETE /api/admin/addon-services/custom/:id
 * @access  Private (Admin)
 */
export const deleteCustomAddOnService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await CustomAddOnService.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting custom service:', error);
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
};
