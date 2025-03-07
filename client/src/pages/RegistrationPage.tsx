import { SignupForm } from "../components/auth/SignupForm";
import bg from "/forms-background.png";

export const RegistrationPage = () => {
  return (
    <main className="flex flex-col justify-center items-center px-4 relative pt-5 pb-5 md:pt-16 md:pb-16">
    <div className="absolute -z-10 flex justify-start max-w-4xl">
      <img className="w-full object-cover" src={bg} alt="background" />
    </div>

    <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start justify-center sm:justify-end gap-8 md:gap-12">
      <div className="w-full md:w-1/2 flex justify-center md:justify-end">
        <SignupForm />
      </div>
    </div>
  </main>
  );
};
