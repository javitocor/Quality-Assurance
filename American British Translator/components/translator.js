const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

let translationList = []
Object.keys(americanOnly).forEach((key) => {
  translationList.push([
    key, americanOnly[key]
  ])
})
Object.keys(americanToBritishSpelling).forEach((key) => {
  translationList.push([
    key,
    americanToBritishSpelling[key]
  ])
})
Object.keys(americanToBritishTitles).forEach((key) => {
  translationList.push([
    key,
    americanToBritishTitles[key]
  ])
})
Object.keys(britishOnly).forEach((key) => {
  translationList.push([
    britishOnly[key],
    key
  ])
})

class Translator {
  translate(value, mode) {
    if (value === '') { return { error: 'No text to translate' } }
    if (!value || !mode) { return { error: 'Required field(s) missing' } }
    if(mode != 'american-to-british' && mode != 'british-to-american') {return { error: 'Invalid value for locale field' }}
    let value1 = value;
    if (mode === 'american-to-british') {
      translationList.forEach((term) => {
        value1 = value1.replace(term[0], `<span class="highlight">${term[1]}</span>`)
      })
    } else {
      translationList.forEach((term) => {
        value1 = value1.replace(term[1], `<span class="highlight">${term[0]}</span>`)
      })
    }
    let timeRegex = /(([0-9]|0[0-9]|1[0-9]|2[0-3])(:|\.)([0-5][0-9]))/g

    let times = value1.match(timeRegex)
    if (times) {
      times.forEach((time) => {
        if (mode === 'american-to-british') {
          value1 = value1.replace(time, time.replace(':', '.'))
        } else {
          value1 = value1.replace(time, time.replace('.', ':'))
        }
      })
    }
    if(value === value1){
      return {text: value, translation:"Everything looks good to me!"}
    } else {
      return {text: value, translation: value1}
    }
  }
}

module.exports = Translator;