(function() {
  if(typeof Function.prototype.bind === 'undefined') {
    Function.prototype.bind = function(thisArgs) {
      var slice = Array.prototype.slice,
        args = slice.call(arguments),
        fn = this;

      return function() {
        return fn.apply(thisArgs, args.concat(slice.call(arguments)));
      };
    };
  }
} ());

(function() {
  // Production steps of ECMA-262, Edition 5, 15.4.4.18
  // Reference: http://es5.github.com/#x15.4.4.18
  if ( !Array.prototype.forEach ) {

    Array.prototype.forEach = function forEach( callback, thisArg ) {

      var T, k;

      if ( this === null ) {
        throw new TypeError( "this is null or not defined" );
      }

      // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
      var O = Object(this);

      // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      var len = O.length >>> 0; // Hack to convert O.length to a UInt32

      // 4. If IsCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if ( {}.toString.call(callback) !== "[object Function]" ) {
        throw new TypeError( callback + " is not a function" );
      }

      // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if ( thisArg ) {
        T = thisArg;
      }

      // 6. Let k be 0
      k = 0;

      // 7. Repeat, while k < len
      while( k < len ) {

        var kValue;

        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        if ( Object.prototype.hasOwnProperty.call(O, k) ) {

          // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
          kValue = O[ k ];

          // ii. Call the Call internal method of callback with T as the this value and
          // argument list containing kValue, k, and O.
          callback.call( T, kValue, k, O );
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined
    };
  }
} ());
(function(root) {
  var App = function(container) {
    // common variables used though the application
    var $body = $('body');
    this.$container = $(container);
    this.id = 0;
    this.boxes = [];

    // constructors used
    this.storage = new root.LocalStorage();
    this.notifications = new root.Notifications($body);
    this.statistics = new root.Statistics($body, this.boxes.length);

    // Checks if the application was already in some state
    this.storagedBoxes = this.storage.get('boxes');
    if(this.storagedBoxes) {
      this.returnPreviousState();
      if(root.chrome) App.helpers.chromeRenderFix();
    } else {
      this.add();
    }
  };

  App.prototype.returnPreviousState = function() {
    var boxesArray = JSON.parse(this.storagedBoxes);

    boxesArray.forEach(function(boxId) {
      this.id = boxId - 1;

      this.addEvent();
    }.bind(this));

    this.id = Math.max.apply(Math, boxesArray);
  };

  App.prototype.add = function(position) {
    var newBox = new root.Box(this.id += 1);

    if(position) {
      this.$container.find(position.$box).after(newBox.$box);
    } else {
      this.$container.append(newBox.$box);
    }

    this.boxes.push(newBox);

    this.addBoxEvents(newBox);

    this.statistics.update(this.boxes.length);
    this.updateStorage();
  };

  App.prototype.updateStorage = function() {
    var boxes = Array.prototype.slice.call(this.$container.find('.box'));

    this.storage.set('boxes', JSON.stringify(boxes.map(function(box) { return box.id; })));
  };

  App.prototype.remove = function(el) {
    $(el).remove();

    this.removed = el;

    // removes from the boxes index
    this.boxes.forEach(this.teardownBox.bind(this));

    this.statistics.update(this.boxes.length, 1);
    this.updateStorage();
  };

  App.prototype.teardownBox = function(box, i) {
    if(box.$box[0] === this.removed) {
      this.boxes.splice(i, 1);
    }
  };

  App.prototype.addBoxEvents = function(box) {
    // when the addEvent is triggered, adds a new box
    box.on('addEvent', this.addEvent.bind(this, box));

    var _this = this;
    box.on('removeEvent', function(el) {
      _this.notifications.newNotification(el.id);
      _this.remove(el);
      _this.renderNeighbors();
      _this.lightenBackground();
    });
  };

  App.prototype.addEvent = function(box) {
    this.add(box || false);
    this.renderNeighbors();
    this.darkenBackground();
  };

  App.prototype.darkenBackground = function() {
    var bg = this.$container.data('bg'),
      rgb = App.helpers.darkenGray(bg);

    this.$container.data('bg', rgb);

    this.applyBackground('rgb(' + rgb + ', ' + rgb + ', ' + rgb + ')');
  };

  App.prototype.lightenBackground = function() {
    var bg = this.$container.data('bg'),
      rgb = App.helpers.lightenGray(bg);

    this.$container.data('bg', rgb);

    this.applyBackground('rgb(' + rgb + ', ' + rgb + ', ' + rgb + ')');
  };

  App.prototype.applyBackground = function(rgb) {
    this.$container.css('background', rgb);
  };

  App.prototype.renderNeighbors = function() {
    this.boxes.forEach(this.checkNeighbors.bind(this));
  };

  App.prototype.checkNeighbors = function(e) {
    var width = e.$box.width(),
      // get the id of the next and previous
      // if there is not it adds false
      left = App.helpers.compareWidth(e.$box, 'prev') ? e.$box.prev()[0].id : false,
      right = App.helpers.compareWidth(e.$box, 'next') ? e.$box.next()[0].id : false;

    e.addNeighbors(left, right);
  };

  this.App = App;
} (this));

(function(root) {
  var helpers = {};

  // little trick to get width in percentage,
  // to make sure the element is in the same line
  helpers.compareWidth = function(element, which) {
    var toCompare = element[which](),
      elementWidth = Math.floor(100 * element.width() / element.parent().width()),
      toCompareWidth = Math.floor(100 * toCompare.width() / toCompare.parent().width());

    return elementWidth === toCompareWidth;
  };

  helpers.lightenGray = function(color) {
    var darker = parseInt(color, 10) + 1;

    return (darker >= 255) ? 255 : darker;
  };

  helpers.darkenGray = function(color) {
    var darker = parseInt(color, 10) - 1;

    return (darker <= 0) ? 0 : darker;
  };

  helpers.chromeRenderFix = function() {
    document.body.style.display = 'inline-block';
    document.body.offsetHeight = document.body.offsetHeight;
    document.body.style.display = '';
  };

  root.App.helpers = helpers;
} (this));
$(function() {
  new App('.container2');
});

(function(root) {
  var Box = function(id) {
    // Tried to use emitter with jquery
    // but didn't work in IE8
    this.events = {};
    this.id = id;
    this.$box = $('<div class="box" id="' + this.id + '">');

    this.createHTML();
  };

  Box.prototype.createHTML = function() {
    var header = $('<header>').text(this.id),
      content = $('<section><span class="left"></span><span class="right"></span></section>');

    header.append('<a>×</a>');

    this.$box.append(header, content);

    this.addListeners();
  };

  Box.prototype.on = function(event, callback) {
    this.events[event] = callback;
  };

  Box.prototype.addNeighbors = function(l, r) {
    var left = l || '',
      right = r || '';

    this.$box.find('.left').html(left);
    this.$box.find('.right').html(right);
  };

  Box.prototype.addListeners = function() {
    this.$box.on('click', function() {
      this.events.addEvent();
    }.bind(this));

    this.$box.find('a').on('click', function(event) {
      event.stopPropagation();
      var el = $(event.target).closest('.box')[0];

      this.events.removeEvent(el);
    }.bind(this));

  };

  this.Box = Box;
} (this));

(function(root) {
  var LocalStorage = function() {

  };

  LocalStorage.prototype.set = function(index, data) {
    return localStorage.setItem(index, data);
  };

  LocalStorage.prototype.get = function(index) {
    return localStorage.getItem(index);
  };

  root.LocalStorage = LocalStorage;
} (this));

(function(root) {
  var Notifications = function($content) {
    // creates a element in the dom for notifications
    this.$container = $('<div class="notifications">');

    $content.append(this.$container);
  };

  Notifications.prototype.newNotification = function(id) {
    var $notification = $('<div class="notification">');
    $notification.text('Item ' + id + ' was deleted');
    $notification.append('<a>×</a>');

    this.$container.prepend($notification);

    this.addEvents($notification);
  };

  Notifications.prototype.addEvents = function($notification) {
    setTimeout(this.destroy.bind(this, $notification), 3000);
    $notification.find('a').on('click', this.destroy.bind(this, $notification));
  };

  Notifications.prototype.destroy = function($notification) {
    // checks if the element is still in the dom
    if($notification.closest(document.documentElement)) $notification.fadeOut(500, function() { $notification.remove(); });
  };

  root.Notifications = Notifications;
} (this));

(function(root) {
  var Statistics = function($content, visible) {
    this.visible = visible;
    this.deleted = 0;

    this.$container = $('<div class="statistics">');
    $content.append(this.$container);

    this.render();
  };

  Statistics.prototype.update = function(visible, deleted) {
    this.visible = visible;
    this.deleted += deleted || 0;

    this.render();
  };

  Statistics.prototype.render = function() {
    var visibleMessage = 'Visible Boxes: ' + this.visible;
    var deletedMessage = 'Deleted Boxes: ' + this.deleted;
    this.$container.html(visibleMessage + ' | ' + deletedMessage);
  };

  root.Statistics = Statistics;
} (this));
