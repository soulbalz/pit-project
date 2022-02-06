import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormLabelRequired } from 'src/components/forms';
import Layout from 'src/components/layouts';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import { API_URL } from 'src/constants';

export default function PageUserChangePassword() {
  const router = useRouter();
  const [session] = useSession();

  const { register, handleSubmit, errors, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    axios.put(`${API_URL}/api/users/${router.query.id}/changepassword`, values, {
      headers: {
        Authorization: `Bearer ${session.user.apiToken}`
      }
    }).then(res => {
      router.push(`/users/${router.query.id}`);
    }).catch(e => setIsSubmitting(false));
  };

  return (
    <Layout>
      <h3>เปลี่ยนรหัสผ่านบุคลากร: {router.query.id}</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabelRequired label='รหัสผ่าน' />
          <FormControl type='password' name='password' isInvalid={errors.password} ref={register({ required: true })} />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='ยืนยันรหัสผ่าน' />
          <FormControl
            type='password'
            name='password_confirmation'
            isInvalid={errors.password_confirmation}
            ref={register({
              required: true,
              validate: value => value === watch('password') || 'รหัสผ่านไม่ตรงกัน'
            })} />
          {errors.password_confirmation && <FormControl.Feedback type='invalid'>{errors.password_confirmation.message}</FormControl.Feedback>}
        </FormGroup>
        <div className='row'>
          <div className='col'>
            <Button type='reset' variant='secondary' disabled={isSubmitting} block onClick={() => router.push(`/users/${router.query.id}`)}>ยกเลิก</Button>
          </div>
          <div className='col'>
            <Button type='submit' variant='primary' disabled={isSubmitting} block>บันทึก</Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
