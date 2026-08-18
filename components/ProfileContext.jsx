import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "./profileService.js";

const ProfileContext = createContext();

function getCurrentRole() {
  return localStorage.getItem("userRole") || "superAdmin";
}

function getProfileStorageKey(role) {
  return `worknest_profile_${role}`;
}

function getInitialProfile() {
  const role = getCurrentRole();
  const storageKey = getProfileStorageKey(role);

  try {
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }

  return {
    fullName: "",
    email: "",
    image: null,
    role: role,
  };
}

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(getInitialProfile);

  const setProfile = (newProfile) => {
    setProfileState(newProfile);

    try {
      const role = getCurrentRole();
      const storageKey = getProfileStorageKey(role);

      localStorage.setItem(
        storageKey,
        JSON.stringify(newProfile)
      );
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const loadFromBackend = async () => {
      try {
        const data = await getProfile();

        if (data) {
          const currentRole = getCurrentRole();

          const freshProfile = {
            fullName: data.fullName || data.name || "",
            email: data.email || "",
            image: data.avatarUrl || null,
            role: data.roleLabel || data.role || currentRole,
          };

          setProfile(freshProfile);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    const token = localStorage.getItem("worknest_token");

    if (token) {
      loadFromBackend();
    }
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}