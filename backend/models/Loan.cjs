// backend/models/Loan.cjs
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  loanAmount: { type: Number, required: true },
  name: { type: String, required: true },
  dob: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loan', loanSchema);