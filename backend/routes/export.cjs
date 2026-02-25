const express = require("express");
const ExcelJS = require("exceljs");
const Loan = require("../models/Loan.cjs");
const router = express.Router();

// POST /api/export
router.post("/export", async (req, res) => {
  try {
    const { password, date } = req.body;

    // 🔐 Password check (Ensure EXPORT_PASSWORD is in your .env)
    if (password !== process.env.EXPORT_PASSWORD) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // 🗓️ Date range (Full day: 00:00:00 to 23:59:59)
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

    // ✅ Cleaned columns to match your updated schema
    sheet.columns = [
      { header: "Loan Amount", key: "loanAmount", width: 15 },
      { header: "Name", key: "name", width: 25 },
      { header: "DOB", key: "dob", width: 15 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Pincode", key: "pincode", width: 10 },
      { header: "State", key: "state", width: 20 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    // Add rows
    loans.forEach(l => {
      sheet.addRow({
        ...l,
        createdAt: l.createdAt.toLocaleString() // Format date for Excel
      });
    });

    // Formatting headers (Optional but nice)
    sheet.getRow(1).font = { bold: true };

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
    console.error("Export Error:", err);
    res.status(500).json({ message: "Export failed" });
  }
});

module.exports = router;