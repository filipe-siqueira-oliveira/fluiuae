"use client";

import { WhatsappSessionStatus } from "@fluiuae/database/enums";
import { PageSection } from "@/components/feedback/page_section";
import { WhatsappQrCode } from "./components/whatsapp_qr_code";
import { WhatsappStatusCard } from "./components/whatsapp_status_card";
import { use_whatsapp_session } from "./hooks/use_whatsapp_session";
import type { WhatsappSessionDto } from "@/types/api";

type WhatsappSettingsViewProps = {
  initial_session: WhatsappSessionDto;
};

export const WhatsappSettingsView = ({ initial_session }: WhatsappSettingsViewProps) => {
  const { session, is_busy, connect, disconnect } = use_whatsapp_session(initial_session);

  return (
    <>
      <PageSection
        title="WhatsApp"
        description="Conecte seu número para receber avisos dos lançamentos."
      >
        <WhatsappStatusCard
          session={session}
          is_busy={is_busy}
          on_connect={connect}
          on_disconnect={disconnect}
        />
      </PageSection>
      {session.status === WhatsappSessionStatus.AWAITING_QR_SCAN ? (
        <PageSection title="Leitura do QR Code" level="section">
          <WhatsappQrCode qr_code={session.qr_code} />
        </PageSection>
      ) : null}
    </>
  );
};
