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

export default function PageQuestionWritingEdit() {
  const router = useRouter();
  const [session] = useSession();

  const { handleSubmit, errors, control, watch, setValue } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [questionGroups, setQuestionGroups] = useState([]);

  const [item, setItem] = useState({});

  const watchSubject = watch('subject');

  const onSubmit = (values) => {
    if (isSubmitting) return;
    setIsSubmitting(false);

    axios.put(`${API_URL}/api/questions/${router.query.id}`, {
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

      axios.get(`${API_URL}/api/questions/${router.query.id}`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        setItem(data);
      });
    }
  }, [session]);

  useEffect(() => {
    setValue('question_group', null);

    if (watchSubject && watchSubject.value && !watchSubject.__isNew__) {
      axios.get(`${API_URL}/api/questions/groups`, {
        params: {
          subject: watchSubject.value
        },
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        setQuestionGroups(data);

        if (watchSubject.value === item.subject) {
          setValue('question_group', { label: item.question_group, value: item.question_group });
        }
      });
    }
  }, [watchSubject]);

  return (
    <Layout>
      <h3>แก้ไขคำถาม: {router.query.id}</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabelRequired label='วิชา' />
          {item.subject && <CreatableSelect
            name='subject'
            control={control}
            rules={{ required: true }}
            options={subjects}
            defaultValue={{ label: item.subject, value: item.subject }}
            isInvalid={errors.subject}
          />}
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='ชุดคำถาม' />
          {item.question_group && <CreatableSelect
            name='question_group'
            control={control}
            rules={{ required: true }}
            options={questionGroups}
            defaultValue={{ label: item.question_group, value: item.question_group }}
            isInvalid={errors.question_group}
          />}
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='คำถาม' />
          {item.name && <TextWYSIWYG
            name='question_name'
            control={control}
            rules={{ required: true }}
            defaultValue={item.name}
            isInvalid={errors.question_name}
          />}
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
