import { useAuthState, useDbData } from "./firebase";

export const useProfile = () => {
  const [user] = useAuthState();
  const [isAdmin, isLoading, error] = useDbData(
    `/admins/${user?.uid || "guest"}`
  );

  // Extracting emailVerified from user or defaulting to false
  const emailVerified = user?.emailVerified || false;

  return [{ user, isAdmin, emailVerified }, isLoading, error];
};
