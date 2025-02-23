import express from 'express'
import { bookAppointment, cancelAppointment, changePassword, checkout, forgotpassword, getAllAppointment, getAllDoctors, getUser, login, resetpassword, updateUser, userRegister } from '../controller/userControler.js'
import { userauth } from '../middleware/authUser.js'
import upload from '../middleware/multer.js'


const router=express.Router()

// user  routes
router.post('/user-register',userRegister)
router.post('/user-login',login)
router.get('/get-user',userauth,getUser)
router.post('/profile-update',userauth,upload.single('image'),updateUser)


// doctor routes
router.get('/get-doctors',getAllDoctors)
router.get('/get-appointments',userauth,getAllAppointment)
router.post('/book-appointement',userauth,bookAppointment)
router.post('/cancel-appointement',userauth,cancelAppointment )


// Stripe payment routes
router.post('/checkout', userauth, checkout);





// password management  routes
router.post('/change-password',userauth,changePassword )
router.post('/forgot-password',forgotpassword)
router.post('/reset-password/:id/:token', resetpassword);


export default router