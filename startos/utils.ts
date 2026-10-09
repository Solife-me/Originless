export const appPort = 3232
export const peerPort = 4001

// Upstream's default STORAGE_MAX (internal/config/config.go).
export const defaultStorageMax = '20GB'

const sizePattern = /^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)$/i

export function normalizeSizeString(value: string): string {
  const trimmed = value.trim().toUpperCase()
  if (!sizePattern.test(trimmed)) {
    throw new Error(
      `Invalid size value "${value}". Use formats like 500MB, 20GB, or 1TB.`,
    )
  }
  return trimmed.replace(/\s+/g, '')
}
