import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { FaMoneyBillWave, FaCog, FaShoppingCart } from "react-icons/fa";
import { RiBankFill } from "react-icons/ri";
import { NavLink } from "react-router";
import SevenDuck from "/logo.png";


export const Navbar = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-white p-4 w-60">
      <div className="flex items-center mb-6">
        <h1 className="text-xl font-bold">Crypto Hill's</h1>
        <img src={SevenDuck} alt="Seven Duck Alliance" className="w-9 h-9 rounded-full ml-2" />
      </div>
      <ul className="space-y-2">
        <li>
          <NavLink to="/dashboard" className="flex items-center p-3 rounded-lg hover:bg-gray-800 focus:bg-gradient-to-r from-blue-500 to-purple-600">
            <MdOutlineSpaceDashboard />
            <span className="ml-3">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/withdraw" className="flex items-center p-3 rounded-lg hover:bg-gray-800 focus:bg-gradient-to-r from-blue-500 to-purple-600">
            <FaMoneyBillWave />
            <span className="ml-3">WithDraw</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/deposits" className="flex items-center p-3 rounded-lg hover:bg-gray-800 focus:bg-gradient-to-r from-blue-500 to-purple-600">
            <RiBankFill />
            <span className="ml-3">Deposits</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/buy-miner" className="flex items-center p-3 rounded-lg hover:bg-gray-800 focus:bg-gradient-to-r from-blue-500 to-purple-600">
            <FaShoppingCart />
            <span className="ml-3">Buy Miner</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className="flex items-center p-3 rounded-lg hover:bg-gray-800 focus:bg-gradient-to-r from-blue-500 to-purple-600">
            <FaCog />
            <span className="ml-3">Settings</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className="flex items-center p-3 rounded-lg hover:bg-gray-800 focus:bg-gradient-to-r from-blue-500 to-purple-600">
            <FaRegUser />
            <span className="ml-3">Profile</span>
          </NavLink>
        </li>
      </ul>
      <div className="mt-auto">
        <NavLink to="/logout" className="flex items-center p-3 rounded-lg hover:bg-gray-800">
          <BiLogOut />
          <span className="ml-3">Log Out</span>
        </NavLink>
      </div>
    </div>
  );
};
