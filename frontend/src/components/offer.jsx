import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./offer.css";

const LoanSelector = () => {
  const MIN_AMOUNT = 20000;
  const MAX_AMOUNT = 1550000;

  const [inputValue, setInputValue] = useState("20000"); 
  const [loanAmount, setLoanAmount] = useState(20000);   

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    let rawValue = e.target.value.replace(/[^0-9]/g, "");

    if (rawValue !== "") {
      let numericValue = parseInt(rawValue, 10);
      if (numericValue > MAX_AMOUNT) numericValue = MAX_AMOUNT;
      rawValue = numericValue.toString();
    }

    setInputValue(rawValue);
    setLoanAmount(parseInt(rawValue || "0", 10));
  };

  const isValidAmount = loanAmount >= MIN_AMOUNT && loanAmount <= MAX_AMOUNT;

  const handleApply = () => {
    if (isValidAmount) {
      // ✅ Send loanAmount via state
      navigate("/form", { state: { loanAmount } }); 
    }
  };

  return (
    <div className="loan-container">
      <h2 className="loan-title">Select Your Loan Amount</h2>

      <div className="loan-input-section">
        <label className="loan-label">Loan Amount</label>
        <input
          type="text"
          value={`Rs. ${parseInt(inputValue || "0", 10).toLocaleString("en-IN")}`}
          onChange={handleChange}
          className="loan-input"
        />
        <p className="loan-subtext">
          Enter an amount between <strong>Rs. 20,000</strong> and <strong>Rs. 15,50,000</strong>
        </p>
        <p className="loan-subtext-small">
          *This amount is indicative. Final loan may vary based on eligibility and documents.
        </p>
      </div>

      <button
        className={`loan-button ${isValidAmount ? "active" : "disabled"}`}
        disabled={!isValidAmount}
        onClick={handleApply}
      >
        APPLY NOW
      </button>
    </div>
  );
};

export default LoanSelector;
