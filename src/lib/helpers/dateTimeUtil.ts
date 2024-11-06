import moment from 'moment-timezone';

const formatDateTimeJp = (
  date: string | Date | undefined,
  timezone = 'Asia/Tokyo',
) => {
  if (date) {
    return moment(date).tz(timezone).format('YYYY年M月D日 HH:mm');
  }
  return '-';
};

const formatDate = (date: string, timezone = 'Asia/Tokyo') => {
  return moment(date).tz(timezone).format('YYYY/MM/DD');
};

const formatDateJp = (
  date: string | Date | undefined,
  timezone = 'Asia/Tokyo',
) => {
  if (date) {
    return moment(date).tz(timezone).format('YYYY年MM月DD日');
  }
  return '-';
};

export { formatDateTimeJp, formatDate, formatDateJp };
