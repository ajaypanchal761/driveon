import AddOnServices from '../models/AddOnServices.js';

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

