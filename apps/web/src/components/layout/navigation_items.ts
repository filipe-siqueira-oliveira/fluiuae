import { ArrowLeftRight, CreditCard, House, Landmark, Tag, type LucideIcon } from "lucide-react";

export type NavigationChildItem = {
  href: string;
  label: string;
};

export type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: NavigationChildItem[];
};

export const navigation_items: NavigationItem[] = [
  { href: "/home", label: "Início", icon: House },
  {
    href: "/transactions",
    label: "Transações",
    icon: ArrowLeftRight,
    children: [
      { href: "/transactions/fixed-expenses", label: "Despesas fixas" },
      { href: "/transactions/fixed-incomes", label: "Receitas fixas" },
      { href: "/transactions/recurring-charges", label: "Recorrências" },
    ],
  },
  { href: "/accounts", label: "Contas bancárias", icon: Landmark },
  { href: "/cards", label: "Cartões e faturas", icon: CreditCard },
  { href: "/categories", label: "Categorias", icon: Tag },
];
