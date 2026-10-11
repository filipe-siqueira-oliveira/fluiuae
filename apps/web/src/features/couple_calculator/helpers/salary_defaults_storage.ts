export type SalarySlot = "first" | "second";

const storage_keys: Record<SalarySlot, string> = {
  first: "fluiuae_couple_calculator_first_salary",
  second: "fluiuae_couple_calculator_second_salary",
};

export const read_salary_default = (slot: SalarySlot): number | null => {
  try {
    const stored_value = window.localStorage.getItem(storage_keys[slot]);
    const parsed_value = stored_value === null ? Number.NaN : Number(stored_value);

    return Number.isFinite(parsed_value) ? parsed_value : null;
  } catch {
    return null;
  }
};

export const store_salary_default = (slot: SalarySlot, value: number | null): void => {
  try {
    if (value === null) {
      window.localStorage.removeItem(storage_keys[slot]);

      return;
    }

    window.localStorage.setItem(storage_keys[slot], String(value));
  } catch {
    return;
  }
};
