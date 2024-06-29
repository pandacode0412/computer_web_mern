import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostAPI from "../../../../API/Post";
import { dateTimeConverter } from "../../../../untils/until";

export default function TabBlog() {
  const [listPost, setListPost] = useState([]);
  const navigate = useNavigate()

  const getAllPostData = async () => {
    try {
      const getPostRes = await PostAPI.getAll(6, 0);
      if (getPostRes?.data && getPostRes?.data?.success) {
        setListPost(getPostRes?.data?.payload?.post);
      }
    } catch (error) {
      console.log("get all post data error: ", error);
    }
  };

  useEffect(() => {
    getAllPostData();
  }, []);

  return (
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
  );
}
