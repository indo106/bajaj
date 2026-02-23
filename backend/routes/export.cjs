const express = require("express");
const ExcelJS = require("exceljs");
const Loan = require("../models/Loan.cjs");

const router = express.Router();

// POST /api/export
router.post("/export", async (req, res) => {
  try {
    const { password, date } = req.body;

    // 🔐 password check
    if (password !== process.env.EXPORT_PASSWORD) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // 🗓️ date range (full day)
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const loans = await Loan.find({
      createdAt: { $gte: start, $lte: end }
    }).lean();

    if (loans.length === 0) {
      return res.status(404).json({ message: "No data for this date" });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Loans");

    sheet.columns = [
      { header: "Name", key: "name" },
      { header: "PAN", key: "pan" },
      { header: "Aadhaar", key: "aadhaar" },
      { header: "DOB", key: "dob" },
      { header: "State", key: "state" },
      { header: "Pincode", key: "pincode" },
      { header: "Email", key: "email" },
      { header: "Income", key: "income" },
      { header: "Phone", key: "phone" },
      { header: "Loan Amount", key: "loanAmount" },
      { header: "Tenure", key: "tenure" },
      { header: "Created At", key: "createdAt" },
    ];

    loans.forEach(l => sheet.addRow(l));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=loan-${date}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Export failed" });
  }
});

module.exports = router;
