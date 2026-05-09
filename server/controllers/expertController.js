const Expert = require('../models/Expert');

// GET /experts — with pagination + filter + search
const getExperts = async (req, res, next) => {
  try {
    const { page = 1, limit = 6, category, search } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const total = await Expert.countDocuments(query);
    const experts = await Expert.find(query)
      .select('-timeSlots')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: experts,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// GET /experts/:id
const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      const err = new Error('Expert not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: expert });
  } catch (err) {
    next(err);
  }
};

module.exports = { getExperts, getExpertById };