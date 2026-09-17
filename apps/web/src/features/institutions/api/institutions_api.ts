import { http_client, unwrap_response } from "@/lib/http_client";
import type { InstitutionDto } from "@/types/api";

let institutions_request: Promise<InstitutionDto[]> | null = null;

export const fetch_institutions = (): Promise<InstitutionDto[]> => {
  institutions_request ??= http_client
    .get("/institutions")
    .then((response) => unwrap_response<InstitutionDto[]>(response.data))
    .catch((error) => {
      institutions_request = null;
      throw error;
    });

  return institutions_request;
};
