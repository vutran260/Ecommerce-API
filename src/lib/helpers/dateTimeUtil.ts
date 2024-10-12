import moment from 'moment';

const formatDateTimeJp = (date: string | Date | undefined) => {
  if (date) {
    return moment(date).format('YYYY年M月D日 HH:mm');
  }
  return '-';
};

const formatDate = (date: string) => {
  return moment(date).format('YYYY/MM/DD');
};

const formatDateJp = (date: string | Date | undefined) => {
  if (date) {
    return moment(date).format('YYYY年MM月DD日');
  }
  return '-';
};

export { formatDateTimeJp, formatDate, formatDateJp };
