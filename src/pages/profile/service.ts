export function isUserObject(value: unknown): value is {
  login: string;
  first_name: string;
  second_name: string;
  email: string;
  display_name: string;
  phone: string;
  id: number;
  avatar: string | null;
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'login' in value &&
    'first_name' in value &&
    'second_name' in value &&
    'email' in value &&
    'display_name' in value &&
    'phone' in value &&
    'avatar' in value &&
    'id' in value
  );
}
