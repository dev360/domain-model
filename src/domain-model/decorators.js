export const REGISTRY = new Map()

export function register(cls = null) {
  if (cls !== null) {
    REGISTRY.set(cls.name, cls)
  }
  return cls
}

export function unregister(cls = null) {
  if (cls !== null) {
    REGISTRY.delete(cls.constructor.name)
  }
}
