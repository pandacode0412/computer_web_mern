import { useEffect } from 'react';
import MainRouter from './routers';
import { ToastContainer } from 'react-toastify';
import UserAPI from './API/UserAPI';
import { useDispatch } from 'react-redux';
import { setUserData } from './slice/userSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const userId = window.sessionStorage.getItem('user_id');
      if (userId) {
        const userRes = await UserAPI.getUserInfo(userId);
        if (userRes?.data?.payload) {
          const { payload } = userRes?.data;
          const newData = {
            ctm_rl: payload?.role,
            ctm_id: payload?._id,
            ctm_usr: payload?.email,
            ctm_name: payload?.name,
            ctm_phone: payload?.phone_number,
          };
          dispatch(setUserData(newData));
        }
      }
    })();
  }, []);
  return (
    <div>
      <MainRouter />
      <ToastContainer />
    </div>
  );
}

export default App;
