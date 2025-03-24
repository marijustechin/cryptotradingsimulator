import { UpdateUserForm } from "../../components/auth/UpdateUserForm";
import { ChangePasswordForm } from "../../components/auth/ChangePassword";

export const UserProfilePage = () => {
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
      <div>
        <ChangePasswordForm />
      </div>
    </main>
  );
};
