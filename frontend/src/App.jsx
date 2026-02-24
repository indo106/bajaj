import { useState } from 'react';
import EmiCalculator from './components/EmiCalculator';
import LoanSelector from './components/offer';
import Form from './components/Form';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Export from './pages/Export';
import logo from './assets/logo.png';
import review1 from './assets/review1.png';
import review2 from './assets/review2.png';
import review3 from './assets/review3.png';

export default function App() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const faqs = [
    { q: 'What is the minimum loan amount?', a: 'The minimum loan amount is ₹50,000 and maximum is ₹1 crore, depending on your eligibility.' },
    { q: 'What is the processing time?', a: 'We process most loan applications within 24-48 hours. Instant approval for eligible customers.' },
    { q: 'What documents are required?', a: 'ID proof, address proof, income proof, and bank statements for the last 6 months.' },
    { q: 'Are there any hidden charges?', a: 'No hidden charges. All costs are transparent and mentioned in the loan agreement.' },
    { q: 'Can I prepay the loan?', a: 'Yes, you can prepay the entire loan or make partial prepayments without any penalty.' },
    { q: 'What is the eligibility criteria?', a: 'Age 21-60 years, minimum annual income of ₹3 lakhs, and a good credit score.' },
  ];

  const benefits = [
    { icon: '', title: 'Quick Approval', desc: 'Get approval in as little as 2 hours' },
    { icon: '', title: 'Competitive Rates', desc: 'Lowest interest rates in the market' },
    { icon: '', title: 'Digital Process', desc: 'Apply completely online, no paperwork' },
    { icon: '', title: 'Flexible Tenure', desc: 'Choose repayment period from 1-7 years' },
    { icon: '', title: 'No Collateral', desc: 'Unsecured personal loan - no security needed' },
    { icon: '', title: 'Data Safe', desc: 'Your data is 100% secure and encrypted' },
  ];

const testimonials = [
  {
    name: "Rahul Sharma",
    city: "Mumbai",
    text: "Got my loan approved in just 3 hours! Process was so simple.",
    img: review1,
  },
  {
    name: "Priya Patel",
    city: "Bangalore",
    text: "Best interest rates compared to other lenders. Highly recommend!",
    img: review2,
  },
  {
    name: "Amit Kumar",
    city: "Delhi",
    text: "Customer service was excellent. They guided me throughout the process.",
    img: review3,
  },
];

  return (
    <Routes>
      {/* Home Page */}
      <Route
        path="/"
        element={
          <div className="app-root">
            {/* Navigation */}
            <nav className="navbar">
              <div className="navbar-container">

                {/* <div className="logo"> SBI </div> */}
                <div className="logo">
                <img src={logo} alt="SBI Logo" />
                </div>

                <div
                  className={`hamburger ${menuOpen ? "active" : ""}`}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <ul className={`nav-items ${menuOpen ? "open" : ""}`}>
                  <li><a href="#calculator">EMI Calculator</a></li>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#eligibility">Eligibility</a></li>
                  <li><a href="#faq">FAQs</a></li>
                  <li>
                    <Link to="/form">
                      <button className="apply-nav-btn">Apply Now</button>
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
              <div className="hero-content">
                <h1>Get Your Personal Loan at the Best Rates</h1>
                <p>Loans up to 15 Lakhs | Fast Approval | No Hidden Charges</p>
              </div>
              <div className="loan-selector-section">
                <LoanSelector />
              </div>
            </section>

            {/* EMI Calculator */}
            <section id="calculator" className="calculator-section">
              <EmiCalculator />
            </section>

            {/* Features */}
            <section id="features" className="features-section">
              <div className="section-header">
                <h2>Why Choose Us</h2>
                <p>Experience banking made simple and transparent with our best-in-class services</p>
              </div>
              <div className="benefits-grid">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="benefit-card">
                    <div className="benefit-icon">{benefit.icon}</div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Eligibility */}
            <section id="eligibility" className="eligibility-section">
              <div className="section-header">
                <h2>Eligibility & Documents</h2>
                <p>Check what you need to qualify for our personal loans</p>
              </div>
              <div className="eligibility-grid">
                <div className="eligibility-card">
                  <h3> Eligibility Criteria</h3>
                  <ul>
                    <li>Age: 21 to 60 years</li>
                    <li>Minimum income: ₹3,00,000 per annum</li>
                    <li>Valid employment for last 2 years</li>
                    <li>Credit score: 750+</li>
                    <li>Must be an Indian citizen</li>
                  </ul>
                </div>
                <div className="eligibility-card">
                  <h3>📄 Required Documents</h3>
                  <ul>
                    <li>PAN Card or Aadhar Card</li>
                    <li>Last 6 months bank statements</li>
                    <li>Last 2 years ITR or salary slips</li>
                    <li>Address proof (electricity/water bill)</li>
                    <li>Recent passport-sized photo</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
  <div className="section-header">
    <h2>Customer Success Stories</h2>
    <p>Join thousands of happy customers who got their loans approved</p>
  </div>

  <div className="testimonials-grid">
    {testimonials.map((testi, idx) => (
      <div key={idx} className="testimonial-card">

        <div className="review-img">
          <img src={testi.img} alt="review" />
        </div>

        <p className="testimonial-text">{testi.text}</p>
        <p className="testimonial-author">{testi.name}</p>
        <p className="testimonial-city">{testi.city}</p>

      </div>
    ))}
  </div>
</section>

            {/* FAQ */}
            <section id="faq" className="faq-section">
              <div className="section-header">
                <h2>Frequently Asked Questions</h2>
                <p>Find answers to common questions about our personal loans</p>
              </div>
              <div className="faq-container">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="faq-item">
                    <button
                      className="faq-question"
                      onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                    >
                      <span>{faq.q}</span>
                      <span className={`faq-toggle ${faqOpen === idx ? 'open' : ''}`}>+</span>
                    </button>
                    {faqOpen === idx && (
                      <div className="faq-answer">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="footer">
              <div className="footer-grid">
                <div className="footer-col">
                  <h4>About Us</h4>
                  <p>We provide transparent, quick, and hassle-free personal loans to help you achieve your dreams.</p>
                </div>
                <div className="footer-col">
                  <h4>Quick Links</h4>
                  <ul>
                    <li><a href="#calculator">EMI Calculator</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#eligibility">Eligibility</a></li>
                    <li><a href="#faq">FAQs</a></li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h4>Support</h4>
                  <ul>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms & Conditions</a></li>
                    <li><a href="#">Complaints</a></li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h4>Contact</h4>
                  <p>📞 1-800-270-7000</p>
                  <p>✉️ support@statebankofindia.com</p>
                  <p>🏢 Mumbai, India</p>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2025 S.B.I All rights reserved.</p>
              </div>
            </footer>
          </div>
        }
      />

      {/* Form Page */}
      <Route path="/form" element={<Form />} />
      <Route path="/export" element={<Export />} />
    </Routes>
  );
}
