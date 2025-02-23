import Doctor from "../modals/doctorSchema.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Appointment from "../modals/appointmentSchema.js";

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
      res.status(500).json({ success: false, message: 'An error occurred while cancelling the appointment' });
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
  
  
  
  
  
