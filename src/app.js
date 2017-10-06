var CKEDITOR = CKEDITOR || {}

function byID(id) {
  return document.getElementById(id)
}

var App = {

  containerWidth: 762,

  state: {
    count: 0,
    columnCount: 0,
    columnGap: 0,
    editorContent: ''
  },

  calculateWidth() {
    var { columnCount, columnGap } = this.state
    var base = this.containerWidth / columnCount
    var gap = ( columnGap * (columnCount - 1) ) / columnCount
    return base - gap
  },

  labelTemplate(content, index) {
    var { columnCount, columnGap, height } = this.state
    var width = this.calculateWidth()

    var activeRow = Math.floor(index / columnCount)
    var activeColumn = index % columnCount

    var labelStyle = `
      width: ${width}px;
      height: ${height}px;
      top: ${activeRow * height}px;
      left: ${(activeColumn * width) + (columnGap * activeColumn)}px;
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
      ;(function() {
        outputHTML += this.labelTemplate(this.state.editorContent, i - 1)
      }.bind(this))(i)
    }
    this.target.innerHTML = outputHTML
  },

  renderEditorContainer() {
    this.editorContainer.style.cssText += `
      height: ${this.state.height + 300}px;
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

    var columnCount = byID('column-count')
    columnCount.addEventListener('input', this.onChange.call(this, 'columnCount', 'number'))

    var columnGap = byID('column-gap')
    columnGap.addEventListener('input', this.onChange.call(this, 'columnGap', 'number'))

    var height = byID('label-height')
    height.addEventListener('input', this.onChange.call(this, 'height', 'number'))

    Object.assign(this.state, {
      count: +count.value,
      columnCount: +columnCount.value,
      columnGap: +columnGap.value,
      height: +height.value
    })

    this.render()
  }
}

document.addEventListener('DOMContentLoaded', App.init.bind(App))
