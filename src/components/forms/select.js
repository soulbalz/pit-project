import ReactSelect from 'react-select';
import CreatableReactSelect from 'react-select/creatable';
import { Controller } from 'react-hook-form';

export const Select = ({
  name,
  options,
  control,
  defaultValue = null,
  rules = {},
  isInvalid = false,
  placeholder = '',
  getOptionLabel = option => option.label,
  getOptionValue = option => option.value,
  isSearchable = true,
  isClearable = false,
  isMulti = false
}) => {
  const customStyles = {};
  if (isInvalid) customStyles.control = base => ({ ...base, borderColor: 'red' });

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={(field) => (
        <ReactSelect
          {...field}
          options={options}
          styles={customStyles}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          placeholder={placeholder}
          isClearable={isClearable}
          isSearchable={isSearchable}
          isMulti={isMulti}
        />
      )}
    />
  );
};

export const CreatableSelect = ({
  name,
  options,
  control,
  defaultValue = null,
  isInvalid = false,
  rules = {},
  placeholder = '',
  getOptionLabel = option => option.label,
  getOptionValue = option => option.value,
  isSearchable = true,
  isClearable = false,
  isMulti = false
}) => {
  const customStyles = {};
  if (isInvalid) customStyles.control = base => ({ ...base, borderColor: 'red' });

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={(field) => (
        <CreatableReactSelect
          {...field}
          options={options}
          styles={customStyles}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          placeholder={placeholder}
          isClearable={isClearable}
          isSearchable={isSearchable}
          isMulti={isMulti}
        />
      )}
    />
  );
};
