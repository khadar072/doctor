import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const DoctorContext = createContext();

const ConnectDoctorContext = (props) => {
    const [dtoken, setDtoken] = useState(localStorage.getItem('dtoken')?localStorage.getItem('dtoken'):''); 
      const [docData, setDocData] = useState({ });

    const getDoctor = async () => {
        try {
          const { data } = await axios.get(
            'http://localhost:4300/doctor/api/get-doctor',
            {
              headers: { dtoken },
            }
          );
          if (data.success) { 
            setDocData(data.doctor)
          }
        } catch (error) {
          console.error('Error fetching doctor data:', error.message);
        }
      };
    
      useEffect(() => {
        if (dtoken) {
          getDoctor();
        }
      }, [dtoken]);



    const value = {
        dtoken,
        setDtoken,
        getDoctor,
        docData,
        setDocData
     
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children} {/* Correctly render children */}
        </DoctorContext.Provider>
    );
};

export default ConnectDoctorContext;