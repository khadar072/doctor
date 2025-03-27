import express from 'express'
import { avialibility, cancelAppointment, completeAppointment, countAmount, countAppoitments, countPatient, doctorchangePassword, getAppointments, getdoctor, login, updatedoctor } from '../controller/doctorControler.js'
import { authdoctor } from '../middleware/authDoctor.js'
import upload from '../middleware/multer.js'




const router=express.Router()


router.post('/login',login)
router.get('/get-doctor',authdoctor,getdoctor)
router.post('/update-doctor',authdoctor,upload.single("image"),updatedoctor)
router.post('/change-password',authdoctor,doctorchangePassword)
router.post('/avialability-change',authdoctor,avialibility)
router.get('/get-appointment',authdoctor,getAppointments)
router.get('/count-appointment',authdoctor,countAppoitments)
router.get('/count-amount',authdoctor,countAmount)
router.get('/count-pateint',authdoctor,countPatient)
router.post('/cancel-appointment',authdoctor,cancelAppointment)
router.post('/complete-appointment',authdoctor,completeAppointment)



export default router