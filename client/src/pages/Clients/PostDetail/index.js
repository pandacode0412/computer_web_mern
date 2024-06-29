import React, { useState, useEffect } from 'react';
import './style.scss';
import { useParams, useNavigate } from 'react-router-dom';
import PostAPI from '../../../API/Post';
import { Markup } from 'interweave';
import moment from 'moment';

export default function PostDetailPage(props) {
  const [postDetail, setPostDetail] = useState({});
  const [newPost, setNewPost] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const getPostDetail = async () => {
    try {
      const postRes = await PostAPI.getPostById(params.postId);
      if (postRes?.data?.success) {
        if (postRes?.data?.payload) {
          setPostDetail(postRes.data.payload);
        }
      }
    } catch (error) {
      console.log('get post detail error: ', error);
    }
  };

  const getNewBlog = async () => {
    try {
      const allBlog = await PostAPI.getAll(4);
      if (allBlog.data && allBlog.data.success) {
        setNewPost(allBlog.data.payload);
      }
    } catch (error) {
      console.log('get post error: ', error);
    }
  };

  useEffect(() => {
    getPostDetail();
    getNewBlog();
  }, [params]);

  console.log('postDetail > ', postDetail);
  return (
    <div className='product-page-frame'>
      {/* inner page section */}
      <section className='inner_page_head'>
        <div className='container_fuild'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='full'>
                <h3>Chi tiết bài viết</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className='blog-detail-page'>
        <div class='header'>
          <h1 style={{ fontWeight: 900, fontSize: '1.2em', color: 'black' }}>
            {postDetail.blog_title ? postDetail.blog_title : 'Không có dữ liệu'}
          </h1>
        </div>

        <div class='row'>
          <div class='col-sm-12 col-md-8 col-lg-9'>
            <div>
              <h5
                style={{
                  paddingLeft: '20px',
                  color: 'gray',
                  fontSize: '1em',
                  fontFamily: '',
                  margin: 0,
                }}
              >
                Ngày đăng:{' '}
                {postDetail.createdAt
                  ? moment(postDetail.createdAt).format('DD-MM-YYYY')
                  : 'Không có dữ liệu'}
              </h5>
              <div class='fakeimg' style={{ height: '900px' }}>
                <img
                  style={{ width: '100%', height: '100%' }}
                  src={postDetail.blog_image ? postDetail.blog_image : ''}
                  alt='Ảnh sản phẩm'
                />
              </div>
              <div style={{ padding: '20px' }} className='post-content'>
                <Markup
                  content={
                    postDetail.blog_desc
                      ? postDetail.blog_desc
                      : 'Không có dữ liệu'
                  }
                />
              </div>
            </div>
          </div>
          <div class='col-sm-12 col-md-4 col-lg-3'>
            <div style={{ paddingRight: '20px', boxSizing: 'border-box' }}>
              <h3
                style={{
                  fontWeight: 800,
                  marginBottom: 0,
                  textAlign: 'center',
                }}
              >
                Bài viết mới nhất
              </h3>
              {newPost
                ?.filter((item) => item?._id !== params.postId)
                ?.map((blogItem, blogIndex) => {
                  return (
                    <div
                      className='new-post-card'
                      key={`new-post-${blogIndex}`}
                    >
                      <div class='card'>
                        <img
                          src={blogItem.blog_image}
                          alt='Avatar'
                          style={{ width: '100%' }}
                        />
                        <div
                          class='container'
                          style={{
                            paddingLeft: 0,
                            paddingRight: 0,
                            width: '100%',
                          }}
                        >
                          <h4
                            style={{ marginTop: '10px', cursor: 'pointer' }}
                            onClick={() => navigate(`/post/${blogItem._id}`)}
                          >
                            <b>{blogItem.blog_title}</b>
                          </h4>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
