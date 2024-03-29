import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormLabelRequired } from 'src/components/forms';
import Layout from 'src/components/layouts';
import { useSession } from 'next-auth/client';
import axios from 'axios';
import { API_URL } from 'src/constants';

export default function PageStudentEdit() {
  const router = useRouter();
  const [session] = useSession();

  const { register, handleSubmit, errors, setValue } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userCode, setUserCode] = useState('');

  const onSubmit = (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    axios.put(`${API_URL}/api/students/${router.query.id}`, values, {
      headers: {
        Authorization: `Bearer ${session.user.apiToken}`
      }
    }).then(res => {
      router.push(`/students/${router.query.id}`);
    }).catch(e => setIsSubmitting(false));
  };

  useEffect(() => {
    if (session && router.query.id) {
      axios.get(`${API_URL}/api/students/${router.query.id}`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        setUserCode(data.user_code);
        setValue('first_name', data.first_name);
        setValue('last_name', data.last_name);
      });
    }
  }, [session, router]);

  return (
    <Layout>
      <h3>แก้ไขข้อมูลนักศึกษา: {router.query.id}</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabelRequired label='รหัสนักศึกษา' />
          <FormControl value={userCode} disabled />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='ชื่อ' />
          <FormControl name='first_name' isInvalid={errors.first_name} ref={register({ required: true })} />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='นามสกุล' />
          <FormControl name='last_name' isInvalid={errors.last_name} ref={register({ required: true })} />
        </FormGroup>
        <div className='row'>
          <div className='col'>
            <Button type='reset' variant='secondary' disabled={isSubmitting} block
                    onClick={() => router.push(`/students/${router.query.id}`)}>ยกเลิก</Button>
          </div>
          <div className='col'>
            <Button type='submit' variant='primary' disabled={isSubmitting} block>บันทึก</Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
