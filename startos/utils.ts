export const appPort = 3232
export const peerPort = 4001

export const defaultStorageMax = '200GB'
export const defaultFileLimit = '5GB'
export const defaultRemoteFileLimit = '2GB'

const sizePattern = /^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)$/i

export function normalizeSizeString(value: string): string {
  const trimmed = value.trim().toUpperCase()
  if (!sizePattern.test(trimmed)) {
    throw new Error(
      `Invalid size value "${value}". Use formats like 500MB, 5GB, or 1TB.`,
    )
  }
  return trimmed.replace(/\s+/g, '')
}

export function normalizeAllowedUsers(value: string): string[] {
  return [
    ...new Set(
      value
        .split(/[\s,]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ]
}

export function combineAllowedUsers(
  publicKey: string,
  additionalAllowedUsers: string[],
): string[] {
  return [...new Set([publicKey, ...additionalAllowedUsers].filter(Boolean))]
}
