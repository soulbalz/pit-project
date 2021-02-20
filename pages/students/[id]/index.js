import { ListGroup } from 'react-bootstrap';
import Layout from 'src/components/layouts';
import { useRouter } from 'next/router';

export default function PageStudentDetail() {
  const { query } = useRouter();
  return (
    <Layout>
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
            <div className='col'>ชื่อ</div>
            <div className='col'>John Doe</div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className='row'>
            <div className='col'>รหัสนักศึกษา</div>
            <div className='col'>1234</div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className='row'>
            <div className='col'>Email</div>
            <div className='col'>example@email.com</div>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </Layout>
  );
}
