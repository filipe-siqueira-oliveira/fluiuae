export const read_first_name = (full_name: string): string => full_name.trim().split(/\s+/)[0] || full_name;
