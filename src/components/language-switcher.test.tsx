import { afterEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, i18n } from "@/test/render";
import { LanguageSwitcher } from "./language-switcher";

describe("LanguageSwitcher", () => {
  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("shows the current language code", async () => {
    await renderWithProviders(<LanguageSwitcher />);
    expect(screen.getByRole("button", { name: "Switch language" })).toHaveTextContent(
      "EN",
    );
  });

  it("switches to Arabic", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<LanguageSwitcher />);

    await user.click(screen.getByRole("button", { name: "Switch language" }));
    const arabic = await screen.findByText("العربية");
    await user.click(arabic);

    expect(i18n.resolvedLanguage).toBe("ar");
    expect(screen.getByRole("button", { name: "Switch language" })).toHaveTextContent(
      "العربية",
    );
  });
});
