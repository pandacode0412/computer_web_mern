import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import {
  Button,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FORMAT_NUMBER } from "../../../../untils/constants";
import CloseIcon from "@mui/icons-material/Close";
import ProductAPI from "../../../../API/Product";

export default function ViewDataDrawer({ visible, onClose, viewData }) {
  const [listCheckoutProduct, setListCheckoutProduct] = useState([]);
  const getListCheckoutProduct = async () => {
    try {
      const productRes = await ProductAPI.getCheckoutById(viewData?._id);

      if (productRes?.data?.success)
        setListCheckoutProduct(productRes?.data?.payload);
    } catch (error) {
      console.log("get list checkout product error >>>>> ", error);
    }
  };

  useEffect(() => {
    getListCheckoutProduct();
  }, []);

  return (
    <React.Fragment key="right">
      <Drawer
        anchor="right"
        open={visible}
        onClose={() => onClose()}
        sx={{
          ".css-1160xiw-MuiPaper-root-MuiDrawer-paper": {
            maxWidth: "850px !important",
          },
        }}
      >
        <Box sx={{ width: "100%", paddingTop: "80px" }}>
          <Stack justifyContent={"start"} flexDirection={'row'}>
            <Box sx={{width: '50%'}}>
              <Button onClick={() => onClose()}>
                <CloseIcon />
              </Button>
            </Box>
          </Stack>
          <Divider />
        </Box>
        <div style={{marginTop: '20px', textAlign: 'center', fontSize: '28px'}}>Thông tin khách hàng</div>
        <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingX: '30px'}}>
          <div style={{width: '50%', marginTop: '20px'}}>Tên khách hàng: {viewData?.user_name}</div>
          <div style={{width: '50%', marginTop: '20px'}}>Email: {viewData?.user_email}</div>
          <div style={{width: '50%', marginTop: '20px'}}>Số điện thoại: {viewData?.user_phone}</div>
          <div style={{width: '50%', marginTop: '20px'}}>Địa chỉ: {viewData?.user_address}</div>
        </Box>
        <div style={{marginTop: '20px', textAlign: 'center', fontSize: '28px'}}>Thông tin sản phẩm</div>
        <Box sx={{ width: "100%", padding: "20px" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Hình ảnh</TableCell>
                  <TableCell align="left">Tên sản phẩm</TableCell>
                  <TableCell align="left">Thương hiệu</TableCell>
                  <TableCell align="left">Danh mục</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                  <TableCell align="right">Gía</TableCell>
                  <TableCell align="right">Tổng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listCheckoutProduct.map((row) => (
                  <TableRow
                    key={row?.product_id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right">
                      <img
                        src={row?.proudct_image}
                        style={{
                          width: "150px",
                          height: "150px",
                          margin: "0 auto",
                        }}
                        alt=""
                      />
                    </TableCell>
                    <TableCell align="right">{row?.product_name}</TableCell>
                    <TableCell align="right">{row?.proudct_brand}</TableCell>
                    <TableCell align="right">{row?.product_category}</TableCell>
                    <TableCell align="right">{row?.product_quanlity}</TableCell>
                    <TableCell align="right">{FORMAT_NUMBER.format(row?.product_price)}</TableCell>
                    <TableCell align="right">{FORMAT_NUMBER.format(Number(row?.product_price) * Number(row?.product_quanlity))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
