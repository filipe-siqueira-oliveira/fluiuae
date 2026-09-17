import type { InstitutionDto } from "@/types/api";

export const other_institution_value = "other";

export const normalize_search_text = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

export const build_institution_search_text = (institution: InstitutionDto): string =>
  normalize_search_text(
    [institution.name, institution.legal_name, institution.compe ?? ""].join(" ")
  );
