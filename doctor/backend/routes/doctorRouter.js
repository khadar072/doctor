import express from 'express'
import { cancelAppointment, completeAppointment, countAmount, countAppoitments, countPatient, getAppointments, getdoctor, login } from '../controller/doctorControler.js'
import { authdoctor } from '../middleware/authDoctor.js'




const router=express.Router()


router.post('/login',login)
router.get('/get-doctor',authdoctor,getdoctor)
router.get('/get-appointment',authdoctor,getAppointments)
router.get('/count-appointment',authdoctor,countAppoitments)
router.get('/count-amount',authdoctor,countAmount)
router.get('/count-pateint',authdoctor,countPatient)
router.post('/cancel-appointment',authdoctor,cancelAppointment)
router.post('/complete-appointment',authdoctor,completeAppointment)



export default router