import {
  Toaster as ReactHotToaster,
  toast as hotToast,
  type Renderable,
  type ToastOptions,
  type ToasterProps,
} from "react-hot-toast"

type AppToastOptions = ToastOptions & {
  description?: Renderable
}

function renderMessage(title: Renderable, description?: Renderable) {
  if (!description) return title

  return (
    <div className=" w-full">
      <div className="font-semibold">{title}</div>
      <div className="mt-0.5 text-sm opacity-70">{description}</div>
    </div>
  )
}

function getToastParts(options?: AppToastOptions) {
  const { description, ...toastOptions } = options ?? {}

  return { description, toastOptions }
}

export const toast = {
  success(title: Renderable, options?: AppToastOptions) {
    const { description, toastOptions } = getToastParts(options)
    return hotToast.success(renderMessage(title, description), toastOptions)
  },
  error(title: Renderable, options?: AppToastOptions) {
    const { description, toastOptions } = getToastParts(options)
    return hotToast.error(renderMessage(title, description), toastOptions)
  },
  info(title: Renderable, options?: AppToastOptions) {
    const { description, toastOptions } = getToastParts(options)
    return hotToast(renderMessage(title, description), {
      ...toastOptions,
      icon: "ℹ️",
    })
  },
}

export function Toaster(props: ToasterProps) {
  return (
    <ReactHotToaster
      position="top-center"
      toastOptions={{ duration: 4000 }}
      {...props}
    />
  )
}
