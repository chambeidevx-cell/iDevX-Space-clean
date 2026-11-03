import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompanyConfig } from '@/interfaces/my-company';
import { COMPANY_NAME, DEFAULT_COMPANY_LOGO, IDEVX_LOGO } from '@/constants/brand';

interface MyCompanyState extends CompanyConfig {
  setDetails: (details: CompanyConfig) => void;
}

const DEFAULT_CONFIG: CompanyConfig = {
  companyName: COMPANY_NAME,
  // The company this install is configured for has a mark of its own, so it
  // starts at that rather than at the placeholder. That matters beyond looking
  // right: anything drawing a company mark treats DEFAULT_COMPANY_LOGO as
  // "no logo uploaded" and falls back to initials, so leaving it here would
  // show "iS" on a company whose logo is sitting in `public/`.
  companyLogo: IDEVX_LOGO,
  // Still the placeholder: required, so it cannot be empty, and nothing renders
  // it yet — it is stored for whatever comes to set the document icon.
  companyFavicon: DEFAULT_COMPANY_LOGO,
  addressLine1: '',
  addressLine2: '',
  country: '',
  city: '',
  zipCode: '',
  workEmail: '',
  dialCode: '+63',
  phoneNumber: '',
};

export const useMyCompanyStore = create<MyCompanyState>()(
  persist(
    (set) => ({
      ...DEFAULT_CONFIG,
      setDetails: (details) => set(details),
    }),
    { name: 'my-company' },
  ),
);
