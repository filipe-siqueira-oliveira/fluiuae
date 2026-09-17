import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { config } from "dotenv";

const find_root_environment_file = (start_directory: string): string | null => {
  let current_directory = start_directory;

  while (true) {
    const candidate = resolve(current_directory, ".env");

    if (existsSync(candidate)) {
      return candidate;
    }

    const parent_directory = dirname(current_directory);

    if (parent_directory === current_directory) {
      return null;
    }

    current_directory = parent_directory;
  }
};

let has_loaded = false;

export const load_root_environment = (): void => {
  if (has_loaded) {
    return;
  }

  has_loaded = true;

  const environment_file = find_root_environment_file(process.cwd());

  if (environment_file) {
    config({ path: environment_file });
  }
};
