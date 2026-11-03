export const ROLES = [
  { id: 'superAdmin', label: 'Super Admin' },
  { id: 'hrManager', label: 'HR Manager' },
  { id: 'payrollOfficer', label: 'Payroll Officer' },
  { id: 'departmentManager', label: 'Department Manager' },
  { id: 'financeAnalyst', label: 'Finance Analyst' },
  { id: 'recruiter', label: 'Recruiter' },
  { id: 'readOnly', label: 'Read Only' },
  { id: 'itAdmin', label: 'IT Admin' },
  { id: 'auditor', label: 'Auditor' },
  { id: 'guest', label: 'Guest' },
] as const;

export type RoleId = (typeof ROLES)[number]['id'];

/**
 * Display label for a role id, falling back to the id so an unknown role still
 * renders something recognisable rather than a blank.
 *
 * @example getRoleLabel('hrManager') // 'HR Manager'
 */
export const getRoleLabel = (roleId: string): string =>
  ROLES.find((role) => role.id === roleId)?.label ?? roleId;

/**
 * Roles as one readable string, for cards and summaries where chips would be
 * too heavy.
 *
 * @example getRoleLabels(['hrManager', 'auditor']) // 'HR Manager, Auditor'
 */
export const getRoleLabels = (roleIds?: string[]): string =>
  (roleIds ?? []).map(getRoleLabel).join(', ');
