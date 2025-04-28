import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useSearchParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import UserService from "../../services/UserService"; // Assuming the UserService is correctly imported

const schema = z.object({
  newPassword: z.string().min(6, "Minimum 6 characters"), // Password validation
});

export const ChangePasswordLoginForm = () => {
  const [searchParams] = useSearchParams(); // Get the token from the URL
  const token = searchParams.get("token");
  const navigate = useNavigate(); // Navigation helper
  const [loading, setLoading] = useState(false); // Loading state to disable the button during API calls

  // Check if the token exists when the component mounts
  useEffect(() => {
    if (!token) {
      toast.error("Reset token not found or expired.");
      navigate("/login");
    }
  }, [token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ newPassword: string }>({
    resolver: zodResolver(schema), // Using Zod for validation
  });

  // Function to handle form submission
  const onSubmit = async ({ newPassword }: { newPassword: string }) => {
    if (!token) {
      toast.error("Reset token not found or expired.");
      return;
    }

    try {
      setLoading(true); // Start loading animation
      // Sending the token and newPassword to the backend
      const response = await UserService.restorePassword(token!, newPassword);
      toast.success(response.message); // Show success message
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setLoading(false); // Stop loading animation
      const errorMessage = err?.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage); // Show error message if API call fails
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-basic">
      <h2>Reset Your Password</h2>

      <label className="form-label" htmlFor="newPassword">
        New Password
      </label>
      <input
        className="form-input"
        type="password"
        {...register("newPassword")}
        placeholder="Enter new password"
      />
      {errors.newPassword && (
        <span className="text-red-500 text-sm">{errors.newPassword.message}</span>
      )}

      <button
        type="submit"
        className="btn-generic mt-4"
        disabled={loading} // Disable the button while loading
      >
        {loading ? "Resetting..." : "Reset Password"} {/* Show loading text if the button is disabled */}
      </button>
    </form>
  );
};

export default ChangePasswordLoginForm;
