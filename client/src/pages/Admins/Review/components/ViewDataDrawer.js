import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import {
  Button,
  Divider,
  FormControl,
  Pagination,
  Stack,
  TextareaAutosize,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReviewAPI from '../../../../API/Review';
import { dateTimeConverter } from '../../../../untils/until';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function ViewDataDrawer({ visible, onClose, viewData }) {
  const [reviewDetail, setReviewDetail] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const getAllReview = async (page) => {
    try {
      const reviewRes = await ReviewAPI.getReviewByProduct({
        productId: viewData,
        limit: 12,
        page: page - 1,
      });
      if (reviewRes.data && reviewRes.data.success) {
        setReviewDetail(reviewRes.data.payload.review);

        const allItem = reviewRes.data.payload.totalItem;
        const total_page = Math.ceil(Number(allItem) / 12);
        setTotalPage(total_page);
        setCurrentPage(page);
      }
    } catch (error) {
      console.log('get review Error: ', error);
    }
  };

  useEffect(() => {
    getAllReview(1);
  }, []);

  const changeReviewStatus = async (reviewId, status) => {
    try {
      const updateRes = await ReviewAPI.updateReviewStatus(reviewId, status);
      if (updateRes?.data?.success) {
        const data = [...reviewDetail];
        const findIndex = data.findIndex((item) => item._id === reviewId);
        if (findIndex !== -1) data[findIndex].status = status;
        setReviewDetail(data);
      }
    } catch (error) {
      console.log('get review Error: ', error);
    }
  };

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
        </Box>
        <Box sx={{ width: '100%', padding: '20px' }}>
          {reviewDetail.map((reviewItem, reviewIndex) => {
            return (
              <div
                className='row'
                style={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  boxSizing: 'border-box',
                  marginTop: '50px',
                  marginLeft: 0,
                  marginRight: 0,
                }}
              >
                <div className='col-sm-12 col-md-12'>
                  <Stack
                    flexDirection={'row'}
                    alignItems='center'
                    justifyContent='space-between'
                    sx={{ marginBottom: '10px' }}
                  >
                    <Stack
                      justifyContent={'start'}
                      flexDirection={'row'}
                      alignItems={'center'}
                      sx={{ marginBottom: '10px' }}
                    >
                      <div>
                        <h6
                          style={{
                            padding: '10px',
                            margin: 0,
                            background: 'gray',
                            color: 'white',
                            fontWeight: '800',
                          }}
                        >
                          {reviewItem.name.charAt(0).toUpperCase()}
                        </h6>
                      </div>
                      <div>
                        <h6
                          style={{
                            marginLeft: '10px',
                            fontSize: '1.2em',
                            fontWeight: '800',
                            marginBottom: 0,
                          }}
                        >
                          {reviewItem.name}
                        </h6>
                      </div>
                    </Stack>
                    <div>
                      {reviewItem?.status ? (
                        <Tooltip placement='top' title='Ẩn'>
                          <VisibilityIcon
                            onClick={() =>
                              changeReviewStatus(reviewItem?._id, false)
                            }
                            style={{cursor: 'pointer'}}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip placement='top' title='Hiện'>
                          <VisibilityOffIcon
                            onClick={() =>
                              changeReviewStatus(reviewItem?._id, true)
                            }
                            style={{cursor: 'pointer'}}
                          />
                        </Tooltip>
                      )}
                    </div>
                  </Stack>
                  <p style={{ marginBottom: 0, fontSize: '0.8em' }}>
                    Ngày review:{' '}
                    {reviewItem.review_date &&
                      dateTimeConverter(reviewItem.review_date)}
                  </p>
                  <FormControl fullWidth>
                    <TextareaAutosize
                      aria-label='minimum height'
                      minRows={3}
                      value={reviewItem.review && reviewItem.review}
                    />
                  </FormControl>
                </div>
              </div>
            );
          })}

          <div
            className='row'
            style={{ marginTop: '50px', marginLeft: 0, marginRight: 0 }}
          >
            <div className='col-sm-12 col-md-12'>
              <div
                className='row'
                style={{
                  justifyContent: 'center',
                  marginLeft: 0,
                  marginRight: 0,
                }}
              >
                <Stack
                  spacing={2}
                  flexDirection={'row'}
                  justifyContent={'center'}
                >
                  <Pagination
                    count={totalPage}
                    color='secondary'
                    defaultPage={1}
                    page={currentPage}
                    onChange={(event, value) => {
                      getAllReview(value);
                    }}
                  />
                </Stack>
              </div>
            </div>
          </div>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
