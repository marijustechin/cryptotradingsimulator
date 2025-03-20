import { useNavigate } from "react-router";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const NotFoundContent = () => {
  const navigate = useNavigate();

  return (
    <main>
      <h1 className="text-center text-lg md:text-3xl p-5">
        Oops...The page you are looking for not found{" "}
      </h1>
      <section className="">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1 text-center">
    <DotLottieReact
      src="https://lottie.host/a03dea08-1e1c-4a37-8282-f7194d12616a/O5YmTu5Jeh.lottie"
      loop
      autoplay
    />
              {/* <div className="h-[400px] bg-[url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')] bg-center bg-no-repeat rounded-3xl"></div> */}

              <div className="contant_box_404 mt-6">
                <button
                  onClick={() => navigate(-1)}
                  type="button"
                  className="btn-generic mt-6"
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};