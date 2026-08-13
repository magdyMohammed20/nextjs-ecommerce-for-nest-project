import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/lib/env";
import { SubmissionAuditFeed } from "./submission-audit-feed";

const auditHandlers = [
  http.get(`${API_URL}/activity/latest`, () =>
    HttpResponse.json({
      data: [
        {
          id: 41,
          action: "product.status_changed",
          actorName: "Admin User",
          actorRole: "admin",
          targetType: "product",
          targetId: 6,
          createdAt: "2026-08-12T09:00:00Z",
        },
        {
          id: 40,
          action: "product.status_changed",
          actorName: "Admin User",
          actorRole: "admin",
          targetType: "product",
          targetId: 6,
          createdAt: "2026-08-12T08:30:00Z",
        },
        {
          id: 39,
          action: "product.status_changed",
          actorName: "Admin User",
          actorRole: "admin",
          targetType: "product",
          targetId: 3,
          createdAt: "2026-08-11T16:00:00Z",
        },
        {
          id: 38,
          action: "product.status_changed",
          actorName: "Admin User",
          actorRole: "admin",
          targetType: "product",
          targetId: 7,
          createdAt: "2026-08-11T12:15:00Z",
        },
      ],
    }),
  ),
];

const meta = {
  title: "Features/Products/SubmissionAuditFeed",
  component: SubmissionAuditFeed,
  parameters: { msw: auditHandlers },
} satisfies Meta<typeof SubmissionAuditFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
