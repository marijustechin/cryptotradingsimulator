import { useAppDispatch } from "../../store/store";
import { logoutUser} from "../../store/features/user/authSlice";

export const Logout = () => {
    const dispatch = useAppDispatch();

    const logout = () => {
        try {
          dispatch(logoutUser());
        } catch (error) {
          console.log("Error to logout", error);
        }
      };

    return (
        <>
            <button onClick={logout} className="px-4 py-2 rounded-[10px] border bg-gradient-to-r from-blue-500 to-purple-600  border-white/47 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer">
              Logout
            </button>
        </>
    )

}

