examDateTimeConverter = (starttime, duration) => {
  formattedStartTime = moment(starttime).format('YYYY-MM-DD HH:mm')
  endtime = moment(starttime).add(duration, 'hours').format('HH:mm')
  return `${formattedStartTime} - ${endtime}`
}

base64ImageFixer = (content) => {
  try {
    if (content.split(',').length != 2) {
      return "data:image/jpeg;base64," + content
    } else {
      return content
    }
  } catch (err) {
    console.log(err)
  }

}

LanguageList = () => {
  return [
    {label: "英语", value:"英语"},
    {label: "俄语", value:"俄语"},
    {label: "法语", value:"法语"},
    {label: "德语", value:"德语"},
    {label: "日语", value:"日语"}
  ]
}
