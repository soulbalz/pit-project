import { useEffect, useState } from 'react';
import ReactDataTable from 'react-data-table-component';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import { MdDelete, MdEdit, MdVisibility } from 'react-icons/md';

const data = [
  { id: 1, firstName: 'Jon', lastName: 'Snow', age: 35 },
  { id: 2, firstName: 'Cersei', lastName: 'Lannister', age: 42 },
  { id: 3, firstName: 'Jaime', lastName: 'Lannister', age: 45 },
  { id: 4, firstName: 'Arya', lastName: 'Stark', age: 16 },
  { id: 5, firstName: 'Daenerys', lastName: 'Targaryen', age: null },
  { id: 6, firstName: null, lastName: 'Melisandre', age: 150 },
  { id: 7, firstName: 'Ferrara', lastName: 'Clifford', age: 44 },
  { id: 8, firstName: 'Rossini', lastName: 'Frances', age: 36 },
  { id: 9, firstName: 'Harvey', lastName: 'Roxie', age: 65 }
];

const DataTable = ({ path = '' }) => {
  const columns = [{
    name: 'ID',
    selector: 'id',
    sortable: true
  }, {
    name: 'First name',
    selector: 'firstName',
    sortable: true
  }, {
    name: 'Last name',
    selector: 'lastName',
    sortable: true
  }, {
    name: 'Age',
    selector: 'age',
    sortable: true
  }, {
    name: 'Action',
    sortable: false,
    allowOverflow: true,
    ignoreRowClick: true,
    button: true,
    cell: row => (
      <>
        <a href={`${path}/${row.id}`} className='btn btn-info btn-lg mr-2'>
          <MdVisibility />
        </a>
        <a href={`${path}/${row.id}/edit`} className='btn btn-warning btn-lg mr-2'>
          <MdEdit />
        </a>
        <Button variant='danger' size='lg'>
          <MdDelete />
        </Button>
      </>
    )
  }];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setItems(data);
      setTotalRows(data.length);
      setLoading(false);
    }, 2000);
  }, []);

  function handleClickSearch() {
    const filterData = items.filter(item => item.firstName === filterText || item.lastName === filterText);
    setItems(filterData);
  }
  function handleClearSearch() {
    if (filterText) {
      setFilterText('');
      setItems(data);
    }
  }

  const dataTableOptions = {
    columns: columns,
    data: items,
    progressPending: loading,
    paginationTotalRows: totalRows,
    striped: true,
    noHeader: true,
    sortServer: true,
    pagination: true,
    paginationServer: true,
    paginationResetDefaultPage: true,
    highlightOnHover: true,
    pointerOnHover: true,
    // selectableRows: selectableRows,
    selectableRowsVisibleOnly: true,
    selectableRowsHighlight: true,
    clearSelectedRows: true,
    paginationPerPage: 25,
    paginationRowsPerPageOptions: [25],
    // onSort: handleSort,
    // onChangePage: handlePageChange,
    // onSelectedRowsChange: handleSelectedRow,
    subHeader: true,
    subHeaderComponent: (
      <FormGroup className='form-inline'>
        <FormControl placeholder='ค้นหา...' value={filterText} onChange={e => setFilterText(e.target.value)} />
        <Button variant='primary' className='ml-1' onClick={handleClickSearch}>ค้นหา</Button>
        <Button variant='danger' className='ml-1' onClick={handleClearSearch}>ล้าง</Button>
      </FormGroup>
    )
  };

  return (
    <ReactDataTable {...dataTableOptions} />
  );
};

export default DataTable;
