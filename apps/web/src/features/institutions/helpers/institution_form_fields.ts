import { other_institution_value } from "./institution_search";

type InstitutionSource = {
  institution: string | null;
  institution_ispb: string | null;
};

export type InstitutionFormFields = {
  institution_choice?: string;
  institution?: string;
};

export type InstitutionPayloadFields = {
  institution: string | null;
  institution_ispb: string | null;
};

export const build_institution_form_fields = (
  source: InstitutionSource | null
): InstitutionFormFields => {
  if (source?.institution_ispb) {
    return { institution_choice: source.institution_ispb, institution: undefined };
  }

  if (source?.institution) {
    return { institution_choice: other_institution_value, institution: source.institution };
  }

  return { institution_choice: undefined, institution: undefined };
};

export const to_institution_payload_fields = (
  fields: InstitutionFormFields
): InstitutionPayloadFields => {
  const is_typed_institution = fields.institution_choice === other_institution_value;

  return {
    institution_ispb:
      fields.institution_choice && !is_typed_institution ? fields.institution_choice : null,
    institution: is_typed_institution ? fields.institution?.trim() || null : null,
  };
};
