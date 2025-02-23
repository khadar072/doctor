import express from 'express'
import { addDoctor, appointmentPerWeek, avialibility,cancelAppointment, countAmount, countAppointment, countDoctors, countPatient, getAllAppointment, getAllDoctors, getAllPatient, getmonthly, getSpecialtyData, login } from '../controller/adminControler.js'
import upload from '../middleware/multer.js'
import { adminauth } from '../middleware/authadmin.js'


const router=express.Router()




router.post('/login',login)
router.post('/add-doctor',adminauth,  upload.single('image'),addDoctor)
router.get('/get-doctors',adminauth,getAllDoctors)
router.get('/get-users',adminauth,getAllPatient)
router.post('/avialability-change',adminauth,avialibility)
router.get('/get-appointments',adminauth,getAllAppointment)
router.post('/cancel-appointement',adminauth,cancelAppointment )
router.get('/count-doctors',adminauth,countDoctors )
router.get('/count-appointment',adminauth,countAppointment )
router.get('/count-patient',adminauth,countPatient )
router.get('/count-amount',adminauth,countAmount )
router.get('/count-speciality',adminauth,getSpecialtyData )
router.get('/Monthly-Payments', adminauth, getmonthly);
router.get('/appointments-per-week', adminauth, appointmentPerWeek);





export default router