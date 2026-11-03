export interface User {
  id: string;
  /** What identifies the record in a URL — never the sequential `id`. */
  uuid: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  suffix?: string;
  email: string;
  personalEmail?: string;
  birthdate?: string;
  /** Role ids from `ROLES`. A user may hold several. */
  roles?: string[];
  status?: string;
  avatar?: string;
  platforms?: string[];
  devices?: import('./device').Device[];
}
