import { AdminContext } from '@/context/AdminContext';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'

const Patient = () => {
  const [patients, setPatients] = useState([]);
    const { atoken } = useContext(AdminContext);

    const getPatient = async () => {
      try {
        const { data } = await axios.get('http://localhost:4300/admin/api/get-users', {
          headers: { atoken }
        });
        if (data.success) {
          setPatients(data.users || []);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  
    useEffect(() => {
      if (atoken) {
        getPatient();
      }
    }, [atoken]);
  return (
    <div  className='mt-16 pt-8 px-8 xl:px-5 ml-40 xl:ml-48 bg-[#E3EEFF] w-full min-h-screen'>
      <p className='text-xl font-medium mb-6'>Patient</p>

      <table className="w-full border-collapse bg-white rounded-lg">
          <thead>
            <tr>
              <th className="text-left p-4 border-b font-medium text-gray-600">Name</th>
              <th className="text-left p-4 border-b font-medium text-gray-600">Email</th>
              <th className="text-left p-4 border-b font-medium text-gray-600">Gender</th>
              <th className="text-left p-4 border-b font-medium text-gray-600">Dob</th>
              <th className="text-left p-4 border-b font-medium text-gray-600">Address</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 && (
              patients.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4  flex items-center space-x-3">
                    <img
                      src={item.image || "/default-image.jpg"}
                      alt="Patient"
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{item.name || "Unknown"}</span>
                  </td>
                  <td className="p-4 ">{item.email || "Unknown Doctor"}</td>
                  <td className="p-4 ">{item.gender} </td>
                  <td className="p-4 ">{item.dob} </td>
                  <td className="p-4 ">{item.address} </td>
                </tr>
              ))
            ) }
          </tbody>
        </table>
    </div>
  )
}

export default Patient
