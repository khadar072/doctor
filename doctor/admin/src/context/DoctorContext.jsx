import React, { createContext, useState } from "react";

export const DoctorContext = createContext();

const ConnectDoctorContext = (props) => {
    const [dtoken, setDtoken] = useState(localStorage.getItem('dtoken')?localStorage.getItem('dtoken'):''); 
    const value = {
        dtoken,
        setDtoken,
     
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children} {/* Correctly render children */}
        </DoctorContext.Provider>
    );
};

export default ConnectDoctorContext;