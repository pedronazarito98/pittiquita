let pathname = '/'

export function usePathname(): string {
  return pathname
}

export function setMockPathname(nextPathname: string): void {
  pathname = nextPathname
}
