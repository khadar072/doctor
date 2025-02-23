import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import  'dotenv/config'
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRouter.js'
import userRouter from './routes/userRouter.js'
import doctorRouter from './routes/doctorRouter.js'


//middleware
const app=express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(cors())

const PORT = process.env.PORT || 5000;
const MONGODB=process.env.MONGOURL;

mongoose.connect(MONGODB)
.then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Database connection error:', error);
});
connectCloudinary()

app.get("/",(req,res)=>{
    res.send('you connect correctily')
})


app.use('/admin/api',adminRouter)
app.use('/doctor/api',doctorRouter)
app.use('/user/api',userRouter)

