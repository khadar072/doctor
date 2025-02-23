import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ConnectAdminContext from "./context/AdminContext.jsx";
import ConnectDoctorContent from "./context/DoctorContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConnectAdminContext>
        <ConnectDoctorContent>
          <App />
        </ConnectDoctorContent>
      </ConnectAdminContext>
    </BrowserRouter>
  </React.StrictMode>
);
