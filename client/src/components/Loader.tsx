import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const Loader = () => {

    return (
      <div className="flex items-center justify-center bg-none">
    <DotLottieReact
        src="https://lottie.host/7d74b156-aa50-44cd-91d1-792e52a3d5e3/WSlwzxyAty.lottie"
        loop
        autoplay
        className="w-50 h-30 min-h-screen"
      />
    </div>
    )

}