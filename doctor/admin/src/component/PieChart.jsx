import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AdminContext } from "@/context/AdminContext";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4500', '#32CD32', '#FFD700', '#8A2BE2'];

const RADIAN = Math.PI / 180;

// Function to render customized labels with percentages
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const SpecialtyPieChart = () => {
  const [data, setData] = useState([]);
  const { atoken } = useContext(AdminContext);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4300/admin/api/count-speciality', { headers: { atoken } }); // Replace with your backend endpoint
      const formattedData = response.data.map((item) => ({
        name: item._id, // Use the specialty name as label
        value: item.count, // Use the count as value
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching specialty data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [atoken]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
            label={renderCustomizedLabel} // Add the label renderer
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ marginTop: '5px', textAlign: 'center' }}>
        {data.map((entry, index) => (
          <div
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              margin: '5px',
              fontSize: '10px',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: '8px',
              }}
            ></div>
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialtyPieChart;
