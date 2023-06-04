import "./App.css";
import Login from "./component/Login";
import Register from "./component/Register";
import Download from "./component/Download";
import VerifyOTP from "./VerifyOTP";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/VerifyOtp/:email" element={<VerifyOTP />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Download" element={<Download />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
