// backend/routes/loans.cjs
const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan.cjs');

// POST /api/loans -> Save loan application
router.post('/', async (req, res) => {
  try {
    const {
      name,
      pan,
      aadhaar,
      dob,
      state,
      pincode,
      email,
      income,
      phone,
      loanAmount,
      tenure
    } = req.body;

    // ✅ Validate required fields
    if (
      !name || !pan || !aadhaar || !dob || !state ||
      !pincode || !email || !income || !phone || !loanAmount || !tenure
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ✅ Create new loan document
    const loan = new Loan({
      name,
      pan,
      aadhaar,
      dob,
      state,
      pincode,
      email,
      income,
      phone,
      loanAmount,
      tenure
    });

    await loan.save();

    // ✅ Success response
    res.status(201).json({ message: 'Loan application saved successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;