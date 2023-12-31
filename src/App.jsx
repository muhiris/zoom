import Call from "./screens/Call";
import LandingPage from "./screens/LandingPage";
import ProductDeatils from "./screens/ProductDeatils";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Pricing from "./screens/Pricing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomPlan from "./screens/CustomPlan";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/custom" element={<CustomPlan />} />
        <Route path="/details" element={<ProductDeatils />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/call" element={<Call />} />
        <Route path="/plans" element={<Pricing />} />
      </Routes>
    </BrowserRouter>
  );
}
