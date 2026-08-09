"use client";

import { useTranslation } from "react-i18next";
import { MessagesSquare } from "lucide-react";
import { PageContainer } from "@/components/shared/page-container";
import { MessagesList } from "@/features/contact/components/messages-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactMessagesPage() {
  const { t } = useTranslation("contact");

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("inbox.title")}
          </h1>
          <p className="text-muted-foreground">{t("inbox.description")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessagesSquare className="h-4 w-4 text-primary" />
              {t("inbox.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MessagesList />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
