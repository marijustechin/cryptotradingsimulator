import { useNavigate } from "react-router";
import { Player } from "@lottiefiles/react-lottie-player";
import { useTranslation } from "react-i18next";

export const NotFoundContent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main>
      <h1 className="text-center text-lg md:text-3xl p-5">
        {t("not_found_title")}
      </h1>
      <section className="">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <Player src="/404.json" loop autoplay />
              <div className="contant_box_404 mt-6">
                <button
                  onClick={() => navigate(-1)}
                  type="button"
                  className="btn-generic mt-6"
                >
                  {t("not_found_go_back")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};