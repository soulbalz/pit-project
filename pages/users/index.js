import Layout from 'src/components/layouts';
import DataTable from 'src/components/datatables';
import { MdDelete, MdEdit, MdVisibility } from 'react-icons/md';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import { API_URL } from 'src/constants';

export default function PageUserList() {
  const columns = [{
    name: 'ID',
    selector: '_id',
    sortable: true
  }, {
    name: 'Username',
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
        <a href={`/users/${row._id}`} className='btn btn-info btn-lg mr-2'>
          <MdVisibility />
        </a>
        <a href={`/users/${row._id}/edit`} className='btn btn-warning btn-lg mr-2'>
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
      axios.get(`${API_URL}/api/users`, {
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
          <h3>รายชื่อบุคลากร</h3>
        </div>
        <div className='col-auto'>
          <a href='/users/create' className='btn btn-primary'>เพิ่มบุคลากร</a>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </Layout>
  );
}
