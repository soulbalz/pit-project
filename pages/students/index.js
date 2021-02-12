import Layout from 'src/components/layouts';
import DataTable from 'src/components/datatables';

export default function List() {
  return (
    <Layout>
      <div className='text-right mb-3'>
        <a href='/students/create' className='btn btn-primary'>เพิ่มนักศึกษา</a>
      </div>
      <DataTable path='/students' />
    </Layout>
  );
}
