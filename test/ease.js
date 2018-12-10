
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
      itemTemplate: '',
      replaceMarkers: ['{{', '}}']
    }
    this.options = _extend(defaults, options);
    this.animationFrameId = null;
    var el = this.options.el;
    this.container = _isNode(el) ? el : document.querySelector(el);
    var s = this.replace(LIST_ITEM_TEMPLATE, {
      avatar: 'http://avatar.jpg',
      name: 'Tesla214'
    })
    console.log(s)
    this.init()
  }

  Ease.prototype.init = function() {
    var that = this;
    var data = that.options.data;
    var container = that.container
    var template = (that.options.itemTemplate || LIST_ITEM_TEMPLATE).trim();
    var html = data.map(function(item) {
      return that.replace(template, item);
    }).join('');
    container.innerHTML = html;
    var width = _toArray(container.children).reduce(function(acc, item) {
      var marginLeft = parseInt(_css(item, 'margin-left'), 10);
      var marginRight = parseInt(_css(item, 'margin-right'), 10);
      return acc + item.offsetWidth + marginLeft + marginRight;
    }, 0);
    console.log(width)
    _css(container, 'width', width + 'px')

    var touchStartX = 0;
    container.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].pageX;
    })
    container.addEventListener('touchmove', function (e) {
      touchStartX = e.touches[0].pageX;
    })
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
    var matrix = _css(el, 'transform');
    var reg = /matrix|\(|\)/g;
    var value = matrix.replace(reg, '').split(',')[4];
    return parseFloat(value);
  }


  window.Ease = Ease


})(window, document, void 0);
