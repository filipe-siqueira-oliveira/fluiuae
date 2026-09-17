import { TransactionType } from "@fluiuae/database";
import { FixedTransactionsScreen } from "../fixed_transactions_screen";

const FixedExpensesPage = () => <FixedTransactionsScreen type={TransactionType.EXPENSE} />;

export default FixedExpensesPage;
