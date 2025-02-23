import { assets } from '@/assets/assets';
import { AdminContext } from '@/context/AdminContext';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';

const Aappointment = () => {
  const [appointments, setAppointment] = useState([]);
  const { atoken } = useContext(AdminContext);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:4300/admin/api/get-appointments',
        {
          headers: { atoken },
        }
      );
      if (data.success) {
        setAppointment(data.appointments || []);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        'http://localhost:4300/admin/api/cancel-appointement',
        { appointmentId },
        { headers: { atoken } }
      );
      if (data.success) {
        alert(data.message);
        setAppointment((prev) =>
          prev.map((appt) =>
            appt._id === appointmentId ? { ...appt, cancelled: true } : appt
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (atoken) {
      getAppointments();
    }
  }, [atoken]);

  return (
    <div className="mt-16 pt-4 pl-5 xl:px-5 ml-40 bg-[#E3EEFF] w-full min-h-screen">
      <div className="flex flex-col gap-5 px-10 xl:px-20 py-12">
        {/* Top part */}
        <div className="flex gap-28">
          <p className="text-lg font-medium">All Appointments</p>
          <div className="flex bg-white border w-72 border-gray-600 justify-center items-center py-1 px-3 rounded">
            <input
              type="text"
              className="border-none outline-none w-full text-sm"
              placeholder="searching"
            />
            <img src={assets.searching} className="w-4" alt="Search" />
          </div>
        </div>

        {/* Appointments List */}
        <div className="  rounded-lg bg-white px-6 pb-8   ">
          {/* Header */}
          <div className="flex p-4 font-bold mb-4  text-gray-600">
            <div className="w-1/4 pl-2">Patient</div>
            <div className="w-1/4">Doctor</div>
            <div className="w-1/4">Booking Date</div>
            <div className="w-1/4 text-center">Status</div>
          </div>

          <div className=' flex flex-col  gap-1'>
            {/* Body */}
          {appointments.length > 0 ? (
            appointments.map((item, index) => (
              <div
                key={index}
                className="flex  py-3 px-4 border border-blue-800  mt-1 rounded-full  items-center hover:bg-gray-50"
              >
                <div className="w-1/4 flex items-center space-x-3">
                  <img
                    src={item.userData?.image || '/default-image.jpg'}
                    alt="Patient"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{item.userData?.name || 'Unknown'}</span>
                </div>
                <div className="w-1/4">{item.docData?.name || 'Unknown Doctor'}</div>
                <div className="w-1/4">
                  {item.slotDate} | {item.slotTime}
                </div>
                <div className="w-1/4  flex gap-2 items-center justify-center">
                  {item.isCompletted ? (
                    <p className="text-green-500">Completed</p>
                  ) : item.cancelled ? (
                    <p className="text-red-500">Cancelled</p>
                  ) : (
                    <img
                    src={assets.cancelled}
                      onClick={() => handleCancel(item._id)}
                      className="border px-1 py-1 rounded w-12 cursor-pointer text-white"
                    />
                    
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center">No Appointments Found</div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aappointment;
