import { useEffect, useState } from "react";
import {
  getInfo,
  selectUserInfo,
} from "../../store/features/user/userInfoSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

export const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserInfo);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formDataChanged, setFormDataChanged] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData) {
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setEmail(userData.email);
      setAddress(userData.address);
      setPhoneNumber(userData.phone_number);
    }
  }, [userData]);

  useEffect(() => {
    if (!userData) {
      dispatch(getInfo());
    }
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:3003/api/v1/users/me/${userData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            address: address,
            phone_number: phoneNumber,
          }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        console.log(updatedUser);
        // ...
      } else if (response.status === 404) {
        console.error("Error updating user: User not found");
        // Display a more user-friendly error message to the user
      } else {
        console.error(
          "Error updating user:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (userData) {
    setEditing(false);
    setFormDataChanged(false);
    setFirstName(userData.first_name);
    setLastName(userData.last_name);
    setEmail(userData.email);
    setAddress(userData.address);
    setPhoneNumber(userData.phone_number);
    }
  };

  return (
    <main>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-lg max-w-xs w-full mx-auto">
          <div className="flex items-center space-x-2">
            {editing ? (
              <p>
                First Name:
                <input
                  type="text"
                  value={editing ? firstName : userData.first_name}
                  onChange={(e) => {
                    editing && setFirstName(e.target.value);
                    setFormDataChanged(true);
                  }}
                  className={`w-full p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none ${
                    editing ? "" : "pointer-events-none"
                  } ${errors.first_name ? "border-red-500" : ""}`}
                />
                {errors.first_name && (
                  <div className="text-red-500">{errors.first_name}</div>
                )}
              </p>
            ) : (
              <h3 className="text-xl font-semibold">{firstName}</h3>
            )}
          </div>

          <div className="mt-4 space-y-3">
            <p>
              Last Name:
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  editing && setLastName(e.target.value);
                  setFormDataChanged(true);
                }}
                className={`w-full p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none ${
                  editing ? "" : "pointer-events-none"
                } ${errors.last_name ? "border-red-500" : ""}`}
              />
              {errors.last_name && (
                <div className="text-red-500">{errors.last_name}</div>
              )}
            </p>
            <p>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  editing && setEmail(e.target.value);
                  setFormDataChanged(true);
                }}
                className={`w-full p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none ${
                  editing ? "" : "pointer-events-none"
                } ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <div className="text-red-500">{errors.email}</div>
              )}
            </p>
            <p>
              Address:
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  editing && setAddress(e.target.value);
                  setFormDataChanged(true);
                }}
                className={`w-full p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none ${
                  editing ? "" : "pointer-events-none"
                } ${errors.address ? "border-red-500" : ""}`}
              />
              {errors.address && (
                <div className="text-red-500">{errors.address}</div>
              )}
            </p>
            <p>
              Phone Number:
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => {
                  editing && setPhoneNumber(e.target.value);
                  setFormDataChanged(true);
                }}
                className={`w-full p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none ${
                  editing ? "" : "pointer-events-none"
                } ${errors.phone_number ? "border-red-500" : ""}`}
              />
              {errors.phone_number && (
                <div className="text-red-500">{errors.phone_number}</div>
              )}
            </p>
          </div>

          <div className="flex justify-end mt-4">
            {editing ? (
              <>
                <button
                  className={`px-3 py-1 rounded-lg ${
                    formDataChanged
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50"
                      : "border border-purple-500 text-purple-500 focus:outline-none focus:ring-2"
                  } text-white cursor-pointer transition duration-300`}
                  onClick={handleUpdate}
                  disabled={!formDataChanged}
                >
                  Update
                </button>
                <button
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 ml-2 cursor-pointer transition duration-300"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 cursor-pointer transition duration-300"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
