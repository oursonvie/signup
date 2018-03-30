examDateTimeConverter = (starttime, duration) => {
  formattedStartTime = moment(starttime).format('YYYY-MM-DD HH:mm')
  endtime = moment(starttime).add(duration, 'hours').format('HH:mm')
  return `${formattedStartTime} - ${endtime}`
}

base64ImageFixer = (content) => {
  if (content.split(',').length != 2) {
    return "data:image/jpeg;base64," + content
  } else {
    return content
  }
}
