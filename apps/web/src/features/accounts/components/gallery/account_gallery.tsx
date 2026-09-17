"use client";

import { AddGalleryTile } from "@/components/gallery/add_gallery_tile";
import { EditableTile } from "@/components/gallery/editable_tile";
import { PanelHeading } from "@/components/feedback/panel_heading";
import { AccountCard } from "./account_card";
import { AccountsGrid } from "./account_card_styles";
import type { AccountDto } from "@/types/api";

type AccountGalleryProps = {
  accounts: AccountDto[];
  can_write: boolean;
  on_add: () => void;
  on_edit: (account: AccountDto) => void;
};

const describe_account_count = (account_count: number): string =>
  account_count === 1 ? "1 conta" : `${account_count} contas`;

export const AccountGallery = ({ accounts, can_write, on_add, on_edit }: AccountGalleryProps) => (
  <>
    <PanelHeading title="Suas contas" meta={describe_account_count(accounts.length)} />
    <AccountsGrid>
      {accounts.map((account) => (
        <EditableTile
          key={account.id}
          edit_label={`Editar conta ${account.name}`}
          can_edit={can_write}
          on_edit={() => on_edit(account)}
        >
          <AccountCard account={account} />
        </EditableTile>
      ))}
      <AddGalleryTile
        title={accounts.length > 0 ? "Adicionar outra conta" : "Adicionar conta"}
        description="Corrente, poupança ou salário, com o saldo sempre em dia."
        is_disabled={!can_write}
        on_add={on_add}
      />
    </AccountsGrid>
  </>
);
