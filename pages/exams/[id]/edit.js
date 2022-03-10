import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormLabelRequired } from 'src/components/forms';
import Layout from 'src/components/layouts';
import { useSession } from 'next-auth/client';
import axios from 'axios';
import { Select } from 'src/components/forms/select';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { API_URL } from 'src/constants';

const TextWYSIWYG = dynamic(
  () => import('src/components/forms/wysiwyg'),
  { ssr: false }
);

export default function PageExamCreate() {
  const router = useRouter();
  const [session] = useSession();

  const { control, register, handleSubmit, errors, watch, setValue } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [questionGroups, setQuestionGroups] = useState([]);

  const [item, setItem] = useState({});

  const watchSubject = watch('subject');

  const onSubmit = (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const timezone = dayjs().format('ZZ');

    const data = {
      ...values,
      subject: values.subject.value,
      question_choice_group: values.question_choice_group?.value,
      total_question_choice: values.question_choice_group ? parseInt(values.total_question_choice) : undefined,
      question_writing_group: values.question_writing_group?.value,
      total_question_writing: values.question_writing_group ? parseInt(values.total_question_writing) : undefined,
      exam_start: `${values.exam_start}:00${timezone}`,
      exam_end: `${values.exam_end}:00${timezone}`,
      exam_time: parseInt(values.exam_time)
    };

    axios.put(`${API_URL}/api/exams/${router.query.id}`, data, {
      headers: {
        Authorization: `Bearer ${session.user.apiToken}`
      }
    }).then(res => {
      router.push('/exams');
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

      axios.get(`${API_URL}/api/exams/${router.query.id}`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        setItem(data);
      });
    }
  }, [session, router]);

  useEffect(() => {
    setValue('question_choice_group', null);
    setValue('question_writing_group', null);

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
          if (item.question_choice_group) {
            setValue('question_choice_group', { label: item.question_choice_group, value: item.question_choice_group });
          }
          if (item.question_writing_group) {
            setValue('question_writing_group', {
              label: item.question_writing_group,
              value: item.question_writing_group
            });
          }
        }
      });
    }
  }, [watchSubject]);

  return (
    <Layout>
      <h3>แก้ไขการสอบ: {router.query.id}</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabelRequired label='ชื่อการสอบ' />
          <FormControl name='exam_name' isInvalid={errors.exam_name} ref={register({ required: true })}
                       defaultValue={item.name} />
        </FormGroup>
        <FormGroup>
          <FormLabel>คำอธิบายการสอบ</FormLabel>
          {item.detail && <TextWYSIWYG
            name='exam_detail'
            control={control}
            defaultValue={item.detail}
            isInvalid={errors.exam_detail}
          />}
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='วิชา' />
          {item.subject && <Select
            name='subject'
            control={control}
            rules={{ required: true }}
            options={subjects}
            isInvalid={errors.subject}
            defaultValue={{ label: item.subject, value: item.subject }}
          />}
        </FormGroup>
        <FormGroup>
          <FormLabel>ชุดคำถามแบบตัวเลือก</FormLabel>
          {item.subject && <Select
            name='question_choice_group'
            control={control}
            options={questionGroups}
            isInvalid={errors.question_choice_group}
            defaultValue={item.question_choice_group
              ? {
                  label: item.question_choice_group,
                  value: item.question_choice_group
                }
              : null}
            isClearable
          />}
        </FormGroup>
        <FormGroup>
          <FormLabel>จำนวนคำถามแบบตัวเลือก</FormLabel>
          <FormControl type='number' name='total_question_choice' isInvalid={errors.total_question_choice}
                       ref={register()} defaultValue={item.total_question_choice} />
        </FormGroup>
        <FormGroup>
          <FormLabel>ชุดคำถามแบบข้อเขียน</FormLabel>
          {item.subject && <Select
            name='question_writing_group'
            control={control}
            options={questionGroups}
            isInvalid={errors.question_writing_group}
            defaultValue={item.question_writing_group
              ? {
                  label: item.question_writing_group,
                  value: item.question_writing_group
                }
              : null}
            isClearable
          />}
        </FormGroup>
        <FormGroup>
          <FormLabel>จำนวนคำถามแบบข้อเขียน</FormLabel>
          <FormControl type='number' name='total_question_writing' isInvalid={errors.total_question_writing}
                       ref={register()} defaultValue={item.total_question_writing} />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='เวลาเริ่มทำข้อสอบ' />
          <FormControl type='datetime-local' name='exam_start' isInvalid={errors.exam_start}
                       ref={register({ required: true })}
                       defaultValue={dayjs(item.exam_start).format('YYYY-MM-DDTHH:mm')} />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='เวลาสิ้นสุดการทำข้อสอบ' />
          <FormControl type='datetime-local' name='exam_end' isInvalid={errors.exam_end}
                       ref={register({ required: true })}
                       defaultValue={dayjs(item.exam_end).format('YYYY-MM-DDTHH:mm')} />
        </FormGroup>
        <FormGroup>
          <FormLabelRequired label='ระยะเวลาทำข้อสอบ (นาที)' />
          <FormControl type='number' name='exam_time' isInvalid={errors.exam_time} ref={register({ required: true })}
                       defaultValue={item.exam_time} />
        </FormGroup>
        <div className='row'>
          <div className='col'>
            <Button type='reset' variant='secondary' disabled={isSubmitting} block
                    onClick={() => router.push('/exams')}>ยกเลิก</Button>
          </div>
          <div className='col'>
            <Button type='submit' variant='primary' disabled={isSubmitting} block>บันทึก</Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
