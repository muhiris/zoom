import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import LogoWithText from "../assets/logowithtext.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice/user/userSlice"
import { useSocket } from "../context/socketContext";

function HamburgerNav() {
  
  const dispatch = useDispatch();
  const socket = useSocket();
  const { userInfo } = useSelector(state => state.user);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  // useEffect(() => {
  //   const handleOutsideClick = (event) => {
  //     if (isOpen && !event.target.closest(".sidebar")) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleOutsideClick);
  //   return () => {
  //     document.removeEventListener("mousedown", handleOutsideClick);
  //   };
  // }, [isOpen]);

  return (
    <div className="lg:hidden mobile:flex z-10">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-4 focus:outline-none"
      >
        <HiMenu className="h-8 w-8" />
      </button>
      <aside
        className={`fixed lg:relative top-0 left-0 lg:static bg-black h-screen w-60 lg:w-16 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ` }
      >
        <ul className="flex flex-col items-center gap-10 mt-10 text-white text-xl justify-between w-full p-3">
        <li>
            <Link to={"/"}>
              <img src={LogoWithText} alt="" style={{ width: "120px" }} />
            </Link>
          </li>
          <li>
            <NavLink to="/details">About Us</NavLink>
          </li>
          <li className="text-white text-xl">
            <NavLink to="/plans">Products</NavLink>
          </li>
          <li>
            <NavLink to="/custom">Solutions</NavLink>
          </li>
          <li>
            <NavLink to="/details">Resources</NavLink>
          </li>
          <li>
            <NavLink to="/plans">Plan & Pricing</NavLink>
          </li>
          <li className="hidden text-primary lg:block">
            <NavLink to="/custom">Contact Sales</NavLink>
          </li>
          {!userInfo?._id ? <li className="lg:hidden">
            <Link
              to="/signup"
              className=" p-3 px-5 border-2 border-primary text-primary rounded-2xl hover:translate-y-1 hover:shadow-md transition-all duration-300 ease-in-out"
            >
              SignUp for Free
            </Link>
          </li>
            :
            <li onClick={() => {
              if(socket){
                socket.disconnect();
              }
              dispatch(logout())
            }} className="lg:hidden">
              <div
                className=" p-2 px-5 border-2 border-[red] text-[red] rounded-2xl hover:translate-y-1 hover:shadow-md transition-all duration-300 ease-in-out"
              >
                Logout
              </div>
            </li>
          }
        </ul>
      </aside>
    </div>
  );
}

export default HamburgerNav;
