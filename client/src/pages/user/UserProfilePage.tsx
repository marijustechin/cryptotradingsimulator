import { UpdateUserForm } from "../../components/auth/UpdateUserForm";
import { ChangePasswordForm } from "../../components/auth/ChangePassword";
import { useState } from "react";

export const UserProfilePage = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const togglePasswordForm = () => {
    setShowPasswordForm((prev) => !prev);
  };
  return (
    <main className="flex flex-col gap-3">
      <h1>User profile</h1>
      <p>Here you can update your personal info</p>
      <p>
        Phone number should consist exactly of 11 digits omiting '+' sign. For
        example: 37012312345
      </p>
      <p>Dar reikia pasikrapstyti su validatoriais, bet jau tingejau...</p>
      <div>
        <UpdateUserForm />
      </div>
      <div className="my-4">
        <p
          onClick={togglePasswordForm}
          className="text-violet-400 cursor-pointer hover:text-violet-300 underline transition duration-150 text-center"
        >
          {showPasswordForm ? "Hide Change Password" : "Change Password"}
        </p>

        {showPasswordForm && (
          <div className="mt-4">
            <ChangePasswordForm />
          </div>
        )}
      </div>
    </main>
  );
};
