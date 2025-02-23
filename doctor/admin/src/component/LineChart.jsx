import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from "@/context/AdminContext";
import axios from 'axios';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const WeeklyPatientsChart = () => {
  const [chartData, setChartData] = useState([]);
  const { atoken } = useContext(AdminContext);

  const fetchChartData = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:4300/admin/api/appointments-per-week',
        {
          headers: { atoken },
        }
      );

      setChartData(data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [atoken]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="Appointments" stroke="#8884d8" strokeWidth={2} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default WeeklyPatientsChart;
