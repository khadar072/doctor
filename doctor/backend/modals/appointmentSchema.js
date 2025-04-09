import mongoose from 'mongoose';
import { type } from 'os';

const appointmentSchema = new mongoose.Schema({
   userId:{type:String,required:true},
   docId:{type:String,required:true},
   slotDate:{type:String,required:true},
   slotTime:{type:String,required:true},
   userData:{type:Object,required:true},
   docData:{type:Object,required:true},
   appointData:{type:Object,default:{}},
   amount:{type:Number,required:true},
   date:{type:Number,required:true},
   cancelled:{type:Boolean,default:false},
   isCompletted:{type:Boolean,default:false},
   payment:{type:Boolean,default:false},
   rescheduled:{type:Boolean,default:false},
},{minimize:false});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
