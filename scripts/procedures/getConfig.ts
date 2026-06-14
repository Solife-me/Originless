import { compat, types as T } from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
  "storage-max": {
    type: "string",
    name: "Storage Limit",
    description: "Maximum size of the embedded IPFS repository. Example: 200GB",
    nullable: false,
    default: "200GB",
    pattern: "^(\\d+(?:\\.\\d+)?)\\s*(B|KB|MB|GB|TB)$",
    "pattern-description": "Use values like 500MB, 5GB, or 1TB",
  },
  "file-limit": {
    type: "string",
    name: "Upload Limit",
    description: "Maximum size accepted by /upload. Example: 5GB",
    nullable: false,
    default: "5GB",
    pattern: "^(\\d+(?:\\.\\d+)?)\\s*(B|KB|MB|GB|TB)$",
    "pattern-description": "Use values like 500MB, 5GB, or 1TB",
  },
  "remote-file-limit": {
    type: "string",
    name: "Remote Upload Limit",
    description: "Maximum size accepted by /remoteupload. Example: 2GB",
    nullable: false,
    default: "2GB",
    pattern: "^(\\d+(?:\\.\\d+)?)\\s*(B|KB|MB|GB|TB)$",
    "pattern-description": "Use values like 500MB, 5GB, or 1TB",
  },
  "additional-allowed-users": {
    type: "list",
    name: "Additional Authorized Public Keys",
    description: "Additional Daku public keys allowed to manage pins.",
    subtype: "string",
    default: [],
    range: "[0,*)",
    spec: {
      placeholder: "daku public key",
      pattern: "^.+$",
      "pattern-description": "Enter a non-empty Daku public key",
    },
  },
});
