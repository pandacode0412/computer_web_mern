import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function PaymentMethodModal(props) {
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const { visible, onClose, savePaymentMethod } = props;
  const [paymentMethod, setPaymentMethod] = React.useState('COD');

  return (
    <div>
      <Dialog
        open={visible}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>{'Bạn có chắc chắn muốn đặt đơn hàng này?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            Vui lòng lựa chọn phương thức thanh toán
            <FormControl>
              <RadioGroup
                aria-labelledby='demo-controlled-radio-buttons-group'
                name='controlled-radio-buttons-group'
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event?.target?.value)}
              >
                <FormControlLabel
                  value='COD'
                  control={<Radio />}
                  label='Thanh toán tận nơi'
                />
                <FormControlLabel
                  value='CARD'
                  control={<Radio />}
                  label='Thanh toán qua thẻ tín dụng'
                />
              </RadioGroup>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Huỷ</Button>
          <LoadingButton
            variant='contained'
            onClick={async () => {
              setCheckoutLoading(true);
              await savePaymentMethod(paymentMethod);
              setCheckoutLoading(false);
            }}
            loading={checkoutLoading}
          >
            Thanh toán
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
