import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from 'src/constants';

export default function PageExaminationIntro() {
  const router = useRouter();
  const [session] = useSession();

  const [item, setItem] = useState([]);
  const [scores, setScores] = useState({});

  const setAnswerScore = (key, value) => {
    const newScores = { ...scores };
    newScores[key] = value;
    setScores(newScores);
  };

  const handlerSubmit = () => {
    axios.put(`${API_URL}/api/examinations/${router.query.id}/review`, { scores }, {
      headers: {
        Authorization: `Bearer ${session.user.apiToken}`
      }
    }).then(({ data }) => {
      router.push(`/exams/${item.exam_id}`);
    });
  };

  useEffect(() => {
    if (session && router.query.id) {
      axios.get(`${API_URL}/api/examinations/${router.query.id}/review`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        setItem(data);
      });
    }
  }, [session, router]);

  return (
    <div className='container'>
      <div className='card'>
        <div className='card-body'>
          <h1>คำตอบของ: {item?.user?.first_name} {item?.user?.last_name}</h1>
          <h2>ชื่อการสอบ: {item?.exam?.name}</h2>
          <h2>วิชา: {item?.exam?.subject}</h2>
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
            <h2>จำนวนครั้งที่สลับหน้าจอ: {item.total_switch_screen}</h2>
            <h2>จำนวนครั้ง Copy & Paste: {item.total_copy_paste}</h2>
          </div>
        </div>

        {(item?.exam_logs || []).map((examLog, qIndex) => {
          return (
            <div key={`question-${qIndex}`} className='card'>
              <div className='card-body'>
                <h3 className='mb-4'>
                  <div>ข้อ {qIndex + 1}.</div>
                  <div dangerouslySetInnerHTML={{ __html: examLog.question.name }} />
                </h3>
                <div dangerouslySetInnerHTML={{ __html: examLog.answer }} />
                <hr />
                <label>คำแนนที่ได้</label>
                <input type='number' className='form-control' onChange={(e) => setAnswerScore(examLog.question_id, e.target.value)} />
              </div>
            </div>
          );
        })}

      <button className='btn btn-block btn-lg btn-primary' onClick={handlerSubmit}>ส่งคำตอบ</button>
    </div>
  );
}
