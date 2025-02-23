import { assets } from "@/assets/assets";
import { Calendar } from "@/components/ui/calendar";
import { DoctorContext } from "@/context/DoctorContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [appointment, setAppointment] = useState(0);
    const [appointments, setAppointments] = useState([]);
  const [earning, setEarning] = useState(0);
  const [patient, setPatient] = useState(0);
  const { dtoken } = useContext(DoctorContext);


  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:4300/doctor/api/get-appointment',
        {
          headers: { dtoken },
        }
      );
      if (data.success) {
        setAppointments(data.appointments || []);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

    useEffect(() => {
      if (dtoken) {
        getAppointments();
      }
    }, [dtoken]);

  const handleCancel = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        'http://localhost:4300/doctor/api/cancel-appointment',
        { appointmentId },
        { headers: { dtoken } }
      );
      if (data.success) {
        alert(data.message);
        setAppointments((prev) =>
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
  const handleComplete = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        'http://localhost:4300/doctor/api/complete-appointment',
        { appointmentId },
        { headers: { dtoken } }
      );
      if (data.success) {
        alert(data.message);
        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === appointmentId ? { ...appt, isCompletted: true } : appt
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // the count part like patient appointment,and earning
  const countAppointment = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4300/doctor/api/count-appointment",
        { headers: { dtoken } }
      );
      if (data.success) {
        const count =
          data.count.length > 0 ? data.count[0].totalAppointment : 0;
        setAppointment(count);
      }
    } catch (error) {
      console.error("Error fetching appointment count:", error);
    }
  };

  useEffect(() => {
    if (dtoken) {
      countAppointment();
    }
  }, [dtoken]);

  const countEarning = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4300/doctor/api/count-amount",
        { headers: { dtoken } }
      );
      if (data.success) {
        const count = data.count.length > 0 ? data.count[0].totalEarning : 0;
        setEarning(count);
      }
    } catch (error) {
      console.error("Error fetching appointment count:", error);
    }
  };

  useEffect(() => {
    if (dtoken) {
      countEarning();
    }
  }, [dtoken]);

  const countPatient = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4300/doctor/api/count-pateint",
        { headers: { dtoken } }
      );
      if (data.success) {
        const count = data.count.length > 0 ? data.count[0].totalUsers : 0;
        setPatient(count);
      }
    } catch (error) {
      console.error("Error fetching appointment count:", error);
    }
  };

  useEffect(() => {
    if (dtoken) {
      countPatient();
    }
  }, [dtoken]);

  return (
    <div className="mt-16 pt-4 pl-5 xl:px-5 ml-40 xl:ml-48 w-full bg-[#E3EEFF]  min-h-screen ">
      <p className="px-8 py-4 font-medium text-xl">Doctor Dashboard</p>
      <div className="px-8 flex w-[85%] gap-6">
        {/* left part */}
        <div className="w-[85%] flex flex-col gap-8 ">
          {/* boxes */}
          <div className="flex xl:flex-row md:flex-col md:gap-4 xl:gap-2">
            <div className="flex gap-2">
              <div className="shadow-lg md:w-72   h-[85px] px-10 py-4 rounded-lg flex gap-2 bg-white">
                <img src={assets.patient} className="w-12" alt="" />
                <div>
                  <p className="text-sm text-gray-400">Total Patient</p>
                  <p>{patient}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="shadow-lg md:w-72   h-[85px] px-9 py-4 rounded-lg flex gap-2 bg-white">
                <img src={assets.appointment} className="w-10" alt="" />
                <div>
                  <p className="text-sm text-gray-400">Total Appointment</p>
                  <p>{appointment}</p>
                </div>
              </div>
              <div className="shadow-lg md:w-72  h-[85px] px-1 py-4 rounded-lg flex gap-2 bg-white">
                <img src={assets.money} className="w-12" alt="" />
                <div>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                  <p>{earning}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>Latest Appointment</p>
            {/* latest appointment */}
          <div className="  rounded-lg  bg-white px-6 pb-4 ">
            {/* Header */}
            <div className="flex p-4  font-bold mb-4  text-gray-600">
              <div className="w-1/3 pl-16">Patient</div>
              <div className="w-1/3 text-center">Booking Date</div>
              <div className="w-1/3 text-end pr-20">Status</div>
            </div>

            <div className=" flex flex-col   gap-1">
              {/* Body */}
              {appointments.length > 0 ? (
                appointments.slice(0,5).reverse().map((item, index) => (
                  <div
                    key={index}
                    className="flex  py-3 px-4 border border-blue-700 mt-1 rounded-full  items-center hover:bg-gray-50"
                  >
                    <div className="w-1/3 flex items-center pl-12 space-x-3">
                      <img
                        src={item.userData?.image || "/default-image.jpg"}
                        alt="Patient"
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{item.userData?.name || "Unknown"}</span>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      {item.slotDate} | {item.slotTime}
                    </div>
                    <div className="w-1/3 flex gap-2 items-center justify-end pr-16">
                      {item.isCompletted ? (
                        <p className="text-green-500">Completed</p>
                      ) : item.cancelled ? (
                        <p className="text-red-500">Cancelled</p>
                      ) : (
                        <div className="flex gap-2">
                          {/* Cancel Button */}
                          <img
                            src={assets.cancelled}
                            onClick={() => handleCancel(item._id)}
                            className="border px-1 py-1 rounded w-12 cursor-pointer text-white"
                            alt="Cancel"
                          />

                          {/* Complete Button */}
                          <img
                            src={assets.correct}
                            onClick={() => handleComplete(item._id)}
                            className="border px-1 py-1 rounded w-11 cursor-pointer text-white"
                            alt="Cancel"
                          />
                        </div>
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
        <div className="">
          {/* right part */}
          <div className="xl:pr-3">
            {/* date */}
            <div className="flex flex-col gap-1">
              <Calendar
                mode="single"
                selected={date}
                className="rounded-md border bg-white text-blue-800 hover:bg-blue-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
