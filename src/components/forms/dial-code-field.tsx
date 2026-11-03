import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { COUNTRIES, CountryOption } from '@/constants/countries';
import { HELPER_TEXT_SX } from '@/constants/form';

/** Wide enough for a flag, the longest dial code and the clear button. */
const DEFAULT_WIDTH = 145;

interface DialCodeFieldProps {
  value: CountryOption | null;
  onChange: (value: CountryOption | null) => void;
  /** Validation message; also puts the field in its error state. */
  error?: string;
  label?: string;
  isRequired?: boolean;
  /** Number for a fixed width, or `'100%'` to fill the grid column it sits in. */
  width?: number | string;
}

/**
 * Country dial code picker, paired with a contact number field.
 *
 * Searching matches the country name as well as the code, since people reach
 * for "Philippines" far more readily than "+63".
 *
 * @example
 * <Stack direction="row" spacing={1.5}>
 *   <DialCodeField value={dialCode} onChange={setDialCode} error={errors.dialCode} />
 *   <TextField label="Contact Number" … />
 * </Stack>
 */
export const DialCodeField = ({
  value,
  onChange,
  error,
  label = 'Code',
  isRequired = true,
  width = DEFAULT_WIDTH,
}: DialCodeFieldProps) => (
  <Autocomplete
    options={[...COUNTRIES]}
    getOptionLabel={(option) => `${option.flag} ${option.dialCode}`}
    filterOptions={(options, { inputValue }) => {
      const query = inputValue.toLowerCase();
      return options.filter((option) =>
        option.name.toLowerCase().includes(query) || option.dialCode.includes(query));
    }}
    value={value}
    onChange={(_, newValue) => onChange(newValue)}
    isOptionEqualToValue={(option, selected) => option.code === selected.code}
    size="small"
    sx={{ width, flexShrink: 0 }}
    renderOption={(props, option) => (
      <Box component="li" {...props} key={option.code}>
        <Typography variant="body2" sx={{ mr: 1 }}>{option.flag}</Typography>
        <Typography variant="body2" sx={{ mr: 1 }}>{option.dialCode}</Typography>
        <Typography variant="body2" color="text.secondary">{option.name}</Typography>
      </Box>
    )}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        required={isRequired}
        error={Boolean(error)}
        helperText={error}
        slotProps={{ inputLabel: { shrink: true }, formHelperText: HELPER_TEXT_SX }}
      />
    )}
  />
);

/** Resolves a stored dial code such as `'+63'` back to its country option. */
export const resolveDialCode = (dialCode: string): CountryOption | null =>
  COUNTRIES.find((country) => country.dialCode === dialCode) ?? null;
