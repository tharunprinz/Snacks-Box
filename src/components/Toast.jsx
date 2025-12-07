import { Toaster, toast } from 'react-hot-toast';

export const showToast = (message, type = 'success') => {
  switch (type) {
    case 'success':
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '500',
        },
      });
      break;
    case 'error':
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '500',
        },
      });
      break;
    case 'info':
      toast(message, {
        duration: 3000,
        position: 'top-right',
        icon: 'ℹ️',
        style: {
          background: '#3b82f6',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '500',
        },
      });
      break;
    default:
      toast(message, {
        duration: 3000,
        position: 'top-right',
      });
  }
};

export const ToastContainer = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 3000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default ToastContainer;

