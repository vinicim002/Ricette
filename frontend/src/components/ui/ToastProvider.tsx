import { ToastContainer } from 'react-toastify'

export function ToastProvider() {
  return (
    <ToastContainer
      theme="dark"
      position="top-right"
      autoClose={4000}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      limit={4}
      toastClassName="ricette-toast"
      progressClassName="ricette-toast-progress"
    />
  )
}
