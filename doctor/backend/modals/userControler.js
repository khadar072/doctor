import User from "../modals/userSchema.js";
import {v2 as cloudinary} from 'cloudinary'
import Doctor from "../modals/doctorSchema.js";
import Appointment from "../modals/appointmentSchema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { format } from "date-fns";
import nodemailer from 'nodemailer'


import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);




// register user
export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing data' });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save to the database
    await user.save();

    // Send response after successful registration
    return res.status(201).json({ success: true, message: 'User created successfully',user });

  } catch (error) {
    console.error(error);
    // Send error response if something goes wrong
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


//login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: userExist._id }, process.env.JWT_SECRET_KEY, {
     // Optional: Add token expiry
    });

    // Return success response
    res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.log(error)
    res.send({success:false,message:error.message})
  }
};


// booking appointment
export const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const { userId } = req.user;

    // Validate input
    if (!slotDate || !slotTime || !userId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Format the slotDate as M/D/YYYY
    const formattedSlotDate = format(new Date(slotDate), "M/d/yyyy");

    // Fetch doctor data
    const docData = await Doctor.findById(docId).select("-password");
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Check if the doctor is available
    if (!docData.available) {
      return res.status(400).json({ success: false, message: "Doctor is not available" });
    }

    // Initialize or update slots_booked
    let slots_booked = docData.slots_booked || {};
    if (!slots_booked[formattedSlotDate]) {
      slots_booked[formattedSlotDate] = [];
    }

    // Check if the slot is already booked
    if (slots_booked[formattedSlotDate].includes(slotTime)) {
      return res.status(400).json({ success: false, message: "This time slot is not available" });
    }

    // Add the slot to the booked slots
    slots_booked[formattedSlotDate].push(slotTime);

    // Fetch user data
    const userData = await User.findById(userId).select("-password");
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create a new appointment
    const newAppointment = new Appointment({
      userId,
      docId,
      userData,
      docData,
      slotDate: formattedSlotDate, // Use the formatted date
      slotTime,
      amount: docData.fees,
      date: new Date(),
    });

    // Save the appointment
    await newAppointment.save();

    // Update the doctor's slots_booked
    await Doctor.findByIdAndUpdate(docId, { slots_booked });

    return res.status(200).json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { userId } = req.user;

    // Fetch appointment data
    const appointmentData = await Appointment.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check if the user is authorized to cancel this appointment
    if (appointmentData.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this appointment' });
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
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while cancelling the appointment' });
  }
};


  //getting all doctors
  export const getAllDoctors = async (req,res) => {
    try {
        const doctors = await Doctor.find()

        res.status(200).json({ success: true, doctors });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message }); 
    }
 }

   //getting all appointment
   export const getAllAppointment = async (req, res) => {
    try {
      const { userId } = req.user; // Extracting userId from req.user
  
      // Finding all appointments for the logged-in user
      const appointments = await Appointment.find({ userId });
  
      res.status(200).json({ success: true,  appointments });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  //forgot-password
  export const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }

    // Create token to send as email
    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET_KEY, { expiresIn: '30m' });

    // URL for resetting the password
    const resetUrl = `http://localhost:5173/reset-password/${userExist._id}/${token}`;

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password',
      html: `
        <h2>Hello ${userExist.name}</h2>
        <p>Please use the URL below to reset your password:</p>
        <p>This link is valid for only 30 minutes.</p>
        <a href="${resetUrl}" style="color: blue; text-decoration: underline;">${resetUrl}</a>
        <p>Regards,</p>
        <p>Khadar</p>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Reset email sent successfully' });
  } catch (error) {
    console.error('Error in forgot-password:', error.message);
    res.status(500).json({ success: false, message: 'Error sending email' });
  }
};

 //reset-password
 export const resetpassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    // Verify the token
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodeToken) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error in reset-password:', error.message);
    res.status(500).json({ success: false, message: 'Error changing password' });
  }
};

// change password
export const changePassword = async (req,res) => {
  try {
    const {userId}= req.user
    const {oldPassword,ConfirmPassword,newPassword}= req.body

    const userExist = await User.findById(userId)

    if (!userExist) {
      return res.status(400).json({ success: false, message: 'user isnot exist' });
    }
    
     const match = await bcrypt.compare(oldPassword,userExist.password)

     if (!match) {
      return res.status(400).json({ success: false, message: 'password is incorrect' });
     }
     if (newPassword !== ConfirmPassword) {
      return res.status(400).json({ success: false, message: 'please entir same password' });
     }

     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(newPassword, salt);

     userExist.password = hashedPassword;
     await userExist.save()
     return res.status(400).json({ success: true, message: 'password changed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

//get user detail
export const getUser = async (req,res) => {
    try {
      const {userId}=req.user

      const userExist = await User.findById(userId)

      res.status(500).json({ success: true, data: userExist });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
}

export const updateUser = async (req, res) => {
  try {
    const {userId} = req.user
     const {name,address,dob,gender,phone}=req.body
     const image=req.file;

     if(!name || !dob || !address || !gender || !phone){
         res.status(500).json({ success: false, message: "data is missing" });
     }

     await User.findByIdAndUpdate(userId,{name,dob,gender,address,phone})

     if (image) {
          // Upload image to Cloudinary
          const imageUpload = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
          const imageUrl = imageUpload.secure_url;

          await User.findByIdAndUpdate(userId,{image:imageUrl})
     }


     res.status(500).json({ success: true, message: "profile is updated" });

  } catch (error) {
    console.error("Error updating user:", error); // Log any errors
    res.status(500).json({ success: false, message: error.message });
  }
};


export const checkout = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Find the appointment in the database
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Appointment with Dr. ${appointment.docData?.name || 'Doctor'}`,
              description: `Patient Name: ${appointment.userData.name}, Slot: ${appointment.slotDate} at ${appointment.slotTime}`,
            },
            unit_amount: appointment.amount * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      customer_email: appointment.userData.email, // Use the email provided
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        appointmentId: appointmentId, // Add metadata for webhook identification
      },
    });

    // Update the appointData with checkout details
    appointment.appointData = {
      ...appointment.appointData, // Preserve existing data
      currency: 'usd',
      doctor_name: appointment.docData?.name || 'Doctor',
      patient_name: appointment.userData.name,
      appointment_date: appointment.slotDate,
      appointment_time: appointment.slotTime,
      unit_amount: appointment.amount , // Amount in cents
      mode: 'payment',
      customer_email: appointment.userData.email,
    };

    // Mark payment as complete
    appointment.payment = true;

    // Save the updated appointment document
    await appointment.save();

    // Return the session URL to the client for redirection
    res.status(200).json({
      success: true,
      message: 'Checkout session created successfully',
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};









