import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, FormGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormLabelRequired } from 'src/components/forms';
import Layout from 'src/components/layouts';
import { useSession } from 'next-auth/client';
import axios from 'axios';
import { CreatableSelect } from 'src/components/forms/select';
import dynamic from 'next/dynamic';
import { API_URL } from 'src/constants';

const TextWYSIWYG = dynamic(
  () => import('src/components/forms/wysiwyg'),
  { ssr: false }
);

export default function PageQuestionWritingCreate() {
  const router = useRouter();
  const [session] = useSession();

  const { handleSubmit, errors, control, watch, setValue } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [questionGroups, setQuestionGroups] = useState([]);

  const watchSubject = watch('subject');

  const onSubmit = (values) => {
    if (isSubmitting) return;
    setIsSubmitting(false);

    axios.post(`${API_URL}/api/questions`, {
      ...values,
      question_type: 'writing'
    }, {
      headers: {
        Authorization: `Bearer ${session.user.apiToken}`
      }
    }).then(res => {
      router.push('/questions/writings');
    }).catch(e => setIsSubmitting(false));
  };

  useEffect(() => {
    if (session) {
      axios.get(`${API_URL}/api/questions/subjects`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        setSubjects(data);
      });
    }
  }, [session]);

  useEffect(() => {
    setValue('question_group', null);

    if (watchSubject && !watchSubject.__isNew__) {
      axios.get(`${API_URL}/api/questions/groups`, {
        params: {
          subject: watchSubject.value
        },
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        setQuestionGroups(data);
      });
    }
  }, [watchSubject]);

  return (
    <Layout>
      <h3>เพิ่มคำถามแบบข้อเขียน</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabelRequired label='วิชา' />
          <CreatableSelect
            name='subject'
            control={control}
            rules={{ required: true }}
            options={subjects}
            isInvalid={errors.subject}
          />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='ชุดคำถาม' />
          <CreatableSelect
            name='question_group'
            control={control}
            rules={{ required: true }}
            options={questionGroups}
            isInvalid={errors.question_group}
          />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='คำถาม' />
          <TextWYSIWYG
            name='question_name'
            control={control}
            rules={{ required: true }}
          />
        </FormGroup>
        <div className='row'>
          <div className='col'>
            <Button type='reset' variant='secondary' disabled={isSubmitting} block onClick={() => router.push('/questions/writings')}>ยกเลิก</Button>
          </div>
          <div className='col'>
            <Button type='submit' variant='primary' disabled={isSubmitting} block>บันทึก</Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
