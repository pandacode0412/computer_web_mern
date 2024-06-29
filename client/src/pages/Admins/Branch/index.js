import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled, alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Alert,
  Button,
  IconButton,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import storage from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Box } from '@mui/system';
import { CHECK_SPECIAL_PATTERN } from '../../../untils/constants';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import SettingsIcon from '@mui/icons-material/Settings';
import CustomPopover from '../../../components/CustomPopover';
import BrandAPI from '../../../API/Brand';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const RedditTextField = styled((props) => (
  <TextField
    InputProps={{ disableUnderline: true }}
    {...props}
    sx={{ width: '100%' }}
  />
))(({ theme }) => ({
  '& .MuiFilledInput-root': {
    border: '1px solid #e2e2e1',
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },

    '.MuiFilledInput-input': {
      minWidth: '300px !important',
    },
  },
}));

const columns = [
  { id: 'index', label: 'STT', minWidth: 150, align: 'center' },
  {
    id: 'image',
    label: 'Hình ảnh',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'name',
    label: 'Tên thương hiệu',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'description',
    label: 'Mô tả',
    minWidth: 170,
    maxWidth: 200,
    align: 'left',
  },
  {
    id: 'action',
    label: 'Thao tác',
    minWidth: 170,
    align: 'center',
  },
];

export default function ProductBranch() {
  const [listBranch, setListBranch] = useState([]);
  const [addBranchModal, setAddBranchModal] = useState({
    status: false,
    type: '',
  });
  const [editBranch, setEditBranch] = useState({
    brandName: '',
    description: '',
    brandImage: '',
    brandId: -1,
  });
  const [editBranchError, setEditBranchError] = useState({
    status: false,
    type: '',
    message: '',
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [popoverId, setPopoverId] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListBranch = async () => {
    try {
      const branchRes = await BrandAPI.getAllBrand();
      if (branchRes?.data?.success) {
        setListBranch(branchRes?.data?.payload);
      }
    } catch (error) {
      console.log('get list brand error >>> ', error);
    }
  };

  useEffect(() => {
    getListBranch();
  }, []);

  const createNewImage = async () => {
    setModalLoading(true);
    setEditBranchError({ status: false, type: '', message: '' });
    const { brandName, description, brandImage } = editBranch;
    if (
      brandName.length <= 0 ||
      description.length <= 0 ||
      (addBranchModal.type === 'add' && typeof brandImage === 'string')
    ) {
      setEditBranchError({
        status: true,
        type: 'error',
        message: 'Tên, mô tả và hình ảnh không được bỏ trống',
      });
    } else if (brandName.trim().length <= 0 || description.trim().length <= 0) {
      setEditBranchError({
        status: true,
        type: 'error',
        message: 'Tên, mô tả không thể chỉ chứa kí tự space',
      });
    } else if (CHECK_SPECIAL_PATTERN.test(brandName)) {
      setEditBranchError({
        status: true,
        type: 'error',
        message: 'Tên không thể chứa kí tự đặc biệt',
      });
    } else if (brandName.length <= 3) {
      setEditBranchError({
        status: true,
        type: 'error',
        message: 'Tên phải nhiều hơn 3 kí tự',
      });
    } else if (description.length <= 10) {
      setEditBranchError({
        status: true,
        type: 'error',
        message: 'Mô tả phải nhiều hơn 10 kí tự',
      });
    } else {
      let branchData = {
        name: brandName,
        image: brandImage || '',
        description: description,
      };

      if (typeof brandImage !== 'string') {
        const imageName = 'branch-' + new Date().getTime();
        const storageRef = ref(storage, imageName);

        const updateImageRes = await uploadBytes(storageRef, brandImage);
        if (updateImageRes) {
          const pathReference = ref(storage, imageName);
          const url = await getDownloadURL(pathReference);
          branchData.image = url;
        } else {
          setEditBranchError({
            status: true,
            type: 'error',
            message: 'Không thể tải hình ảnh, Vui lòng thử lại sau',
          });
        }
      }

      /*Create branch*/
      if (addBranchModal.type === 'add') {
        const createBranchRes = await BrandAPI.createNewBranch(branchData);
        if (createBranchRes?.data?.success) {
          setEditBranchError({
            status: true,
            type: 'success',
            message: 'Thêm mới thương hiệu thành công',
          });
          getListBranch();
          setTimeout(() => {
            setAddBranchModal({ status: false, type: '' });
          }, 1000);
        } else {
          setEditBranchError({
            status: true,
            type: 'error',
            message: 'Thêm mới thương hiệu thất bại',
          });
        }

        /*Update branch*/
      } else {
        const updateRes = await BrandAPI.updateBranchData(
          branchData,
          editBranch?.brandId
        );

        if (updateRes?.data?.success) {
          setEditBranchError({
            status: true,
            type: 'success',
            message: 'Cập nhật thương hiệu thành công',
          });
          getListBranch();
          setTimeout(() => {
            setAddBranchModal({ status: false, type: '' });
          }, 1000);
        } else {
          setEditBranchError({
            status: true,
            type: 'error',
            message: 'Cập nhật thương hiệu thất bại',
          });
        }
      }
    }
    setModalLoading(false);
  };

  const deleteBranch = async (branchId) => {
    try {
      const deleteRes = await BrandAPI.deleteBranch(branchId);
      if (deleteRes?.data?.success) {
        toast.success('Xoá thương hiệu thành công');
        getListBranch();
        setPopoverId('');
      } else {
        toast.error(
          deleteRes?.data?.error?.message || 'Xoá thương hiệu thất bại'
        );
      }
    } catch (error) {
      toast.error('Xoá thương hiệu thất bại');
    }
  };

  return (
    <>
      <div>
        <BootstrapDialog
          onClose={() =>
            setAddBranchModal({ ...addBranchModal, status: false })
          }
          aria-labelledby='customized-dialog-title'
          open={addBranchModal.status}
        >
          <BootstrapDialogTitle
            id='customized-dialog-title'
            onClose={() =>
              setAddBranchModal({ ...addBranchModal, status: false })
            }
          >
            {addBranchModal.type === 'add'
              ? 'Thêm mới thương hiệu'
              : 'Cập nhật thương hiệu'}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <RedditTextField
              label='Tên'
              defaultValue={editBranch.brandName || ''}
              id='post-title'
              variant='filled'
              style={{ marginTop: 11, textAlign: 'left' }}
              onChange={(event) =>
                setEditBranch({ ...editBranch, brandName: event.target.value })
              }
            />

            <TextareaAutosize
              defaultValue={editBranch.description || ''}
              aria-label='minimum height'
              minRows={10}
              placeholder='Nhập mô tả'
              style={{ width: '100%', marginTop: '20px', padding: '10px' }}
              onChange={(event) =>
                setEditBranch({
                  ...editBranch,
                  description: event.target.value,
                })
              }
            />

            <Box sx={{ margin: '10px 0' }}>
              <Typography variant='p' component='p'>
                Hình ảnh:
              </Typography>
              <RedditTextField
                defaultValue=''
                id='post-title'
                variant='filled'
                style={{ marginTop: 11 }}
                type='file'
                onChange={(event) =>
                  setEditBranch({
                    ...editBranch,
                    brandImage: event.target.files[0],
                  })
                }
              />
            </Box>

            {editBranchError.status && (
              <Alert severity={editBranchError.type}>
                {editBranchError.message}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={modalLoading}
              autoFocus
              onClick={() => {
                createNewImage();
              }}
            >
              {addBranchModal.type === 'add' ? 'Thêm mới' : 'Cập nhật'}
            </LoadingButton>
          </DialogActions>
        </BootstrapDialog>
      </div>
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
          Quản lí thương hiệu
        </Typography>
        <div>
          <Button
            variant='contained'
            onClick={() => {
              setEditBranch({ brandName: '', description: '', brandImage: '' });
              setEditBranchError({ status: false, type: '', message: '' });
              setAddBranchModal({ status: true, type: 'add' });
            }}
          >
            Thêm mới
          </Button>
        </div>
      </Stack>
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
              {listBranch
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
                                  open={popoverId === row?._id}
                                  onClose={() => setPopoverId('')}
                                  handleSubmit={() =>
                                    deleteBranch(row?._id)
                                  }
                                  noti='Bạn có chắc chắn muốn xoá thương hiệu?'
                                >
                                  <Button
                                    color='error'
                                    variant='contained'
                                    onClick={() => {
                                      if (popoverId === row?._id) {
                                        setPopoverId('');
                                      } else {
                                        setPopoverId(row?._id);
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </CustomPopover>
                                <Button
                                  variant='contained'
                                  onClick={() => {
                                    setEditBranchError({
                                      status: false,
                                      type: '',
                                      message: '',
                                    });
                                    setEditBranch({
                                      brandName: row?.name,
                                      description: row?.description,
                                      brandImage: row?.image,
                                      brandId: row?._id,
                                    });
                                    setAddBranchModal({
                                      status: true,
                                      type: 'update',
                                    });
                                  }}
                                >
                                  <SettingsIcon />
                                </Button>
                              </Stack>
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
                            ) : column.id === 'image' ? (
                              <img src={value} width={150} height={150} />
                            ) : column.id === 'name' ? (
                              <div style={{ fontWeight: 600 }}>{value}</div>
                            ) : column.id === 'description' ? (
                              <div
                                style={{
                                  maxWidth: '200px',
                                  overflowWrap: 'anywhere',
                                }}
                              >
                                {value}
                              </div>
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
          count={listBranch.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
