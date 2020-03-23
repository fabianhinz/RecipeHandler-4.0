import { Quantity } from '../model/model'

export const stopPropagationProps = {
    onClick: (event: any) => event.stopPropagation(),
    onFocus: (event: any) => event.stopPropagation(),
}

export const isSafari =
    /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)

export const displayedQuantity = (quantity: Quantity) => {
    switch (quantity.type) {
        case 'cakeForm': {
            switch (quantity.value) {
                case 1: {
                    return 'eine kleine Form'
                }
                case 2: {
                    return 'eine große Form'
                }
                case 3: {
                    return 'ein Blech'
                }
            }
            break
        }
        case 'muffins': {
            return `${quantity.value} Stück`
        }
        case 'persons': {
            return quantity.value === 1 ? '1 Person' : `${quantity.value} Personen`
        }
    }
}
