// backend/models/Loan.cjs
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pan: { type: String, required: true },
  aadhaar: { type: String, required: true },
  dob: { type: Date, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  email: { type: String, required: true },
  income: { type: Number, required: true },
  phone: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  tenure: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Loan', loanSchema);
