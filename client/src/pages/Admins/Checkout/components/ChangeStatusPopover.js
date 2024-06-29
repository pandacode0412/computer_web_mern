import React, { useEffect, useState } from "react";
import CustomPopover from "../../../../components/CustomPopover";

export default function ChangeStatusPopover(props) {
  const [selectStatus, setSelectStatus] = useState(-1)
  const { visible, onClose, handleSubmit, children, currentStatus } = props;

  useEffect(() => {
    setSelectStatus(currentStatus)
  }, [currentStatus])

  return (
    <CustomPopover
      open={visible}
      onClose={() => onClose()}
      handleSubmit={() => handleSubmit(selectStatus)}
      noti="Bạn có chắc chắn muốn đổi trạng thái đơn hàng?"
      width='320px'
      content={
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: '10px'
          }}
        >
          {[{label: "Đã huỷ", value: 0}, {label: "Đã đặt hàng", value: 1}, {label: "Đang vận chuyển", value: 2}, {label: "Đã giao hàng", value: 3}].map(
            (statusItem) => {
              return (
                <div style={{ padding: "2px 6px", border: "1px solid gray", fontSize: '9px', marginRight: '5px', cursor: 'pointer', background: selectStatus === statusItem?.value ? '#c9c4c3': '' }}
                  onClick={()=> {
                    setSelectStatus(statusItem?.value)
                  }}
                >
                  {statusItem?.label}
                </div>
              );
            }
          )}
        </div>
      }
    >
      {children}
    </CustomPopover>
  );
}
