import React, {  useState } from "react";
import './style.scss'

export default function CustomPagination(props) {
  const {totalPage, handlePageChange,} = props
  const [currentPage, setCurentPage] = useState(1)

  return (
    <div className="custom-pagination">
      <div class="pagination">
        <a href style={{cursor: 'pointer'}} onClick={() => {
          if ( currentPage > 0 ) {
            setCurentPage(currentPage - 1)
            handlePageChange(currentPage - 1)
          }
        }}>&laquo;</a>
        <a href>{currentPage + ' / ' + totalPage}</a>
        <a href style={{cursor: 'pointer'}} onClick={() => {
          if ( currentPage < totalPage ) {
            setCurentPage(currentPage + 1)
            handlePageChange(currentPage + 1)
          }
        }}>&raquo;</a>
      </div>
    </div>
  );
}
