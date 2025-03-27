import { AdminContext } from "@/context/AdminContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Update = () => {
  const { docId } = useParams();
  const { atoken } = useContext(AdminContext);
  const navigate = useNavigate();

  // Ensure all fields have default values to avoid uncontrolled input warning
  const [docData, setDocData] = useState({
    name: "",
    age: "",
    address: "",
    speciality: "",
    degree: "",
    experience: "",
    fees: "",
    about: "",
    image: "",
  });

  const [image, setImage] = useState(null);

  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", docData.name);
      formData.append("age", docData.age);
      formData.append("address", docData.address);
      formData.append("speciality", docData.speciality);
      formData.append("degree", docData.degree);
      formData.append("experience", docData.experience);
      formData.append("fees", docData.fees);
      formData.append("about", docData.about);

      const { data } = await axios.post(
        `http://localhost:4300/admin/api/update-doctor/${docId}`,
        formData,
        { headers: { atoken } }
      );

      if (data.success) {
        await getDoctor();
        setImage(null);
        navigate('/doctors');
      }
    } catch (error) {
      console.error("Error updating doctor profile:", error);
    }
  };

  const getDoctor = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4300/admin/api/get-doctor/${docId}`,
        { headers: { atoken } }
      );
      if (data.success && data.doctor) {
        setDocData(data.doctor);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error.message);
    }
  };

  useEffect(() => {
    if (atoken) {
      getDoctor();
    }
  }, [atoken]);

  return (
    <div className="mt-16 flex flex-col gap-6 pt-10 pl-5 xl:px-5 ml-40 xl:ml-48 w-full bg-[#E3EEFF] min-h-screen">
      <div className="flex w-full gap-6">
        <img
          src={image ? URL.createObjectURL(image) : docData.image || "/default-image.png"}
          className="w-56 border border-blue-500 object-cover"
          alt="Profile"
        />
        <div className="flex flex-1 flex-col gap-2">
          {[
            { label: "Name", key: "name" },
            { label: "Age", key: "age" },
            { label: "Speciality", key: "speciality" },
            { label: "Experience", key: "experience" },
            { label: "Degree", key: "degree" },
            { label: "Address", key: "address" },
            { label: "Fees", key: "fees" },
            { label: "About", key: "about" },
          ].map((field) => (
            <div key={field.key} className="flex items-center gap-2">
              <p className="font-medium">{field.label}:</p>
              <input
                className="border rounded border-gray-300 px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                value={docData[field.key] || ""}
                onChange={(e) =>
                  setDocData((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }))
                }
              />
            </div>
          ))}

          <div className="flex gap-5">
            <Link
              to="/doctors"
              className="w-40 text-center bg-black py-1 rounded-lg text-white mt-2"
            >
              Back
            </Link>
            <button
              onClick={updateProfile}
              className="w-40 text-center bg-green-600 py-1 rounded-lg text-white mt-2"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;
