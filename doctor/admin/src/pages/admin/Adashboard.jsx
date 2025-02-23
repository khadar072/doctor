import { assets } from "@/assets/assets";
import BarChart from "@/component/BarChart";
import LineChart from "@/component/LineChart";
import PieChart from "@/component/PieChart";
import { Calendar } from "@/components/ui/calendar";
import { AdminContext } from "@/context/AdminContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

const Adashboard = () => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(0);
  const [appointment, setAppointment] = useState(0);
  const [earning, setEarning] = useState(0);
  const [patient, setPatient] = useState(0);
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
        setAppointments(data.appointments || []);
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


  // counting parts

  const countDoctors = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4300/admin/api/count-doctors",
        { headers: { atoken } }
      );
      if (data.success) {
        const count = data.count.length > 0 ? data.count[0].totalDoctors : 0;
        setDoctor(count);
      }
    } catch (error) {
      console.error("Error fetching appointment count:", error);
    }
  };

  useEffect(() => {
    if (atoken) {
      countDoctors();
    }
  }, [atoken]);

  const countAppointment = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4300/admin/api/count-appointment",
        { headers: { atoken } }
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
    if (atoken) {
      countAppointment();
    }
  }, [atoken]);

  const countEarning = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4300/admin/api/count-amount",
        { headers: { atoken } }
      );
      if (data.success) {
        const count =
          data.totalFees.length > 0 ? data.totalFees[0].totalEarnings : 0;
        setEarning(count);
      }
    } catch (error) {
      console.error("Error fetching appointment count:", error);
    }
  };

  useEffect(() => {
    if (atoken) {
      countEarning();
    }
  }, [atoken]);

  const countPatient = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4300/admin/api/count-patient",
        { headers: { atoken } }
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
    if (atoken) {
      countPatient();
    }
  }, [atoken]);
  return (
    <div className="mt-16 pt-4 px-2 xl:px-5 ml-40 xl:ml-48 w-full bg-[#E3EEFF]  min-h-screen ">
      <p className="md:px-1 xl:px-4  py-4 font-medium text-xl">Admin Dashboard</p>
      <div className=" px-1xl:px-2 flex lg:w-[100%] gap-2 xl:gap-8">
        {/* left part */}
        <div className="w-[100%] xl:w-[80%] flex flex-col">
          {/* boxes */}
          <div className="flex flex-col gap-10 w-full">
            <p>Overview Analystic</p>
            <div className="flex xl:flex-row md:flex-col md:gap-4 xl:gap-2">
            <div className="flex gap-2">
              <div className="shadow-lg md:w-72 xl:w-60 h-[85px] px-10 py-4 rounded-lg flex gap-2 bg-white">
                <img src={assets.person} className="w-10" alt="" />
                <div>
                  <p className="text-sm text-gray-400">Total Doctors</p>
                  <p>{doctor}</p>
                </div>
              </div>
              <div className="shadow-lg md:w-72 xl:w-60  h-[85px] px-10 py-4 rounded-lg flex gap-2 bg-white">
                <img src={assets.patient} className="w-12" alt="" />
                <div>
                  <p className="text-sm text-gray-400">Total Patient</p>
                  <p>{patient}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="shadow-lg md:w-72 xl:w-60  h-[85px] px-9 py-4 rounded-lg flex gap-2 bg-white">
                <img src={assets.appointment} className="w-10" alt="" />
                <div>
                  <p className="text-sm text-gray-400">Total Appointment</p>
                  <p>{appointment}</p>
                </div>
              </div>
              <div className="shadow-lg md:w-72 xl:w-60  h-[85px] px-1 py-4 rounded-lg flex gap-2 bg-white">
                <img src={assets.money} className="w-12" alt="" />
                <div>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                  <p>{earning}</p>
                </div>
              </div>
            </div>
            </div>
          </div>
          {/* chats */}
          <div className="flex flex-col gap-4  w-full py-10  xl:py-10">
            <div className="flex gap-2 xl:gap-6 w-full">
              <div className="w-[38%] h-42  rounded-xl  text-white flex flex-col justify-center items-center bg-gray-300">
                
                <PieChart />
              </div>
              <div className="flex-1 md:w-60 xl:w-80 rounded-xl text-white flex justify-center items-center bg-gray-300">
                <BarChart />
              </div>
            </div>
            <div className="h-80 px-10 py-5  rounded-xl text-white flex justify-center items-center bg-gray-300">
              <LineChart/>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
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
          {/* lattest appointment */}
          <div className="xl:w-[95%] w-full rounded-md py-6 px-1 xl:px-4 bg-white ">
              <p>Recentily Appointment</p>
              <div className=' flex flex-col  py-4 gap-1'>
                          {/* Body */}
                        {appointments.length > 0 ? (
                          appointments.slice(0,6).reverse().map((item, index) => (
                            <div
                              key={index}
                              className="flex  py-3 xl:px-2 gap-2  border border-blue-800  mt-1 rounded-lg  items-center hover:bg-gray-50"
                            >
                              <div className=" flex items-center space-x-1 xl:space-x-3">
                                <img
                                  src={item.userData?.image || '/default-image.jpg'}
                                  alt="Patient"
                                  className="w-8 h-8 rounded-lg"
                                />
                                <span className="xl:text-base md:text-sm">{item.userData?.name || 'Unknown'}</span>
                              </div>
                              <div className="text-xs">
                                {item.slotDate} | {item.slotTime}
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
    </div>
  );
};

export default Adashboard;
