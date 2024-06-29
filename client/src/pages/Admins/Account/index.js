import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import UserAPI from "../../../API/UserAPI";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box } from "@mui/system";
import SwipeableTemporaryDrawer from "./components/ViewUserDrawer";
import { toast } from "react-toastify";
import AddManagerModal from "./components/AddManagerModal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CustomPopover from "../../../components/CustomPopover";

const columns = [
  { id: "name", label: "Tên", minWidth: 170 },
  { id: "email", label: "Địa chỉ", minWidth: 170 },
  {
    id: "phone_number",
    label: "SĐT",
    minWidth: 170,
    align: "right",
  },
  {
    id: "address",
    label: "Email",
    minWidth: 170,
    align: "left",
  },
  {
    id: "action",
    label: "Thao tác",
  },
];

export default function AdminAccount() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentTab, setCurrentTab] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [viewUserData, setViewUserData] = useState({});
  const [visibleUserDrawer, setVisibleUserDrawer] = useState(false);
  const [visibleAddModal, setVisibleAddModal] = useState(false);
  const [popoverId, setPopoverId] = useState("");
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getAllUserData = async () => {
    setTableData([]);
    const accountRes = await UserAPI.getAllUser(currentTab);
    if (accountRes?.data?.payload?.user?.length) {
      setTableData(accountRes?.data?.payload?.user);
    }
  };

  useEffect(() => {
    getAllUserData();
  }, [currentTab]);

  const handleCreateManager = async (managerData) => {
    const { address, email, fullName, password, phone } = managerData;
    const createData = {
      name: fullName,
      email: email,
      phone_number: phone,
      address: address,
      password: password,
      role: 2,
    };
    const createRes = await UserAPI.userSignup(createData);
    if (createRes?.data?.success) {
      getAllUserData();
      setVisibleAddModal(false);
      toast.success("Thêm mới nhân viên quản lí thành công");
      return { success: true };
    } else {
      toast.error("Thêm mới nhân viên quản lí thất bại");
      return createRes;
    }
  };

  const handleDeleteAccount = async (userId) => {
    const deleteRes = await UserAPI.deleteUser(userId);

    if (deleteRes?.data?.success) {
      getAllUserData();
      toast.success("Xoá tài khoản thành công");
      setPopoverId("");
    } else {
      toast.error(deleteRes?.data?.error?.message || "Xoá tài khoản thất bại");
    }
  }

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
          Quản lí tài khoản
        </Typography>
        <div>
          <Button variant="contained" onClick={() => setVisibleAddModal(true)}>
            Thêm mới
          </Button>
        </div>
      </Stack>
      <Box sx={{ marginBottom: "10px" }}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value={1} label="Khách hàng" />
          <Tab value={2} label="Nhân viên" />
        </Tabs>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns?.map((column) => (
                  <TableCell
                    key={column?.id}
                    align={column?.align}
                    style={{ minWidth: column?.minWidth }}
                  >
                    {column?.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row) => {
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
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  flexWrap: "nowrap",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={() => {
                                    setViewUserData(row);
                                    setVisibleUserDrawer(true);
                                  }}
                                >
                                  {value}
                                  <RemoveRedEyeIcon />
                                </Button>
                                <CustomPopover
                                  open={popoverId === row._id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    handleDeleteAccount(row._id)
                                  }
                                  noti="Tất cả thông tin của khách hàng sẽ bị mất hoàn toàn khi tài khoản bị xoá"
                                >
                                  <Button variant="contained" 
                                    color="error"
                                    onClick={() => {
                                      if (popoverId === row._id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row._id);
                                      }
                                    }}
                                  >
                                    <DeleteForeverIcon />
                                  </Button>
                                </CustomPopover>
                              </div>
                            ) : (
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
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {visibleUserDrawer && (
        <SwipeableTemporaryDrawer
          visible={visibleUserDrawer}
          initData={viewUserData}
          onClose={() => setVisibleUserDrawer(false)}
        />
      )}

      {visibleAddModal && (
        <AddManagerModal
          visible={visibleAddModal}
          onClose={() => setVisibleAddModal(false)}
          handleSubmit={(managerData) => handleCreateManager(managerData)}
        />
      )}
    </>
  );
}
