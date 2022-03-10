import { ListGroup } from 'react-bootstrap';
import Layout from 'src/components/layouts';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import { API_URL } from 'src/constants';

export default function PageStudentDetail() {
  const { query } = useRouter();
  const [session] = useSession();

  const [item, setItem] = useState([]);

  useEffect(() => {
    if (session && query.id) {
      axios.get(`${API_URL}/api/students/${query.id}`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        setItem(data);
      });
    }
  }, [session, query]);

  return (
    <Layout>
      <h3>ข้อมูลนักศึกษา: {query.id}</h3>
      <div className='row mb-3'>
        <div className='col'>
          <a href='/students' className='btn btn-secondary'>ย้อนกลับ</a>
        </div>
        <div className='col text-right'>
          <a href={`/students/${query.id}/changepassword`} className='btn btn-warning mr-2'>เปลี่ยนรหัสผ่าน</a>
          <a href={`/students/${query.id}/edit`} className='btn btn-primary'>แก้ไขข้อมูล</a>
        </div>
      </div>

      <ListGroup variant='flush'>
        <ListGroup.Item>
          <div className='row'>
            <div className='col'>รหัสนักศึกษา</div>
            <div className='col'>{item.user_code}</div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className='row'>
            <div className='col'>ชื่อ</div>
            <div className='col'>{item.first_name} {item.last_name}</div>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </Layout>
  );
}
