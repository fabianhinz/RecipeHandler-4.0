import Commute from '@material-ui/icons/Commute'
import Fastfood from '@material-ui/icons/Fastfood'
import Weekend from '@material-ui/icons/Weekend'
import { CashMultiple } from 'mdi-material-ui'

const getIconByExpenseCategory = (category: string) => {
    switch (category) {
        case 'Lebensmittel':
            return <Fastfood fontSize="large" />
        case 'Mobilität':
            return <Commute fontSize="large" />
        case 'Inventar':
            return <Weekend fontSize="large" />
        case 'Sonstiges':
            return <CashMultiple fontSize="large" />
        default:
            return <CashMultiple fontSize="large" />
    }
}

const getMonthStringByDate = (date: Date) => {
    const month = date.getMonth() + 1
    return `${month < 10 ? '0' + month : month}/${date.getFullYear()}`
}

const expenseUtils = { getIconByExpenseCategory, getMonthStringByDate }
export default expenseUtils
