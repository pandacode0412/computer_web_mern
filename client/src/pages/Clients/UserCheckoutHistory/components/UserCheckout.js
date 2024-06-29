import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Alert, Button, Stack } from '@mui/material';
import { FORMAT_NUMBER } from '../../../../untils/constants';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ViewDataDrawer from './CheckoutDrawer';
import ProductAPI from '../../../../API/Product';
import { dateTimeConverter } from '../../../../untils/until';
import moment from 'moment';
import { useSelector } from 'react-redux';

const columns = [
  { id: 'createdAt', label: 'Ngày đặt hàng', width: 200, align: 'center' },
  {
    id: 'user_address',
    label: 'Địa chỉ giao hàng',
    minWidth: 100,
    align: 'right',
  },
  { id: 'total_price', label: 'Tổng giá tiền', width: 200, align: 'right' },
  {
    id: 'status',
    label: 'Trạng thái',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'action',
    label: 'Thao tác',
    minWidth: 170,
    align: 'center',
  },
];

export default function UserCheckout() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listProduct, setListProduct] = useState([]);
  const [visibleViewDataDrawer, setVisibleViewDataDrawer] = useState(false);
  const [viewData, setViewData] = useState('');
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const userData = useSelector((state) => state.user.userData);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListProduct = async () => {
    const getListRes = await ProductAPI.getCheckoutByUserId(userData?.ctm_id);
    if (getListRes?.data?.success) {
      setListProduct(getListRes?.data?.payload);
    }
  };

  useEffect(() => {
    if (userData?.ctm_id) {
      getListProduct();
    }
  }, [userData?.ctm_id]);

  const displayStatus = (status, checkoutId) => {
    if (status === 0) {
      return (
        <Alert badgeContent={4} color='error' icon={false}>
          Đã huỷ
        </Alert>
      );
    } else if (status === 1) {
      return (
        <Alert badgeContent={4} color='warning' icon={false}>
          Đặt hàng thành công
        </Alert>
      );
    } else if (status === 2) {
      return (
        <Alert badgeContent={4} color='primary' icon={false}>
          Đang giao hàng
        </Alert>
      );
    } else if (status === 3) {
      return (
        <Alert badgeContent={4} color='success' icon={false}>
          Đã giao hàng
        </Alert>
      );
    }
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listProduct
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === 'action' ? (
                              <Stack
                                flexDirection={'row'}
                                justifyContent='center'
                              >
                                <Button
                                  variant='contained'
                                  color='success'
                                  onClick={() => {
                                    setViewData(row?._id);
                                    setVisibleViewDataDrawer(true);
                                  }}
                                >
                                  <RemoveRedEyeIcon />
                                </Button>
                              </Stack>
                            ) : column.id === 'checkout_date' ? (
                              <div>{dateTimeConverter(value)}</div>
                            ) : column.id === 'checkout_id' ? (
                              <div
                                style={{
                                  textAlign: 'center',
                                  color: 'red',
                                  fontWeight: 'bold',
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === 'total_price' ? (
                              FORMAT_NUMBER.format(value)
                            ) : column.id === 'status' ? (
                              displayStatus(value, row?.checkout_id)
                            ) : column.id === 'createdAt' ? (
                              <div>{moment(value).format('DD-MM-YYYY')}</div>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={listProduct.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {visibleViewDataDrawer && (
        <ViewDataDrawer
          visible={visibleViewDataDrawer}
          onClose={() => setVisibleViewDataDrawer(false)}
          viewData={viewData}
        />
      )}
    </>
  );
}
