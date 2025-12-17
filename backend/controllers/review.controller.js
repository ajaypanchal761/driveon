/**
 * Reviews Controller
 * Minimal stub to avoid 404s and return an empty review list
 * until real review storage is implemented.
 */
export const getCarReviews = async (req, res) => {
  try {
    const { carId } = req.params;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
    const sort = req.query.sort || 'newest';

    // Placeholder empty response
    return res.json({
      success: true,
      data: {
        reviews: [],
        total: 0,
        page,
        limit,
        sort,
        carId,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching car reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch car reviews',
      error: error.message,
    });
  }
};


