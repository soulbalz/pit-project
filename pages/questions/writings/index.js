import Layout from 'src/components/layouts';
import DataTable from 'src/components/datatables';
import { MdDelete, MdEdit, MdVisibility } from 'react-icons/md';
import { Button } from 'react-bootstrap';
import { useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from 'src/constants';

export default function PageQuestionWritingList() {
  const columns = [{
    name: 'ID',
    selector: '_id',
    sortable: true
  }, {
    name: 'คำถาม',
    selector: 'name',
    sortable: true,
    cell: row => (
      <div dangerouslySetInnerHTML={{ __html: row.name }} />
    )
  }, {
    name: 'ชุดคำถาม',
    selector: 'question_group',
    sortable: true
  }, {
    name: 'วิชา',
    selector: 'subject',
    sortable: true
  }, {
    name: 'Action',
    sortable: false,
    allowOverflow: true,
    ignoreRowClick: true,
    button: true,
    cell: row => (
      <>
        <a href={`/questions/writings/${row._id}`} className='btn btn-info btn-lg mr-2'>
          <MdVisibility />
        </a>
        <a href={`/questions/writings/${row._id}/edit`} className='btn btn-warning btn-lg mr-2'>
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
      axios.get(`${API_URL}/api/questions`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`
        },
        params: {
          question_type: 'writing'
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
          <h3>รายการคำถามแบบข้อเขียน</h3>
        </div>
        <div className='col-auto'>
          <a href='/questions/writings/create' className='btn btn-primary'>เพิ่มคำถาม</a>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </Layout>
  );
}
