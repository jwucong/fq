// components/input/input.js
Component({
  /**
   * 组件的配置
   */
  options: {
    multipleSlots: true
  },
  
  externalClasses: ['iconfont', 'icon-close'],
  
  /**
   * 组件的属性列表
   */
  properties: {
    model: {
      type: String,
      value: '',
      get() {
        return this.val
      },
      set(val) {
        this.setData({val})
      }
    },
    value: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'text'
    },
    password: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: ''
    },
    placeholderStyle: {
      type: String,
      value: ''
    },
    placeholderClass: {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: false
    },
    maxlength: {
      type: Number,
      value: 140
    },
    cursorSpacing: {
      type: [Number, String],
      value: 0
    },
    focus: {
      type: Boolean,
      value: false
    },
    confirmType: {
      type: String,
      value: 'done'
    },
    confirmHold: {
      type: Boolean,
      value: false
    },
    cursor: {
      type: Number,
      value: void 0
    },
    selectionStart: {
      type: Number,
      value: -1
    },
    selectionEnd: {
      type: Number,
      value: -1
    },
    adjustPosition: {
      type: Boolean,
      value: true
    },
    clearable: {
      type: Boolean,
      value: false
    },
    customClass: {
      type: String,
      value: ''
    },
    iconClass: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    val: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleInput(event) {
      console.log('handleInput: %o', event)
      this.emit('input', event.detail, event.options)
    },
  
    handleFocus(event) {
      console.log('handleFocus: %o', event)
      this.emit('focus', event.detail, event.options)
    },
  
    handleBlur(event) {
      console.log('handleBlur: %o', event)
      this.emit('blur', event.detail, event.options)
    },
  
    handleConfirm(event) {
      console.log('handleConfirm: %o', event)
      this.emit('confirm', event.detail, event.options)
    },
  
    watchModel(newVal, oldVal, changedPath) {
    
    },
    
    emit() {
      this.triggerEvent.apply(this, arguments)
    }
    
  }
})
