import { bad_request } from "@/lib/http_error";
import { find_institution } from "@/server/institutions/institution_catalog";

type InstitutionInput = {
  institution?: string | null;
  institution_ispb?: string | null;
};

export const resolve_institution = (
  input: InstitutionInput
): { institution: string | null; institution_ispb: string | null } => {
  if (input.institution_ispb) {
    const catalog_institution = find_institution(input.institution_ispb);

    if (!catalog_institution) {
      throw bad_request("institution_not_found");
    }

    return { institution: catalog_institution.name, institution_ispb: catalog_institution.ispb };
  }

  const typed_institution = input.institution?.trim();

  return { institution: typed_institution ? typed_institution : null, institution_ispb: null };
};
