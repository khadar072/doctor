import {v2 as cloudinary} from 'cloudinary'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Doctor from "../modals/doctorSchema.js";
import Appointment from '../modals/appointmentSchema.js';
import User from '../modals/userSchema.js';



//admin login
export const login = async  (req,res) => {
    try {
        const {email,password}=req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const atoken=await jwt.sign(email+password,process.env.JWT_SECRET_KEY)
            res.status(200).json({success:true, message: 'logged successfully',atoken });
        }else{
            res.status(200).json({success:false, message: 'you are not authenticated' });
        }
    } catch (error) {
        console.log(error)
        res.send({success:false,message:error.message})
    }
}

// adding doctors
export const addDoctor = async (req, res) => {
  try {
      const { name, email, password, speciality, address, about, fees, experience ,degree, age, gender } = req.body;
      const image = req.file;

      // Check for missing fields
      if (!name || !email || !password || !speciality || !address || !about || !fees || !experience || !degree || !age || !gender || !image) {
          return res.status(400).json({ success: false, message: 'One or more details are missing' });
      }

      

      // Check if doctor already exists by email
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
          return res.status(400).json({ success: false, message: 'Doctor with this email already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Upload image to Cloudinary
      const imageUpload = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
      const imageUrl = imageUpload.secure_url;



      // Create a new doctor object
      const doctor = new Doctor({
          name,
          email,
          password: hashedPassword,
          image: imageUrl,
          speciality,
          degree,
          about,
          experience,
          fees,
          address,
          age,
          gender,
          date: Date.now() // Use UTC date here
      });

      // Save to the database
      await doctor.save();

      // Respond with success
      res.status(200).json({ success: true, message: 'Doctor added successfully' });

  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
  }
};

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

//cancelling appointment
export const cancelAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.body;
  
      // Fetch appointment data
      const appointmentData = await Appointment.findById(appointmentId);
      if (!appointmentData) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
  
  
      // Mark the appointment as cancelled
      await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
  
      // Release the booked slot for the doctor
      const { docId, slotDate, slotTime } = appointmentData;
      const doctorData = await Doctor.findById(docId);
      if (!doctorData) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
  
      let slotsBooked = doctorData.slots_booked || {}; // Handle potential undefined value
  
      if (slotsBooked[slotDate]) {
        slotsBooked[slotDate] = slotsBooked[slotDate].filter((time) => time !== slotTime);
  
        // If no slots remain for the date, remove the date entry
        if (slotsBooked[slotDate].length === 0) {
          delete slotsBooked[slotDate];
        }
  
        // Update the doctor's booked slots
        await Doctor.findByIdAndUpdate(docId, { slots_booked: slotsBooked });
      }
  
      res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.log(error)
        res.send({success:false,message:error.message})
    }
};

//getting all doctors
 export const getAllDoctors = async (req,res) => {
    try {
        const doctors = await Doctor.find({}).select('-password ')

        res.status(200).json({ success: true,doctors });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message }); 
    }
 };

 export const getAllPatient = async (req,res) => {
    try {
        const users = await User.find({}).select('-password ')

        res.status(200).json({ success: true,users });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message }); 
    }
 };

//getting all appointment
  export const getAllAppointment = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('userData', '-password') // Populate userData and exclude password
            .populate('docData', '-password'); // Populate docData and exclude password

        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//counting all doctors
export const countDoctors = async (req, res) => {
    try {
        const count = await Doctor.aggregate([
            {
              $group: {
                _id: null, 
                totalDoctors: { $sum: 1 }, 
              },
            },
          ]);
          
         
          res.status(200).json({ success: true, count });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
};

//counting all appointment
export const countAppointment = async (req, res) => {
    try {
      const count = await Appointment.aggregate([
        {
            $match: {
                isCompletted: true // 
            }
        },
        {
          $group: {
            _id: null, 
            totalAppointment: { $sum: 1 }, 
            
          },
        },
      ]);
  
      // Send the response back to the client
      res.status(200).json({ success: true, count });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
};

//counting all fees earned
export const countAmount = async (req, res) => {
    try {
        const totalFees = await Appointment.aggregate([
            {
                $match: {
                    payment: true // Filter only completed appointments
                }
            },
            {
                $group: {
                    _id: null, // Group all documents into one group
                    totalEarnings: { $sum: '$amount' }, // Sum the 'fees' field
                },
            },
        ]);

        // Send the response back to the client
        res.status(200).json({ success: true,  totalFees });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// counting patient
export const countPatient = async(req,res) =>{
    try {
        const count = await User.aggregate([
            {
              $group: {
                _id: null, 
                totalUsers: { $sum: 1 }, 
              },
            },
          ]);
          
         
          res.status(200).json({ success: true, count });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
}

//piecharts
  export const getSpecialtyData = async (req, res) => {
  try {
    const specialtyData = await Appointment.aggregate([
      { $match: { cancelled: false } }, // Exclude cancelled appointments
      {
        $group: {
          _id: "$docData.speciality", // Group by specialty
          count: { $sum: 1 }, // Count the number of appointments per specialty
        },
      },
      { $sort: { count: -1 } }, // Sort by count in descending order
    ]);

    res.status(200).json(specialtyData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching specialty data" });
  }
};

//barchats
export const getmonthly = async (req, res) => {
  try {
    const payments = await Appointment.aggregate([
      {
        $match: {
          payment: true, // Only include completed payments
        },
      },
      {
        $group: {
          _id: { $month: { $toDate: "$date" } }, // Group by month
          totalPayments: { $sum: "$amount" },   // Sum the amount for each month
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    // Map months (1 = Jan, 2 = Feb, ...)
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const formattedData = payments.map((item) => ({
      month: months[item._id - 1],
      payments: item.totalPayments,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//line charts
export const appointmentPerWeek = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month

    // Example: Mocked database query for appointments within the current month
    const appointments = await Appointment.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Group by week
    const weeklyData = {};
    appointments.forEach((appointment) => {
      const weekNumber = Math.ceil(
        (new Date(appointment.date).getDate() - 1) / 7
      );
      weeklyData[weekNumber] = (weeklyData[weekNumber] || 0) + 1;
    });

    // Format the data for the chart
    const result = Array.from({ length: 4 }, (_, index) => ({
      week: `Week ${index + 1}`,
      Appointments: weeklyData[index + 1] || 0,
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching appointments for current month:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};




 
