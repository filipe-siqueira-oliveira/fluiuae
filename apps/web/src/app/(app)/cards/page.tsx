import { CreditCardsView } from "@/features/credit_cards/credit_cards_view";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { can_write_data } from "@/server/authorization/member_permissions";
import { list_accounts } from "@/server/services/account_service";
import { list_credit_cards } from "@/server/services/credit_card_service";

const CardsPage = async () => {
  const context = await require_authenticated_context();
  const [credit_cards, accounts] = await Promise.all([
    list_credit_cards(context.workspace.id),
    list_accounts(context.workspace.id),
  ]);

  return (
    <CreditCardsView
      credit_cards={credit_cards}
      accounts={accounts}
      can_write={can_write_data(context.role)}
    />
  );
};

export default CardsPage;
