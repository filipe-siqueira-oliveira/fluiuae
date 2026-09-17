const read_required_variable = (variable_name: string): string => {
  const value = process.env[variable_name];

  if (!value) {
    throw new Error(`missing_environment_variable:${variable_name}`);
  }

  return value;
};

const read_optional_variable = (variable_name: string, fallback: string): string =>
  process.env[variable_name] ?? fallback;

export const environment = {
  jwt_secret: () => read_required_variable("JWT_SECRET"),
  session_cookie_name: () => read_optional_variable("SESSION_COOKIE_NAME", "fluiuae_session"),
  session_max_age_seconds: () =>
    Number(read_optional_variable("SESSION_MAX_AGE_SECONDS", "604800")),
  whatsapp_worker_url: () => read_optional_variable("WHATSAPP_WORKER_URL", "http://localhost:4000"),
  whatsapp_worker_token: () => read_optional_variable("WHATSAPP_WORKER_TOKEN", ""),
  is_production: () => process.env.NODE_ENV === "production",
};
