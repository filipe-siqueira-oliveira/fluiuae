import { banks, pixInstitutions, type Institution } from "logos-bancos-br";
import { featured_institutions } from "./featured_institutions";
import type { InstitutionDto } from "@/types/api";

const nickname_by_ispb = new Map(
  featured_institutions.map((featured, position) => [featured.ispb, { ...featured, position }])
);

const to_institution_dto = (institution: Institution): InstitutionDto => {
  const featured = nickname_by_ispb.get(institution.ispb);

  return {
    ispb: institution.ispb,
    compe: institution.compe ?? null,
    name: featured?.nickname ?? institution.shortName ?? institution.name,
    legal_name: institution.name,
    has_logo: Boolean(institution.logo?.png),
    is_featured: Boolean(featured),
  };
};

const sort_institutions = (first: InstitutionDto, second: InstitutionDto): number => {
  if (first.is_featured && second.is_featured) {
    return (
      (nickname_by_ispb.get(first.ispb)?.position ?? 0) -
      (nickname_by_ispb.get(second.ispb)?.position ?? 0)
    );
  }

  if (first.is_featured !== second.is_featured) {
    return first.is_featured ? -1 : 1;
  }

  return first.name.localeCompare(second.name, "pt-BR");
};

const build_catalog = (): InstitutionDto[] => {
  const unique_institutions = new Map<string, Institution>();

  for (const institution of [...banks(), ...pixInstitutions()]) {
    unique_institutions.set(institution.ispb, institution);
  }

  return [...unique_institutions.values()].map(to_institution_dto).sort(sort_institutions);
};

let cached_catalog: InstitutionDto[] | null = null;
let cached_index: Map<string, InstitutionDto> | null = null;

export const list_institutions = (): InstitutionDto[] => {
  cached_catalog ??= build_catalog();

  return cached_catalog;
};

export const find_institution = (ispb: string | null | undefined): InstitutionDto | null => {
  if (!ispb) {
    return null;
  }

  cached_index ??= new Map(list_institutions().map((institution) => [institution.ispb, institution]));

  return cached_index.get(ispb) ?? null;
};
