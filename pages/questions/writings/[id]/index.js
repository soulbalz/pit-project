import { ListGroup } from 'react-bootstrap';
import Layout from 'src/components/layouts';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import { API_URL } from 'src/constants';

export default function PageQuestionWritingDetail() {
  const { query } = useRouter();
  const [session] = useSession();

  const [item, setItem] = useState({});

  useEffect(() => {
    if (session) {
      axios.get(`${API_URL}/api/questions/${query.id}`, {
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
      <h3>ข้อมูลคำถามแบบข้อเขียน: {query.id}</h3>
      <div className='row mb-3'>
        <div className='col'>
          <a href='/questions/writings' className='btn btn-secondary'>ย้อนกลับ</a>
        </div>
        <div className='col text-right'>
          <a href={`/questions/writings/${query.id}/edit`} className='btn btn-primary'>แก้ไขข้อมูล</a>
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
            <div className='col'>ชุดคำถาม</div>
            <div className='col'>{item.question_group}</div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className='row'>
            <div className='col'>คำถาม</div>
            <div className='col' dangerouslySetInnerHTML={{ __html: item.name }} />
          </div>
        </ListGroup.Item>
      </ListGroup>
    </Layout>
  );
}
