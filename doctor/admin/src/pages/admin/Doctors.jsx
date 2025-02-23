import { AdminContext } from "@/context/AdminContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

const Doctors = () => {
  const [doctor, setDoctors] = useState([]);
  const { atoken } = useContext(AdminContext);
  const getDoctosr = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4300/admin/api/get-doctors",
        { headers: { atoken } }
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
    getDoctosr();
  }, [atoken]);

  const onchangeHandle = async (docId) => {
    try {
      const { data } = await axios.post('http://localhost:4300/admin/api/avialability-change', { docId}, { headers: { atoken } });
      if (data.success) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <div className="mt-20 pt-4 pl-2 xl:px-24 ml-40 bg-[#E3EEFF] w-full min-h-screen">
      <p className="px-4 p font-medium text-xl">All Doctors</p>
      <div className="lg:px-3 py-7">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5   gap-2 xl:gap-4  px-3 sm:px-0 cursor-pointer">
          {doctor.map((item, index) => (
            <div
              key={index}
              className="border bg-white px-1 py-1 rounded-lg h-auto  hover:border-2 hover:border-blue-700"
            >
              <div className="mb-1">
                <img
                  className="h-[200px] xl:h-[220px] w-full  bg-blue-100 border  object-cover rounded-lg"
                  src={item.image}
                  alt={`${item.name}`}
                />
              </div>

              <div className="flex flex-col mt-2 gap-1 sm:gap-0 items-start px-3">
                <div className="flex gap-1 items-center justify-center">
                  <input
                    onChange={(e) => onchangeHandle(item._id)}
                    type="checkbox"
                    checked={item.available}
                    name=""
                    id=""
                  />
                  <p className="text-xs text-green-500">Available</p>
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
