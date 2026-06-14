import { types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration = async () => {
  return {
    result: {
      configured: true,
    },
  };
};
