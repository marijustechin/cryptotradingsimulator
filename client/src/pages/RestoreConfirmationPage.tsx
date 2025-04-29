import { useEffect } from "react";
import RestorePasswordConfirmation from "../components/auth/RestorePasswordConfirmation"; // ❗️ No curly braces
import bg from "/forms-background.png";

const RestorePasswordPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex flex-col justify-center items-center px-4 relative pt-5 pb-5 md:pt-[9.9rem] md:pb-[9.9rem]">
      <div className="absolute z-0 flex justify-start max-w-4xl">
        <img className="w-full object-cover" src={bg} alt="background" />
      </div>
      <div className="w-full z-10 max-w-5xl flex flex-col md:flex-row items-center md:items-start justify-center sm:justify-end gap-8 md:gap-12">
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <RestorePasswordConfirmation />
        </div>
      </div>
    </main>
  );
};

export default RestorePasswordPage;
