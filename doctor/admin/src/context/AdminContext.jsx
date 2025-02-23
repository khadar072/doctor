import React, { createContext, useState } from "react";

export const AdminContext = createContext();

const ConnectAdminContext = (props) => {
    const [atoken, setAtoken] = useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):''); 
    const value = {
        atoken,
        setAtoken,
     
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children} {/* Correctly render children */}
        </AdminContext.Provider>
    );
};

export default ConnectAdminContext;