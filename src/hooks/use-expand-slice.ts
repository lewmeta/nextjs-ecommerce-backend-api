import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface useExpandSliceStore {
    expandSidebar: boolean;
    toggleSidebar: () => void;
}

export const useExpandSlice = create(persist<useExpandSliceStore>((set) => ({
    expandSidebar: true,
    toggleSidebar: () =>
        set((state) => ({ expandSidebar: !state.expandSidebar })),
}), {
    name: "sidebar-storages",
    storage: createJSONStorage(() => localStorage)
}))