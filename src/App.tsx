import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Register from './pages/Register';
import Edit from './pages/edit';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Admin" element={<Admin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/edit" element={<Edit />} />
    </Routes>
  );
}

export default App;
