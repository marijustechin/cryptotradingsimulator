import { Link } from "react-router";
import { mainNavLinks, registerLinks } from "./mainNavLinks";
import logo from "/logo.png"
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logoutUser, selectUser } from "../../store/features/user/authSlice"
import { BiLogOut } from "react-icons/bi";

export const Header = () => {
const user = useAppSelector(selectUser);
const dispatch = useAppDispatch()

const logout = () => {
  try {
    dispatch(logoutUser())
  } catch (error) {
    console.log("Error to logout", error)
  }
}

  return (
    <div className="flex justify-between nav w-[80.34vw] mx-auto h-[8vh] items-center">
      {/* Logo */}
      <div>
        <img className="w-[100px] h-[100px] justify-start relative z-10" src={logo} alt="Seven Ducks Alliance Logo" />
      </div>

      <div className="flex w-full justify-between items-center">
        {/* Navigation Links */}
        <div className="text-white flex flex-1 justify-center gap-3 inter text-[14px] font-semibold">
          {mainNavLinks.map((link) => (
            <div key={link.title}>
              <Link to={link.href}>{link.title}</Link>
            </div>
          ))}
        </div>

        {/* Sign Buttons */}
        {user && user.id ?(
        <button
        onClick={logout}
        className="text-[30px] cursor-pointer"><BiLogOut /></button> 
        )
        : (
          <div className="flex justify-end items-center gap-3">
          {registerLinks.map((link, index) => (
            <div key={link.title}>
              <Link
                to={link.href}
                className={`px-4 py-2 rounded-[10px] border border-white/47 ${
                  index === registerLinks.length - 1
                    ? "bg-[linear-gradient(225deg,_#18C8FF_14.89%,_#933FFE_85.85%)]"
                    : ""
                }`}
              >
                {link.title}
              </Link>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};
