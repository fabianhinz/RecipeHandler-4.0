import { useEffect, useRef, useState } from 'react'
interface Options {
  src: string | undefined
  skipOnUndefined?: boolean
}

const useImgSrcLazy = ({ src, skipOnUndefined }: Options) => {
  const [imgLoading, setImgLoading] = useState(true)
  const [imgSrc, setImgSrc] = useState<string | undefined>()
  const imgRef = useRef(new Image())

  useEffect(() => {
    setImgLoading(true)

    if (!src) {
      if (skipOnUndefined) setImgLoading(false)
      return
    }

    imgRef.current.onload = () => {
      setImgLoading(false)
      setImgSrc(imgRef.current.src)
    }
    imgRef.current.onerror = () => setImgLoading(false)

    imgRef.current.src = src
  }, [skipOnUndefined, src])

  return {
    imgSrc,
    imgLoading,
    imgRef: imgLoading || !imgSrc ? null : imgRef.current,
  }
}

export default useImgSrcLazy
