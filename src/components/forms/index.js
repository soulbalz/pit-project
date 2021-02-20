import { FormLabel } from 'react-bootstrap';

export function FormLabelRequired({ label }) {
  return (
    <FormLabel>
      {label} <span className='text-danger'>*</span>
    </FormLabel>
  );
}
