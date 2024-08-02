import { Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/modules/general/components/Button';
import { Input } from 'src/modules/general/components/input/input';
import { Modal } from 'src/modules/general/components/modal';

import { useEditSummary } from './useEditSummary';

interface EditSummaryProps {
  open: boolean;
  handleClose: () => void;
  type?: 'users' | 'organizations';
}

export const EditSummary: React.FC<EditSummaryProps> = ({ open, handleClose, type = 'users' }) => {
  const { t } = useTranslation('profile');
  const { error, summary, handleChange, letterCount, closeModal, onSave } = useEditSummary(handleClose, type);
  const contentJSX = (
    <div className="p-6 w-full h-full flex flex-col gap-[6px]">
      <Input
        id="summary"
        label={t('experienceSkillsPassionLabel')}
        name="summary"
        required
        errors={error ? [error] : undefined}
        value={summary}
        onChange={handleChange}
        multiline
        customHeight="168px"
        maxRows={7}
      />
      <Typography variant="caption" className="text-Gray-light-mode-600 mr-0 ml-auto">
        {`${letterCount}/2600`}
      </Typography>
    </div>
  );

  const modalFooterJsx = (
    <div className="w-full flex flex-col md:flex-row-reverse px-4 py-4 md:px-6 md:py-6 gap-3 md:justify-start">
      <Button customStyle="w-full md:w-fit " variant="contained" color="primary" onClick={onSave}>
        {t('summaryText')}
      </Button>
      <Button customStyle="w-full md:w-fit " variant="outlined" color="primary" onClick={closeModal}>
        {t('saveText')}
      </Button>
    </div>
  );
  return (
    <Modal
      open={open}
      handleClose={closeModal}
      title={t('editSummaryText')}
      content={contentJSX}
      footer={modalFooterJsx}
    />
  );
};
