import Doctor from "../modals/doctorSchema.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Appointment from "../modals/appointmentSchema.js";
import {v2 as cloudinary} from 'cloudinary';

  //doctor login
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const doctorExist = await Doctor.findOne({ email });
  
      if (!doctorExist) {
        return res.status(400).json({ success: false, message: 'Doctor not exist' });
      }
  
      const match = await bcrypt.compare(password, doctorExist.password);
  
      if (match) {
        const dtoken = await jwt.sign({ docId: doctorExist._id }, process.env.JWT_SECRET_KEY);
        res.status(200).json({ success: true, message: 'Logged in successfully', dtoken });
      } else {
        return res.status(400).json({ success: false, message: 'Password not correct' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
};

  //update doctor
export const updatedoctor = async (req,res)=>{
    try {
        const { docId } = req.doctor;
        const { name, address, age,about } = req.body;
        const image = req.file; // Uploaded image

        const doctorExist = await Doctor.findById( docId );
  
        if (!doctorExist) {
          return res.status(400).json({ success: false, message: 'Doctor not exist' });
        }
    
        // Validate required fields
        if (!name || !age || !address || !about ) {
          return res.status(400).json({ success: false, message: "Data is missing" });
        }
    
        const updateData = { name,  address, age ,about };
    
        // Handle image upload if present
        if (image) {
          const imageUpload = await cloudinary.uploader.upload(image.path, { resource_type: "image" });
          updateData.image = imageUpload.secure_url;
        }
    
        // Update the user in one database call
        const updatedDoctor = await Doctor.findByIdAndUpdate(docId, updateData, { new: true });
      


        return res.status(200).json({ success: true, message: "doctor Profile updated successfully",updatedDoctor });
    
      } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ success: false, message: error.message });
      }
}

// change password
export const doctorchangePassword = async (req, res) => {
  try {
    const { docId } = req.doctor;
    const { oldPassword, newPassword, ConfirmPassword } = req.body;

    const doctorExist = await Doctor.findById(docId);

    if (!doctorExist) {
      return res.status(400).json({ success: false, message: 'doctor does not exist' });
    }

    const match = await bcrypt.compare(oldPassword, doctorExist.password);

    if (!match) {
      return res.status(400).json({ success: false, message: 'Old password is incorrect' });
    }

    if (newPassword !== ConfirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    doctorExist.password = hashedPassword;
    await doctorExist.save();

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

  //cancel appointment
export const cancelAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.body;
      const { docId } = req.doctor
  
      // Fetch appointment data
      const appointmentData = await Appointment.findById(appointmentId);
      if (!appointmentData) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
    
      // Check if the user is authorized to cancel this appointment
      if (appointmentData.docId.toString() !== docId) {
        return res.status(403).json({ success: false, message: 'Unauthorized to cancel this appointment' });
      }
  
      // Mark the appointment as cancelled
      await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
  
     
  
      
  
      res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
};

  //complete appointment
export const completeAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.body;
      const { docId } = req.doctor
  
      // Fetch appointment data
      const appointmentData = await Appointment.findById(appointmentId);
      if (!appointmentData) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
    
      // Check if the user is authorized to cancel this appointment
      if (appointmentData.docId.toString() !== docId) {
        return res.status(403).json({ success: false, message: 'Unauthorized to cancel this appointment' });
      }
  
      // Mark the appointment as cancelled
      await Appointment.findByIdAndUpdate(appointmentId, { isCompletted: true });

      res.status(200).json({ success: true, message: 'Appointment completed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
};

 //getting user appointment
export const getAppointments = async (req, res) => {
  try {
    const { docId } = req.doctor; // Extracting doctorId from req.doctor
    
    // Finding all appointments for the logged-in doctor
    const appointments = await Appointment.find({ docId });

    if (!appointments) {
      return res.status(404).json({ success: false, message: "No appointments found." });
    }

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

 //count appointment
export const countAppoitments = async (req,res) =>{
    try {
      const {docId} =req.doctor
      const count = await Appointment.aggregate([
        {
            $match: {
                isCompletted: true // Filter only completed appointments
            }
        },
        {
          $group: {
            _id: docId, // Group all documents into one group
            totalAppointment: { $sum: 1 }, // Count the number of documents
            
          },
        },
      ]);
  
      // Send the response back to the client
      res.status(200).json({ success: true, count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
}
  
 //count fees amount
export const countAmount = async (req,res) =>{
    try {
      const {docId} =req.doctor
      const count = await Appointment.aggregate([
        {
            $match: {
                payment: true // Filter only completed appointments
            }
        },
        {
          $group: {
            _id: docId, // Group all documents into one group
            totalEarning: { $sum: '$amount' }, // Count the number of documents
            
          },
        },
      ]);
  
      // Send the response back to the client
      res.status(200).json({ success: true,  count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
}
  
   //count patient
export const countPatient = async (req, res) => {
    try {
      const { docId } = req.doctor; // Get the doctor ID from the request
  
      // Perform aggregation to count the number of unique users (patients) for the doctor
      const count = await Appointment.aggregate([
        {
          $match: {
            docId: docId, // Filter appointments by doctor ID
            isCompletted: true, // Ensure field name matches schema exactly
          },
        },
        {
          $group: {
            _id: "$userId", // Group by userId to count unique users
          },
        },
        {
          $count: "totalUsers", // Count the unique userId values
        },
      ]);
  
      res.status(200).json({ success: true,  count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
};


  //get doctor
export const getdoctor = async (req,res)=>{
      try {
        const {docId} = req.doctor;
        const doctor = await Doctor.findById(docId)

        
          res.status(200).json({ success: true,  doctor });  
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
      }
}
  

  //make doctor available or inavialable
export const avialibility = async (req,res) => {
      try {
          const {docId}=req.body
  
          const docData=await Doctor.findById(docId)
  
          await Doctor.findByIdAndUpdate(docId,{available: !docData.available})
          res.status(200).json({success:true, message: 'avialability changed' });
      } catch (error) {
          console.log(error)
          res.send({success:false,message:error.message})
      }
}
  
  
  
  
