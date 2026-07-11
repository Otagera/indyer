import type { HealthResponse } from "@indyer/shared";
import { create } from "zustand";

type Status = "idle" | "loading" | "success" | "error";

interface HealthState {
  status: Status;
  data: HealthResponse | null;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useHealthStore = create<HealthState>((set) => ({
  status: "idle",
  data: null,
  error: null,
  fetch: async () => {
    set({ status: "loading", error: null });
    try {
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: HealthResponse = await res.json();
      set({ status: "success", data });
    } catch (e) {
      set({ status: "error", error: (e as Error).message });
    }
  },
}));
