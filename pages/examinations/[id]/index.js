import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import axios from 'axios';
import { useTimer } from 'react-timer-hook';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { API_URL } from 'src/constants';

const TextWYSIWYG = dynamic(
  () => import('src/components/forms/text-field'),
  { ssr: false }
);

export default function PageExaminationIntro() {
  const router = useRouter();
  const [session] = useSession();

  const isSubmitting = useRef(false);
  const totalPaste = useRef(0);
  const totalSwitchScreen = useRef(0);

  const [item, setItem] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answerChoices, setAnswerChoices] = useState({});
  const [answerWritings, setAnswerWritings] = useState({});

  const { seconds, minutes, hours, start, pause, restart } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
    onExpire: () => {
      pause();
      isSubmitting.current = true;
      alert('หมดเวลาสอบ');
      handlerSubmit(true);
    }
  });

  const handlerChooseAnswer = (key, value) => {
    const newAnswers = { ...answerChoices };
    newAnswers[key] = value;
    setAnswerChoices(newAnswers);
  };

  const handlerWritingAnswer = (key, value) => {
    const newAnswers = { ...answerWritings };
    newAnswers[key] = value;
    setAnswerWritings(newAnswers);
  };

  const handlerSubmit = (isForce = false) => {
    pause();
    isSubmitting.current = true;

    let isConfirmed;
    if (isForce) {
      isConfirmed = true;
    } else {
      isConfirmed = confirm('ยืนยันการส่งคำตอบ');
    }
    if (isConfirmed) {
      const payload = {
        total_copy_paste: totalPaste.current,
        total_switch_screen: totalSwitchScreen.current
      };
      if (item.question_choices.length > 0) {
        payload.choices = answerChoices;
      }
      if (item.question_writings.length > 0) {
        payload.writings = answerWritings;
      }
      axios.put(`${API_URL}/api/examinations/${router.query.id}`, payload, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        setIsSubmitted(true);
      }).catch(() => {
        start();
      }).finally(() => {
        setTimeout(() => {
          isSubmitting.current = false;
        }, 500);
      });
    } else {
      start();
      setTimeout(() => {
        isSubmitting.current = false;
      }, 500);
    }
  };

  const onBlur = useCallback(() => {
    if (!isSubmitting.current) totalSwitchScreen.current++;
  }, []);

  const onPaste = useCallback(() => {
    if (!isSubmitting.current) totalPaste.current++;
  }, []);

  useEffect(() => {
    window.addEventListener('blur', onBlur);
    window.addEventListener('paste', onPaste);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('paste', onPaste);
    };
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      router.push('/examinations');
    }
  }, [isSubmitted]);

  useBeforeunload(() => {
    if (isSubmitted) return null;

    if (item.question_choices.length === Object.keys(answerChoices).length || item.question_writings.length === Object.keys(answerWritings).length) return null;

    console.log('leave browser');
    return 'You\'ll lose your data!';
  });

  useEffect(() => {
    if (session && router.query.id) {
      axios.get(`${API_URL}/api/examinations/${router.query.id}`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        data.question_choices = data.question_choices.sort((a, b) => 0.5 - Math.random()).map((question, qIndex) => {
          question.choices.sort((a, b) => 0.5 - Math.random());
          return question;
        });
        data.question_writings = data.question_writings.sort((a, b) => 0.5 - Math.random());
        restart(dayjs().add(data.exam_time, 'minute').toDate(), true);
        setItem(data);
      });
    }
  }, [session, router]);

  return (
    <div className='container'>
      <div className='card'>
        <div className='card-body'>
          <h1>{item?.exam?.name}</h1>
          <h2>วิชา: {item?.exam?.subject}</h2>
          <h2>ระยะเวลาสอบ: {item?.exam?.exam_time} นาที</h2>
        </div>
      </div>

      <div className='card'>
        <div className='card-header'>
          <h2>คำอธิบายการสอบ</h2>
        </div>
        <div className='card-body' dangerouslySetInnerHTML={{ __html: item?.exam?.detail }} />
      </div>

      <div className='card'>
        <div className='card-body'>
          <h3>เหลือเวลาอีก {hours > 0 ? `${hours} ชั่วโมง ` : ''}{minutes > 0 ? `${minutes} นาที ` : ''}{seconds} วินาที</h3>
        </div>
      </div>

      {(item?.question_choices || []).length > 0 && <>
        <div className='card'>
          <div className='card-body'>
            <h3>คำถามแบบเลือกตอบ</h3>
          </div>
        </div>

        {item.question_choices.map((question, qIndex) => {
          return (
            <div key={`question-${qIndex}`} className='card'>
              <div className='card-body'>
                <h3 className='mb-4'>
                  <div>ข้อ {qIndex + 1}.</div>
                  <div dangerouslySetInnerHTML={{ __html: question.name }} />
                </h3>
                {question.choices.map((choice, cIndex) => {
                  return (
                    <button
                      key={`choice-${cIndex}`}
                      className={`btn btn-block btn-lg text-left ${answerChoices[question._id] === choice._id ? 'btn-dark' : 'btn-outline-dark'}`}
                      onClick={() => handlerChooseAnswer(question._id, choice._id)}
                      disabled={answerChoices[question._id] === choice._id}>
                      <div dangerouslySetInnerHTML={{ __html: choice.name }} />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </>}

      {(item?.question_writings || []).length > 0 && <>
        <div className='card'>
          <div className='card-body'>
            <h3>คำถามแบบข้อเขียน</h3>
          </div>
        </div>

        {item.question_writings.map((question, qIndex) => {
          return (
            <div key={`question-${qIndex}`} className='card'>
              <div className='card-body'>
                <h3 className='mb-4'>
                  <div>ข้อ {qIndex + 1}.</div>
                  <div dangerouslySetInnerHTML={{ __html: question.name }} />
                </h3>
                <TextWYSIWYG
                  value={answerWritings[question._id] || ''}
                  onChange={(value) => handlerWritingAnswer(question._id, value)}
                />
              </div>
            </div>
          );
        })}
      </>}

      <button className='btn btn-block btn-lg btn-primary' onClick={() => handlerSubmit(false)} disabled={isSubmitting.current}>ส่งคำตอบ</button>
    </div>
  );
}
