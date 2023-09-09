import LandingPage from "./screens/LandingPage";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/home" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
