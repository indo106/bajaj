import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Form.css";

export default function Form() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillLoan = location.state?.loanAmount || "";

  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    pan: "",
    aadhaar: "",
    dob: "",
    state: "",
    pincode: "",
    email: "",
    mobile: "",
    income: "",
    loanAmount: prefillLoan,
    tenure: "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Please enter full name";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(formData.pan)) newErrors.pan = "Enter valid PAN (ABCDE1234F)";
    if (!/^\d{12}$/.test(formData.aadhaar)) newErrors.aadhaar = "Enter valid 12-digit Aadhaar";

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

    if (!formData.state.trim()) newErrors.state = "Please enter state";
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter valid 6-digit pincode";
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) newErrors.email = "Only Gmail allowed";
    if (!/^(\+91)[6-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = "Mobile must start with +91";
    if (!formData.income || Number(formData.income) < 15000) newErrors.income = "Income must be ₹15,000+";
    if (!formData.loanAmount || Number(formData.loanAmount) < 20000 || Number(formData.loanAmount) > 1550000)
      newErrors.loanAmount = "Loan ₹20k - ₹15.5L only";
    if (!formData.tenure || Number(formData.tenure) <= 0 || Number(formData.tenure) > 20) newErrors.tenure = "Tenure 1-20 years";

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setStatus("Submitting...");

    const payload = {
      name: formData.fullName,
      pan: formData.pan,
      aadhaar: formData.aadhaar,
      dob: formData.dob,
      state: formData.state,
      pincode: formData.pincode,
      email: formData.email,
      income: formData.income,
      phone: formData.mobile,
      loanAmount: formData.loanAmount,
      tenure: formData.tenure,
    };

    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowPopup(true);
        setFormData({
          fullName: "", pan: "", aadhaar: "", dob: "", state: "",
          pincode: "", email: "", mobile: "", income: "",
          loanAmount: prefillLoan, tenure: "",
        });
        setStatus("");
      } else {
        setStatus("Failed to submit form");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error");
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
          <h2>Loan Application</h2>
          <p>Fill in the details to get your loan approved fast.</p>
        </div>

        <form className="loan-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-container">
              <label>Full Name</label>
              <input type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} className={errors.fullName ? "invalid" : ""} />
              {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
            </div>

            <div className="input-container">
              <label>PAN Number</label>
              <input type="text" name="pan" placeholder="ABCDE1234F" value={formData.pan} onChange={handleChange} className={errors.pan ? "invalid" : ""} />
              {errors.pan && <span className="error-msg">{errors.pan}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="input-container">
              <label>Aadhaar Number</label>
              <input type="text" name="aadhaar" placeholder="12-digit number" value={formData.aadhaar} onChange={handleChange} className={errors.aadhaar ? "invalid" : ""} />
              {errors.aadhaar && <span className="error-msg">{errors.aadhaar}</span>}
            </div>

            <div className="input-container">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={errors.dob ? "invalid" : ""} />
              {errors.dob && <span className="error-msg">{errors.dob}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="input-container">
              <label>State</label>
              <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className={errors.state ? "invalid" : ""} />
              {errors.state && <span className="error-msg">{errors.state}</span>}
            </div>

            <div className="input-container">
              <label>Pincode</label>
              <input type="text" name="pincode" placeholder="6-digit" value={formData.pincode} onChange={handleChange} className={errors.pincode ? "invalid" : ""} />
              {errors.pincode && <span className="error-msg">{errors.pincode}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="input-container">
              <label>Gmail Address</label>
              <input type="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} className={errors.email ? "invalid" : ""} />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="input-container">
              <label>Mobile Number</label>
              <input type="text" name="mobile" placeholder="+91XXXXXXXXXX" value={formData.mobile} onChange={handleChange} className={errors.mobile ? "invalid" : ""} />
              {errors.mobile && <span className="error-msg">{errors.mobile}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="input-container">
              <label>Monthly Income</label>
              <input type="number" name="income" placeholder="Min ₹15,000" value={formData.income} onChange={handleChange} className={errors.income ? "invalid" : ""} />
              {errors.income && <span className="error-msg">{errors.income}</span>}
            </div>

            <div className="input-container">
              <label>Required Loan Amount</label>
              <input type="number" name="loanAmount" placeholder="₹20,000 - ₹15.5L" value={formData.loanAmount} onChange={handleChange} className={errors.loanAmount ? "invalid" : ""} />
              {errors.loanAmount && <span className="error-msg">{errors.loanAmount}</span>}
            </div>
          </div>

          <div className="form-row single">
            <div className="input-container">
              <label>Tenure (Years)</label>
              <input type="number" name="tenure" placeholder="1 to 20" value={formData.tenure} onChange={handleChange} className={errors.tenure ? "invalid" : ""} />
              {errors.tenure && <span className="error-msg">{errors.tenure}</span>}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={!isValid}>
            Submit Application
          </button>
        </form>

        {status && <p className={`status-msg ${status.includes("❌") ? "error" : "success"}`}>{status}</p>}

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <div className="success-icon">✓</div>
              <h3>Form Submitted</h3>
              <p>Your application is under review.<br />We will contact you within 24 hours.</p>
              <button onClick={handlePopupOk}>Back to Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}