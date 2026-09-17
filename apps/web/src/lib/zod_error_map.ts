import { z } from "zod";

const plural = (count: number, singular: string, many: string): string => (count === 1 ? `1 ${singular}` : `${count} ${many}`);

export const portuguese_error_map: z.ZodErrorMap = (issue, context) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      return {
        message:
          issue.received === "undefined" || issue.received === "null"
            ? "Campo obrigatório."
            : issue.expected === "integer"
              ? "Use um número inteiro."
              : "Valor em formato inválido.",
      };
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") {
        return { message: "Informe um e-mail válido." };
      }

      if (issue.validation === "uuid") {
        return { message: "Escolha uma opção da lista." };
      }

      if (issue.validation === "datetime" || issue.validation === "date") {
        return { message: "Informe uma data válida." };
      }

      return { message: "Texto em formato inválido." };
    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        return { message: `Use pelo menos ${plural(Number(issue.minimum), "caractere", "caracteres")}.` };
      }

      if (issue.type === "number") {
        return { message: issue.inclusive ? `O valor mínimo é ${issue.minimum}.` : `O valor precisa ser maior que ${issue.minimum}.` };
      }

      return { message: "Escolha pelo menos uma opção." };
    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        return { message: `Use no máximo ${plural(Number(issue.maximum), "caractere", "caracteres")}.` };
      }

      return { message: issue.type === "number" ? `O valor máximo é ${issue.maximum}.` : "Opções demais selecionadas." };
    case z.ZodIssueCode.invalid_enum_value:
      return { message: "Escolha uma opção da lista." };
    case z.ZodIssueCode.invalid_date:
      return { message: "Informe uma data válida." };
    case z.ZodIssueCode.invalid_union:
      return { message: "Valor em formato inválido." };
    default:
      return { message: context.defaultError === "Required" ? "Campo obrigatório." : "Valor inválido." };
  }
};

z.setErrorMap(portuguese_error_map);
