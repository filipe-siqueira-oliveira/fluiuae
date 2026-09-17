const error_messages: Record<string, string> = {
  account_has_transactions: "Essa conta tem lançamentos e não pode ser excluída. Exclua ou mova os lançamentos dela antes.",
  account_name_already_used: "Já existe uma conta com esse nome.",
  account_not_found: "Essa conta não existe mais. Atualize a página.",
  account_not_in_workspace: "Escolha uma conta desta carteira.",
  card_purchase_settles_with_statement: "Compras no cartão ficam pagas quando você paga a fatura, em Cartões e faturas.",
  category_already_exists: "Já existe uma categoria com esse nome e tipo.",
  category_kind_does_not_match_type: "Escolha uma categoria do mesmo tipo do lançamento: despesa ou receita.",
  category_not_found: "Essa categoria não existe mais. Atualize a página.",
  category_not_in_workspace: "Escolha uma categoria desta carteira.",
  choose_account_or_credit_card: "Escolha uma conta ou um cartão.",
  credit_card_has_transactions: "Esse cartão tem compras e não pode ser excluído. Exclua as compras dele antes.",
  credit_card_name_already_used: "Já existe um cartão com esse nome.",
  credit_card_not_found: "Esse cartão não existe mais. Atualize a página.",
  credit_card_not_in_workspace: "Escolha um cartão desta carteira.",
  credit_card_only_for_expenses: "Cartão de crédito só pode ser usado em despesas.",
  current_password_incorrect: "A senha atual está incorreta.",
  destination_account_only_for_transfer: "Conta de destino só vale para transferências.",
  email_already_registered: "Esse e-mail já está em uso em outra conta.",
  fixed_transaction_not_found: "Esse item fixo não existe mais. Atualize a página.",
  installment_count_below_generated: "O número de parcelas não pode ser menor do que as parcelas já lançadas.",
  institution_not_found: "Não encontramos essa instituição. Escolha outra na lista.",
  internal_server_error: "Algo deu errado do nosso lado. Tente de novo em instantes.",
  invalid_color: "Escolha uma cor válida.",
  invalid_credentials: "E-mail ou senha incorretos.",
  invalid_phone: "Use só números, espaços, parênteses, + e -.",
  invalid_statement: "Essa fatura não é válida. Atualize a página.",
  invitation_already_pending: "Já existe um convite pendente para esse e-mail.",
  invitation_not_found: "Esse convite não existe mais. Atualize a página.",
  member_not_found: "Esse membro não faz mais parte da carteira. Atualize a página.",
  network_error: "Sem conexão com o servidor. Confira sua internet e tente de novo.",
  owner_cannot_be_removed: "O dono da carteira não pode ser removido.",
  owner_role_cannot_change: "O papel do dono da carteira não pode ser alterado.",
  recurring_charge_not_found: "Essa recorrência não existe mais. Atualize a página.",
  request_timeout: "O servidor demorou para responder. Tente de novo.",
  role_cannot_manage_members: "Só o dono da carteira pode gerenciar membros.",
  role_cannot_manage_workspace: "Só o dono da carteira pode fazer essa alteração.",
  role_cannot_write_data: "Você tem acesso só para visualizar esta carteira.",
  session_not_found: "Sua sessão expirou. Entre de novo.",
  statement_already_paid: "Essa fatura já foi paga.",
  statement_has_no_purchases: "Essa fatura não tem compras para pagar.",
  statement_payment_locked: "Esse lançamento é o pagamento de uma fatura. Para mudar, desfaça o pagamento em Cartões e faturas.",
  statement_payment_not_found: "Essa fatura não tem pagamento para desfazer.",
  system_category_locked: "Categorias do sistema não podem ser editadas nem excluídas.",
  transaction_not_found: "Esse lançamento não existe mais. Atualize a página.",
  transfer_accounts_must_differ: "Escolha contas diferentes para a origem e o destino.",
  transfer_cannot_have_category: "Transferências não têm categoria.",
  transfer_requires_destination_account: "Escolha a conta de destino da transferência.",
  unexpected_error: "Algo deu errado. Tente de novo em instantes.",
  unknown_tour: "Essa explicação não existe mais.",
  user_already_member: "Essa pessoa já faz parte da carteira.",
  user_not_found: "Não encontramos essa pessoa.",
  user_not_member_of_workspace: "Você não faz mais parte dessa carteira.",
  user_without_workspace: "Sua conta não tem nenhuma carteira. Fale com quem convidou você.",
  validation_error: "Confira os dados preenchidos e tente de novo.",
};

const status_messages: Record<number, string> = {
  400: error_messages.validation_error,
  401: error_messages.session_not_found,
  403: "Você não tem permissão para fazer isso.",
  404: "Não encontramos o que você procurava. Atualize a página.",
  409: "Essa ação entra em conflito com dados que já existem.",
  422: error_messages.validation_error,
  429: "Muitas tentativas seguidas. Espere um pouco e tente de novo.",
};

const is_error_code = (value: string): boolean => /^[a-z][a-z0-9_]*$/.test(value);

export const translate_error = (value: string | null | undefined, status_code?: number): string => {
  if (value && error_messages[value]) {
    return error_messages[value];
  }

  if (value && !is_error_code(value)) {
    return value;
  }

  if (status_code && status_messages[status_code]) {
    return status_messages[status_code];
  }

  return status_code && status_code >= 500 ? error_messages.internal_server_error : error_messages.unexpected_error;
};
