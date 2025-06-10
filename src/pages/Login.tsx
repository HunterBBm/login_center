import React,{ useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../index.css';  
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { username, password });
      // สมมุติ response.data.token คือ token ที่ backend ส่งกลับมา
      localStorage.setItem('token', response.data.token);

      const active = response?.data?.user?.tb_is_active;
      if (active === 0) {
        setError('บัญชีผู้ใช้ถูกระงับ กรุณาติดต่อผู้ดูแลระบบ');
        return;
      }

      const role = response?.data?.user?.tb_role; 
      if (role === 'admin') {
        navigate('/Admin');
      } else if (role === 'user') {
        window.location.href = 'https://sites.google.com/sansaihospital.go.th/datacenter/home';
      } else {
        setError('ไม่พบสิทธิ์ของผู้ใช้');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}