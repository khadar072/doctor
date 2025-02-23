import { AdminContext } from '@/context/AdminContext';
import { DoctorContext } from '@/context/DoctorContext';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(true); // Improved state naming
  const {setAtoken}= useContext(AdminContext)
  const {setDtoken}= useContext(DoctorContext)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (isAdmin) {
        // Admin login request
        const response = await axios.post('http://localhost:4300/admin/api/login', {
          email,
          password,
        });
  
        if (response.data.success) {
          const atoken = response.data.atoken;
          localStorage.setItem('atoken', atoken);
          setAtoken(atoken);
          navigate('/admin-dashboard');
        } else {
          alert(response.data.message || 'Invalid credentials');
        }
      } else {
        // Doctor login request
        const response = await axios.post('http://localhost:4300/doctor/api/login', {
          email,
          password,
        });
  
        if (response.data.success) {
          const dtoken = response.data.dtoken;
          localStorage.setItem('dtoken', dtoken);
          setDtoken(dtoken);
          navigate('/doctor-dashboard');
        } else {
          alert(response.data.message || 'Invalid credentials');
        }
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      alert('An error occurred during login. Please try again.');
    }
  };
  
  

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="border rounded px-3 py-3 gap-4  w-80">
        <h1 className="flex justify-center gap-2 mb-2 text-blue-700">
          {isAdmin ? 'Admin' : 'Doctor'} <p className='text-black'>Login</p>
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="border w-full px-2 py-2 rounded-sm text-xs focus:outline-none focus:ring-2 focus:ring-blue-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="border w-full px-2 py-2 rounded-sm text-xs focus:outline-none focus:ring-2 focus:ring-blue-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-7 bg-blue-700 py-1 rounded-sm text-white mt-4"
          >
            Login
          </button>
          <p
            onClick={() => setIsAdmin(!isAdmin)}
            className="text-xs mt-2 cursor-pointer items-start"
          >
            {isAdmin ? 'Doctor Login' : 'Admin Login'}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
