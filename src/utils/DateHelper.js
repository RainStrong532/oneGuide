import { i18next } from '../utils'
import Helper from '../utils/Helper'
import moment from 'moment';

const now = new Date();
const currentMonth = new Date().getMonth()
const currentYear = now.getFullYear()
const currentDay = now.getDate()


const timeSince = (timeStamp) => {

  if (!timeStamp) {
    return ''
  }

  const currentTimestamp = Math.round(new Date().getTime() / 1000)
  const diff = currentTimestamp - timeStamp

  const minutes = Math.round(diff / 60)
  if (minutes < 1) {
    return i18next.t('justnow')
  }

  if (minutes < 60) {
    return minutes + ' ' + i18next.t('minutes')
  }

  const hours = Math.round(diff / (60 * 60))
  if (hours === 1) {
    return i18next.t('AHours')
  }

  if (hours < 24) {
    return hours + ' ' + i18next.t('hours')
  }

  if (hours < 48) {
    return i18next.t('Yesterday')
  }

  const days = Math.round(diff / (60 * 60 * 24))
  if (days === 1) {
    return i18next.t('ADay')
  }
  return days + ' ' + i18next.t('day')
}

const convertTimeToFomart = (timeStamp) => {

  if (!timeStamp) {
    return '--/--/--'
  }

  var date = new Date(0)
  date.setUTCSeconds(timeStamp);

  let time = date.toDateString();
  time = time.split(' ');
  time[0] = i18next.t(time[0]);
  time[1] = i18next.t(time[1]);

  return time.join(' ');
}

const formatDateStringDefault = ({ year, month, day }) => {
  const newYear = year || 0
  const newMonth = Helper.formatNumberString(month || 0, '0')
  const newDay = Helper.formatNumberString(day || 0, '0')

  return `${newYear}/${newMonth}/${newDay}`
}


const convertStringDateToString = (dateString, format, toFormat) => {

  let momentObj = moment(dateString, format || 'DD-MM-YYYY HH:mm')

  return momentObj.format(toFormat || 'YYYY/MM/DD')
}

const convertDateToString = (date) => {
  const month = date.getMonth() || 0
  const year = date.getFullYear() || 0
  const day = date.getDate() || 0

  return formatDateStringDefault({ year, month, day })
}


const isPast = ({ year, month, day }) => {
  const currentDayString = formatDateStringDefault({ year: currentYear, month: currentMonth + 1, day: currentDay })
  const dayString = formatDateStringDefault({ year, month, day })


  return dayString < currentDayString
}

const date1GreaterDate2 = (date1, date2) => {
  const date1String = formatDateStringDefault(date1)
  const date2String = formatDateStringDefault(date2)
  return date1String > date2String
}

const date1EqualDate2 = (date1, date2) => {
  const date1String = formatDateStringDefault(date1)
  const date2String = formatDateStringDefault(date2)

  return date1String === date2String
}

const date1GreaterOrEqualDate2 = (date1, date2) => {
  const date1String = formatDateStringDefault(date1)
  const date2String = formatDateStringDefault(date2)

  return date1String >= date2String
}

const currentDate = () => {

  return { year: currentYear, month: currentMonth, day: currentDay }
}


const previousDate = (date) => {

  const dateString = formatDateStringDefault({ ...date, month: date.month + 1 })

  const preDate = moment(dateString, 'YYYY-MM-DD').subtract(1, 'days')

  const month = preDate.month() || 0
  const year = preDate.year() || 0
  const day = preDate.date() || 0
  return { year, month, day }
}


const convertStringDateToObject = (dateString, format) => {

  let momentObj = moment(dateString, format || 'DD-MM-YYYY HH:mm')

  const month = momentObj.month() || 0
  const year = momentObj.year() || 0
  const day = momentObj.date() || 0

  return { year, month, day }
}


const convertStringToDate = (dateString, format) => {
  if (!dateString) {
    return null
  }
  let momentObj = moment(dateString, format || 'DD-MM-YYYY HH:mm')

  return momentObj.toDate()
}


const date1DiffDayDate2 = (date1, date2) => {
  const d1 = convertStringToDate(date1)
  const d2 = convertStringToDate(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
}


export default {
  timeSince,
  convertTimeToFomart,
  formatDateStringDefault,
  convertStringDateToString,
  convertDateToString,
  isPast,
  currentDate,
  date1GreaterDate2,
  date1GreaterOrEqualDate2,
  date1EqualDate2,
  previousDate,
  convertStringDateToObject,
  convertStringToDate,
  date1DiffDayDate2
}
