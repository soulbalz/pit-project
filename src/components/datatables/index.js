import { DataGrid } from '@material-ui/data-grid';

const DataTable = ({ path = '' }) => {
  const columns = [{
    field: 'id',
    headerName: 'ID',
    flex: 1
  }, {
    field: 'firstName',
    headerName: 'First name',
    flex: 1
  }, {
    field: 'lastName',
    headerName: 'Last name',
    flex: 1
  }, {
    field: 'age',
    headerName: 'Age',
    flex: 1
  }, {
    field: 'action',
    headerName: 'Action',
    sortable: false,
    flex: 1,
    renderCell: (params) => (
        <>
          <a href={`${path}/${params.getValue('id')}`} className='btn btn-info mr-2'>ดูข้อมูล</a>
          <a href={`${path}/${params.getValue('id')}`} className='btn btn-warning mr-2'>แก้ไขข้อมูล</a>
          <a href={`${path}/${params.getValue('id')}`} className='btn btn-danger'>ลบข้อมูล</a>
        </>
    )
  }];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
  ];
  return (
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection autoHeight />
  );
};

export default DataTable;
