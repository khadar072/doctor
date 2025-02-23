import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: String, 
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    fees: {
        type: Number,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now // MongoDB will store this in UTC by default
    },
    slots_booked: {
        type: Object,
        default: {}
    }
}, { minimize: false });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
  