import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/client';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiUser } from 'react-icons/fi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const PageLogin = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  if (session && !loading) router.push('/');

  const { register, handleSubmit, errors } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.getElementById('__next').classList.add('c-app', 'flex-row', 'align-items-center', 'auth-bg');
    return () => {
      document.getElementById('__next').classList.remove('c-app', 'flex-row', 'align-items-center', 'auth-bg');
    };
  }, []);

  const sendLogin = async ({ username, password }) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const res = await signIn('credentials', { username, password, redirect: false });

    if (!res.ok) {
      setIsSubmitting(false);
      toast.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-8 col-lg-5'>
          <div className='card-group'>
            <div className='card p-4'>
              <div className='card-body'>
                <div className='row align-items-baseline'>
                  <div className='col'>
                    <h1>เข้าสู่ระบบ</h1>
                  </div>
                  <div className='col-auto'>
                    <a href='/register'>สมัครสมาชิก</a>
                  </div>
                </div>
                <form onSubmit={handleSubmit(sendLogin)}>
                  <InputGroup className='mb-3'>
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FiUser className='c-icon' />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl name='username' placeholder='รหัสนักศึกษา / Email' isInvalid={errors.username} ref={register({ required: true })} />
                  </InputGroup>
                  <InputGroup className='mb-4'>
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <RiLockPasswordLine className='c-icon' />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type='password' name='password' placeholder='รหัสผ่าน' isInvalid={errors.password} ref={register({ required: true })} />
                  </InputGroup>

                  <Button type='submit' variant='primary' className='text-uppercase' disabled={isSubmitting} block>Login</Button>
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
