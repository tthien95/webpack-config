import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toastActions, ToastState } from 'store/toast-slice';
import classes from './Toast.module.scss';

enum NotiStatus {
  success = '#5cb85c',
  error = '#d9534f',
}

const Toast = () => {
  const notification = useSelector((state: ToastState) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    if (notification) {
      const interval = setTimeout(() => {
        dispatch(toastActions.hideNotification());
      }, 3000);

      return () => {
        clearTimeout(interval);
      };
    }
    return undefined;
  }, [notification, dispatch]);

  if (!notification) {
    return null;
  }

  const { status, title, message } = notification;

  const content = (
    <div role="alert" className={classes['notification-container']}>
      <div
        className={`${classes.notification} ${classes.toast}`}
        style={{ backgroundColor: NotiStatus[status] }}
      >
        <button
          onClick={() => {
            dispatch(toastActions.hideNotification());
          }}
        >
          X
        </button>
        <div>
          <p className={classes['notification-title']}>{title}</p>
          <p className={classes['notification-message']}>{message}</p>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.getElementById('toastNoti')!);
};

export default Toast;
