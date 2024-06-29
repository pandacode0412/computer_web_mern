import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function CheckoutCardConfirmModal(props) {
  const [paymentLoading, setPaymentLoading] = React.useState(false)
  const { visible, onClose, handleActive } = props;
  const userData = useSelector((state) => state.user.userData);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setPaymentLoading(true)

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        email: userData?.ctm_email,
        phone: userData?.ctm_phone,
        name: userData?.ctm_usr,
      },
    });

    if (!error) {
      const { id } = paymentMethod;
      try {
        await handleActive(id);
      } catch (error) {
        console.log('errorrrrrr >>>>> ', error);
      }
    }
    setPaymentLoading(false);
  };

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
            Để đặt hàng vui lòng điền thông tin thanh toán phía dưới nhé
            <div style={{ marginTop: '20px' }}>
              <form onSubmit={handleSubmit}>
                <CardElement id='card-element' />
                <Stack
                  flexDirection={'row'}
                  alignItems='center'
                  justifyContent={'center'}
                >
                  <LoadingButton
                    type='submit'
                    sx={{
                      color: 'white !important',
                      marginTop: '80px !important',
                    }}
                    disabled={!stripe || !elements || paymentLoading}
                    loading={paymentLoading}
                    variant='contained'
                  >
                    Thanh toán
                  </LoadingButton>
                </Stack>
              </form>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Huỷ</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
