"use client";

import { supabase } from "./supabaseClient";
import { useUserStore } from "./userStore";

export function useUserData() {
  const { setUser, setLoading, clearUser } = useUserStore();

  const getUserData = async () => {
    setLoading(true);

    const { data } = await supabase.auth.getUser();

    if (data.user) {
      setUser(data.user);
      setLoading(false);
      return { success: true, user: data.user };
    } else {
      clearUser();
      setLoading(false);
      return { success: false, error: "사용자 없음" };
    }
  };

  return { getUserData };
}
