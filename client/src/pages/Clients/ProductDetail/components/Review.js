import React, { useState, useEffect } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ReviewAPI from '../../../../API/Review';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import {  toast } from 'react-toastify';
import moment from 'moment';
import { useSelector } from 'react-redux';

export default function ProductDetailReview(props) {
  const [addReviewData, setAddReviewData] = useState('');
  const [reviewData, setReviewData] = useState([]);
  const [createReviewNoti, setCreateReviewNoti] = useState({
    status: false,
    noti: '',
    type: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();

  const userData = useSelector((state) => state.user.userData);

  const params = useParams();

  const createNewReview = async () => {
    try {
      if (userData) {
        const createReviewRes = await ReviewAPI.createCustomerReview({
          user_id: userData.ctm_id,
          review: addReviewData,
          product_id: params?.productId,
        });

        if (createReviewRes.data && createReviewRes.data.success) {
          toast.success('Gửi review thành công');
          getAllReview(currentPage);
        } else {
          toast.error('Gửi review thất bại');
        }
        setTimeout(() => {
          setAddReviewData('');
          setCreateReviewNoti({ status: false, noti: '', type: '' });
        }, 2000);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.log('create review error: ', error);
    }
  };

  const getAllReview = async (page) => {
    try {
      const reviewRes = await ReviewAPI.getReviewByProduct({
        productId: params?.productId,
        limit: 12,
        page: page - 1,
      });
      if (reviewRes.data && reviewRes.data.success) {
        setReviewData(reviewRes.data.payload.review);

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

  return (
    <div style={{ marginBottom: '30px' }}>
      <h6
        style={{
          textAlign: 'center',
          fontSize: '1.5em',
          color: '#FF5721',
          fontWeight: 600,
        }}
      >
        Đánh giá khách hàng
      </h6>
      <div
        className='row'
        style={{
          paddingLeft: '20px',
          paddingRight: '20px',
          boxSizing: 'border-box',
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <div className='col-sm-2 col-md-3'></div>
        <div className='col-sm-8 col-md-6'>
          <FormControl fullWidth>
            <TextareaAutosize
              aria-label='minimum height'
              minRows={4}
              placeholder='Nhập đánh giá'
              value={addReviewData}
              onChange={(event) => setAddReviewData(event.target.value)}
              style={{ padding: '10px' }}
            />

            {createReviewNoti.status && (
              <Stack
                sx={{ marginTop: '10px' }}
                spacing={2}
                justifyContent='space-around'
                flexDirection={'row'}
              >
                <Alert
                  severity={createReviewNoti.type}
                  sx={{ marginTop: '10px' }}
                >
                  {createReviewNoti.noti}
                </Alert>
              </Stack>
            )}

            <Stack
              sx={{ marginTop: '10px' }}
              justifyContent={'end'}
              flexDirection={'row'}
            >
              <Box>
                <Button
                  variant='contained'
                  onClick={() => createNewReview()}
                  sx={{ color: 'white !important' }}
                >
                  Gửi đánh giá
                </Button>
              </Box>
            </Stack>
          </FormControl>
        </div>
        <div className='col-sm-2 col-md-3'></div>
      </div>

      {/*  */}

      {reviewData.map((reviewItem) => {
        return (
          <>
            {reviewItem?.status  && (
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
                <div className='col-sm-2 col-md-1'/>
                <div className='col-sm-8 col-md-6'>
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
                        {reviewItem?.name?.charAt(0)?.toUpperCase()}
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
                  <p style={{ marginBottom: 0, fontSize: '0.8em' }}>
                    Ngày review:{' '}
                    {reviewItem.createdAt &&
                      moment(reviewItem.createdAt).format('DD-MM-YYYY')}
                  </p>
                  <FormControl fullWidth>
                    <TextareaAutosize
                      aria-label='minimum height'
                      minRows={3}
                      value={reviewItem.review && reviewItem.review}
                      style={{padding: '5px'}}
                    />
                  </FormControl>
                </div>
                <div className='col-sm-2 col-md-3'></div>
              </div>
            )}
          </>
        );
      })}

      <div
        className='row'
        style={{ marginTop: '50px', marginLeft: 0, marginRight: 0 }}
      >
        <div className='col-sm-2 col-md-1'></div>
        <div className='col-sm-8 col-md-6'>
          <div
            className='row'
            style={{ justifyContent: 'center', marginLeft: 0, marginRight: 0 }}
          >
            <Stack spacing={2} flexDirection={'row'} justifyContent={'center'}>
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
        <div className='col-sm-2 col-md-3'></div>
      </div>
      
    </div>
  );
}
