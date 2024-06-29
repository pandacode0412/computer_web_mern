import React, { useCallback, useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, debounce, Stack, Typography } from '@mui/material';
import { FORMAT_NUMBER } from '../../../untils/constants';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ViewDataDrawer from './components/ViewDataDrawer';
import ControlProductModal from './components/ControlProductModal';
import storage from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {  toast } from 'react-toastify';
import CustomPopover from '../../../components/CustomPopover';
import ProductAPI from '../../../API/Product';
import './product.scss';

const columns = [
  { id: 'index', label: 'STT', minWidth: 150, align: 'center' },
  { id: 'image', label: 'Hình ảnh', width: 200, align: 'center' },
  {
    id: 'name',
    label: 'Tên sản phẩm',
    minWidth: 200,
    align: 'left',
  },
  {
    id: 'quanlity',
    label: 'Số lượng',
    minWidth: 70,
    align: 'right',
  },
  {
    id: 'price',
    label: 'Giá bán',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'sale_price',
    label: 'Giá khuyến mãi',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'action',
    label: 'Thao tác',
    minWidth: 170,
    align: 'center',
  },
];

export default function AdminProduct() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listProduct, setListProduct] = useState([]);
  const [visibleViewDataDrawer, setVisibleViewDataDrawer] = useState(false);
  const [viewData, setViewData] = useState({});
  const [visibleCreateModal, setVisibleCreateModal] = useState(false);
  const [visibleUpdateModal, setVisibleUpdateModal] = useState(false);
  const [popoverId, setPopoverId] = useState('');
  const [searchText, setSearchText] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListProduct = async (search) => {
    const getListRes = await ProductAPI.getAllProduct(
      'undefined',
      'undefined',
      -1,
      -1,
      search
    );
    if (getListRes?.data?.success) {
      setListProduct(getListRes?.data?.payload?.product);
    }
  };

  useEffect(() => {
    getListProduct('');
  }, []);

  const handleCreateProduct = async (productData) => {
    try {
      let frontImageURL = '';
      let backImageURL = '';

      if (typeof productData?.front_image !== 'string') {
        const frontImageName = 'front-product-' + new Date().getTime();
        const frontStorageRef = ref(storage, frontImageName);
        const updateImageRes = await uploadBytes(
          frontStorageRef,
          productData.front_image
        );
        if (updateImageRes) {
          const pathReference = ref(storage, frontImageName);
          const url = await getDownloadURL(pathReference);
          frontImageURL = url;
        }
      }

      if (typeof productData?.back_image !== 'string') {
        const backImageName = 'back-product-' + new Date().getTime();
        const backStorageRef = ref(storage, backImageName);
        const updateImageRes = await uploadBytes(
          backStorageRef,
          productData.back_image
        );
        if (updateImageRes) {
          const pathReference = ref(storage, backImageName);
          const url = await getDownloadURL(pathReference);
          backImageURL = url;
        }
      }

      const imageName = 'product-' + new Date().getTime();
      const storageRef = ref(storage, imageName);
      const updateImageRes = await uploadBytes(storageRef, productData.image);
      if (updateImageRes) {
        const pathReference = ref(storage, imageName);
        const url = await getDownloadURL(pathReference);

        productData.image = url;
        productData.font_image = frontImageURL;
        productData.back_image = backImageURL;
        const createRes = await ProductAPI.createNewProduct(productData);

        if (createRes?.data?.success) {
          toast.success('Thêm mới sản phẩm thành công');
          getListProduct(searchText);
          setVisibleCreateModal(false);
          return { success: true };
        } else {
          toast.error('Thêm mới sản phẩm thất bại');
          return createRes;
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Không thể tạo mới dữ liệu',
      };
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      let updateData = {
        description: productData?.description,
        quanlity: productData?.quanlity,
        price: productData?.price,
        sale_price: productData?.sale_price,
        name: productData?.name,
        brand_id: productData?.brand_id,
        category_id: productData?.category_id,
        image: productData?.image,
        front_image: productData?.front_image,
        back_image: productData?.back_image,
      };

      let frontImageURL = '';
      let backImageURL = '';

      if (
        productData?.front_image &&
        typeof updateData?.front_image !== 'string'
      ) {
        const frontImageName = 'front-product-' + new Date().getTime();
        const frontStorageRef = ref(storage, frontImageName);
        const updateImageRes = await uploadBytes(
          frontStorageRef,
          updateData.front_image
        );
        if (updateImageRes) {
          const pathReference = ref(storage, frontImageName);
          const url = await getDownloadURL(pathReference);
          frontImageURL = url;
          updateData.front_image = frontImageURL;
        }
      }

      if (
        productData?.back_image &&
        typeof updateData?.back_image !== 'string'
      ) {
        const backImageName = 'back-product-' + new Date().getTime();
        const backStorageRef = ref(storage, backImageName);
        const updateImageRes = await uploadBytes(
          backStorageRef,
          updateData.back_image
        );
        if (updateImageRes) {
          const pathReference = ref(storage, backImageName);
          const url = await getDownloadURL(pathReference);
          backImageURL = url;
          updateData.back_image = backImageURL;
        }
      }

      if (typeof productData.image !== 'string') {
        const imageName = 'product-' + new Date().getTime();
        const storageRef = ref(storage, imageName);

        const updateImageRes = await uploadBytes(storageRef, productData.image);
        if (updateImageRes) {
          const pathReference = ref(storage, imageName);
          const url = await getDownloadURL(pathReference);
          updateData.image = url;
        }
      }

      const updateDataRes = await ProductAPI.updateProductData(
        updateData,
        productData._id
      );

      if (updateDataRes?.data?.success) {
        toast.success('Bạn cập nhật sản phẩm thành công');
        getListProduct(searchText);
        setVisibleUpdateModal(false);
        return { success: true };
      } else {
        toast.error('Bạn cập nhật sản phẩm thất bại');
        return updateDataRes;
      }
    } catch (error) {
      return {
        success: false,
        error: 'Không thể cập nhật dữ liệu',
      };
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const deleteRes = await ProductAPI.deleteProduct(productId);

      if (deleteRes?.data?.success) {
        getListProduct(searchText);
        toast.success('Xoá sản phẩm thành công');
        setPopoverId('');
      } else {
        toast.error(deleteRes?.data?.error?.message || 'Xoá sản phẩm thất bại');
      }
    } catch (error) {
      toast.error('Xoá sản phẩm thất bại');
    }
  };

  const debounceSearch = useCallback(
    debounce(() => {
      getListProduct(searchText);
    }, 1000),
    []
  );

  return (
    <>
      <Stack
        flexWrap={'nowrap'}
        flexDirection='row'
        justifyContent={'space-between'}
        sx={{ marginBottom: '20px' }}
      >
        <Typography
          component='h2'
          variant='h6'
          color='primary'
          gutterBottom
          sx={{ textAlign: 'left' }}
        >
          Quản lí sản phẩm
        </Typography>
        <div>
          <Button
            variant='contained'
            onClick={() => setVisibleCreateModal(true)}
          >
            Thêm mới
          </Button>
        </div>
      </Stack>
      <div class='wrap home-searchbar'>
        <div class='search'>
          <input
            type='text'
            class='searchTerm'
            placeholder='Bạn muốn tìm kiếm sản phẩm gì'
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            onMouseEnter={() => getListProduct(searchText)}
            onKeyUp={(event) => {
              if (event?.code === 'Backspace') {
                debounceSearch();
              }
            }}
          />
          <button
            type='submit'
            class='searchButton'
            onClick={() => getListProduct(searchText)}
          >
            <i class='fa fa-search'></i>
          </button>
        </div>
      </div>
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
                .map((row, rowIndex) => {
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
                                <CustomPopover
                                  open={popoverId === row._id}
                                  onClose={() => setPopoverId('')}
                                  handleSubmit={() =>
                                    handleDeleteProduct(row._id)
                                  }
                                  noti='Bạn có chắc chắn muốn xoá sản phẩm?'
                                >
                                  <Button
                                    color='error'
                                    variant='contained'
                                    onClick={() => {
                                      if (popoverId === row._id) {
                                        setPopoverId('');
                                      } else {
                                        setPopoverId(row._id);
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </CustomPopover>
                                <Button
                                  variant='contained'
                                  onClick={() => {
                                    setViewData({
                                      ...row,
                                      image: row?.image?.[0],
                                      front_image: row?.image?.[1],
                                      back_image: row?.image?.[2]
                                    });
                                    setVisibleUpdateModal(true);
                                  }}
                                >
                                  <SettingsIcon />
                                </Button>
                                <Button
                                  variant='contained'
                                  color='success'
                                  onClick={() => {
                                    setViewData(row);
                                    setVisibleViewDataDrawer(true);
                                  }}
                                >
                                  <RemoveRedEyeIcon />
                                </Button>
                              </Stack>
                            ) : column.id === 'image' ? (
                              <div>
                                <img
                                  src={value?.[0]}
                                  style={{
                                    width: '150px',
                                    height: '150px',
                                    margin: '0 auto',
                                  }}
                                  alt=''
                                />
                              </div>
                            ) : column.id === '_id' ? (
                              <div
                                style={{
                                  textAlign: 'center',
                                  color: 'red',
                                  fontWeight: 'bold',
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === 'price' ||
                              column.id === 'sale_price' ? (
                              FORMAT_NUMBER.format(value)
                            ) : column.id === 'index' ? (
                              <div>{rowIndex + 1}</div>
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

      {visibleCreateModal && (
        <ControlProductModal
          visibleModal={visibleCreateModal}
          onClose={() => setVisibleCreateModal(false)}
          modalType='add'
          handleSubmit={(productData) => handleCreateProduct(productData)}
        />
      )}

      {visibleUpdateModal && (
        <ControlProductModal
          visibleModal={visibleUpdateModal}
          onClose={() => setVisibleUpdateModal(false)}
          modalType='update'
          handleSubmit={(productData) => handleUpdateProduct(productData)}
          initValue={viewData}
        />
      )}
      
    </>
  );
}
