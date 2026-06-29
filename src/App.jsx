import React from "react";
import Navbar from "./components/layout/Navbar.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import FloatingWhatsApp from "./components/common/FloatingWhatsApp.jsx";

function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
      <FloatingWhatsApp />
    </>
  );
}

export default App;