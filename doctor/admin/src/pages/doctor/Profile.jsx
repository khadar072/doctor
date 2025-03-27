import React, { useContext, useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import { DoctorContext } from "@/context/DoctorContext";
import { assets } from "@/assets/assets";

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const { dtoken, getDoctor, docData, setDocData } = useContext(DoctorContext);

  const [image, setImage] = useState(null);

  //update profile
  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", docData.name);
      formData.append("age", docData.age);
      formData.append("address", docData.address);
      formData.append("about", docData.about);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        "http://localhost:4300/doctor/api/update-doctor",
        formData,
        { headers: { dtoken } }
      );

      if (data.success) {
        // toast.success(data.message);
        await getDoctor();
        setIsEdit(false);
        setImage(null);
      } else {
        // toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Change password
  const changePassword = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:4300/doctor/api/change-password",
        { oldPassword, newPassword, ConfirmPassword },
        { headers: { dtoken } }
      );

      if (data.success) {
        console.log("Password changed successfully!");
        setoldPassword("");
        setnewPassword("");
        setConfirmPassword("");
      } else {
        console.log(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        // Specific error response from server
        console.log(
          error.response?.data?.message || "Failed to change password."
        );
      } else {
        // General error (network, etc.)
        console.log("An unexpected error occurred.");
      }
      console.error(error);
    }
  };


  //change avialability
  const onchangeHandle = async (docId) => {
    try {
      const { data } = await axios.post('http://localhost:4300/doctor/api/avialability-change', { docId}, { headers: { dtoken } });
      if (data.success) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="mt-16 flex flex-col gap-6 pt-10 pl-5 xl:px-5 ml-40 xl:ml-48 w-full bg-[#E3EEFF] min-h-screen">
      <div className="flex w-full gap-6">
        <img
          src={image ? URL.createObjectURL(image) : docData.image}
          className="w-56 border border-blue-500 object-cover"
          alt="Profile"
        />
        <div className="flex flex-1 flex-col gap-2">
          {isEdit ? (
            <div className="flex items-center gap-2">
              <p className="font-medium">Name:</p>
              <input
                className="border rounded border-gray-300 px-2 py-1   focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                value={docData.name}
                onChange={(e) =>
                  setDocData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-blue-800">
              <span className="text-black font-medium">Name:</span>{" "}
              {docData.name}
            </p>
          )}
          <p className="text-blue-800">
            <span className="text-black font-medium">Email:</span>{" "}
            {docData.email}
          </p>
          {isEdit ? (
            <div className="flex items-center gap-2">
              <p className="font-medium">Speciality:</p>
              <input
                className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                value={docData.speciality}
                onChange={(e) =>
                  setDocData((prev) => ({
                    ...prev,
                    speciality: e.target.value,
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-blue-800">
              <span className="text-black font-medium">Speciality:</span>{" "}
              {docData.speciality}
            </p>
          )}
          {isEdit ? (
            <div className="flex items-center gap-2">
              <p className="font-medium">Address:</p>
              <input
                className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                value={docData.address}
                onChange={(e) =>
                  setDocData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-blue-800">
              <span className="text-black font-medium">Address:</span>{" "}
              {docData.address}
            </p>
          )}

          {isEdit ? (
            <div className="flex items-center gap-2">
              <p className="font-medium">Gender:</p>
              <select
                className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                value={docData.gender}
                onChange={(e) =>
                  setDocData((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          ) : (
            <p className="text-blue-800">
              <span className="text-black font-medium">Gender:</span>{" "}
              {docData.gender}
            </p>
          )}
          {isEdit ? (
            <div className="flex items-center gap-2">
              <p className="font-medium">Age:</p>
              <input
                className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                value={docData.age}
                onChange={(e) =>
                  setDocData((prev) => ({
                    ...prev,
                    age: e.target.value, // Corrected this line to update age instead of address
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-blue-800">
              <span className="text-black font-medium">Age:</span> {docData.age}
            </p>
          )}
          <div className="flex gap-1 items-center ">
            <p className="text-md font-medium  ">Available : </p>
            <input
                    onChange={(e) => onchangeHandle(docData._id)}
                    type="checkbox"
                    checked={docData.available}
                    name=""
                    id=""
                  />
          </div>
          {isEdit ? (
            <div className="flex flex-col w-full gap-2">
              <label className="font-medium">About:</label>
              <textarea
                className="border border-gray-300 w-[95%] px-3 py-2 rounded h-32 focus:outline-none focus:ring focus:ring-blue-300 resize-none"
                value={docData.about}
                onChange={(e) =>
                  setDocData((prev) => ({
                    ...prev,
                    about: e.target.value, // Fixed incorrect key update (was `address`)
                  }))
                }
              />
            </div>
          ) : (
            <div>
              <p className="text-black font-medium">About:</p>
              <p className="text-blue-800">{docData.about}</p>
            </div>
          )}

          <div className="flex items-start gap-4">
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="bg-blue-500 px-6 py-2 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(!isEdit)}
                className="bg-green-500 px-6 py-2 text-white rounded-lg hover:bg-green-600 transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="w-64">
        <div className="flex flex-col gap-2 border border-blue-800 p-4 rounded-lg">
          <input
            type="password"
            className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Previous password"
            value={oldPassword}
            onChange={(e) => setoldPassword(e.target.value)}
          />
          <input
            type="password"
            className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setnewPassword(e.target.value)}
          />
          <input
            type="password"
            className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Confirm password"
            value={ConfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            onClick={changePassword}
            className="bg-blue-800 text-center text-white py-2 rounded hover:bg-blue-900 transition"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
