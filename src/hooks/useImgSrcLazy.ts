import { useEffect, useState } from 'react'

interface Options {
    src: string | undefined
    skipOnUndefined?: boolean
}

const useImgSrcLazy = ({ src, skipOnUndefined }: Options) => {
    const [imgLoading, setImgLoading] = useState(true)
    const [imgSrc, setImgSrc] = useState<string | undefined>()

    useEffect(() => {
        setImgLoading(true)

        if (!src) {
            if (skipOnUndefined) setImgLoading(false)
            return
        }

        const img = new Image()

        img.onload = () => {
            setImgLoading(false)
            setImgSrc(img.src)
        }
        img.onerror = () => setImgLoading(false)

        img.src = src
    }, [skipOnUndefined, src])

    return {
        imgSrc,
        imgLoading,
    }
}

export default useImgSrcLazy
