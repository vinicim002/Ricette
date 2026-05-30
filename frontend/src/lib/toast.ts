import { toast, type ToastOptions } from 'react-toastify'
import { ApiError } from '../services/api'

export { toastConfirm } from './ConfirmToast'
export type { ToastConfirmOptions } from './ConfirmToast'

const baseOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
}

export function toastSuccess(message: string, options?: ToastOptions) {
  toast.success(message, { ...baseOptions, ...options })
}

export function toastError(message: string, options?: ToastOptions) {
  toast.error(message, { ...baseOptions, ...options })
}

export function toastInfo(message: string, options?: ToastOptions) {
  toast.info(message, { ...baseOptions, ...options })
}

export function toastFromError(error: unknown, fallback = 'Algo deu errado. Tente novamente.') {
  if (error instanceof ApiError) {
    toastError(error.message)
    return
  }
  if (error instanceof Error && error.message) {
    toastError(error.message)
    return
  }
  toastError(fallback)
}
