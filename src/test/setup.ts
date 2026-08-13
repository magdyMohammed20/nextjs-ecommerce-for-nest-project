import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { setupServer } from "msw/node";
import { defaultHandlers, setMockDelay } from "@/test-utils/msw/handlers";
import "@/test/router";
import { resetRouter } from "@/test/router";
import i18n from "@/lib/i18n";

if (!i18n.isInitialized) {
  await i18n.init();
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

setMockDelay(0);

beforeAll(() => {
  resetRouter();
});

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
if (!window.ResizeObserver) {
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: ResizeObserverStub,
  });
}
if (!window.IntersectionObserver) {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: IntersectionObserverStub,
  });
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
if (!window.scrollTo) {
  window.scrollTo = () => {};
}

Element.prototype.setPointerCapture ??= () => {};
Element.prototype.releasePointerCapture ??= () => {};
Element.prototype.hasPointerCapture ??= () => false;

class ImageStub {
  private listeners: Record<string, (() => void) | null> = {};
  complete = true;
  naturalWidth = 1;
  naturalHeight = 1;
  private _src = "";
  set src(value: string) {
    this._src = value;
    if (value) {
      queueMicrotask(() =>
        this.listeners["load"]?.({ currentTarget: this } as unknown as Event),
      );
    }
  }
  get src() {
    return this._src;
  }
  addEventListener(type: string, callback: () => void) {
    this.listeners[type] = callback;
  }
  removeEventListener(type: string) {
    delete this.listeners[type];
  }
}
globalThis.Image = ImageStub as unknown as typeof Image;

export const server = setupServer(...defaultHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());
