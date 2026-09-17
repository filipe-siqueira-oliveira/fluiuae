"use client";

import { Modal } from "antd";
import { CreditCardStatementsContent } from "./credit_card_statements_content";
import type { AccountDto, CreditCardDto } from "@/types/api";

type CreditCardStatementsModalProps = {
  credit_card: CreditCardDto | null;
  accounts: AccountDto[];
  can_write: boolean;
  on_close: () => void;
};

export const CreditCardStatementsModal = ({
  credit_card,
  accounts,
  can_write,
  on_close,
}: CreditCardStatementsModalProps) => (
  <Modal
    open={Boolean(credit_card)}
    title={credit_card ? `Faturas do cartão ${credit_card.name}` : ""}
    footer={null}
    width={1080}
    onCancel={on_close}
    destroyOnHidden
  >
    {credit_card ? (
      <CreditCardStatementsContent credit_card={credit_card} accounts={accounts} can_write={can_write} />
    ) : null}
  </Modal>
);
