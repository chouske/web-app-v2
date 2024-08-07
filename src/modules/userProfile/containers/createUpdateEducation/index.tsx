import React from 'react';
import { useTranslation } from 'react-i18next';
import { Education } from 'src/core/api';
import { Button } from 'src/modules/general/components/Button';
import { Input } from 'src/modules/general/components/input/input';
import { Modal } from 'src/modules/general/components/modal';
import { SearchDropdown } from 'src/modules/general/components/SearchDropdown';

import { useCreateUpdateEducation } from './useCreateUpdateEducation';

interface CreateUpdateEducationProps {
  open: boolean;
  handleClose: () => void;
  education?: Education;
  readonly?: boolean;
}

export const CreateUpdateEducation: React.FC<CreateUpdateEducationProps> = ({
  open,
  handleClose,
  education,
  readonly,
}) => {
  const {
    schoolVal,
    searchSchools,
    onSelectSchool,
    errors,
    register,
    months,
    years,
    startMonth,
    startYear,
    endMonth,
    endYear,
    onSelectStartMonth,
    onSelectStartYear,
    onSelectEndMonth,
    onSelectEndYear,
    handleSubmit,
    onSave,
    onDelete,
    startDateErrors,
    endDateErrors,
  } = useCreateUpdateEducation(handleClose, education);
  const { t } = useTranslation('profile');
  const contentJSX = (
    <div className="p-6 w-full h-full flex flex-col gap-5 overflow-y-auto">
      <SearchDropdown
        id="school"
        cacheOptions
        value={schoolVal}
        isAsync
        creatable
        loadOptions={searchSchools}
        defaultOptions
        icon="search-lg"
        hasDropdownIcon={false}
        label={t('schoolLabel')}
        onChange={value => {
          onSelectSchool(value);
        }}
        placeholder="Search for school"
        noOptionsMessage={({ inputValue }) => inputValue}
        errors={errors['school']?.label?.message ? [errors['school']?.label.message.toString()] : undefined}
        isDisabled={readonly}
      />
      <Input
        id="degree"
        label={t('credential')}
        name="degree"
        register={register}
        placeholder={t('credentialName')}
        errors={errors['degree']?.message ? [errors['degree']?.message.toString()] : undefined}
        disabled={readonly}
      />
      <Input
        id="field-of-study"
        label={t('fieldOfStudy')}
        name="field"
        register={register}
        placeholder={t('specialities')}
        errors={errors['field']?.message ? [errors['field']?.message.toString()] : undefined}
        disabled={readonly}
      />
      <div className="flex gap-4 items-start">
        <SearchDropdown
          required
          id="start-month"
          value={startMonth}
          label={t('startDateLabel')}
          options={months}
          hasDropdownIcon
          onChange={value => {
            onSelectStartMonth(value);
          }}
          className="flex-1"
          placeholder="Month"
          isSearchable
          errors={startDateErrors ? [startDateErrors.toString()] : undefined}
          isDisabled={readonly}
        />
        <SearchDropdown
          required
          id="start-year"
          label="&nbsp;"
          value={startYear}
          options={years}
          hasDropdownIcon
          onChange={value => {
            onSelectStartYear(value);
          }}
          className="flex-1"
          placeholder="Year"
          isSearchable
          isDisabled={readonly}
        />
      </div>
      <div className="flex gap-4 items-start">
        <SearchDropdown
          required
          id="end-month"
          value={endMonth}
          label={t('endDateLabel')}
          options={months}
          hasDropdownIcon
          onChange={value => {
            onSelectEndMonth(value);
          }}
          placeholder="Month"
          className="flex-1"
          isSearchable
          errors={endDateErrors ? [endDateErrors.toString()] : undefined}
          isDisabled={readonly}
        />
        <SearchDropdown
          required
          id="end-year"
          label="&nbsp;"
          value={endYear}
          options={years}
          hasDropdownIcon
          onChange={value => {
            onSelectEndYear(value);
          }}
          className="flex-1"
          placeholder="Year"
          isSearchable
          isDisabled={readonly}
        />
      </div>
      <Input
        id="grade"
        label={t('Profile_Grade')}
        name="grade"
        register={register}
        placeholder={t('Profile_Grade')}
        errors={errors['grade']?.message ? [errors['grade']?.message.toString()] : undefined}
        disabled={readonly}
      />
      <Input
        id="description"
        name="description"
        label={t('descriptionLabel')}
        multiline
        customHeight="130px"
        register={register}
        placeholder={t('enterDescriptionText')}
        disabled={readonly}
      />
    </div>
  );
  const modalFooterJsx = (
    <div className="w-full flex flex-col md:flex-row-reverse px-4 py-4 md:px-6 md:py-6 gap-3 md:justify-start">
      <Button customStyle="w-full md:w-fit " variant="contained" color="primary" onClick={handleSubmit(onSave)}>
        {education ? t('job_title_header') : t('addEducationText')}
      </Button>
      <Button customStyle="w-full md:w-fit " variant="outlined" color="primary" onClick={handleClose}>
        {t('cancelText')}
      </Button>
      {education && (
        <Button
          variant="text"
          color="primary"
          customStyle="ml-0 mr-auto text-Gray-light-mode-600 w-full md:w-fit"
          onClick={onDelete}
        >
          Delete education
        </Button>
      )}
    </div>
  );
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title={education ? t('Profile_Edit_education') : t('addEducationText')}
      content={contentJSX}
      footer={modalFooterJsx}
    />
  );
};
