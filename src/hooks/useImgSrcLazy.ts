import { useEffect, useState } from 'react'

interface Options {
    src: string
}

const useImgSrcLazy = ({ src }: Options) => {
    const [imgLoading, setImgLoading] = useState(true)
    const [imgSrc, setImgSrc] = useState<string | undefined>()

    useEffect(() => {
        const img = new Image()

        img.onload = () => {
            setImgLoading(false)
            setImgSrc(img.src)
        }
        img.onerror = () => setImgLoading(false)

        img.src = src
    }, [src])

    return {
        imgSrc,
        imgLoading,
    }
}

export default useImgSrcLazy
