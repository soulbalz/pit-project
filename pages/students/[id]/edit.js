import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormLabelRequired } from 'src/components/forms';
import Layout from 'src/components/layouts';

export default function PageStudentCreate() {
  const router = useRouter();
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      studentCode: '1234',
      email: 'example@email.com'
    }
  });
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
          <FormLabelRequired label='ชื่อ' />
          <FormControl name='firstName' isInvalid={errors.firstName} ref={register({ required: true })} />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='นามสกุล' />
          <FormControl name='lastName' isInvalid={errors.lastName} ref={register({ required: true })} />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='รหัสนักศึกษา' />
          <FormControl name='studentCode' isInvalid={errors.studentCode} ref={register({ required: true })} />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='อีเมล์' />
          <FormControl type='email' name='email' isInvalid={errors.email} ref={register({ required: true })} />
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
