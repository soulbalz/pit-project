import Layout from 'src/components/layouts';
import DataTable from 'src/components/datatables';
import { useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDelete, MdEdit, MdVisibility } from 'react-icons/md';
import { Button } from 'react-bootstrap';
import { API_URL } from 'src/constants';

export default function PageExamList() {
  const columns = [{
    name: 'ID',
    selector: '_id',
    sortable: true
  }, {
    name: 'ชื่อการสอบ',
    selector: 'name',
    sortable: true
  }, {
    name: 'วิชา',
    selector: 'subject',
    sortable: true
  }, {
    name: 'ข้อสอบตัวเลือก',
    selector: 'total_question_choice',
    sortable: true
  }, {
    name: 'ข้อสอบข้อเขียน',
    selector: 'total_question_writing',
    sortable: true
  }, {
    name: 'Action',
    sortable: false,
    allowOverflow: true,
    ignoreRowClick: true,
    button: true,
    cell: row => (
      <>
        <a href={`/exams/${row._id}`} className='btn btn-info btn-lg mr-2'>
          <MdVisibility />
        </a>
        <a href={`/exams/${row._id}/edit`} className='btn btn-warning btn-lg mr-2'>
          <MdEdit />
        </a>
        <Button variant='danger' size='lg'>
          <MdDelete />
        </Button>
      </>
    )
  }];

  const [session] = useSession();

  const [data, setData] = useState([]);

  useEffect(() => {
    if (session) {
      axios.get(`${API_URL}/api/exams`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        }
      }).then(({ data }) => {
        setData(data);
      });
    }
  }, [session]);

  return (
    <Layout>
      <div className='row align-items-center mb-3'>
        <div className='col'>
          <h3>รายการการสอบ</h3>
        </div>
        <div className='col-auto'>
          <a href='/exams/create' className='btn btn-primary'>เพิ่มการสอบ</a>
        </div>
      </div>
      <DataTable columns={columns} data={data} subHeader={false} />
    </Layout>
  );
}
