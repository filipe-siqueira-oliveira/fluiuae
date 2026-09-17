import { TransactionType } from "@fluiuae/database";
import { FixedTransactionsScreen } from "../fixed_transactions_screen";

const FixedIncomesPage = () => <FixedTransactionsScreen type={TransactionType.INCOME} />;

export default FixedIncomesPage;
