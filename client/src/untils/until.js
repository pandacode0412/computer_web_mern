import moment from 'moment';

export const dateTimeConverter = (dateTime) => {
  if (dateTime) {
    return moment(dateTime).format('DD-MM-YYYY');
  }
  return '';
};