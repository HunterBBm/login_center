import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';
import '../index.css';

export default function edit() {
  const navigate = useNavigate();
  const location = useLocation();
  const userFromState = location.state && location.state.user ? location.state.user : undefined;

  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [active, setActive] = useState(1);
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const userId = userFromState?.id;

  React.useEffect(() => {
    if (userFromState) {
      setUsername(userFromState.tb_username || '');
      setFirstname(userFromState.tb_firstname || '');
      setLastname(userFromState.tb_lastname || '');
      setPhone(userFromState.tb_phone || '');
      setActive(userFromState.tb_is_active ?? 1);
      setRole(userFromState.tb_role || 'user');
    }
  }, [userFromState]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!userId) {
    setError('ไม่พบข้อมูลผู้ใช้ (userId)');
    return;
  }
    try {
      // log payload for debug
      const payload = {
        ...(password ? { tb_password: password } : {}),
        tb_firstname: firstname,
        tb_lastname: lastname,
        tb_phone: phone,
        tb_is_active: Number(active),
        tb_role: role,
      };
      console.log('PUT /user payload:', payload);
      await api.put(`/user/${userId}`, payload);
      navigate('/Admin'); // Redirect to Admin page after successful edit
    } catch (err: any) {
      if (err.response && err.response.data) {
        console.log('API error:', err.response.data);
        if (err.response.data.message) {
          setError('เกิดข้อผิดพลาด: ' + err.response.data.message);
        } else {
          setError('เกิดข้อผิดพลาด: ' + JSON.stringify(err.response.data));
        }
      } else {
        setError('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
      }
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
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Edit User</h2>
      <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          readOnly
          style={{ padding: 10, borderRadius: 6, border: '1px solid #444', background: '#333', color: '#fff', opacity: 0.7 }}
        />
        <input
          type="password"
          placeholder="Password (ถ้าไม่เปลี่ยนให้เว้นว่าง)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <select
          value={active}
          onChange={(e) => setActive(Number(e.target.value))}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #444', background: '#333', color: '#fff' }}
        >
          <option value={1}>true</option>
          <option value={0}>false</option>
        </select>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #444', background: '#333', color: '#fff' }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          style={{ padding: 12, borderRadius: 6, border: 'none', background: 'linear-gradient(90deg,rgb(77, 124, 156), #2196f3)', color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', marginTop: 8 }}
        >
          บันทึกการแก้ไข
        </button>
        {error && <p className="error" style={{ color: 'salmon', textAlign: 'center', margin: 0 }}>{error}</p>}
      </form>
    </div>
  );
}