import { ListGroup } from 'react-bootstrap';
import Layout from 'src/components/layouts';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import { API_URL } from 'src/constants';

export default function PageUserDetail() {
  const { query } = useRouter();
  const [session] = useSession();

  const [item, setItem] = useState([]);

  useEffect(() => {
    if (session && query.id) {
      axios.get(`${API_URL}/api/users/${query.id}`, {
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
      <h3>ข้อมูลบุคลากร: {query.id}</h3>
      <div className='row mb-3'>
        <div className='col'>
          <a href='/users' className='btn btn-secondary'>ย้อนกลับ</a>
        </div>
        <div className='col text-right'>
          <a href={`/users/${query.id}/changepassword`} className='btn btn-warning mr-2'>เปลี่ยนรหัสผ่าน</a>
          <a href={`/users/${query.id}/edit`} className='btn btn-primary'>แก้ไขข้อมูล</a>
        </div>
      </div>

      <ListGroup variant='flush'>
        <ListGroup.Item>
          <div className='row'>
            <div className='col'>Username</div>
            <div className='col'>{item.user_code}</div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className='row'>
            <div className='col'>ชื่อ</div>
            <div className='col'>{item.first_name} {item.last_name}</div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className='row'>
            <div className='col'>สิทธิ์การใช้งาน</div>
            <div className='col'>{item.role === 'admin' ? 'ผู้ดูแลระบบ' : 'บุคลากร'}</div>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </Layout>
  );
}
