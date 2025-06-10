import React,{ useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../index.css';  
import './Admin.css';

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Fetch user data from the API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/user');
        setData(res.data.users);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Filter and paginate the data based on search term and current page
  const filteredData = data?.filter((user: any) =>
    user.tb_firstname.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Paginate the filtered data
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>
      <div className="admin-actions">
        <button
          className="admin-button register-button"
          onClick={() => navigate('/register')}
        >
          Register New User
        </button>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {paginatedData && Array.isArray(paginatedData) && (
        <>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th>Active</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((user: any, idx: number) => (
                  <tr key={idx} className="admin-row">
                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td>{user.tb_username}</td>
                    <td>{user.tb_firstname}</td>
                    <td>{user.tb_lastname}</td>
                    <td>{user.tb_phone}</td>
                    <td>{user.tb_is_active ? 'Yes' : 'No'}</td>
                    <td>{user.tb_role}</td>
                    <td>
                      <button
                        className="admin-button edit-button"
                        onClick={() => navigate('/edit', { state: { user: user } })}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-button delete-button"
                        onClick={async () => {
                          if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบผู้ใช้งานนี้ :  ${user.tb_username}`)) {
                            try {
                              const response = await api.delete(`/user/${user.id}`);
                              if (response.status === 200) {
                                alert('User deleted successfully');
                                setData(data.filter((u: any) => u.id !== user.id));
                              } else {
                                alert('Failed to delete user');
                              }
                            } catch (err) {
                              console.error('Error deleting user:', err);
                              alert('Error deleting user: ' + err);
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-container">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}