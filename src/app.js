var CKEDITOR = CKEDITOR || {}

function byID(id) {
  return document.getElementById(id)
}

var App = {

  state: {
    count: 0,
    width: 0,
    editorContent: ''
  },

  labelTemplate(content) {
    var { width, height } = this.state
    var labelStyle = `
      width: ${width}px;
      height: ${height}px;
    `

    return `
      <div class="label-container" style="${labelStyle}">
        ${content}
      </div>
    `
  },

  renderLabelList() {
    var outputHTML = ''
    var i = 0
    while (i++ < +this.state.count) {
      outputHTML += this.labelTemplate(this.state.editorContent)
    }
    this.target.innerHTML = outputHTML
  },

  renderEditorContainer() {
    this.editorContainer.style.cssText += `
      width: ${this.state.width}px;
      height: ${this.state.height + 400}px;
    `
  },

  render() {
    this.renderLabelList()
    this.renderEditorContainer()
  },

  onChange(what, type) {
    return event => {
      var _value = event.target.value
      var value
      if (type == 'number') {
        value = +_value
      }
      this.state[what] = value
      this.render()
    }
  },

  init() {
    this.target = byID('label-list')
    this.editorContainer = byID('editor-container')

    CKEDITOR.config.height = 'auto'
    CKEDITOR.config.width = 'auto'
    this.editor = CKEDITOR.replace('editor-content')

    this.editor.on('change', event => {
      this.state.editorContent = event.editor.getData()
      this.render()
    })

    var count = byID('label-count')
    count.addEventListener('input', this.onChange.call(this, 'count', 'number'))

    var width = byID('label-width')
    width.addEventListener('input', this.onChange.call(this, 'width', 'number'))

    var height = byID('label-height')
    height.addEventListener('input', this.onChange.call(this, 'height', 'number'))

    Object.assign(this.state, {
      count: +count.value,
      width: +width.value,
      height: +height.value
    })

    this.render()
  }
}

document.addEventListener('DOMContentLoaded', App.init.bind(App))
