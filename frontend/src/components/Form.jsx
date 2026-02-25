import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Form.css";
import logo from '/src/assets/logo.png';

export default function Form() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillLoan = location.state?.loanAmount || "";

  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    loanAmount: prefillLoan, // Moved to top
    fullName: "",
    dob: "",
    state: "",
    pincode: "",
    mobile: "+91",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (!value.startsWith("+91")) {
        setFormData((prev) => ({ ...prev, mobile: "+91" }));
        return;
      }
      const numberPart = value.slice(3);
      if (/^\d*$/.test(numberPart) && numberPart.length <= 10) {
        setFormData((prev) => ({ ...prev, mobile: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const newErrors = {};

    // 1. Loan Amount Validation
    if (!formData.loanAmount || Number(formData.loanAmount) < 20000 || Number(formData.loanAmount) > 1550000) {
      newErrors.loanAmount = "Loan ₹20k - ₹15.5L only";
    }

    // 2. Name Validation
    if (!formData.fullName.trim()) newErrors.fullName = "Please enter full name";

    // 3. DOB Validation (18+)
    if (!formData.dob) {
      newErrors.dob = "Please select date of birth";
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
      if (age < 18) newErrors.dob = "You must be 18+ years";
    }

    // 4. Location & Contact
    if (!formData.state.trim()) newErrors.state = "Please enter state";
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter valid 6-digit pincode";
    if (!/^(\+91)[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter valid 10-digit number";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setStatus("Submitting...");

    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowPopup(true);
        setFormData({
          loanAmount: prefillLoan,
          fullName: "", dob: "", state: "",
          pincode: "", mobile: "+91",
        });
        setStatus("");
      } else {
        setStatus("❌ Submission failed");
      }
    } catch (err) {
      setStatus("❌ Server error");
    }
  };

  const handlePopupOk = () => {
    setShowPopup(false);
    navigate("/");
  };

  return (
    <div className="page-container">
      <div className="form-wrapper">
        <div className="form-header">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <h2>Loan Application</h2>
          <p>Complete your details to proceed.</p>
        </div>

        <form className="loan-form" onSubmit={handleSubmit}>
          
          {/* Section: Loan Amount First */}
          <div className="form-row single">
            <div className="input-container">
              <label>Required Loan Amount</label>
              <input 
                type="number" 
                name="loanAmount" 
                placeholder="₹20,000 - ₹15.5L" 
                value={formData.loanAmount} 
                onChange={handleChange} 
                className={errors.loanAmount ? "invalid" : ""} 
              />
              {errors.loanAmount && <span className="error-msg">{errors.loanAmount}</span>}
            </div>
          </div>

          <hr className="form-divider" />

          {/* Section: Personal Details */}
          <div className="form-row">
            <div className="input-container">
              <label>Full Name</label>
              <input type="text" name="fullName" placeholder="Enter name" value={formData.fullName} onChange={handleChange} className={errors.fullName ? "invalid" : ""} />
              {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
            </div>
            <div className="input-container">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={errors.dob ? "invalid" : ""} />
              {errors.dob && <span className="error-msg">{errors.dob}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="input-container">
              <label>Mobile Number</label>
              <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className={errors.mobile ? "invalid" : ""} />
              {errors.mobile && <span className="error-msg">{errors.mobile}</span>}
            </div>
            <div className="input-container">
              <label>Pincode</label>
              <input type="text" name="pincode" placeholder="6-digit" value={formData.pincode} onChange={handleChange} className={errors.pincode ? "invalid" : ""} />
              {errors.pincode && <span className="error-msg">{errors.pincode}</span>}
            </div>
          </div>

          <div className="form-row single">
            <div className="input-container">
              <label>State</label>
              <input type="text" name="state" placeholder="Your State" value={formData.state} onChange={handleChange} className={errors.state ? "invalid" : ""} />
              {errors.state && <span className="error-msg">{errors.state}</span>}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={!isValid}>
            Apply for Loan
          </button>
        </form>

        {status && <p className={`status-msg ${status.includes("❌") ? "error" : "success"}`}>{status}</p>}

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <div className="success-icon">✓</div>
              <h3>Request Sent</h3>
              <p>We have received your application for ₹{formData.loanAmount || prefillLoan}.</p>
              <button onClick={handlePopupOk}>Return Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}