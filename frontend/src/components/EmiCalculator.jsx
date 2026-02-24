import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import useNavigate
import './EmiCalculator.css';

function formatCurrency(num) {
  if (!isFinite(num)) return '-';
  return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

function formatShortCurrency(num) {
  if (!isFinite(num)) return '-';
  if (num >= 10000000) return '₹' + (num / 10000000).toFixed(1) + 'Cr';
  if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + 'L';
  return '₹' + (num / 1000).toFixed(1) + 'K';
}

function calculateEmi(principal, annualRate, months) {
  const P = Number(principal);
  const r = Number(annualRate) / 12 / 100;
  const n = Number(months);
  if (P <= 0 || n <= 0) return { emi: 0, totalPayment: 0, totalInterest: 0 };
  if (r === 0) {
    const emi = P / n;
    return { emi, totalPayment: emi * n, totalInterest: emi * n - P };
  }
  const x = Math.pow(1 + r, n);
  const emi = (P * r * x) / (x - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;
  return { emi, totalPayment, totalInterest };
}

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState(200000);
  const [annualRate, setAnnualRate] = useState(9.5);
  const [tenureYears, setTenureYears] = useState(5);

  const navigate = useNavigate(); // ✅ initialize navigate

  const months = tenureYears * 12;

  const { emi, totalPayment, totalInterest } = useMemo(() =>
    calculateEmi(principal, annualRate, months),
    [principal, annualRate, months]
  );

  const schedule = useMemo(() => {
    const rows = [];
    let balance = principal;
    const monthlyRate = annualRate / 12 / 100;
    for (let i = 1; i <= Math.min(12, months); i++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      balance = Math.max(0, balance - principalPaid);
      rows.push({ month: i, interest, principalPaid, balance });
    }
    return rows;
  }, [principal, annualRate, emi, months]);

  const handleApply = () => {
    navigate("/form"); // ✅ redirect to Form page
  };

  return (
    <div className="emi-container">
      <div className="emi-calculator-wrapper">
        
        {/* Left Side - Inputs */}
        <div className="emi-inputs-section">
          <h2>Loan Details</h2>
          <p className="section-subtitle">Adjust the values to calculate your EMI</p>
         
          {/* Loan Amount */}
          <div className="input-group">
            <div className="input-label-row">
              <label>Loan Amount</label>
              <span className="input-value">{formatShortCurrency(principal)}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="1550000"
              step="10000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="slider"
            />
            <div className="range-labels">
              <span>20K</span>
              <span>15.5L</span> 
            </div>
            <input
              type="number"
              min="20000"
              max="1550000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value || 20000))}
              className="number-input"
            />
          </div>

          {/* Interest Rate */}
          <div className="input-group">
            <div className="input-label-row">
              <label>Interest Rate (p.a)</label>
              <span className="input-value">{annualRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="24"
              step="0.1"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="slider"
            />
            <div className="range-labels">
              <span>5%</span>
              <span>24%</span>
            </div>
            <input
              type="number"
              step="0.1"
              min="0"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value || 0))}
              className="number-input"
            />
          </div>

          {/* Loan Tenure */}
          <div className="input-group">
            <div className="input-label-row">
              <label>Loan Tenure (Years)</label>
              <span className="input-value">{tenureYears} years / {months} months</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="slider"
            />
            <div className="range-labels">
              <span>1 year</span>
              <span>30 years</span>
            </div>
            <input
              type="number"
              min="1"
              max="30"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value || 0))}
              className="number-input"
            />
          </div>
        </div>

        {/* Right Side - Results */}
        <div className="emi-results-section">
          <h2>Loan Breakdown</h2>
          
          <div className="emi-result-card">
            <div className="result-card-icon">📅</div>
            <div className="result-card-content">
              <div className="result-card-label">Monthly EMI</div>
              <div className="result-card-value">{formatCurrency(Math.round(emi))}</div>
              <div className="result-card-subtext">for {months} months</div>
            </div>
          </div>

          <div className="emi-result-card">
            <div className="result-card-icon">💰</div>
            <div className="result-card-content">
              <div className="result-card-label">Total Interest</div>
              <div className="result-card-value">{formatCurrency(Math.round(totalInterest))}</div>
              <div className="result-card-subtext">over loan tenure</div>
            </div>
          </div>

          <div className="emi-result-card highlight">
            <div className="result-card-icon">💳</div>
            <div className="result-card-content">
              <div className="result-card-label">Total Payment</div>
              <div className="result-card-value">{formatCurrency(Math.round(totalPayment))}</div>
              <div className="result-card-subtext">principal + interest</div>
            </div>
          </div>

          {/* ✅ Updated Apply Button */}
          <button className="apply-button" onClick={handleApply}>
            Apply for Loan
          </button>
        </div>
      </div>

      {/* Amortization Schedule */}
      <div className="emi-schedule-section">
        <h2>Payment Schedule</h2>
        <p className="section-subtitle">First 12 months of your EMI breakdown</p>
        
        <div className="schedule-table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((r) => (
                <tr key={r.month}>
                  <td className="month-cell">{r.month}</td>
                  <td className="principal-cell">{formatCurrency(Math.round(r.principalPaid))}</td>
                  <td className="interest-cell">{formatCurrency(Math.round(r.interest))}</td>
                  <td className="balance-cell">{formatCurrency(Math.round(r.balance))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
