// TODO: replace with real generated client calls once the feature exists.
// Pattern: import { exampleControllerFindAll } from "@/lib/generated/api";
// then `await exampleControllerFindAll(params)` — generated clients already
// resolve to the payload (the envelope is unwrapped by orvalFetch).
import type { ExampleItem } from "../types/example-types";

export const exampleApi = {
  getAll: async (): Promise<ExampleItem[]> => {
    throw new Error("Not implemented yet");
  },
};
