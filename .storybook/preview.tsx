import { definePreview } from "@storybook/react-vite";
import addonMsw from "msw-storybook-addon";
import type { AnyHandler } from "msw";
import { withThemeByClassName } from "@storybook/addon-themes";
import {
  AppRouterContext,
  type AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime.js";
import {
  PathnameContext,
  SearchParamsContext,
} from "next/dist/shared/lib/hooks-client-context.shared-runtime.js";
import "../src/app/globals.css";
import "./fonts.css";
import { Providers } from "@/components/providers";
import i18n, { applyDocumentLanguage, type AppLanguage } from "@/lib/i18n";
import { defaultHandlers } from "@/test-utils/msw/handlers";

type MswParameter =
  | Array<AnyHandler>
  | { handlers?: Array<AnyHandler> | Record<string, AnyHandler | Array<AnyHandler>> };

const storyRouter: AppRouterInstance = {
  push: () => {},
  replace: () => {},
  forward: () => {},
  back: () => {},
  prefetch: () => {},
  refresh: () => {},
  bfcacheId: "storybook",
};

export default definePreview({
  addons: [addonMsw()],
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
      parentSelector: "html",
    }),
    (Story, context) => {
      const lang = (context.parameters?.appLanguage ?? "en") as AppLanguage;
      void i18n.changeLanguage(lang).finally(() => {
        applyDocumentLanguage(lang);
      });

      const worker = context.msw;
      const param = context.parameters?.msw;
      const paramHandlers = Array.isArray(param)
        ? param
        : Array.isArray(param?.handlers)
          ? param.handlers
          : param?.handlers
            ? Object.values(param.handlers).flat()
            : [];

      if (worker) {
        worker.resetHandlers(
          ...(paramHandlers.length > 0 ? paramHandlers : defaultHandlers),
        );
      }

      return (
        <AppRouterContext.Provider value={storyRouter}>
          <PathnameContext.Provider value="/storybook">
            <SearchParamsContext.Provider value={new URLSearchParams()}>
              <Providers initialLang={lang}>
                <Story />
              </Providers>
            </SearchParamsContext.Provider>
          </PathnameContext.Provider>
        </AppRouterContext.Provider>
      );
    },
  ],
  parameters: {
    controls: { sort: "alpha" },
    layout: "padded",
    docs: { tags: ["autodocs"] },
    nextjs: {
      appDirectory: true,
    },
  },
});

declare module "storybook/internal/csf" {
  interface Parameters {
    appLanguage?: AppLanguage;
    msw?: MswParameter;
  }
}