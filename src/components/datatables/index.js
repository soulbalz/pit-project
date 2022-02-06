import { useEffect, useState } from 'react';
import ReactDataTable from 'react-data-table-component';
import { Button, FormControl, FormGroup } from 'react-bootstrap';

const DataTable = ({
  columns = [],
  data = [],
  progressPending = false,
  paginationTotalRows = 0,
  striped = true,
  noHeader = true,
  sortServer = true,
  pagination = true,
  paginationServer = true,
  paginationResetDefaultPage = true,
  highlightOnHover = true,
  pointerOnHover = true,
  selectableRowsVisibleOnly = true,
  selectableRowsHighlight = true,
  clearSelectedRows = true,
  paginationPerPage = 25,
  paginationRowsPerPageOptions = [25],
  subHeader = true
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(progressPending);
  const [totalRows, setTotalRows] = useState(paginationTotalRows);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setItems(data);
      setTotalRows(data.length);
      setLoading(false);
    }, 500);
  }, [data]);

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
    striped: striped,
    noHeader: noHeader,
    sortServer: sortServer,
    pagination: pagination,
    paginationServer: paginationServer,
    paginationResetDefaultPage: paginationResetDefaultPage,
    highlightOnHover: highlightOnHover,
    pointerOnHover: pointerOnHover,
    // selectableRows: selectableRows,
    selectableRowsVisibleOnly: selectableRowsVisibleOnly,
    selectableRowsHighlight: selectableRowsHighlight,
    clearSelectedRows: selectableRowsHighlight,
    paginationPerPage: paginationPerPage,
    paginationRowsPerPageOptions: paginationRowsPerPageOptions,
    // onSort: handleSort,
    // onChangePage: handlePageChange,
    // onSelectedRowsChange: handleSelectedRow,
    subHeader: subHeader,
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
