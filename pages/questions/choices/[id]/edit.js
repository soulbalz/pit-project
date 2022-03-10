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

export default function PageQuestionChoiceEdit() {
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
      question_type: 'choice'
    }, {
      headers: {
        Authorization: `Bearer ${session.user.apiToken}`
      }
    }).then(res => {
      router.push(`/questions/choices/${router.query.id}`);
    }).catch(e => setIsSubmitting(false));
  };

  useEffect(() => {
    if (session && router.query.id) {
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
  }, [session, router]);

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

  const answers = item.choices?.map((choice, i) => {
    return (
      <FormGroup key={choice._id}>
        <FormLabelRequired label={`คำตอบ ${i + 1} ${i === 0 ? '(คำตอบที่ถูกต้อง)' : ''}`} />
        <TextWYSIWYG
          name={`question_answers[${choice._id}]`}
          control={control}
          rules={{ required: true }}
          isInvalid={errors.question_answer?.[choice._id] || false}
          defaultValue={choice.name}
        />
      </FormGroup>
    );
  }) || [];

  if (item.choices && answers.length < 5) {
    [...Array(5 - answers.length)].forEach((i, val) => {
      answers.push(
        <FormGroup key={4}>
          <FormLabel>คำตอบ {answers.length + 1}</FormLabel>
          <TextWYSIWYG
            name={`question_answers[${answers.length}]`}
            control={control}
            isInvalid={errors.question_answer?.[answers.length] || false}
          />
        </FormGroup>
      );
    });
  }

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
