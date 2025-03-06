import { SignupForm } from "../components/auth/SignupForm";
import bg from '/forms-background.png';

export const RegistrationPage = () => {
  return (
    <main className="relative max-w-3xl mx-auto h-screen flex flex-col justify-center items-center">
      <img
        className="absolute -left-60 md:top-30 z-10"
        src={bg}
        alt="background"
      />
      <div className="absolute sm:top-10 md:top-20 lg:top-32 md:right-10 z-20 ">
        <SignupForm />
      </div>
    </main>
  );
};
