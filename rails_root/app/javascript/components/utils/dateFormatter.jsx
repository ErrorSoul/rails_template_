const ruFormater = (dateVal) => {
  const date = Date.parse(dateVal);

  const formatDate = Intl.DateTimeFormat('ru-RU',{
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric' }).format(date);

  return formatDate;
}

export default ruFormater;
