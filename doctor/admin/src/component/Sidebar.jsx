import React from 'react'
import {NavLink} from 'react-router-dom'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '@/context/AdminContext'
import { DoctorContext } from '@/context/DoctorContext'
const Sidebar = () => {
  const {atoken}=useContext(AdminContext)
  const {dtoken}=useContext(DoctorContext)
  return (
    <div className='w-40 xl:w-48 mt-[77px] min-h-screen border-r fixed z-10 py-4 bg-blue-700 border-r-blue-700 '>

      {/* admin sidebar */}
      {atoken &&
        <ul  className='text-white text-sm mt-3'>
       <NavLink className={({isActive})=> `flex gap-3 items-center px-3  py-3  xl:px-7 md:min-w-36 cursor-pointer ${isActive ?'bg-[#eff4ff] text-blue-600 border-r-2 border-green-500':''}`} to={'/admin-dashboard'}>
         <img src={assets.dashboard} className='w-5' alt="" />
         <p>Dashboard</p>
       </NavLink>
       <NavLink className={({isActive})=> `flex gap-3 items-center px-3 py-3  xl:px-7 md:min-w-36 cursor-pointer ${isActive ?'bg-[#eff4ff] text-blue-600 border-r-2 border-green-500':''}`} to={'/add-doctor'}>
         <img src={assets.add} className='w-5' alt="" />
         <p>Add-Doctor</p>
       </NavLink>
       <NavLink className={({isActive})=> `flex gap-2 items-center px-3 py-3  xl:px-7 md:min-w-36 cursor-pointer ${isActive ?'bg-[#eff4ff] text-blue-600 border-r-2 border-green-500':''}`} to={'/doctors'}>
         <img src={assets.people} className='w-6' alt="" />
         <p>Doctors</p>
       </NavLink>
       <NavLink className={({isActive})=> `flex gap-3 items-center px-3 py-3  xl:px-7 md:min-w-36 cursor-pointer ${isActive ?'bg-[#eff4ff] text-blue-600 border-r-2 border-green-500':''}`} to={'/admin-appointment'}>
         <img src={assets.appointment} className='w-5' alt="" />
         <p>Appointment</p>
       </NavLink>
       <NavLink className={({isActive})=> `flex gap-1 items-center px-3 py-2  xl:px-7 md:min-w-36 cursor-pointer ${isActive ?'bg-[#eff4ff] text-blue-600 border-r-2 border-green-500':''}`} to={'/patient'}>
         <img src={assets.patient} className='w-7' alt="" />
         <p>Patient</p>
       </NavLink>
      </ul>
      }


      {/* doctor sidebar */}
      {dtoken &&
        <ul  className='text-white  text-sm mt-3'>
       <NavLink className={({isActive})=> `flex gap-2 items-center px-3 py-3  xl:px-7 md:min-w-36 cursor-pointer ${isActive ?'bg-[#eff4ff] text-blue-600 border-r-2 border-green-500':''}`} to={'/doctor-dashboard'}>
         <img src={assets.dashboard} className='w-5' alt="" />
         <p>Dashboard</p>
       </NavLink>
       <NavLink className={({isActive})=> `flex gap-2 items-center px-5 py-3  xl:px-7 md:min-w-36 cursor-pointer ${isActive ?'bg-[#eff4ff] text-blue-600 border-r-2 border-green-500':''}`} to={'/doctor-appointment'}>
         <img src={assets.add} className='w-5' alt="" />
         <p>Appointment</p>
       </NavLink>
       <NavLink className={({isActive})=> `flex gap-1 items-center px-5 py-3  xl:px-7 md:min-w-36 cursor-pointer ${isActive ?'bg-[#eff4ff] text-blue-600 border-r-2 border-green-500':''}`} to={'/doctor-profile'}>
         <img src={assets.people} className='w-6' alt="" />
         <p>Profile</p>
       </NavLink>
      </ul>
      }
    </div>
  )
}

export default Sidebar
