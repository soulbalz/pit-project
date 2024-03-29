import Layout from 'src/components/layouts';
import DataTable from 'src/components/datatables';
import { MdDelete, MdEdit, MdVisibility } from 'react-icons/md';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import { API_URL } from 'src/constants';

export default function PageStudentList() {
  const columns = [{
    name: 'ID',
    selector: '_id',
    sortable: true
  }, {
    name: 'User Code',
    selector: 'user_code',
    sortable: true
  }, {
    name: 'First name',
    selector: 'first_name',
    sortable: true
  }, {
    name: 'Last name',
    selector: 'last_name',
    sortable: true
  }, {
    name: 'Action',
    sortable: false,
    allowOverflow: true,
    ignoreRowClick: true,
    button: true,
    cell: row => (
      <>
        <a href={`/students/${row._id}`} className='btn btn-info btn-lg mr-2'>
          <MdVisibility />
        </a>
        <a href={`/students/${row._id}/edit`} className='btn btn-warning btn-lg mr-2'>
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
      axios.get(`${API_URL}/api/students`, {
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
          <h3>รายชื่อนักศึกษา</h3>
        </div>
        <div className='col-auto'>
          <a href='/students/create' className='btn btn-primary'>เพิ่มนักศึกษา</a>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </Layout>
  );
}
