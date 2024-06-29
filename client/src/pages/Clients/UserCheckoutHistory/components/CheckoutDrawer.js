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
      const productRes = await ProductAPI.getCheckoutById(viewData);

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
        <Box sx={{ width: "100%"}}>
          <Stack justifyContent={"start"} flexDirection={'row'}>
            <Box sx={{width: '50%'}}>
              <Button onClick={() => onClose()}>
                <CloseIcon />
              </Button>
            </Box>
            <Box sx={{width: '50%'}}>
              Thông tin sản phẩm
            </Box>
          </Stack>
          <Divider />
        </Box>
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
