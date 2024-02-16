import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel
} from '@mui/material';

function DataTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('Service');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    axios.get('http://localhost:4040/dashboard')
      .then(response => {
        setData(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const getServiceRows = () => {
    const rows = [];

    for (const serviceName in data) {
      if (Array.isArray(data[serviceName])) {
        data[serviceName].forEach(item => {
          const row = { id: rows.length + 1, Service: serviceName };
          for (const field in item) {
            if (!['_id', 'createdAt', 'updatedAt', '__v'].includes(field)) {
              row[field] = item[field] || ''; // Ensure the field has a value or set it to an empty string
            }
          }
          rows.push(row);
        });
      }
    }

    return rows;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  if (!data.jobs || data.jobs.length === 0) {
    return null; // Render nothing if data.jobs is not available or empty
  }

  return (
    <Paper style={{ width: '100%' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'Service'}
                  direction={orderBy === 'Service' ? order : 'asc'}
                  onClick={() => handleSortRequest('Service')}
                >
                  Service
                </TableSortLabel>
              </TableCell>
              {/* Define other headers dynamically based on the data */}
              {Object.keys(data.jobs[0])
                .filter(field => !['_id', 'createdAt', 'updatedAt', '__v'].includes(field))
                .map(field => (
                  <TableCell key={field}>
                    <TableSortLabel
                      active={orderBy === field}
                      direction={orderBy === field ? order : 'asc'}
                      onClick={() => handleSortRequest(field)}
                    >
                      {field}
                    </TableSortLabel>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {getServiceRows()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.Service}</TableCell>
                  {/* Render other cells dynamically based on the data */}
                  {Object.keys(data.jobs[0])
                    .filter(field => !['_id', 'createdAt', 'updatedAt', '__v'].includes(field))
                    .map(field => (
                      <TableCell key={field}>{row[field]}</TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={getServiceRows().length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default DataTable;
