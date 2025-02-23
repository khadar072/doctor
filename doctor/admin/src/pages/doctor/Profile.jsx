import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { DoctorContext } from '@/context/DoctorContext';
import { assets } from '@/assets/assets';

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [PrevPassword, setPrevPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { dtoken } = useContext(DoctorContext);
  const [docData, setDocData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    age: '', // Use 'age' field for displaying age
    image: '',
    speciality: '' // Add this to handle speciality field
  });

  const getDoctor = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:4300/doctor/api/get-doctor',
        {
          headers: { dtoken },
        }
      );
      if (data.success) {
        const age = calculateAge(data.doctor.dob); // Calculate age from dob
        setDocData({
          ...data.doctor,
          age, // Update the state with the calculated age
        });
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error.message);
    }
  };

  useEffect(() => {
    if (dtoken) {
      getDoctor();
    }
  }, [dtoken]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="mt-16 flex flex-col gap-6 pt-10 pl-5 xl:px-5 ml-40 xl:ml-48 w-full bg-[#E3EEFF] min-h-screen">
      <div className="flex gap-6">
        <img
          className="w-60 h-[250px] border border-blue-500 object-cover"
          src={docData.image || assets.placeholderImage} // Fallback for the image
          alt="Profile"
        />
        <div className="flex flex-col gap-2">
          {isEdit ? (
            <div className="flex items-center gap-2">
              <p className="font-medium">Name:</p>
              <input
                className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                value={docData.name}
                onChange={(e) =>
                  setDocData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-blue-800">
              <span className="text-black font-medium">Name:</span> {docData.name}
            </p>
          )}
          <p className="text-blue-800">
            <span className="text-black font-medium">Email:</span> {docData.email}
          </p>
          {isEdit ? (
            <div className="flex items-center gap-2">
              <p className="font-medium">Speciality:</p>
              <input
                className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                value={docData.speciality}
                onChange={(e) =>
                  setDocData((prev) => ({
                    ...prev,
                    speciality: e.target.value,
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-blue-800">
              <span className="text-black font-medium">Speciality:</span> {docData.speciality}
            </p>
          )}
          {isEdit ? (
            <div className="flex items-center gap-2">
              <p className="font-medium">Address:</p>
              <input
                className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                value={docData.address}
                onChange={(e) =>
                  setDocData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-blue-800">
              <span className="text-black font-medium">Address:</span> {docData.address}
            </p>
          )}
          {isEdit ? (
            <div className="flex items-center gap-2">
              <p className="font-medium">Gender:</p>
              <select
                className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                value={docData.gender}
                onChange={(e) =>
                  setDocData((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          ) : (
            <p className="text-blue-800">
              <span className="text-black font-medium">Gender:</span> {docData.gender}
            </p>
          )}
          {isEdit ? (
            <div className="flex items-center gap-2">
              <p className="font-medium">Age:</p>
              <input
                className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                value={docData.age}
                onChange={(e) =>
                  setDocData((prev) => ({
                    ...prev,
                    age: e.target.value, // Corrected this line to update age instead of address
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-blue-800">
              <span className="text-black font-medium">Age:</span> {docData.age}
            </p>
          )}
          <div className="flex items-start gap-4">
            {isEdit ? (
              <button
                onClick={() => setIsEdit(!isEdit)}
                className="bg-blue-500 px-6 py-2 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(!isEdit)}
                className="bg-green-500 px-6 py-2 text-white rounded-lg hover:bg-green-600 transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="w-64">
        <div className="flex flex-col gap-2 border border-blue-800 p-4 rounded-lg">
          <input
            type="password"
            className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Previous password"
            onChange={(e) => setPrevPassword(e.target.value)}
          />
          <input
            type="password"
            className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="New password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="bg-blue-800 text-center text-white py-2 rounded hover:bg-blue-900 transition">
            Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
