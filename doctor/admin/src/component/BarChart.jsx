import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from "@/context/AdminContext";
import axios from 'axios';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MonthlyPaymentsChart = () => {
  const [data, setData] = useState([]);
  const { atoken } = useContext(AdminContext);
  

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:4300/admin/api/Monthly-Payments',{headers:{atoken}}); // Update the URL based on your backend route
      setData(response.data);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };
  useEffect(() => {
    fetchPayments();
  }, [atoken]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="payments" fill="#3498db" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyPaymentsChart;
