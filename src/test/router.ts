import { vi } from "vitest";

const { routerMock } = vi.hoisted(() => {
  const router = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: "/",
    searchParams: new URLSearchParams(),
  };
  return { routerMock: router };
});

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
  usePathname: () => routerMock.pathname,
  useSearchParams: () => routerMock.searchParams,
}));

export function setPathname(pathname: string) {
  routerMock.pathname = pathname;
}

export function setSearchParams(searchParams: URLSearchParams) {
  routerMock.searchParams = searchParams;
}

export function getRouterMock() {
  return routerMock;
}

export function resetRouter() {
  routerMock.push.mockReset();
  routerMock.replace.mockReset();
  routerMock.prefetch.mockReset();
  routerMock.back.mockReset();
  routerMock.forward.mockReset();
  routerMock.refresh.mockReset();
  routerMock.pathname = "/";
  routerMock.searchParams = new URLSearchParams();
}
