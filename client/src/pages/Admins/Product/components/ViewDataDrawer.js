import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { Button, Divider, Stack } from '@mui/material';
import { FORMAT_NUMBER } from '../../../../untils/constants';
import CloseIcon from '@mui/icons-material/Close';
import { Markup } from 'interweave';

const inputStyle = {
  width: '75%',
  minHeight: '50px',
  border: '1px solid #1876D1',
  padding: '10px',
  borderRadius: '5px',
  marginLeft: '20px',
};

export default function ViewDataDrawer({ visible, onClose, viewData }) {
  return (
    <React.Fragment key='right'>
      <Drawer
        anchor='right'
        open={visible}
        onClose={() => onClose()}
        sx={{
          '.css-1160xiw-MuiPaper-root-MuiDrawer-paper': {
            maxWidth: '650px !important',
          },
        }}
      >
        <Box sx={{ width: '50vw', minWidth: '300px', paddingTop: '80px' }}>
          <Stack justifyContent={'end'}>
            <Box>
              <Button onClick={() => onClose()}>
                <CloseIcon />
              </Button>
            </Box>
          </Stack>
          <Divider />
          <div style={{ height: '20px' }} />
          <div style={{ textAlign: 'center' }}>
            <img
              src={viewData?.image?.[0]}
              style={{ width: '50%', height: '250px', margin: '0 auto' }}
              alt='prd-img'
            />
          </div>
        </Box>
        <Box sx={{ width: '100%', padding: '20px' }}>
          <Stack
            flexWrap='nowrap'
            flexDirection={'row'}
            alignItems='center'
            justifyContent='flex-start'
            style={{ marginBottom: '20px', width: '100%' }}
          >
            <Box sx={{ width: '25%' }}>
              <b>Mã sản phẩm:</b>
            </Box>
            <Box sx={inputStyle}>{viewData?._id || ''}</Box>
          </Stack>

          <Stack
            flexWrap='nowrap'
            flexDirection={'row'}
            alignItems='center'
            justifyContent='flex-start'
            style={{ marginBottom: '20px', width: '100%' }}
          >
            <Box sx={{ width: '25%' }}>
              <b>Tên sản phẩm:</b>
            </Box>
            <Box sx={inputStyle}>{viewData?.name || ''}</Box>
          </Stack>

          <Stack
            flexWrap='nowrap'
            flexDirection={'row'}
            alignItems='center'
            justifyContent='flex-start'
            style={{ marginBottom: '20px', width: '100%' }}
          >
            <Box sx={{ width: '25%' }}>
              <b>Số lượng:</b>
            </Box>
            <Box sx={inputStyle}>{viewData?.quanlity || ''}</Box>
          </Stack>

          <Stack
            flexWrap='nowrap'
            flexDirection={'row'}
            alignItems='center'
            justifyContent='flex-start'
            style={{ marginBottom: '20px', width: '100%' }}
          >
            <Box sx={{ width: '25%' }}>
              <b>Giá:</b>
            </Box>
            <Box sx={inputStyle}>
              {FORMAT_NUMBER.format(viewData?.price)} VNĐ
            </Box>
          </Stack>
          <Stack
            flexWrap='nowrap'
            flexDirection={'row'}
            alignItems='center'
            justifyContent='flex-start'
            style={{ marginBottom: '20px', width: '100%' }}
          >
            <Box sx={{ width: '25%' }}>
              <b>Giá khuyến mãi:</b>
            </Box>
            <Box sx={inputStyle}>
              {FORMAT_NUMBER.format(viewData?.sale_price)} VNĐ
            </Box>
          </Stack>

          <div className='product-drawer-desc'>
            <Stack
              flexWrap='nowrap'
              flexDirection={'row'}
              alignItems='center'
              justifyContent='flex-start'
              style={{ marginBottom: '20px', width: '100%' }}
            >
              <Box sx={{ width: '25%' }}>
                <b>Mô tả:</b>
              </Box>
              <Box sx={inputStyle}>
                <Markup content={viewData?.description} />
              </Box>
            </Stack>
          </div>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
