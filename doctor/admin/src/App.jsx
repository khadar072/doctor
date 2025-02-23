import React, { useContext } from 'react'
import Navbar from './component/Navbar'
import Sidebar from './component/Sidebar'
import {Route, Routes} from 'react-router-dom'
import AddDoctor from './pages/admin/AddDoctor'
import Doctors from './pages/admin/Doctors'
import Patient from './pages/admin/Patient'
import Login from './pages/Login'
import { AdminContext } from './context/AdminContext'
import Adashboard from './pages/admin/Adashboard'
import Aappointment from './pages/admin/Aappointment'
import { DoctorContext } from './context/DoctorContext'
import Dashboard from './pages/doctor/Dashboard'
import Appointment from './pages/doctor/Appointment'
import Profile from './pages/doctor/Profile'

const App = () => {

  const {atoken}=useContext(AdminContext)
  const {dtoken}=useContext(DoctorContext)
  return atoken ||dtoken ?(
    <div className='flex flex-col gap-0'>
      <Navbar/>
      <div className='flex'>
        <Sidebar/>
        <Routes>
        {/* admin router */}

          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Adashboard/>} />
          <Route path='/add-doctor' element={<AddDoctor/>} />
          <Route path='/doctors' element={<Doctors/>} />
          <Route path='/admin-appointment' element={<Aappointment/>} />
          <Route path='/patient' element={<Patient/>} />

        {/* doctor router */}
          <Route path='/doctor-dashboard' element={<Dashboard/>} />
          <Route path='/doctor-profile' element={<Profile/>} />
          <Route path='/doctor-appointment' element={<Appointment/>} />
          
        
        </Routes>
      </div>
    </div>
  )
  :
  (
    <Login/>
  )
}

export default App
