import React from 'react';
import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/auth/authSlice';

const navItems = [
  { path: '/dashboard/admin', label: 'Dashboard' },
  { path: '/dashboard/add-product', label: 'Add Product' },
  { path: '/dashboard/manage-products', label: 'Manage Products' },
  { path: '/dashboard/users', label: 'Users' },
  { path: '/dashboard/manage-orders', label: 'Manage Orders' },
];
const AdminDashboard = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  return (
    <div className="space-y-5 bg-white p-7 md:h-screen flex flex-col justify-between">
      <div>
        <div className="nav__logo">
          <Link to="/">
            Shop<span>.</span>
          </Link>
          <p className="text-xs italic">User dashboard</p>
        </div>
        <hr className="mt-5" />
        <ul className="space-y-5 pt-5">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink className={({ isActive }) => `transition-all duration-300 transform inline-block ${isActive ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600 hover:scale-105'}`} end to={item.path}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-3">
        <hr className="mb-3" />
        <button onClick={handleLogout} className="text-white bg-primary hover:bg-red-800  shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 font-medium px-5 py-1 rounded-sm">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
