import { types as T, YAML } from "../deps.ts";

function normalizeSize(value: unknown, fallback: string): string {
  const text = typeof value === "string" ? value.trim().toUpperCase() : fallback;
  return text.replace(/\s+/g, "");
}

function normalizeUsers(value: unknown): string[] {
  return Array.isArray(value)
    ? [...new Set(value.map((v) => String(v).trim()).filter(Boolean))]
    : [];
}

export const setConfig: T.ExpectedExports.setConfig = async (
  effects,
  input,
) => {
  const config = {
    "storage-max": normalizeSize(input["storage-max"], "200GB"),
    "file-limit": normalizeSize(input["file-limit"], "5GB"),
    "remote-file-limit": normalizeSize(input["remote-file-limit"], "2GB"),
    "additional-allowed-users": normalizeUsers(input["additional-allowed-users"]),
  };

  await effects.createDir({
    path: "start9",
    volumeId: "main",
  });

  await effects.writeFile({
    path: "start9/config.yaml",
    volumeId: "main",
    toWrite: YAML.stringify(config),
  });

  await effects.writeFile({
    path: "start9/originless.env",
    volumeId: "main",
    toWrite:
      `STORAGE_MAX=${config["storage-max"]}\n` +
      `FILE_LIMIT=${config["file-limit"]}\n` +
      `REMOTE_FILE_LIMIT=${config["remote-file-limit"]}\n` +
      `ADDITIONAL_ALLOWED_USERS=${config["additional-allowed-users"].join(",")}\n`,
  });

  return {
    result: {
      signal: "SIGTERM",
      "depends-on": {},
    },
  };
};
