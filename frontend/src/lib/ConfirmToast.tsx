import { toast } from 'react-toastify'

interface ConfirmToastContentProps {
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmToastContent({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmToastContentProps) {
  return (
    <div className="ricette-toast-confirm">
      <p className="ricette-toast-confirm__title">{title}</p>
      <p className="ricette-toast-confirm__message">{message}</p>
      <div className="ricette-toast-confirm__actions">
        <button
          type="button"
          className="ricette-toast-confirm__btn ricette-toast-confirm__btn--ghost"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="ricette-toast-confirm__btn ricette-toast-confirm__btn--danger"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}

export interface ToastConfirmOptions {
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

/** Toast de confirmação. Resolve `true` se confirmar, `false` se cancelar ou fechar. */
export function toastConfirm({
  title = 'Confirmar exclusão',
  message,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
}: ToastConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false
    const settle = (value: boolean) => {
      if (settled) return
      settled = true
      resolve(value)
    }

    toast(
      ({ closeToast }) => (
        <ConfirmToastContent
          title={title}
          message={message}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
          onConfirm={() => {
            settle(true)
            closeToast()
          }}
          onCancel={() => {
            settle(false)
            closeToast()
          }}
        />
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: true,
        hideProgressBar: true,
        className: 'ricette-toast ricette-toast--confirm',
        onClose: () => settle(false),
      },
    )
  })
}
