import { ListGroup, Table } from 'react-bootstrap';
import Layout from 'src/components/layouts';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import { API_URL } from 'src/constants';

export default function PageExamDetail() {
  const { query } = useRouter();
  const [session] = useSession();

  const [item, setItem] = useState({});

  useEffect(() => {
    if (session) {
      axios.get(`${API_URL}/api/exams/${query.id}`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        setItem(data);
      });
    }
  }, [session]);

  return (
    <Layout>
      <h3>ข้อมูลการสอบ: {query.id}</h3>
      <div className='row mb-3'>
        <div className='col'>
          <a href='/exams' className='btn btn-secondary'>ย้อนกลับ</a>
        </div>
        <div className='col text-right'>
          <a href={`/exams/${query.id}/edit`} className='btn btn-primary'>แก้ไขข้อมูล</a>
        </div>
      </div>

      <ListGroup variant='flush'>
        <ListGroup.Item>
          <div className='row'>
            <div className='col'>วิชา</div>
            <div className='col'>{item.subject}</div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className='row'>
            <div className='col'>ชื่อการสอบ</div>
            <div className='col'>{item.name}</div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className='row'>
            <div className='col'>รายละเอียดการสอบ</div>
            <div className='col' dangerouslySetInnerHTML={{ __html: item.detail }} />
          </div>
        </ListGroup.Item>
        {item.question_choice_group && <>
          <ListGroup.Item>
            <div className='row'>
              <div className='col'>ชุดคำถามแบบตัวเลือก</div>
              <div className='col'>{item.question_choice_group}</div>
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className='row'>
              <div className='col'>จำนวนคำถามแบบตัวเลือก</div>
              <div className='col'>{item.total_question_choice}</div>
            </div>
          </ListGroup.Item>
        </>}
        {item.question_writing_group && <>
          <ListGroup.Item>
            <div className='row'>
              <div className='col'>ชุดคำถามแบบข้อเขียน</div>
              <div className='col'>{item.question_writing_group}</div>
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className='row'>
              <div className='col'>จำนวนคำถามแบบข้อเขียน</div>
              <div className='col'>{item.total_question_writing}</div>
            </div>
          </ListGroup.Item>
        </>}
      </ListGroup>
      <Table className='mt-3' responsive bordered>
        <thead>
          <tr>
            <th>นักศึกษา</th>
            <th>จำนวนครั้งสลับหน้าจอ</th>
            <th>จำนวนครั้ง Copy & Paste</th>
            {item.question_choice_group && <th>คะแนนข้อสอบแบบตัวเลือก</th>}
            {item.question_writing_group && <th>คะแนนข้อสอบแบบข้อเขียน</th>}
          </tr>
        </thead>
        <tbody>
          {(item.exam_results || []).map((ex, i) => {
            let questionChoiceScore = 'ยังไม่ทราบผล';
            let questionWritingScore = 'ยังไม่ทราบผล';
            if (ex.is_submited) {
              questionChoiceScore = `${ex.total_choice_pass || 0} / ${item.total_question_choice}`;
              if (ex.total_writing_score === undefined) {
                questionWritingScore = <a href={`/examinations/${ex._id}/review`} className='btn btn-primary'>ตรวจคำตอบ</a>;
              } else {
                questionWritingScore = ex.total_writing_score;
              }
            }
            return (
              <tr key={i}>
                <td>{ex.user_code} {ex.user ? `- ${ex.user.first_name} ${ex.user.last_name}` : ''}</td>
                <td>{ex.total_switch_screen}</td>
                <td>{ex.total_copy_paste}</td>
                {item.question_choice_group && <td>{questionChoiceScore}</td>}
                {item.question_writing_group && <td>{questionWritingScore}</td>}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Layout>
  );
}
