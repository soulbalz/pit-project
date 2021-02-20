import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormLabelRequired } from 'src/components/forms';
import Layout from 'src/components/layouts';

export default function PageStudentCreate() {
  const router = useRouter();
  const { register, handleSubmit, errors, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    router.push(`/students/${router.query.id}`);
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabelRequired label='รหัสผ่าน' />
          <FormControl type='password' name='password' isInvalid={errors.password} ref={register({ required: true })} />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='ยืนยันรหัสผ่าน' />
          <FormControl
            type='password'
            name='passwordConfirmation'
            isInvalid={errors.passwordConfirmation}
            ref={register({
              required: true,
              validate: value => value === watch('password') || 'รหัสผ่านไม่ตรงกัน'
            })} />
          {errors.passwordConfirmation && <FormControl.Feedback type='invalid'>{errors.passwordConfirmation.message}</FormControl.Feedback>}
        </FormGroup>
        <div className='row'>
          <div className='col'>
            <Button type='reset' variant='secondary' disabled={isSubmitting} block onClick={() => router.push(`/students/${router.query.id}`)}>ยกเลิก</Button>
          </div>
          <div className='col'>
            <Button type='submit' variant='primary' disabled={isSubmitting} block>บันทึก</Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
