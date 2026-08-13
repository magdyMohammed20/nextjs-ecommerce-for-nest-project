import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { getInitials, UserAvatar } from "./user-avatar";
import { getUserAvatarUrl } from "@/features/auth/lib/avatar-image";

describe("getInitials", () => {
  it("builds initials from a name", () => {
    expect(getInitials("Jane Doe")).toBe("JD");
    expect(getInitials("alice")).toBe("A");
    expect(getInitials("Ana Maria Souza")).toBe("AM");
    expect(getInitials("")).toBe("");
  });
});

describe("getUserAvatarUrl", () => {
  it("prefixes upload paths with the API url", () => {
    expect(getUserAvatarUrl("/uploads/avatar.png")).toBe(
      "http://localhost:3000/uploads/avatar.png",
    );
  });

  it("returns absolute urls unchanged", () => {
    expect(getUserAvatarUrl("https://cdn.example.com/a.png")).toBe(
      "https://cdn.example.com/a.png",
    );
  });

  it("returns an empty string when there is no url", () => {
    expect(getUserAvatarUrl()).toBe("");
    expect(getUserAvatarUrl(null)).toBe("");
  });
});

describe("UserAvatar", () => {
  it("shows initials when there is no avatar", () => {
    render(<UserAvatar name="Jane Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("shows the image when an avatar url is provided", async () => {
    render(<UserAvatar name="Jane Doe" avatarUrl="https://cdn.example.com/jane.png" />);
    expect(await screen.findByAltText("Jane Doe")).toBeInTheDocument();
  });
});
