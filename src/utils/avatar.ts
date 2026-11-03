export const getAvatarColor = (name: string): string => {
  const colors = [
    '#129BFF',
    '#73D8F7',
    '#003B8B',
    '#175EA1',
    '#05894C',
    '#D4893E',
    '#A40D0D',
    '#0A7FDB',
  ];
  const charCode = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
  return colors[charCode % colors.length];
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Builds avatar initials from the first two words of a company name.
 *
 * @example getCompanyInitials('Acme Corp Holdings') // 'AC'
 */
export const getCompanyInitials = (name: string): string =>
  name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();
