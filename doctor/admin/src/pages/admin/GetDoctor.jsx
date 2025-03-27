import { AdminContext } from '@/context/AdminContext';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';


const GetDoctor = () => {
  const { atoken } = useContext(AdminContext);
  const {docId}=useParams();
  const [docData, setDocData] = useState({ });

  const getDoctor = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4300/admin/api/get-doctor/${docId}`,
        {
          headers: { atoken },
        }
      );
      if (data.success) { 
        setDocData(data.doctor)
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error.message);
    }
  };

  useEffect(() => {
    if (atoken) {
      getDoctor();
    }
  }, [atoken ]);

  
  return (
    <div className="mt-16 flex flex-col gap-6 pt-10 pl-5 xl:px-5 ml-40 xl:ml-48 w-full bg-[#E3EEFF] min-h-screen">
      <div className="flex w-full gap-6">
        <img
          src={docData.image}
          className="w-56 border border-blue-500 h-60 object-cover"
          alt="Profile"
        />
        <div className="flex flex-1 flex-col gap-2">
        <p className="text-blue-800">
            <span className="text-black font-medium">name:</span>{" "}
            {docData.name}
          </p>
          <p className="text-blue-800">
            <span className="text-black font-medium">Email:</span>{" "}
            {docData.email}
          </p>

          <p className="text-blue-800">
            <span className="text-black font-medium">age:</span>{" "}
            {docData.age}
          </p>
          <p className="text-blue-800">
            <span className="text-black font-medium">speciality:</span>{" "}
            {docData.speciality}
          </p>
          <p className="text-blue-800">
            <span className="text-black font-medium">experience:</span>{" "}
            {docData.experience}
          </p>
          <p className="text-blue-800">
            <span className="text-black font-medium">degree:</span>{" "}
            {docData.degree}
          </p>
          <p className="text-blue-800">
            <span className="text-black font-medium">address:</span>{" "}
            {docData.address}
          </p>
          <p className="text-blue-800">
            <span className="text-black font-medium">fees:</span>{" "}
            {docData.fees}
          </p>
          <p className="text-blue-800">
            <span className="text-black font-medium">about:</span>{" "}
            {docData.about}
          </p>
          <div className='flex gap-5'>
          <Link
            to='/doctors'
            className="w-40 text-center bg-black py-1 rounded-lg text-white mt-2"
          >
            Back
          </Link>
          <Link
            to={`/update-doctor/${docData._id}`}
            className="w-40 text-center bg-green-600 py-1 rounded-lg text-white mt-2"
          >
            Update
          </Link>
          </div>
              
      </div>
    </div>
    </div>
  )
}

export default GetDoctor
