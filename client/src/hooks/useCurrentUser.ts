import { useEffect, useState } from "react";
import {
  AuthService,
  UserWithDetails,
} from "@/services/authService/AuthService";

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authService = new AuthService();
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user data",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
  };
};
