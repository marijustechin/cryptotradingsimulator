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

  const handleUpdate = () => {
    console.log("Update button clicked");
  };

  return (
    <main>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
          <div className="flex items-center space-x-4">
            {editing ? (
              <p>
                First Name:
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFormDataChanged(true);
                  }}
                  className={`text-2xl font-semibold w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none`}
                />
              </p>
            ) : (
              <h3 className="text-2xl font-semibold">{firstName}</h3>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <p>
              Last Name:
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  editing && setLastName(e.target.value);
                  setFormDataChanged(true);
                }}
                className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none ${
                  editing ? "" : "pointer-events-none"
                }`}
              />
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
                className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none ${
                  editing ? "" : "pointer-events-none"
                }`}
              />
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
                className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none ${
                  editing ? "" : "pointer-events-none"
                }`}
              />
            </p>
            <p>
              Phone number:
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => {
                  editing && setPhoneNumber(e.target.value);
                  setFormDataChanged(true);
                }}
                className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none ${
                  editing ? "" : "pointer-events-none"
                }`}
              />
            </p>
            <button
              className={`px-4 py-2 rounded-[10px] border border-white/47 cursor-pointer transition duration-300 ${
                editing
                  ? formDataChanged
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50"
                    : "bg-gradient-to-r from-grey-500 to-grey-700 hover:shadow-lg hover:shadow-grey-500/50"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50"
              } ${
                formDataChanged
                  ? "focus:outline-none focus:ring-2 focus:ring-purple-500"
                  : ""
              }`}
              disabled={editing && !formDataChanged}
              onClick={() => {
                if (!editing) {
                  setEditing(true);
                } else {
                  handleUpdate();
                  setEditing(false);
                  setFormDataChanged(false);
                }
              }}
            >
              {editing ? "Save" : "Update"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
