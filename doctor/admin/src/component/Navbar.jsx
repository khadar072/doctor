import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '@/context/AdminContext';
import { DoctorContext } from '@/context/DoctorContext';

const Navbar = () => {
  const { setAtoken } = useContext(AdminContext);
  const { setDtoken } = useContext(DoctorContext);

  const logout = () => {
    localStorage.removeItem('atoken');
    setAtoken('');
    localStorage.removeItem('dtoken');
    setDtoken('');
  };

  return (
    <div className="flex fixed z-10 bg-white w-full justify-between items-center px-3 py-2 border-b border-b-blue-700">
      <div className="flex items-center">
        <img src={assets.logo} alt="Logo" className="w-44" />
        <p className="border mt-4 rounded px-2 flex items-center justify-center border-blue-800 text-gray-500 text-sm">
          {localStorage.getItem('atoken') ? 'Admin' : 'Doctor'}
        </p>
      </div>
      <button
        onClick={logout}
        className="border py-1 px-4 mr-7 rounded-lg text-white bg-blue-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
