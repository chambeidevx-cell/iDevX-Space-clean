import { Box } from '@mui/material';
import { PersonName } from '@/utils/format-name';
import { usePersonName } from '@/hooks/use-person-name';

interface PersonNameCellProps {
  /** Omit or pass `undefined` for an unknown person — the cell shows a dash. */
  person?: PersonName;
}

/**
 * Grid cell for a person's name, arranged by the format set in Account
 * Settings.
 *
 * Takes the name's parts rather than a finished string: a cell handed
 * `'John Doe'` cannot honour a setting that asks for `Doe, John`, and storing
 * the assembled name is what silently opts a column out of the rule that every
 * name in the app reads the same way.
 *
 * @example renderCell: (params) => <PersonNameCell person={findUserById(params.value)} />
 */
export const PersonNameCell = ({ person }: PersonNameCellProps) => {
  const getName = usePersonName();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', whiteSpace: 'nowrap' }}>
      {person ? getName(person) : <Box component="span" sx={{ color: 'text.disabled' }}>—</Box>}
    </Box>
  );
};
