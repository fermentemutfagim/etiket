function $id(id) {
  return document.getElementById(id)
}

var App = {

  state: {
    count: 0,
    width: 0,
    font: '',
    style: '',
    weight: '',
    texts: []
  },

  labelTemplate(texts) {
    var { width } = this.state
    var labelStyle = `
      width: ${width}%;
    `

    var activeTexts = texts.filter(text => text.isActive)

    return `
      <div class="label-container" style="${labelStyle}">
        ${ activeTexts.reduce((prev, text) => prev + `
          <p style="font-size: ${text.size}px" class="label-text">
            ${text.value}
          </p>
        `, '') }
      </div>
    `
  },

  renderLabelList() {
    var outputStyle = `;
      font-family: ${this.state.font};
      font-style: ${this.state.style};
      font-weight: ${+this.state.weight}
    `
      console.log(outputStyle)

    var outputHTML = ''
    var i = 0
    while (i++ < +this.state.count) {
      outputHTML += this.labelTemplate(this.state.texts)
    }
    this.target.innerHTML = outputHTML

    this.target.style.cssText = outputStyle
  },

  handleChange(prop) {
    return event => {
      this.state[prop] = event.target.value
      this.renderLabelList()
    }
  },

  toggleText(textIndex) {
    var text = this.state.texts[textIndex]
    text.isActive = !text.isActive
    this.renderLabelList()

    var container = this.$texts[textIndex]
    container.classList.toggle('disabled')

    var value = container.querySelector('input[type="text"]')
    var size = container.querySelector('input[type="number"]')
    value.disabled = !text.isActive
    size.disabled = !text.isActive
  },

  handleTextChange(textIndex) {
    return event => {
      this.state.texts[textIndex].value = event.target.value
      this.renderLabelList()
    }
  },

  handleTextSizeChange(textIndex) {
    return event => {
      this.state.texts[textIndex].size = event.target.value
      this.renderLabelList()
    }
  },

  init() {
    this.target = $id('label-list')

    var count = $id('count').querySelector('input')
    count.addEventListener('input', this.handleChange.call(this, 'count'))

    var width = $id('width').querySelector('input')
    width.addEventListener('input', this.handleChange.call(this, 'width'))

    var font = $id('font').querySelector('select')
    font.addEventListener('input', this.handleChange.call(this, 'font'))

    var style = $id('style').querySelector('select')
    style.addEventListener('input', this.handleChange.call(this, 'style'))

    var weight = $id('weight').querySelector('select')
    weight.addEventListener('input', this.handleChange.call(this, 'weight'))

    Object.assign(this.state, {
      count: count.value,
      width: width.value,
      font: font.value,
      style: style.value,
      weight: weight.value
    })

    this.$texts = Array.from(document.querySelectorAll('[id^="text"]'))
    this.$texts.forEach((text, index) => {
      var check = text.querySelector('input[type="checkbox"]')
      check.addEventListener('change', this.toggleText.bind(this, index))

      var value = text.querySelector('input[type="text"]')
      value.addEventListener('input', this.handleTextChange.call(this, index))

      var size = text.querySelector('input[type="number"]')
      size.addEventListener('input', this.handleTextSizeChange.call(this, index))

      this.state.texts.push({
        value: value.value,
        size: size.value,
        isActive: !value.disabled
      })
    })

    this.renderLabelList()
  }
}

document.addEventListener('DOMContentLoaded', App.init.bind(App))
