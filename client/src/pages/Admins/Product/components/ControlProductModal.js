import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled, alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import BrandAPI from '../../../../API/Brand';
import CategoryAPI from '../../../../API/Category';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import storage from '../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import 'braft-extensions/dist/table.css';
import BraftTable from 'braft-extensions/dist/table';
import TableDropdown from '../../../../components/TableDropdown';

const maxFileSize = 500000; //500 kb
const controls = [
  'bold',
  'italic',
  'underline',
  'separator',
  'text-indent',
  'text-align',
  'list-ul',
  'list-ol',
  'link',
  'separator',
  'media',
];
BraftEditor.use(BraftTable());

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
    minWidth: '700px',
  },
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function ControlProductModal(props) {
  const { visibleModal, onClose, modalType, handleSubmit, initValue } = props;
  const [editProductData, setEditProductData] = useState({
    brand_id: '',
    category_id: '',
    name: '',
    description: '',
    quanlity: 0,
    price: 0,
    image: '',
    sale_price: 0,
    front_image: '',
    back_image: '',
  });
  const [editProductError, setEditProductError] = useState({
    status: false,
    type: '',
    message: '',
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [listBranch, setListBranch] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [braftValue, setBraftValue] = useState(
    BraftEditor.createEditorState('')
  );

  const getListBranch = async () => {
    const branchRes = await BrandAPI.getAllBrand();
    if (branchRes?.data?.payload) {
      setListBranch(branchRes?.data?.payload);
    }
  };

  const getlistCategory = async () => {
    try {
      const branchRes = await CategoryAPI.getAllCategory();
      if (branchRes?.data?.success) {
        setListCategory(branchRes?.data?.payload);
      }
    } catch (error) {
      console.log('get list brand error >>> ', error);
    }
  };

  useEffect(() => {
    getListBranch();
    getlistCategory();
  }, []);

  useEffect(() => {
    if (initValue) {
      setEditProductData(initValue);
      setBraftValue(
        BraftEditor?.createEditorState?.(initValue?.description || '')
      );
    } else {
      setBraftValue(BraftEditor?.createEditorState?.(''));
    }
  }, []);

  const customUpload = async (props) => {
    const { file, success, error } = props;
    const imageName = 'post-' + new Date().getTime();
    const storageRef = ref(storage, imageName);

    const updateImageRes = await uploadBytes(storageRef, file);
    if (updateImageRes) {
      const pathReference = ref(storage, imageName);
      const url = await getDownloadURL(pathReference);
      success({ url });
    } else {
      error('File upload failed');
      toast.warn('File upload failed');
    }
  };

  const validateFn = (file) => {
    let fileSizeError = 'File tải lên không thể quá 500 kb';

    if (file.size > maxFileSize) {
      toast.warn(fileSizeError);
      return false;
    }
    return true;
  };

  return (
    <div>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby='customized-dialog-title'
        open={visibleModal}
      >
        <BootstrapDialogTitle id='customized-dialog-title' onClose={onClose}>
          {modalType === 'add' ? 'Thêm mới sản phẩm' : 'Cập nhật sản phẩm'}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <FormControl sx={{ m: 1, width: '99%' }}>
            <InputLabel id='demo-multiple-name-label'>
              Tên thương hiệu
            </InputLabel>
            <Select
              labelId='demo-multiple-name-label'
              id='demo-multiple-name'
              multiple={false}
              input={<OutlinedInput label='Name' />}
              MenuProps={MenuProps}
              value={editProductData.brand_id}
              onChange={(event) => {
                setEditProductData({
                  ...editProductData,
                  brand_id: event.target.value,
                });
              }}
            >
              {listBranch?.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, width: '99%' }}>
            <InputLabel id='demo-multiple-name-label'>Tên Danh mục</InputLabel>
            <Select
              labelId='demo-multiple-name-label'
              id='demo-multiple-name'
              multiple={false}
              input={<OutlinedInput label='Name' />}
              MenuProps={MenuProps}
              value={editProductData.category_id}
              onChange={(event) => {
                setEditProductData({
                  ...editProductData,
                  category_id: event.target.value,
                });
              }}
            >
              {listCategory?.map((category) => (
                <MenuItem
                  key={category?._id}
                  value={category?._id}
                >
                  {category?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <RedditTextField
            label='Tên sản phẩm'
            defaultValue={editProductData.name || ''}
            id='post-title'
            variant='filled'
            style={{ marginTop: 11, textAlign: 'left' }}
            onChange={(event) =>
              setEditProductData({
                ...editProductData,
                name: event.target.value,
              })
            }
          />

          <RedditTextField
            label='Số lượng'
            defaultValue={editProductData.quanlity || 0}
            id='post-title'
            variant='filled'
            type='number'
            style={{ marginTop: 11, textAlign: 'left' }}
            onChange={(event) =>
              setEditProductData({
                ...editProductData,
                quanlity: event.target.value,
              })
            }
          />

          <RedditTextField
            label='Giá: '
            defaultValue={editProductData.price || 0}
            id='post-title'
            variant='filled'
            type='number'
            style={{ marginTop: 11, textAlign: 'left' }}
            onChange={(event) =>
              setEditProductData({
                ...editProductData,
                price: event.target.value,
              })
            }
          />

          <RedditTextField
            label='Giá khuyến mãi: '
            defaultValue={editProductData.sale_price || 0}
            id='post-title'
            variant='filled'
            style={{ marginTop: 11, textAlign: 'left' }}
            onChange={(event) =>
              setEditProductData({
                ...editProductData,
                sale_price: event.target.value,
              })
            }
          />
          <Box sx={{ margin: '10px 0' }}>
            <Typography variant='p' component='p' sx={{ margin: '10px 0' }}>
              Mô tả sản phẩm:
            </Typography>
            <BraftEditor
              language='en'
              controls={controls}
              media={{ uploadFn: customUpload, validateFn: validateFn }}
              contentStyle={{
                height: 350,
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)',
              }}
              extendControls={[
                {
                  key: 'table',
                  type: 'dropdown',
                  title: 'Insert Table',
                  text: 'Table',
                  html: null,
                  showArrow: false,
                  arrowActive: false,
                  component: (
                    <div className='my-dropdown'>
                      <TableDropdown
                        editorState={braftValue}
                        onChange={(value) => {
                          setBraftValue(value);
                        }}
                      />
                    </div>
                  ),
                },
              ]}
              value={braftValue}
              onChange={(editorState) => {
                setBraftValue(editorState);
                setEditProductData({
                  ...editProductData,
                  description: editorState.toHTML(),
                });
              }}
            />
          </Box>

          <Box sx={{ margin: '10px 0' }}>
            <Typography variant='p' component='p'>
              Hình ảnh chính:
            </Typography>
            <RedditTextField
              defaultValue=''
              id='post-title'
              variant='filled'
              style={{ marginTop: 11 }}
              type='file'
              onChange={(event) =>
                setEditProductData({
                  ...editProductData,
                  image: event.target.files[0],
                })
              }
            />
          </Box>

          <Box sx={{ margin: '10px 0' }}>
            <Typography variant='p' component='p'>
              Hình ảnh phụ:
            </Typography>
            <RedditTextField
              defaultValue=''
              id='post-title'
              variant='filled'
              style={{ marginTop: 11 }}
              type='file'
              onChange={(event) =>
                setEditProductData({
                  ...editProductData,
                  front_image: event.target.files[0],
                })
              }
            />
          </Box>

          <Box sx={{ margin: '10px 0' }}>
            <Typography variant='p' component='p'>
              Hình ảnh phụ:
            </Typography>
            <RedditTextField
              defaultValue=''
              id='post-title'
              variant='filled'
              style={{ marginTop: 11 }}
              type='file'
              onChange={(event) =>
                setEditProductData({
                  ...editProductData,
                  back_image: event.target.files[0],
                })
              }
            />
          </Box>

          {editProductError.status && (
            <Alert severity={editProductError.type}>
              {editProductError.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={modalLoading}
            autoFocus
            onClick={async () => {
              const {
                brand_id,
                category_id,
                name,
                description,
                quanlity,
                price,
                sale_price,
                image,
              } = editProductData;
              setEditProductError({ status: false, type: '', message: '' });
              if (
                (brand_id.toString().length <= 0 ||
                  category_id.toString().length <= 0 ||
                  name.length <= 0 ||
                  description.length <= 0 ||
                  typeof image === 'string') &&
                modalType === 'add'
              ) {
                setEditProductError({
                  status: true,
                  type: 'error',
                  message: 'Các trường dữ liêu không được bỏ trống',
                });
              } else if (
                (brand_id.toString().length <= 0 ||
                  category_id.toString().length <= 0 ||
                  name.length <= 0 ||
                  description.length <= 0) &&
                modalType === 'update'
              ) {
                setEditProductError({
                  status: true,
                  type: 'error',
                  message: 'Các trường dữ liêu không được bỏ trống',
                });
              } else if (
                Number(quanlity) <= 0 ||
                Number(price) <= 0 ||
                Number(sale_price) < 0
              ) {
                setEditProductError({
                  status: true,
                  type: 'error',
                  message: 'Giá và số lượng cần lớn hơn 0',
                });
              } else {
                setModalLoading(true);
                const submitRes = await handleSubmit({ ...editProductData });
                if (!submitRes?.data?.success) {
                  setModalLoading(false);
                  setEditProductError({
                    status: true,
                    type: 'error',
                    message: submitRes?.data?.error?.message,
                  });
                }
              }
            }}
          >
            {modalType === 'add' ? 'Thêm mới' : 'Cập nhật'}
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
