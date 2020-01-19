export const stopPropagationProps = {
    onClick: (event: any) => event.stopPropagation(),
    onFocus: (event: any) => event.stopPropagation(),
}

export const isSafari =
    /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)
