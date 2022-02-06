import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormLabelRequired } from 'src/components/forms';
import Layout from 'src/components/layouts';
import { useSession } from 'next-auth/client';
import axios from 'axios';
import { API_URL } from 'src/constants';

export default function PageUserCreate() {
  const router = useRouter();
  const [session] = useSession();

  const { register, handleSubmit, errors, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    axios.post(`${API_URL}/api/users`, values, {
      headers: {
        Authorization: `Bearer ${session.user.apiToken}`
      }
    }).then(res => {
      router.push('/users');
    }).catch(e => setIsSubmitting(false));
  };

  return (
    <Layout>
      <h3>เพิ่มบุคลากร</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabelRequired label='Username' />
          <FormControl name='user_code' isInvalid={errors.user_code} ref={register({ required: true })} />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='ชื่อ' />
          <FormControl name='first_name' isInvalid={errors.first_name} ref={register({ required: true })} />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='นามสกุล' />
          <FormControl name='last_name' isInvalid={errors.last_name} ref={register({ required: true })} />
        </FormGroup>
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
        <FormGroup>
          <FormLabelRequired label='สิทธิ์การใช้งาน' />
          <FormControl
            as='select'
            name='role'
            isInvalid={errors.role}
            ref={register({ required: true })}
            custom
          >
            <option value='teacher'>บุคลากร</option>
            <option value='admin'>ผู้ดูแลระบบ</option>
          </FormControl>
        </FormGroup>
        <div className='row'>
          <div className='col'>
            <Button type='reset' variant='secondary' disabled={isSubmitting} block onClick={() => router.push('/users')}>ยกเลิก</Button>
          </div>
          <div className='col'>
            <Button type='submit' variant='primary' disabled={isSubmitting} block>บันทึก</Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
