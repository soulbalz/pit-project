import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FormLabelRequired } from 'src/components/forms';
import axios from 'axios';
import { API_URL, REF_TEACHER } from 'src/constants';

const PageLogin = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  if (session && !loading) router.push('/');

  const { register, handleSubmit, errors, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    let registerPath = '/api/register';
    if (router.query.refs === REF_TEACHER) {
      registerPath = '/api/register/teacher';
    }

    axios.post(`${API_URL}${registerPath}`, values).then(res => {
      toast.success('สมัครสมาชิกสำเร็จ กรุณาล็อกอินเพื่อเข้าใช้ระบบ', {
        onClose: () => router.push('/auth')
      });
    }).catch(e => {
      setIsSubmitting(false);
      toast.error('สมัครสมาชิกไม่สำเร็จกรุณาตรวจสอบข้อมูลอีกครั้ง');
    });
  };

  useEffect(() => {
    document.getElementById('__next').classList.add('c-app', 'flex-row', 'align-items-center', 'auth-bg');
    return () => {
      document.getElementById('__next').classList.remove('c-app', 'flex-row', 'align-items-center', 'auth-bg');
    };
  }, []);

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card-group'>
            <div className='card p-4'>
              <div className='card-body'>
                <h1>สมัครใช้งานระบบ</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormGroup>
                    <FormLabelRequired label='รหัสนักศึกษา / Email' />
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
                  <div className='row'>
                    <div className='col'>
                      <Button type='reset' variant='secondary' disabled={isSubmitting} block onClick={() => router.push('/students')}>ยกเลิก</Button>
                    </div>
                    <div className='col'>
                      <Button type='submit' variant='primary' disabled={isSubmitting} block>บันทึก</Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
