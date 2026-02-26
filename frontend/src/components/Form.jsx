import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient"; 
import "./Form.css";
import logo from '/src/assets/logo.png';

export default function Form() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillLoan = location.state?.loanAmount || "";

  const [showPopup, setShowPopup] = useState(false);
  const [submittedAmount, setSubmittedAmount] = useState(""); // Popup ke liye alag state
  const [formData, setFormData] = useState({
    loanAmount: prefillLoan,
    fullName: "",
    state: "",
    pincode: "",
    mobile: "+91",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fullName") {
      if (!/^[a-zA-Z\s]*$/.test(value)) return;
    }

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
    if (!formData.loanAmount || Number(formData.loanAmount) < 20000 || Number(formData.loanAmount) > 1550000) {
      newErrors.loanAmount = "Loan ₹20k - ₹15.5L only";
    }
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter full name";
    } else if (!nameRegex.test(formData.fullName)) {
      newErrors.fullName = "Only alphabets allowed";
    }
    if (!formData.state.trim()) newErrors.state = "Please enter state";
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter valid 6-digit pincode";
    if (!/^(\+91)[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter valid 10-digit number";
    }
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  // --- FIXED HANDLESUBMIT WITH RETRY LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setStatus("Connecting...");
    setSubmittedAmount(formData.loanAmount); // Amount ko save karlo pehle hi

    const submitWithRetry = async (retryCount = 0) => {
      try {
        const { error } = await supabase
          .from('loans')
          .insert([{ 
              loan_amount: Number(formData.loanAmount), 
              full_name: formData.fullName, 
              mobile: formData.mobile, 
              pincode: formData.pincode, 
              state: formData.state 
          }]);

        if (error) throw error;

        // SUCCESS
        setStatus("");
        setShowPopup(true);
        
        // Form Reset
        setFormData({
          loanAmount: prefillLoan,
          fullName: "", 
          state: "",
          pincode: "", 
          mobile: "+91",
        });

      } catch (err) {
        if (retryCount < 1) { // 1 baar apne aap retry karega
          console.log("Retrying connection...");
          setStatus("Re-connecting...");
          return submitWithRetry(retryCount + 1);
        }
        console.error(err);
        setStatus("❌ Timeout: Please check internet and try again.");
      }
    };

    await submitWithRetry();
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
          <div className="form-row single">
            <div className="input-container">
              <label>Required Loan Amount</label>
              <input type="number" name="loanAmount" placeholder="₹20,000 - ₹15.5L" value={formData.loanAmount} onChange={handleChange} className={errors.loanAmount ? "invalid" : ""} />
              {errors.loanAmount && <span className="error-msg">{errors.loanAmount}</span>}
            </div>
          </div>

          <hr className="form-divider" />

          <div className="form-row single">
            <div className="input-container">
              <label>Full Name</label>
              <input type="text" name="fullName" placeholder="Enter name" value={formData.fullName} onChange={handleChange} className={errors.fullName ? "invalid" : ""} />
              {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
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

          <button type="submit" className="submit-btn" disabled={!isValid || status === "Connecting..."}>
            {status === "Connecting..." ? "Wait..." : "Apply for Loan"}
          </button>
        </form>

        {status && <p className={`status-msg ${status.includes("❌") ? "error" : "success"}`}>{status}</p>}

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <div className="success-icon">✓</div>
              <h3>Request Sent</h3>
              <p>We have received your application for ₹{submittedAmount}.</p>
              <button onClick={handlePopupOk}>Return Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}