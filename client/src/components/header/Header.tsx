import { Link, useLocation } from "react-router";
import { mainNavLinks, registerLinks } from "./mainNavLinks";
import logo from "/logo.png"
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logoutUser, selectUser } from "../../store/features/user/authSlice"

export const Header = () => {
const user = useAppSelector(selectUser);
const dispatch = useAppDispatch()
const location = useLocation()

  const logout = () => {
    try {
      dispatch(logoutUser());
    } catch (error) {
      console.log('Error to logout', error);
    }
  };

return (
  <div className="flex items-center justify-between w-[80vw] mx-auto h-[8vh]">

    {/* Logo */}
    <div className="flex-1 flex justify-start">
      <Link to="/"><img className="h-18 relative z-10" src={logo} alt="Seven Ducks Alliance Logo" />
      </Link>
    </div>

    
    <div className="flex-1 flex justify-center text-white gap-6 inter text-[14px] font-semibold">
      {/* Navigation Links */}
      {mainNavLinks
      .filter((link) => user.id || link.title !== "My Dashboard" )
      .map((link) => (   
        <div key={link.title}>
          <Link to={link.href}
          className={`hover:shadow-lg hover:shadow-purple-500/90 transition-all duration-300 cursor-pointer ${
            location.pathname === link.href
            ? "border-b p-[2px] pb-2 border-violet-600"
            : ""
          }`}
          >{link.title}</Link>
        </div>
      ))}
    </div>

     {/* Sign Buttons */}
    <div className="flex-1 flex justify-end items-center gap-3">
      {user && user.id ? (
        <button
         onClick={logout}
         className="px-4 py-2 rounded-[10px] border bg-gradient-to-r from-blue-500 to-purple-600  border-white/47 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer">
          Logout
        </button> 
      ) : (
        registerLinks.map((link, index) => (
          <div key={link.title}>
            <Link
              to={link.href}
              className={`px-4 py-2 rounded-[10px] border border-white/47 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 ${
                index === registerLinks.length - 1
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  : ""
              }`}
            >
              {link.title}
            </Link>
          </div>
        ))
      )}
    </div>

  </div>
);
}
