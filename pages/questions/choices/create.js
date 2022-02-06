import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, FormGroup, FormLabel } from 'react-bootstrap';
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

export default function PageQuestionChoiceCreate() {
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
      question_type: 'choice'
    }, {
      headers: {
        Authorization: `Bearer ${session.user.apiToken}`
      }
    }).then(res => {
      router.push('/questions/choices');
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

  const answers = [];
  for (let i = 0; i < 5; i++) {
    if (i < 2) {
      answers.push(
        <FormGroup>
          <FormLabelRequired label={`คำตอบ ${i + 1} ${i === 0 ? '(คำตอบที่ถูกต้อง)' : ''}`} />
          <TextWYSIWYG
            name={`question_answers[${i}]`}
            control={control}
            rules={{ required: true }}
            isInvalid={errors.question_answer?.[i] || false}
          />
        </FormGroup>
      );
    } else {
      answers.push(
        <FormGroup>
          <FormLabel>คำตอบ {i + 1}</FormLabel>
          <TextWYSIWYG
            name={`question_answers[${i}]`}
            control={control}
            isInvalid={errors.question_answer?.[i] || false}
          />
        </FormGroup>
      );
    }
  }

  return (
    <Layout>
      <h3>เพิ่มคำถามแบบตัวเลือก</h3>
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
        {answers}
        <div className='row'>
          <div className='col'>
            <Button type='reset' variant='secondary' disabled={isSubmitting} block onClick={() => router.push('/questions/choices')}>ยกเลิก</Button>
          </div>
          <div className='col'>
            <Button type='submit' variant='primary' disabled={isSubmitting} block>บันทึก</Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
