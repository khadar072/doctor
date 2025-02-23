import React, { useContext, useState } from "react";
import axios from "axios";
import { assets } from "@/assets/assets";
import { AdminContext } from "@/context/AdminContext";

const AddDoctor = () => {
  const [docImage, setDocImage] = useState(null);
  const [docName, setDocName] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [docPassword, setDocPassword] = useState("");
  const [docExperience, setDocExperience] = useState("1 Year");
  const [docFees, setDocFees] = useState("");
  const [docAbout, setDocAbout] = useState("");
  const [docSpeciality, setDocSpeciality] = useState("Surgery");
  const [docAddress, setDocAddress] = useState("");
  const [docDegree, setDocDegree] = useState("");
  const [docAge, setDocAge] = useState("");
  const [docGender, setDocGender] = useState("");
  const { atoken } = useContext(AdminContext);
  const submitHandle = async (e) => {
    e.preventDefault();

    try {
      if (!docImage) {
        alert("Please select an image");
        return;
      }

      const formData = new FormData();

      formData.append("name", docName);
      formData.append("email", docEmail);
      formData.append("password", docPassword);
      formData.append("experience", docExperience);
      formData.append("gender", docGender);
      formData.append("address", docAddress);
      formData.append("degree", docDegree);
      formData.append("fees", Number(docFees));
      formData.append("about", docAbout);
      formData.append("speciality", docSpeciality);
      formData.append("age", docAge);
      formData.append("image", docImage); // Image field

      const { data } = await axios.post(
        "http://localhost:4300/admin/api/add-doctor",
        formData,
        {
          headers: {
            atoken,
          },
        }
      );

      if (data.success) {
        alert("Doctor added successfully");
        setDocImage(null);
        setDocName("");
        setDocEmail("");
        setDocPassword("");
        setDocAddress("");
        setDocAbout("");
        setDocDegree("");
        setDocFees("");
        setDocAge("");
        setDocExperience("1 Year");
        setDocSpeciality("Surgery");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocImage(file); // Set the selected file
    }
  };

  return (
    <div className="mt-16 pt-4 pl-5 xl:px-5 ml-40 bg-[#E3EEFF] w-full min-h-screen">
      <form
        onSubmit={submitHandle}
        className="w-full px-10 xl:px-16 flex flex-col gap-2 py-5 xl:py-10"
      >
        <p>Add Doctor</p>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <label htmlFor="doc-img">
              <img
                src={docImage ? URL.createObjectURL(docImage) : assets.noUser} // Use placeholder or selected file
                className="w-16 border border-blue-600 bg-white pt-1 px-1"
                alt="Doctor"
              />
            </label>
            <input
              type="file"
              id="doc-img"
              onChange={handleImageChange} // Call the handler
              hidden
            />
            <p className="text-sm mt-2">
              Upload doctor <br />
              picture
            </p>
          </div>
          <div className="flex gap-0 w-full">
            <div className="w-1/2 flex flex-col gap-1">
              {/* Doctor Details */}
              <div>
                <p>Doctor Name</p>
                <input
                  type="text"
                  onChange={(e) => setDocName(e.target.value)}
                  className="border pl-4 text-sm py-1 rounded border-gray-800 w-[90%]"
                  placeholder="Name"
                  required
                />
              </div>
              <div>
                <p>Doctor Email</p>
                <input
                  type="email"
                  onChange={(e) => setDocEmail(e.target.value)}
                  className="border pl-4 text-sm py-1 rounded border-gray-800 w-[90%]"
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <p>Doctor Password</p>
                <input
                  type="text"
                  onChange={(e) => setDocPassword(e.target.value)}
                  className="border pl-4 text-sm py-1 rounded border-gray-800 w-[90%]"
                  placeholder="Password"
                  required
                />
              </div>
              <div>
                <p>Doctor Gender</p>
                <input
                  type="text"
                  onChange={(e) => setDocGender(e.target.value)}
                  className="border pl-4 text-sm py-1 rounded border-gray-800 w-[90%]"
                  placeholder="Gender"
                  required
                />
              </div>
              <div>
                <p>Doctor Age</p>
                <input
                  type="text"
                  onChange={(e) => setDocAge(e.target.value)}
                  className="border pl-4 text-sm py-1 rounded border-gray-800 w-[90%]"
                  placeholder="Age"
                  required
                />
              </div>
            </div>
            <div className="w-1/2 flex flex-col gap-1">
              {/* Doctor Additional Details */}
              <div>
                <p>Doctor Degree</p>
                <input
                  type="text"
                  onChange={(e) => setDocDegree(e.target.value)}
                  className="border pl-4 text-sm py-1 rounded border-gray-800 w-[90%]"
                  placeholder="Certificate"
                  required
                />
              </div>
              <div>
                <p>Doctor Speciality</p>
                <select
                  onChange={(e) => setDocSpeciality(e.target.value)}
                  className="border pl-4 text-sm py-1 rounded border-gray-800 w-[90%]"
                >
                  <option value="Surgery">General Surgery</option>
                  <option value="Neurological">Neurological</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="Dentist">Dentist</option>
                  <option value="General Doctor">General Doctor</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Otology">Otology</option>
                </select>
              </div>

              <div>
                <p>Doctor Experience</p>
                <select
                  onChange={(e) => setDocExperience(e.target.value)}
                  className="border pl-4 text-sm py-1 rounded border-gray-800 w-[90%]"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={`${i + 1} Year`}>
                      {i + 1} Year
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p>Doctor Address</p>
                <input
                  type="text"
                  onChange={(e) => setDocAddress(e.target.value)}
                  className="border pl-4 text-sm py-1 rounded border-gray-800 w-[90%]"
                  placeholder="Address"
                  required
                />
              </div>
              <div>
                <p>Doctor Fees</p>
                <input
                  type="number"
                  onChange={(e) => setDocFees(e.target.value)}
                  className="border pl-4 text-sm py-1 rounded border-gray-800 w-[90%]"
                  placeholder="Fees"
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <p>About Doctor</p>
            <textarea
              onChange={(e) => setDocAbout(e.target.value)}
              className="border pl-4 text-sm py-3 rounded border-gray-800 w-[95%]"
              placeholder="Description"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-[95%] bg-blue-700 py-1 rounded text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
