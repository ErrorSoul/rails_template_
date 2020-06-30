const Formater = (dateVal) => {
  const date = Date.parse(dateVal);

  const formatDate = Intl.DateTimeFormat('ru-RU',{
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    }).format(date);

  return formatDate;
}

export default Formater;
