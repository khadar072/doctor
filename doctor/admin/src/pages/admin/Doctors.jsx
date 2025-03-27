import { AdminContext } from "@/context/AdminContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null); // Track dropdown for each doctor
  const { atoken } = useContext(AdminContext);
  const navigate = useNavigate();

  const getDoctors = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4300/admin/api/get-doctors",
        {
          headers: { atoken },
        }
      );
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getDoctors();
  }, [atoken]);

  const onchangeHandle = async (docId) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4300/admin/api/avialability-change",
        { docId },
        {
          headers: { atoken },
        }
      );
      if (data.success) {
        alert(data.message);
        getDoctors(); // Refresh doctors list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //delete
  const deleteDoctor = async (docId) => {
    try {
      await axios.delete(`http://localhost:4300/admin/api/delete-doctor/${docId}`, {
        headers: { atoken },
      });
  
      // Update state to remove deleted doctor
      setDoctors((prevDoctor) => prevDoctor.filter((doctors) => doctors._id !== docId));
      console.log('Doctor deleted');
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  return (
    <div className="mt-20 pt-4 pl-2 xl:px-24 ml-40  w-full min-h-screen">
      <p className="px-4 font-medium text-xl">All Doctors</p>
      <div className="lg:px-3 py-7">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 xl:gap-4 px-3 sm:px-0 cursor-pointer">
          {doctors.map((item, index) => (
            <div
              key={item._id}
              className="border bg-white px-1 py-1 rounded-lg h-auto hover:border-2 hover:border-blue-700"
            >
              <div className="mb-1">
                <img
                  className="h-[200px] xl:h-[220px] w-full bg-blue-100 border object-cover rounded-lg"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className="flex flex-col mt-2 gap-1 sm:gap-0 items-start px-3">
                <div className="flex gap-1 items-center w-full justify-between relative">
                  <div className="flex gap-1 justify-between">
                    <input
                      onChange={() => onchangeHandle(item._id)}
                      type="checkbox"
                      checked={item.available}
                    />
                    <p className="text-xs text-green-500">Available</p>
                  </div>
                  <div className="relative flex items-center gap-1 cursor-pointer">
                    <BsThreeDots
                      onClick={() => toggleDropdown(index)}
                      className="cursor-pointer"
                    />
                    {dropdownOpen === index && (
                      <div className="absolute top-8 right-0 bg-stone-100 rounded shadow-lg text-gray-600 z-20">
                        <ul className="flex flex-col gap-2 p-3 min-w-[150px] font-medium">
                          <Link
                            to={`/get-doctor/${item._id}`}
                            className="hover:text-black cursor-pointer"
                          >
                            Get Doctor
                          </Link>
                          <Link
                            to={`/update-doctor/${item._id}`}
                            className="hover:text-black cursor-pointer"
                          >
                            Update Doctor
                          </Link>
                          <button
                            onClick={() => deleteDoctor(item._id)}
                            className="border bg-blue-600 text-white rounded cursor-pointer"
                          >
                            Delete
                          </button>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-xs mt-1 border border-blue-500 px-2 rounded flex items-center justify-center mb-1">
                  {item.speciality}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
