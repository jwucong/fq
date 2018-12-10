
;(function (window, document, undefined) {

  var LIST_ITEM_TEMPLATE = [
    '<li class="ease-item">',
    '<img class="ease-item-avatar" src="{{avatar}}">',
    '<h3 class="ease-item-name">{{name}}</h3>',
    '</li>'
  ].join('')

  var Ease = function(options) {
    var defaults = {
      el: '.ease',
      data: [],
      count: 6,
      itemTemplate: '',
      itemSpace: 10,
      replaceMarkers: ['{{', '}}'],
      maxOffsetLeft: 50,
      maxOffsetRight: 50,
      easeDuration: 500,
    }
    this.options = _extend(defaults, options);
    this.isMoving = false;
    var el = this.options.el;
    this.container = _isNode(el) ? el : document.querySelector(el);
    this.init()
  }

  Ease.prototype.init = function() {
    var that = this;
    var options = that.options;
    var data = options.data;
    var size = data.length;
    var container = that.container;
    var initialContainerWidth = container.clientWidth;
    var template = (options.itemTemplate || LIST_ITEM_TEMPLATE).trim();
    var space = options.itemSpace;
    var count = options.count;
    var itemWidth = Math.floor((initialContainerWidth - space * (count - 1)) / count);
    var layoutContainerWidth = size * itemWidth + (space * (size - 1));
    var fragment = document.createDocumentFragment();
    data.forEach(function(item, index) {
      var div = document.createElement('div');
      div.innerHTML = that.replace(template, item);
      var node = div.firstElementChild;
      _css(node, {
        width: itemWidth + 'px',
        marginRight: index < size - 1 ? space + 'px' : 0
      });
      fragment.appendChild(node);
    })
    _css(container, 'width', layoutContainerWidth + 'px');
    container.appendChild(fragment);

    var startX = 0;
    var maxSwipeOffsetLeft = options.maxOffsetLeft;
    var swipeOffsetRightEnd = initialContainerWidth - layoutContainerWidth;
    var maxSwipeOffsetRight = swipeOffsetRightEnd - options.maxOffsetRight;
    
    container.addEventListener('touchstart', function (e) {
      e.preventDefault();
      startX = e.touches[0].pageX;
    }, false);
    
    container.addEventListener('touchmove', function (e) {
      var x = e.touches[0].pageX;
      var delta = x - startX;
      var offset = _getTranslateX(this);
      var offsetX = offset + delta;
      if(delta > 0) {
        offsetX = offsetX > maxSwipeOffsetLeft ? maxSwipeOffsetLeft : offsetX;
      } else {
        offsetX = offsetX < maxSwipeOffsetRight ? maxSwipeOffsetRight : offsetX;
      }
      _css(this, 'transform', 'translateX(' + offsetX + 'px)');
    }, false);
    
    container.addEventListener('touchend', function () {
      var start = _getTranslateX(this);
      var duration = options.easeDuration;
      if(start > 0) {
        that.easeOut(start, 0, duration);
      } else if(start < swipeOffsetRightEnd) {
        that.easeOut(start, swipeOffsetRightEnd, duration);
      }
    }, false);
  }
  
  Ease.prototype.setOptions = function(options) {
    this.options = _extend(this.options, options)
    this.container.innerHTML = '';
    _css(this.container, 'width', 'auto')
    this.init();
  }

  Ease.prototype.replace = function(str, data) {
    var mks = this.options.replaceMarkers
    for (var key in data) {
      if(data.hasOwnProperty(key)) {
        var regStr = mks[0] + '\\s*' + key + '\\s*' + mks[1];
        str = str.replace(new RegExp(regStr, 'g'), data[key]);
      }
    }
    return str
  }
  
  Ease.prototype.easeOut = function(star, end, duration) {
    if(this.isMoving) {
      return;
    }
    this.isMoving = true;
    var that = this;
    var t = 0;
    var timerId = null;
    var realDuration = Math.floor(duration / 17);
    var move = function() {
      var offset = _getOffsetX(t, star, end, realDuration);
      _css(that.container, 'transform', 'translateX(' + offset + 'px)');
      t++;
      if(t > realDuration) {
        window.cancelAnimationFrame(timerId);
        that.isMoving = false;
      } else {
        timerId = window.requestAnimationFrame(move);
      }
    }
    move();
  }

  function _extend() {
    return _toArray(arguments).reduce(function(acc, item) {
      if(_is(item, 'object')) {
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
            var value = item[key];
            if(acc[key] !== value) {
              acc[key] = value;
            }
          }
        }
      }
      return acc;
    }, {});
  }

  function _css(el, attr, value) {
    if(_is(attr, 'object')) {
      for (var key in attr) {
        if(attr.hasOwnProperty(key)) {
          el.style[key] = attr[key]
        }
      }
      return
    }
    if(!_is(value, 'undefined')) {
      el.style[attr] = value
      return
    }
    var css = window.getComputedStyle || document.defaultView.getComputedStyle
    var style = css(el, null)
    return style[attr]
  }

  function _is(value, type) {
    var className = {}.toString.call(value).replace(/^\[object\s(\w+)\]$/, '$1')
    return type ? className.toLowerCase() === type.toLowerCase() : className
  }

  function _isNode(value) {
    return /^HTML(\w+)Element$/.test(_is(value))
  }

  function _toArray(arrayLike) {
    return [].slice.call(arrayLike);
  }

  function _getTranslateX(el) {
    var reg = /matrix\(|\)/g;
    var matrix = _css(el, 'transform');
    if(!reg.test(matrix)) {
      return 0;
    }
    var value = matrix.replace(reg, '').split(',')[4];
    return parseFloat(value);
  }
  
  /**
   * 计算缓冲运动位置(时间与偏移的函数)
   * x = delta * (-2^-10t/d + 1)
   * @param t {Number} current time   开始运动的时间
   * @param s {Number} start offsetX  运动的起始x偏移
   * @param e {Number} end offsetX    运动的结束x偏移
   * @param d {Number} duration(ms)   运动持续时间
   * @return {Number} offsetX  当前时间的x偏移
   */
  function _getOffsetX(t, s, e, d) {
    console.group('getOffsetX')
    console.log('t: %o', t)
    console.log('s: %o', s)
    console.log('e: %o', e)
    console.log('d: %o', d)
    var delta = Math.abs(e - s);
    var x = t >= d ? delta : delta * (-Math.pow(2, -10 * t / d) + 1);
    var offset = s < e ? s + x : s - x;
    console.log('delta: %o', delta)
    console.log('x: %o', x)
    console.log('offset: %o', offset)
    console.groupEnd()
    return offset
  }


  window.Ease = Ease


})(window, document, void 0);
