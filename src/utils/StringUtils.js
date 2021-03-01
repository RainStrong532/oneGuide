import Device from '../modules/Device'

const MAX_LINE = 5

const fontText = {
  fontSize: 14,
  fontConstant: 1.9
}


const formatNewline = (string) => {

  if (!string) {
    return string
  }

  const newString = JSON.stringify(string.trim()).replace(/^\"/g, '').replace(/\"$/g, '')
  return newString
}


isLongTextPost = (text) => {
  const width = Device.screenSize().width - 20
  const info = {
    ...fontText,
    text,
    width
  }

  return this.isLongText(info)
}

isLongTextComment = (text) => {
  const width = Device.screenSize().width - 70
  const info = {
    ...fontText,
    text,
    width
  }

  return this.isLongText(info)
}

isLongTextCommentReply = (text) => {
  const width = Device.screenSize().width - 110
  const info = {
    ...fontText,
    text,
    width
  }

  return this.isLongText(info)
}

isLongText = (info) => {
  if (!info.text)
    return false
  const lines = info.text.split('\n');
  if (lines.length > MAX_LINE) {
    return true
  }

  let length = 0
  lines.forEach(element => {
    const { numberOfLines, overLine } = this.getNumberOfLines(element, info.fontSize, info.fontConstant, info.width)
    length += numberOfLines

    if (length > MAX_LINE ||
      overLine === true) {
      return true
    }

  });

  return (length > MAX_LINE)
}

getNumberOfLines = (text, fontSize, fontConstant, width) => {
  let cpl = Math.floor(width / (fontSize / fontConstant));
  const words = text.split(' ');
  const elements = [];
  let line = '';

  while (words.length > 0) {

    if (line.length + words[0].length + 1 <= cpl ||
      line.length === 0 &&
      words[0].length + 1 >= cpl) {

      let word = words.splice(0, 1);
      if (line.length === 0) {
        line = word;
      } else {
        line = line + ' ' + word;
      }
      if (words.length === 0) {
        elements.push(line);
      }
    }
    else {
      elements.push(line);
      line = ''
    }

    if (elements.length > MAX_LINE) {
      return { numberOfLines: elements.length, overLine: true }
    }
  }

  return { numberOfLines: elements.length, overLine: (elements.length > MAX_LINE) }
}

export default {
  formatNewline,
  isLongText,
  isLongTextPost,
  isLongTextComment,
  isLongTextCommentReply
}
