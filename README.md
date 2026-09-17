# FluiuAê

Controle financeiro compartilhado. Cada usuário tem uma carteira (`workspace`) e pode convidar
ajudantes para ver e organizar as finanças junto com ele.

## Estrutura

```
apps/web         Next.js (App Router) — telas e API HTTP
apps/whatsapp    Worker Node — sessões Baileys, uma por usuário
packages/database  Schema Prisma, client e enums compartilhados
```

## Modelo de dados

| Tabela | Papel |
| --- | --- |
| `users` | identidade (e-mail, senha, telefone) |
| `workspaces` | carteira; toda informação financeira pertence a uma |
| `workspace_members` | vínculo usuário × carteira com papel `OWNER` / `ADMIN` / `VIEWER` |
| `workspace_invitations` | convite por e-mail, com token e validade |
| `accounts` | contas bancárias (`CHECKING` corrente, `SAVINGS` poupança, `SALARY` salário) |
| `categories` | classificação `INCOME` / `EXPENSE`, semeada no cadastro |
| `transactions` | lançamentos |
| `fixed_transactions` | despesas e receitas fixas, geram um lançamento previsto por mês sem fim |
| `recurring_charges` | cobranças parceladas, geram um lançamento previsto por mês até a última parcela |
| `whatsapp_sessions` | credenciais Baileys e estado da conexão por usuário |

Um lançamento tem duas dimensões independentes:

- `type` — `INCOME` (receita), `EXPENSE` (despesa), `TRANSFER` (transferência entre contas)
- `status` — `PAID` (efetivado), `PENDING` (previsto)

Compra no crédito é `EXPENSE` + `PENDING`: conta como gasto da categoria e como despesa prevista,
sem mexer no saldo até ser efetivada. Pagar a fatura é `TRANSFER`, então não vira despesa nova.

Saldo de conta nunca é armazenado: é `initial_balance` somado aos lançamentos `PAID`.

## Permissões

| | `OWNER` | `ADMIN` | `VIEWER` |
| --- | --- | --- | --- |
| Ler dados | sim | sim | sim |
| Criar, editar e excluir lançamentos, contas e categorias | sim | sim | não |
| Convidar, promover e remover membros | sim | não | não |

O papel é lido do banco a cada requisição, então promoção, rebaixamento e remoção valem na hora,
sem novo login.

## Autenticação

Senha com `bcryptjs`, sessão em JWT (`jose`) dentro de cookie `httpOnly`. O middleware protege
as rotas privadas. O token carrega o usuário e a carteira ativa; trocar de carteira reemite o cookie.

## Configuração

```bash
cp .env.example .env    # preencha DATABASE_URL, DIRECT_URL e JWT_SECRET
npm install
npm run db:generate
npm run db:migrate
```

Em produção, aponte `DATABASE_URL` para o pooler do Supabase (porta 6543,
sufixo `?pgbouncer=true&connection_limit=1`) e mantenha `DIRECT_URL` na porta 5432 para as migrations.

## Execução

```bash
npm run dev            # web em http://localhost:3000
npm run dev:whatsapp   # worker em http://localhost:4000
```

O worker é opcional: sem ele o app funciona normalmente e a tela de WhatsApp mostra o erro de conexão.

## Rotas

`/register` `/login` `/transactions` `/accounts` `/categories` `/members` `/settings/whatsapp`

A API fica sob `/api` e é consumida pelo browser via Axios.
