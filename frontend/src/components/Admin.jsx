import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Admin = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passInput, setPassInput] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleLogin = () => {
    if (passInput === "vk4280") {
      setIsAuth(true);
    } else {
      alert("Galat Password!");
    }
  };

  useEffect(() => {
    if (isAuth) fetchLoans();
  }, [isAuth]);

  const fetchLoans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setLoans(data);
      setFilteredLoans(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedDate === "") {
      setFilteredLoans(loans);
    } else {
      const filtered = loans.filter((loan) => 
        new Date(loan.created_at).toISOString().split('T')[0] === selectedDate
      );
      setFilteredLoans(filtered);
    }
  }, [selectedDate, loans]);

  // Specific Row Delete karne ke liye
  const deleteSpecific = async (id) => {
    if (window.confirm("Kya aap ye entry delete karna chahte hain?")) {
      const { error } = await supabase.from('loans').delete().eq('id', id);
      if (error) alert("Error: " + error.message);
      else fetchLoans(); // Refresh data
    }
  };

  // Selected Date ka poora data delete karne ke liye
  const deleteByDate = async () => {
    if (!selectedDate) return;
    if (window.confirm(`⚠️ WARNING: Kya aap ${selectedDate} ka SAARA data delete karna chahte hain?`)) {
      // Supabase range delete logic
      const { error } = await supabase
        .from('loans')
        .delete()
        .gte('created_at', `${selectedDate}T00:00:00`)
        .lte('created_at', `${selectedDate}T23:59:59`);

      if (error) alert("Error: " + error.message);
      else {
        alert("Date wise data deleted!");
        setSelectedDate("");
        fetchLoans();
      }
    }
  };

  const downloadExcel = () => {
    if (filteredLoans.length === 0) return alert("No data to download!");
    const headers = ["Name", "Amount", "Mobile", "Pincode", "State", "Date"].join(",");
    const rows = filteredLoans.map(loan => {
      const formattedDate = new Date(loan.created_at).toLocaleDateString('en-GB');
      return `"${loan.full_name}","${loan.loan_amount}","${loan.mobile}","${loan.pincode}","${loan.state}","${formattedDate}"`;
    }).join("\n");

    const csvContent = headers + "\n" + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Loans_${selectedDate || 'All'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e', padding: '20px' }}>
        <div style={{ background: '#ffffff', padding: '40px', borderRadius: '15px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: '#1a1a2e', marginBottom: '25px' }}>Admin Login</h2>
          <input 
            type="password" 
            placeholder="Password" 
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}
            onChange={(e) => setPassInput(e.target.value)}
          />
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: '#4e73df', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fc', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#4e73df', padding: '15px 30px', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>LoanAdmin Panel</h1>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>FILTER DATE: </label>
                <input type="date" value={selectedDate} style={{ padding: '8px' }} onChange={(e) => setSelectedDate(e.target.value)} />
                {selectedDate && <button onClick={() => setSelectedDate("")} style={{ marginLeft: '10px', color: '#4e73df', border: 'none', background: 'none', cursor: 'pointer' }}>Clear</button>}
            </div>
            {selectedDate && (
                <button onClick={deleteByDate} style={{ background: '#e74a3b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    🗑️ Delete This Date
                </button>
            )}
          </div>
          <button onClick={downloadExcel} style={{ background: '#1cc88a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            📥 Download Excel
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fc', borderBottom: '2px solid #e3e6f0' }}>
                  <th style={thStyle}>NAME</th>
                  <th style={thStyle}>AMOUNT</th>
                  <th style={thStyle}>MOBILE</th>
                  <th style={thStyle}>PINCODE</th>
                  <th style={thStyle}>STATE</th>
                  <th style={thStyle}>DATE</th>
                  <th style={thStyle}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.length === 0 ? (
                    <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No records found.</td></tr>
                ) : (
                    filteredLoans.map((loan) => (
                    <tr key={loan.id} style={{ borderBottom: '1px solid #e3e6f0' }}>
                        <td style={tdStyle}>{loan.full_name}</td>
                        <td style={tdStyle}>₹{loan.loan_amount}</td>
                        <td style={tdStyle}>{loan.mobile}</td>
                        <td style={tdStyle}>{loan.pincode}</td>
                        <td style={tdStyle}>{loan.state}</td>
                        <td style={tdStyle}>{new Date(loan.created_at).toLocaleDateString('en-IN')}</td>
                        <td style={tdStyle}>
                            <button onClick={() => deleteSpecific(loan.id)} style={{ color: '#e74a3b', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                Delete
                            </button>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const thStyle = { padding: '15px', textAlign: 'left', fontSize: '12px', color: '#4e73df' };
const tdStyle = { padding: '15px', fontSize: '14px', color: '#5a5c69' };

export default Admin;