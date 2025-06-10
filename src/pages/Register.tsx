import React,{ useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../index.css';  

export default function Register() {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/register', {
        tb_username: username,
        tb_password: password,
        tb_firstname: firstname,
        tb_lastname: lastname,
        tb_phone: phone,
      });
      console.log('Registration successful');
      navigate('/Admin'); // Redirect to Admin page after successful registration
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการลงทะเบียน');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
    }
  };

  return (
    <div className="register-container" style={{ maxWidth: 400, margin: '40px auto', background: '#222', color: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0002', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Register</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #444', background: '#333', color: '#fff' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #444', background: '#333', color: '#fff' }}
        />
        <input
          type="text"
          placeholder="ชื่อ"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #444', background: '#333', color: '#fff' }}
        />
        <input
          type="text"
          placeholder="นามสกุล"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #444', background: '#333', color: '#fff' }}
        />
        <input
          type="text"
          placeholder="โทรศัพท์"
          value={phone}
          onChange={handlePhoneChange}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #444', background: '#333', color: '#fff' }}
        />
        <button
          type="submit"
          style={{ padding: 12, borderRadius: 6, border: 'none', background: 'linear-gradient(90deg, #4caf50, #2196f3)', color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', marginTop: 8 }}
        >
          Register
        </button>
        {error && <p className="error" style={{ color: 'salmon', textAlign: 'center', margin: 0 }}>{error}</p>}
      </form>
    </div>
  );
}