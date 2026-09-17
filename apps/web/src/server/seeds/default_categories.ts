import { CategoryKind } from "@fluiuae/database";

type SeedCategory = {
  name: string;
  color: string;
};

type DefaultCategory = SeedCategory & {
  kind: CategoryKind;
  is_system: boolean;
};

const system_income_categories: SeedCategory[] = [
  { name: "Outros", color: "#101828" },
  { name: "Recebimentos", color: "#30A46C" },
  { name: "Resgate aplicação", color: "#2F6B4F" },
  { name: "Transferência mesmo titular", color: "#FFB224" },
];

const system_expense_categories: SeedCategory[] = [
  { name: "Cartão de crédito", color: "#0090FF" },
  { name: "Depósito aplicação", color: "#2F6B4F" },
  { name: "Outros", color: "#101828" },
  { name: "Tarifas bancárias", color: "#E5484D" },
  { name: "Transferência mesmo titular", color: "#FFB224" },
  { name: "Transferência para terceiros", color: "#F76B15" },
];

export const starter_income_categories: SeedCategory[] = [
  { name: "Salário", color: "#30A46C" },
  { name: "Rendimentos", color: "#12A594" },
  { name: "Outras receitas", color: "#8E4EC6" },
];

export const starter_expense_categories: SeedCategory[] = [
  { name: "Alimentação", color: "#F76B15" },
  { name: "Assinaturas", color: "#8E4EC6" },
  { name: "Moradia", color: "#3E63DD" },
  { name: "Cuidados pessoais", color: "#D6409F" },
  { name: "Doações", color: "#E5484D" },
  { name: "Educação", color: "#0090FF" },
  { name: "Empréstimos e financiamentos", color: "#6F6E77" },
  { name: "Impostos", color: "#FFB224" },
  { name: "Investimentos", color: "#30A46C" },
  { name: "Lazer", color: "#05A2C2" },
  { name: "Mercado", color: "#12A594" },
  { name: "Pets", color: "#A18072" },
  { name: "Presentes", color: "#D6409F" },
  { name: "Saúde", color: "#E5484D" },
  { name: "Serviços", color: "#6F6E77" },
  { name: "Transporte", color: "#F76B15" },
  { name: "Utilidades", color: "#FFB224" },
  { name: "Viagens", color: "#0090FF" },
];

const with_kind = (
  categories: SeedCategory[],
  kind: CategoryKind,
  is_system: boolean
): DefaultCategory[] => categories.map((category) => ({ ...category, kind, is_system }));

export const default_categories: DefaultCategory[] = [
  ...with_kind(system_income_categories, CategoryKind.INCOME, true),
  ...with_kind(system_expense_categories, CategoryKind.EXPENSE, true),
  ...with_kind(starter_income_categories, CategoryKind.INCOME, false),
  ...with_kind(starter_expense_categories, CategoryKind.EXPENSE, false),
];
