export type ProductTourStep = {
  target?: string;
  title: string;
  description: string;
};

export type ProductTour = {
  key: string;
  matches: (pathname: string) => boolean;
  steps: ProductTourStep[];
};

export const product_tours: ProductTour[] = [
  {
    key: "home",
    matches: (pathname) => pathname === "/home",
    steps: [
      {
        title: "Boas-vindas ao FluiuAê",
        description: "Aqui você organiza tudo o que entra e sai do seu dinheiro. Vamos dar uma volta rápida por esta tela.",
      },
      {
        target: "home_summary",
        title: "O resumo do mês",
        description: "Quanto entrou, quanto saiu e quanto sobrou. A parte clarinha das barras é o que ainda está previsto.",
      },
      {
        target: "home_widgets",
        title: "Seus números em blocos",
        description: "Gráficos e estatísticas do mês. Em cada gráfico, Ver tabela mostra os números exatos.",
      },
      {
        target: "home_customize",
        title: "Deixe do seu jeito",
        description: "Escolha quais blocos aparecem aqui. A escolha fica salva na sua conta.",
      },
      {
        target: "app_navigation",
        title: "Tudo pelo menu",
        description: "Lançamentos, contas, cartões e categorias ficam aqui. Cada tela tem uma explicação rápida na primeira visita.",
      },
      {
        target: "app_user_menu",
        title: "Seu perfil",
        description: "Nas configurações você muda nome, senha, tema e outras preferências.",
      },
    ],
  },
  {
    key: "transactions",
    matches: (pathname) => pathname === "/transactions",
    steps: [
      {
        title: "Lançamentos",
        description: "Tudo o que entrou e saiu, um mês por vez. Despesas fixas e parcelas aparecem aqui sozinhas.",
      },
      {
        target: "transactions_month",
        title: "Troque de mês",
        description: "Use as setas para ver meses passados ou o que já está previsto para os próximos.",
      },
      {
        target: "transactions_intro",
        title: "O saldo do mês",
        description: "Receitas, despesas e o resultado. Embaixo de cada número aparece o que ainda vai entrar ou sair.",
      },
      {
        target: "transactions_filters",
        title: "Encontre rápido",
        description: "Busque pelo nome ou filtre por pago, a pagar, recebido e a receber. O botão ao lado filtra por conta e categoria.",
      },
      {
        target: "transactions_list",
        title: "Clique para editar",
        description: "Toque em um lançamento para editar ou excluir. Contas a pagar têm o botão Efetivar para marcar como pagas.",
      },
      {
        target: "transactions_actions",
        title: "Novo lançamento",
        description: "Registre uma despesa, receita ou transferência. Se a data já passou, ele entra como pago.",
      },
    ],
  },
  {
    key: "fixed_expenses",
    matches: (pathname) => pathname === "/transactions/fixed-expenses",
    steps: [
      {
        title: "Despesas fixas",
        description: "Contas que se repetem todo mês, como aluguel e internet. Cadastre uma vez e elas aparecem nos lançamentos.",
      },
      {
        target: "fixed_intro",
        title: "Quanto sai todo mês",
        description: "O total fixo, o que já passou e o que ainda vem neste mês.",
      },
      {
        target: "fixed_panel",
        title: "Pelo dia do mês",
        description: "A lista segue o calendário e destaca a próxima. Clique em uma para editar ou excluir.",
      },
      {
        target: "fixed_actions",
        title: "Débito automático",
        description: "Ao cadastrar pagando por conta, marque Débito automático se ela sai sozinha. Assim ela já entra como paga no dia.",
      },
    ],
  },
  {
    key: "fixed_incomes",
    matches: (pathname) => pathname === "/transactions/fixed-incomes",
    steps: [
      {
        title: "Receitas fixas",
        description: "Dinheiro que entra todo mês, como salário. No dia certo ele entra sozinho no saldo da conta.",
      },
      {
        target: "fixed_panel",
        title: "Recebeu antes?",
        description: "Em Lançamentos, use Efetivar para marcar como recebida antes do dia.",
      },
      {
        target: "fixed_actions",
        title: "Nova receita fixa",
        description: "Informe o valor, o dia do mês e a conta onde o dinheiro cai.",
      },
    ],
  },
  {
    key: "recurring",
    matches: (pathname) => pathname === "/transactions/recurring-charges",
    steps: [
      {
        title: "Recorrências",
        description: "Compras parceladas e cobranças com data para acabar, como um notebook em 10 vezes.",
      },
      {
        target: "recurring_intro",
        title: "Quanto ainda falta",
        description: "Parcelas do mês, o total que falta pagar e qual termina primeiro.",
      },
      {
        target: "recurring_panel",
        title: "Acompanhe cada uma",
        description: "O círculo mostra quantas parcelas já foram lançadas. Clique para editar ou excluir.",
      },
      {
        target: "recurring_actions",
        title: "Nova recorrência",
        description: "Informe o valor da parcela, quantas vezes e o mês da primeira. Cada parcela aparece no mês dela.",
      },
    ],
  },
  {
    key: "accounts",
    matches: (pathname) => pathname === "/accounts",
    steps: [
      {
        title: "Contas bancárias",
        description: "As contas onde seu dinheiro fica. O saldo é calculado a partir dos lançamentos pagos.",
      },
      {
        target: "accounts_intro",
        title: "Tudo somado",
        description: "O saldo de todas as contas e o que entrou e saiu delas neste mês.",
      },
      {
        target: "accounts_panel",
        title: "Cada conta",
        description: "Saldo atual, a variação dos últimos 30 dias e o movimento do mês. Clique na conta para editar.",
      },
      {
        target: "accounts_actions",
        title: "Nova conta",
        description: "Escolha o banco e o saldo inicial. A conta padrão já vem marcada nos lançamentos.",
      },
    ],
  },
  {
    key: "cards",
    matches: (pathname) => pathname === "/cards",
    steps: [
      {
        title: "Cartões e faturas",
        description: "Compras no cartão ficam a pagar até você pagar a fatura.",
      },
      {
        target: "cards_intro",
        title: "O que está em uso",
        description: "Quanto do limite está comprometido e quando vence a próxima fatura.",
      },
      {
        target: "cards_statements",
        title: "Veja as faturas",
        description: "Abra as faturas do cartão para ver as compras de cada mês e pagar a fatura por uma conta.",
      },
      {
        target: "cards_actions",
        title: "Novo cartão",
        description: "Informe o limite e os dias de fechamento e vencimento. Clique no cartão para editar depois.",
      },
    ],
  },
  {
    key: "categories",
    matches: (pathname) => pathname === "/categories",
    steps: [
      {
        title: "Categorias",
        description: "Dão nome aos seus gastos e ganhos para você entender para onde vai o dinheiro.",
      },
      {
        target: "categories_intro",
        title: "Categorias padrão",
        description: "A categoria escolhida aqui já vem marcada quando você cria um lançamento.",
      },
      {
        target: "categories_kind",
        title: "Despesas e receitas",
        description: "Alterne entre os dois tipos. As do sistema têm cadeado e não podem ser apagadas.",
      },
      {
        target: "categories_actions",
        title: "Nova categoria",
        description: "Escolha o tipo, o nome e uma cor. Clique numa categoria sua para editar ou excluir.",
      },
    ],
  },
  {
    key: "settings",
    matches: (pathname) => pathname === "/settings",
    steps: [
      {
        title: "Configurações",
        description: "Seu perfil, seu acesso e como o FluiuAê aparece para você.",
      },
      {
        target: "settings_security_section",
        title: "Acesso e segurança",
        description: "Troque o e-mail ou a senha quando quiser. Pedimos a senha atual para confirmar.",
      },
      {
        target: "settings_workspace_section",
        title: "Sua carteira",
        description: "Dê um nome para a carteira e veja quem ajuda você a organizar.",
      },
      {
        target: "settings_preferences_section",
        title: "Do seu jeito",
        description: "Tema claro ou escuro, menu recolhido e a opção de ver estas explicações de novo.",
      },
    ],
  },
];

export const find_product_tour = (pathname: string): ProductTour | null =>
  product_tours.find((tour) => tour.matches(pathname)) ?? null;
