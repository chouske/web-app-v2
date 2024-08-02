import { Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { COUNTRIES_DICT } from 'src/constants/COUNTRIES';
import { CountryFlag } from 'src/modules/general/components/countryFlag';
export interface LocationProps {
  country?: string;
  city?: string;
  iconName?: string;
}
export const Location: React.FC<LocationProps> = props => {
  const { country, city } = props;
  function getCountryName(shortname?: keyof typeof COUNTRIES_DICT | undefined) {
    if (shortname && COUNTRIES_DICT[shortname]) {
      return COUNTRIES_DICT[shortname];
    } else {
      return shortname;
    }
  }

  const address = `${city}, ${getCountryName(country as keyof typeof COUNTRIES_DICT | undefined)}`;
  const { t } = useTranslation('profile');
  return (
    <div className="flex flex-col gap-2">
      <Typography variant="subtitle1" className="text-Gray-light-mode-600">
        {t('locationLabel')}
      </Typography>
      <div className="flex gap-2 items-center">
        <CountryFlag countryCode={country || ''} />
        <Typography variant="h6" className="text-Gray-light-mode-700">
          {address}
        </Typography>
      </div>
    </div>
  );
};
