import { Store } from 'react-notifications-component';
import { useContext } from 'react';
import useErrorHandler, { extractApiErrorMessage } from './useErrorHandler';
import AuthContext from '../contexts/authContext';

const useToasterNotification = () => {
  const { setLogOut } = useContext(AuthContext);

  const { handleError } = useErrorHandler();

  const showNotification = (
    title: string | JSX.Element,
    message: string | JSX.Element,
    type: 'default' | 'success' | 'danger' | 'info' | 'warning' = 'default'
  ) => {
    Store.addNotification({
      title,
      message,
      type,
      insert: 'top',
      container: 'top-right',
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 2000,
        pauseOnHover: true,
        onScreen: true,
        showIcon: true,
        waitForAnimation: true,
      },
    });
  };

  const showErrorNotification = (message: any| JSX.Element) => {
    const status = message?.response?.status;
    const apiMessage =
      typeof message === 'string' ? message : extractApiErrorMessage(message);

    if (status === 401) {
      setLogOut();
      return;
    }

    // 403 with a business message (e.g. PERMISSION_DENIED) — show toast, do not log out
    if (status === 403 && apiMessage) {
      showNotification('Error', apiMessage, 'danger');
      return;
    }

    if (status === 403) {
      setLogOut();
      return;
    }

    showNotification('Error', apiMessage || handleError(message), 'danger');
  };

  const showSuccessNotification = (message: string | JSX.Element) => {
    showNotification('Success', message, 'success');
  };

  return {
    showNotification,
    showErrorNotification,
    showSuccessNotification,
  };
};

export default useToasterNotification;
