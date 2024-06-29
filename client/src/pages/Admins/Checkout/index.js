import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { FORMAT_NUMBER } from "../../../untils/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ViewDataDrawer from "./components/ViewDataDrawer";
import {  toast } from "react-toastify";
import CustomPopover from "../../../components/CustomPopover";
import ProductAPI from "../../../API/Product";
import { dateTimeConverter } from "../../../untils/until";
import ChangeStatusPopover from "./components/ChangeStatusPopover";
import moment from "moment";

const columns = [
  { id: "createdAt", label: "Ngày đặt hàng", width: 200, align: "center" },
  {
    id: "user_name",
    label: "Tên",
    minWidth: 200,
    align: "left",
  },
  { id: "total_price", label: "Tổng giá tiền", width: 200, align: "right" },
  {
    id: "payment_methods",
    label: "Phương thức thanh toán",
    width: 200,
    align: "right",
  },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 100,
    align: "center",
  },
  {
    id: "action",
    label: "Thao tác",
    minWidth: 170,
    align: "center",
  },
];

export default function AdminCheckout() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listProduct, setListProduct] = useState([]);
  const [visibleViewDataDrawer, setVisibleViewDataDrawer] = useState(false);
  const [viewData, setViewData] = useState("");
  const [popoverId, setPopoverId] = useState("");
  const [changeStatusPopoverId, setChangeStatusPopoverId] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListProduct = async () => {
    const getListRes = await ProductAPI.getAllCheckoutProduct();
    if (getListRes?.data?.success) {
      setListProduct(getListRes?.data?.payload);
    }
  };

  useEffect(() => {
    getListProduct();
  }, []);

  const handleDeleteCheckoutProduct = async (checkoutId) => {
    try {
      const deleteRes = await ProductAPI.deleteCheckoutProduct(checkoutId);
      if (deleteRes?.data?.success) {
        getListProduct();
        toast.success("Xoá đơn hàng thành công");
        setPopoverId("");
      } else {
        toast.error(deleteRes?.data?.error?.message || "Xoá đơn hàng thất bại");
      }
    } catch (error) {
      toast.error("Xoá đơn hàng thất bại");
    }
  };

  const changeCheckoutStatus = async (status, checkoutId) => {
    try {
      const res = await ProductAPI.changeCheckoutStatus(status, checkoutId);

      if (res?.data?.success) {
        const product = [...listProduct];
        const findCheckoutProduct = product?.findIndex(
          (item) => item?._id === checkoutId
        );
        if (findCheckoutProduct !== -1) {
          product[findCheckoutProduct].status = status;
          setListProduct(product);
        } else {
          getListProduct();
        }
        toast.success("Đổi trạng thái đơn đặt hàng thành công");
        setChangeStatusPopoverId("");
      } else {
      }
    } catch (error) {
      toast.error("Đổi trạng thái đơn đặt hàng thất bại");
    }
  };

  const displayStatus = (status, checkoutId) => {
    if (status === 0) {
      return (
        <ChangeStatusPopover
          visible={changeStatusPopoverId === checkoutId}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) =>
            changeCheckoutStatus(selectStatus, checkoutId)
          }
        >
          <Alert
            badgeContent={4}
            color="error"
            icon={false}
            onClick={() => setChangeStatusPopoverId(checkoutId)}
            sx={{ cursor: "pointer" }}
          >
            Đã huỷ
          </Alert>
        </ChangeStatusPopover>
      );
    } else if (status === 1) {
      return (
        <ChangeStatusPopover
          visible={changeStatusPopoverId === checkoutId ? true : false}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) =>
            changeCheckoutStatus(selectStatus, checkoutId)
          }
        >
          <Alert
            badgeContent={4}
            color="warning"
            icon={false}
            sx={{ cursor: "pointer" }}
            onClick={() => setChangeStatusPopoverId(checkoutId)}
          >
            Đặt hàng thành công
          </Alert>
        </ChangeStatusPopover>
      );
    } else if (status === 2) {
      return (
        <ChangeStatusPopover
          visible={changeStatusPopoverId === checkoutId ? true : false}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) =>
            changeCheckoutStatus(selectStatus, checkoutId)
          }
        >
          <Alert
            badgeContent={4}
            color="primary"
            icon={false}
            onClick={() => setChangeStatusPopoverId(checkoutId)}
          >
            Đang giao hàng
          </Alert>
        </ChangeStatusPopover>
      );
    } else if (status === 3) {
      return (
        <ChangeStatusPopover
          visible={changeStatusPopoverId === checkoutId ? true : false}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) =>
            changeCheckoutStatus(selectStatus, checkoutId)
          }
        >
          <Alert
            badgeContent={4}
            color="success"
            icon={false}
            onClick={() => setChangeStatusPopoverId(checkoutId)}
          >
            Đã giao hàng
          </Alert>
        </ChangeStatusPopover>
      );
    }
  };

  const diplayPaymentMethod = (method) => {
    switch (method) {
      case "COD":
        return (
          <Alert
            badgeContent={4}
            color="primary"
            icon={false}
          >
            Thanh toán tận nơi
          </Alert>
        );
      case 'CARD':
        return (
          <Alert
            badgeContent={4}
            color="success"
            icon={false}
          >
            Thanh toán qua thẻ
          </Alert>
        );
      default: 
          break;
    }
  };

  return (
    <>
      <Stack
        flexWrap={"nowrap"}
        flexDirection="row"
        justifyContent={"space-between"}
        sx={{ marginBottom: "20px" }}
      >
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          Quản lí sản phẩm
        </Typography>
      </Stack>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "action" ? (
                              <Stack
                                flexDirection={"row"}
                                justifyContent="center"
                              >
                                <CustomPopover
                                  open={popoverId === row._id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    handleDeleteCheckoutProduct(row._id)
                                  }
                                  noti="Bạn có chắc chắn muốn xoá đơn đặt hàng?"
                                >
                                  <Button
                                    color="error"
                                    variant="contained"
                                    onClick={() => {
                                      if (popoverId === row._id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row._id);
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </CustomPopover>
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={() => {
                                    setViewData(row);
                                    setVisibleViewDataDrawer(true);
                                  }}
                                >
                                  <RemoveRedEyeIcon />
                                </Button>
                              </Stack>
                            ) : column.id === "createdAt" ? (
                              <div>{moment(value).format('DD-MM-YYYY')}</div>
                            ) : column.id === "_id" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === "total_price" ? (
                              FORMAT_NUMBER.format(value)
                            ) : column.id === "status" ? (
                              displayStatus(value, row?._id)
                            ) : (
                              column.id === 'payment_methods' ?
                              diplayPaymentMethod(row?.payment_methods):

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
          component="div"
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
      
    </>
  );
}
