import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostAPI from "../../../API/Post";
import CustomPagination from "../../../components/CustomPagination";
import { dateTimeConverter } from "../../../untils/until";

export default function PostPage() {
  const [listPost, setListPost] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const navigate = useNavigate()

  const getAllPostData = async (page) => {
    try {
      const getPostRes = await PostAPI.getAll(6, page - 1, '');
      if (getPostRes?.data && getPostRes?.data?.success) {
        setListPost(getPostRes?.data?.payload?.post);
        const totalItem = getPostRes?.data?.payload?.totalItem;
        const totalPage = Math.ceil(totalItem / 6);
        setTotalPage(totalPage);
      }
    } catch (error) {
      console.log("get all post data error: ", error);
    }
  };

  useEffect(() => {
    getAllPostData(1);
  }, []);

  return (
    <div className="product-page-frame">
      {/* inner page section */}
      <section className="inner_page_head">
        <div className="container_fuild">
          <div className="row">
            <div className="col-md-12">
              <div className="full">
                <h3>SẢN PHẨM CỦA CHÚNG TÔI</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end inner page section */}
      {/* product section */}
      <section className="product_section layout_padding">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>
              Tất cả <span> bài viết</span>
            </h2>
          </div>
          <div className="home-new-post">
            <div className="card-container">
              {listPost?.map((postItem, postIndex) => {
                return (
                  <div className="card card-1" 
                    key={`new-post-${postIndex}`}
                    onClick={() => navigate(`/post/${postItem._id}`)}
                  >
                    <div
                      className="card-img"
                      style={{
                        backgroundImage: `url(${postItem?.blog_image})`,
                      }}
                    />
                    <a href className="card-link">
                      <div
                        className="card-img-hovered"
                        style={{
                          backgroundImage: `url(${postItem?.blog_image})`,
                        }}
                      />
                    </a>
                    <div className="card-info">
                      <div className="card-about">
                        <a className="card-tag tag-news">NEWS</a>
                        <div className="card-time">
                          {dateTimeConverter(postItem?.updated_at)}
                        </div>
                      </div>
                      <h1 className="card-title">{postItem?.blog_title}</h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {totalPage > 0 && (
            <div className="pagination">
              <CustomPagination
                totalPage={totalPage}
                handlePageChange={(page) => {
                  getAllPostData(page);
                }}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
