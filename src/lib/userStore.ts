import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false, // 초기에는 로딩 안함
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // localStorage 키 이름
      partialize: (state) => ({ user: state.user }), // user만 저장 (isLoading은 저장하지 않음)
    }
  )
);
