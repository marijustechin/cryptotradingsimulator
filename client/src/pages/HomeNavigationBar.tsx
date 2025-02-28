import { useNavigate } from "react-router";
import logo from "../../images/logo.png"

export const NavigationBar = () => {
    const navigate = useNavigate();


    const handleClick = (): void => {
        navigate("/");
    }


    return (
        <>
            <div className="flex justify-between nav w-[80.34vw] mx-auto h-[8vh] items-center">

                {/* Logo */}
                <div>
                    <img className="w-[100px] h-[100px] justify-start relative z-10" src={logo}></img>
                </div>

                <div className="text-white flex-1 flex justify-center gap-3 inter text-[14px] font-semibold">
                    {/* This could be a different now just EXAMPLE*/}
                    <h4>Buy/Sell</h4>
                    <h4>Grow</h4>
                    <h4>Markets</h4>
                    <h4>Business</h4>
                    <h4>Support</h4>
                </div>

                {/* Sign Buttons */}
                <div className="flex justify-center items-center gap-3">
                        <button
                        className="text-white text-[14px] rounded-[10px] border-1 w-[96px] h-[40px]"
                        onClick={() => handleClick()}>
                        <h4 className="">Sign In</h4>
                        </button>
                        <button
                        className="rounded-[10px] border-1 border-white/47 w-[96px] h-[40px] bg-[linear-gradient(225deg,_#18C8FF_14.89%,_#933FFE_85.85%)]"
                        onClick={() => handleClick()}>
                        <h4 className="inter font-semibold text-[16px]">Sign up</h4>
                        </button>
                    </div>
            </div>
        </>
    )
} 
