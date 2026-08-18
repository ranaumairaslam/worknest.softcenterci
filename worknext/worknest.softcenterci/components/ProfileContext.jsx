import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {

  const [profile, setProfile] = useState({
    fullName: "Muhammad Ayaz",
    email: "ayazhameed@gmail.com",
    image: null,
    role: "Super Admin",
  });

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}