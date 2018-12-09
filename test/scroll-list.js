;(function(window, document, undefined) {
  
  var LIST_ITEM_TEMPLATE = [
    '<li class="list-item">',
    '<img class="list-item-img" src="{{imgSrc}}">',
    '<h3 class="list-item-title">{{name}}</h3>',
    '</li>'
  ].join('')
  
  function SwipeList(options) {
    var defaults = {
      el: '.list',
      data: [],
      listItemTemplate: LIST_ITEM_TEMPLATE
    }
    this.name = 'swipeList';
    this.version = '1.0.0';
    this.options = this.extend(defaults, options);
    var el = this.options.el;
    this.listContainer = this.isNode(el) ? el : document.querySelector(el);
    this.listSize = 0;
    this.timer = null;
    this.init();
  }
  
  SwipeList.prototype.init = function() {
    var that = this
    var container = this.listContainer
    var template = this.options.listItemTemplate.trim()
    var data = this.options.data
    container.innerHTML = _createList(template, data)
    var listWidth = container.clientWidth;
    var itemWidth = container.firstElementChild.offsetWidth;
    this.listSize = Math.floor(listWidth / itemWidth)
    var size = this.listSize
    console.log(size)
    var n = data.length
    if(n >= size) {
      var copyData = data.slice(0, size + 1);
      console.log(copyData)
      container.innerHTML = container.innerHTML + _createList(template, copyData)
      _css(container, 'width', container.firstElementChild.offsetWidth * (n + size + 1) + 'px')
    }
    var sx = 0
    var mx = 0;
    var moveEndX = 0
    var emx = document.getElementById('mx')
    var esx = document.getElementById('sx')
    var dir = document.getElementById('dir')
    var dt = document.getElementById('dt')
    var nv = document.getElementById('v')
    var touchStartX = 0;
    container.addEventListener('touchstart', function (e) {
      window.cancelAnimationFrame(that.timer)
      touchStartX = e.touches[0].pageX;
    })
    container.addEventListener('touchmove', function (e) {
      var translateX = _getTranslateX(this)
      console.log(translateX)
      console.log(-n * itemWidth)
      if(translateX >= 30 || translateX <= -n * itemWidth) {
        return
      }
      var pageX = e.touches[0].pageX;
      var moveX = pageX - touchStartX;
      touchStartX = pageX;
      if(moveX > 0) {
        translateX += Math.abs(moveX)
      }else {
        translateX -= Math.abs(moveX)
      }
      var matrix = 'matrix(1, 0, 0, 1, ' + translateX + ', 0)'
      _css(container, 'transform', matrix)
    })
    container.addEventListener('touchend', function () {
      mx = 0
      sx = 0
      dir.innerText = ''
      emx.innerText = 0
      esx.innerText = 0
      dt.innerText = 0
      console.log(_getTranslateX(this))
      if(_getTranslateX(container) > 0) {
        // _css(container, {
        //   animation: 'transform 3s',
        //   transform: 'matrix(1, 0, 0, 1, 0, 0)'
        // })
        _css(this, 'animation', 'transform 3s')
        _css(this, 'transform', 'matrix(1, 0, 0, 1, 0, 0)')
        setTimeout(function() {
          _css(container, 'animation', 'none')
          // that.move()
        }, 3000)
        
      }else {
        that.start()
      }
    })
    this.start()
  }
  
  SwipeList.prototype.is = _is
  
  SwipeList.prototype.isNode = function(value) {
    return /^HTML(\w+)Element$/.test(this.is(value))
  }
  
  SwipeList.prototype.extend = function() {
    var that = this
    var args = [].slice.call(arguments)
    var target = {}
    args.forEach(function(item) {
      if(!that.is(item, 'Object')) {
        return
      }
      for (var key in item) {
        if (item.hasOwnProperty(key)) {
          var value = item[key]
          if(target[key] !== value) {
            target[key] = value
          }
        }
      }
    })
    return target
  }
 
  SwipeList.prototype.start = function () {
    this.move();
  }
  
  SwipeList.prototype.stop = function () {
    window.cancelAnimationFrame(this.timer);
  }
  
  SwipeList.prototype.move = function(direction) {
    var that = this
    var dir = direction === 'right' ? direction : 'left'
    var box = this.listContainer
    var w = box.firstElementChild.offsetWidth
    var n = this.options.data.length
    var size = this.listSize
    var e = (n) * w
    console.log('n: %o', n)
    console.log('size: %o', size)
    console.log('e: %o', e)
    console.log('transform: %o',  _css(box, 'transform'))
    console.log('transform: %o',  _getTranslateX(box))
    // transform: "matrix(1, 0, 0, 1, 0, 0)"
    function m() {
      var x = _getTranslateX(box)
      var value = Math.abs(x) >= e ? 0 : x - 0.25
      var matrix = 'matrix(1, 0, 0, 1, ' + value + ', 0)'
      _css(box, 'transform', matrix)
      that.timer = window.requestAnimationFrame(m);
    }
    if(_css(box, 'position') !== 'relative') {
      _css(box, 'position', 'relative')
    }
    if (dir === 'left') {
      // TODO 运动抖动，试着用transform替换看看
      // this.timer = setInterval(function() {
      //   var left = parseFloat(_css(box, 'left'))
      //   var value = Math.abs(left) >= e ? 0 : --left
      //   _css(box, 'left', value + 'px')
      // }, 80)
      // this.timer = setInterval(function() {
      //   var x = _getTranslateX(box)
      //   var value = Math.abs(x) >= e ? 0 : --x
      //   var matrix = 'matrix(1, 0, 0, 1, ' + value + ', 0)'
      //   _css(box, 'transform', matrix)
      // }, 80)
      m()
    }
  }

  function _is(value, type) {
    var className = {}.toString.call(value).replace(/^\[object\s(\w+)\]$/, '$1')
    return type ? className.toLowerCase() === type.toLowerCase() : className
  }
  
  function _createList(template, data) {
    return data.map(function(item) {
      return _replace(template, item);
    }).join('');
  }
  
  function _replace(str, data) {
    for (var key in data) {
      if(data.hasOwnProperty(key)) {
        var reg = new RegExp('{{' + key + '}}', 'g')
        str = str.replace(reg, data[key])
      }
    }
    return str
  }
  
  function _getListSize(container) {
  
  }
  
  function _css(el, attr, value) {
    if(_is(attr, 'Object')) {
      for (var key in attr) {
        if(attr.hasOwnProperty(key)) {
          el.style[key] = attr[key]
        }
      }
      return
    }
    if(arguments.length > 2) {
      el.style[attr] = value
      return
    }
    var css = window.getComputedStyle || document.defaultView.getComputedStyle
    var style = css(el, null)
    return style[attr]
  }
  
  function _getTranslateX(container) {
    var matrix = _css(container, 'transform')
    var reg = /matrix|\(|\)/g
    var x = matrix.replace(reg, '').split(',')[4]
    return parseFloat(x)
  }
  
  window.SwipeList = SwipeList
  
})(window, document, void 0);
