import Swal from 'sweetalert2';

// Success notification
export const showSuccess = (message, title = 'Berhasil') => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonColor: '#4F46E5',
  });
};

// Error notification
export const showError = (message, title = 'Error') => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonColor: '#EF4444',
  });
};

// Warning notification
export const showWarning = (message, title = 'Peringatan') => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    confirmButtonColor: '#F59E0B',
  });
};

// Info notification
export const showInfo = (message, title = 'Informasi') => {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonColor: '#3B82F6',
  });
};

// Confirmation dialog
export const showConfirm = (message, title = 'Konfirmasi') => {
  return Swal.fire({
    icon: 'question',
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: '#4F46E5',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  });
};

// Toast notification (small, non-intrusive)
export const showToast = (message, type = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: false,
  });

  return Toast.fire({
    icon: type,
    title: message,
  });
};
