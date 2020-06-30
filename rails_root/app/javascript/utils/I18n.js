export default class I18n {
  static defaultLocale = 'ru'

  static get locale() {
    if (this._locale == null) {
      this._locale = this.defaultLocale
    }
    return this._locale
  }
  static set locale(value) {
    if (value !== this._locale) {
      this._locale = value
    }
    return this._locale
  }

  static get translations() {
    return this._translations
  }
  static set translations(value) {
    this._translations = value
    return this._translations
  }

  static t(label, ...args) {
    const label_ = label
    const translations = this.translations
    return this._fetch(translations, label_, args) || (() => {
      throw `missed translation constant \`${label}\``
    })()
  }

  static _fetch(translations, label, args, with_fallback = true) {
    const fallback = (this.locale === 'ru') ? 'en' : 'ru'
    if (label in (translations[this.locale] || {})) {
      return this.format((translations[this.locale] || {})[label], args)
    } else if (with_fallback && label in (translations[fallback] || {})) {
      return this.format(`${fallback}: ` + (translations[fallback] || {})[label], args)
    }
  }

  // Преобразовывыет строку, заменяя $num на соответствующее число из массива args,
  // и заменяя %num{word1}{word2}{word3} в соответствии с правилами языка для числа с номером num из массива args
  // en-fr word1-единственное число, word2-множественное число
  // ru word1 - 1,21,31..., word2 - 2,3,4,22..., word3 - 5,6,7,11...
  // Пример использования:
  // str = "$1 %1{мальчик съел}{мальчика съели}{мальчиков съели} $2 %2{апельсин}{апельсина}{апельсинов}
  // args = [1, 1], result = 1 мальчик съел 1 апельсин
  // args = [1, 5], result = 1 мальчик съел 5 апельсинов
  // args = [5, 1], result = 5 мальчиков съели 1 апельсин
  // args = [5, 1], result = 5 мальчиков съели 1 апельсин
  // args = [3, 3], result = 3 мальчика съели 3 апельсина
  //
  // Для правильной работы необходимо проследить, что аргументы имеют тип "number", а не "string". То есть, например, [1, 1], а не ["1", "1"]
  static format(string, args) {
    let str = string.replace(/\$(\d+)/g, (match, number) => {
      const count = args[number - 1]
      if (count == null) {
        return match
      }
      return args[number - 1]
    })
    str = str.replace(/%(\d+)(({.*?})+)/g, (match, number, braces) => {
      const count = args[number - 1]
      if (!(count != null && typeof(count) === 'number' && Math.floor(count) === count)) {
        return match
      }
      const arr = braces.slice(1, -1).split('}{')
      return this.pluralize(count, arr)
    })
    return str
  }

  // использовать именованные константы
  static format2(string, args) {
    string.replace(/%(.*?)%/g, (match, key) => {
      const value = args[key]
      return (typeof value === 'object' && (() => {
        try {
          return JSON.stringify(value)
        } catch (error) { /* nothing */ }
      })()) || value
    })
  }


  /*
   Pluralizing word with number
   * number Integer number
   * words Array of all word forms for this language
   */
  static pluralize(number, words) {
    switch (this.locale) {
    case 'en': {
      if (words.length < 2) throw new Error('wrong number of words for ' + this.locale + ' locale.')
      if (number === 1) {
        return words[0]
      }
      return words[1]
    }
    case 'ru': {
      if (words.length < 3) throw new Error('wrong number of words for ' + this.locale + ' locale')
      const number_100 = number % 100
      const number_10 = number % 10
      if (11 <= number_100 && number_100 <= 14 || 5 <= number_10 && number_10 <= 9 || number_10 === 0) {
        return words[2]
      }
      if (number_10 === 1) {
        return words[0]
      }
      return words[1]
    }
    default:
      throw new Error('unknown locale ' + this.locale)
    }
  }
}
