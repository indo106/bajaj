// backend/routes/loans.cjs
const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan.cjs');

// POST /api/loans -> Save loan application
router.post('/', async (req, res) => {
  try {
    const {
      loanAmount,
      fullName,
      dob,
      mobile,
      pincode,
      state
    } = req.body;

    // ✅ Validate only the required fields remaining
    if (
      !loanAmount || !fullName || !dob || !mobile || !pincode || !state
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ✅ Create new loan document with cleaned data
    const loan = new Loan({
      loanAmount,
      name: fullName, // Mapping fullName from frontend to name in DB
      dob,
      phone: mobile,  // Mapping mobile from frontend to phone in DB
      pincode,
      state
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