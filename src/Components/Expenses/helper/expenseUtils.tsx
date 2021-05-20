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

const dayFormatter = new Intl.DateTimeFormat('de', {
    day: 'numeric',
    weekday: 'long',
    month: 'short',
})
const getFormattedDateString = (date: Date) => {
    return dayFormatter.format(date)
}

const monthFormatter = new Intl.DateTimeFormat('de', { month: 'long', year: 'numeric' })
const getMonthStringByDate = (date: Date) => {
    return monthFormatter.format(date)
}

const expenseUtils = { getIconByExpenseCategory, getMonthStringByDate, getFormattedDateString }
export default expenseUtils
