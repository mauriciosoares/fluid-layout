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

    boxesArray.forEach(function(boxId, index) {
      var lastItem = (boxesArray.length == index + 1);

      this.id = boxId - 1;

      // this flag prevents the neighbor checking
      // in all elements, only in the last
      this.addEvent(false, !lastItem);
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
    box.on('addEvent', this.addEvent.bind(this, box, false));

    box.on('removeEvent', function(event, el) {
      this.notifications.new(el.id);
      this.remove(el);
      this.renderNeighbors();
      this.lightenBackground();
    }.bind(this));
  };

  App.prototype.addEvent = function(box, lastItem) {
    this.add(box || false);
    this.darkenBackground();

    if(!lastItem) {
      if(App.helpers.isIE()) this.polyFill();
      this.renderNeighbors();
    }
  };

  App.prototype.polyFill = function() {
    this.$container.find('.box')
      .removeClass('last-child')
      .last()
      .addClass('last-child');
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
      parentWidth = element.parent().width(),
      elementWidth = Math.floor(100 * element.width() / parentWidth),
      toCompareWidth = Math.floor(100 * toCompare.width() / parentWidth);

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

  helpers.isIE = function() {
    // thanks to browserhacks
    var isIE = /*@cc_on!@*/false;
    return isIE;
  };

  root.App.helpers = helpers;
} (this));
$(function() {
  new App('.container2');
});

(function(root) {
  var Box = function(id) {
    this.emitter = $({});
    this.on = this.emitter.on.bind(this.emitter);
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

  Box.prototype.addNeighbors = function(l, r) {
    var left = l || '',
      right = r || '';

    this.$box.find('.left').html(left);
    this.$box.find('.right').html(right);
  };

  Box.prototype.addListeners = function() {
    this.$box.on('click', function() {
      this.emitter.trigger('addEvent');
    }.bind(this));

    this.$box.find('a').on('click', function(event) {
      event.stopPropagation();

      this.emitter.trigger('removeEvent', $(event.target).closest('.box'));
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

  Notifications.prototype.new = function(id) {
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
