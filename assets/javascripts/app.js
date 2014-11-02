(function(root) {
  var App = function(container) {
    // common variables used though the application
    var $body = $('body');
    this.$container = $(container);
    this.id = 0;
    this.boxes = [];

    // constructors used
    this.storage = new root.App.LocalStorage();
    this.notifications = new root.App.Notifications($body);
    this.statistics = new root.App.Statistics($body, this.boxes.length);

    // Checks if the application was already in some state
    this.storagedBoxes = this.storage.get('boxes');

    if(this.storagedBoxes && this.storagedBoxes.length) {
      this.returnPreviousState();

      // this is a trick to Chrome, which as bugging
      // when everything as rendered from Localstorage
      if(root.chrome) App.helpers.chromeRenderFix();
    } else {
      this.add();
    }
  };

  // when the application starts, gets the data from localStorage
  // and renders it
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

  // add a new box, and then run some tasks to update everything
  App.prototype.add = function(position) {
    var newBox = new root.App.Box(this.id += 1);

    if(position) {
      this.$container.find(position.$box).after(newBox.$box);
    } else {
      this.$container.append(newBox.$box);
    }

    this.boxes.push(newBox);

    this.addBoxEvents(newBox);

    this.statistics.update(this.boxes.length);
    this.updateStorage();

    return newBox.$box;
  };

  // used to update localStorage with new boxes
  App.prototype.updateStorage = function() {
    var boxes = Array.prototype.slice.call(this.$container.find('.box'));

    this.storage.set('boxes', JSON.stringify(boxes.map(function(box) { return box.id; })));
  };

  // remove a clicked box, and runs some tasks
  App.prototype.remove = function(el) {
    $(el).remove();

    this.removed = el;

    // removes from the boxes index
    this.boxes.forEach(this.teardownBox.bind(this));

    this.statistics.update(this.boxes.length, 1);
    this.updateStorage();
  };

  // whenvever a box is deleted, it's removed from
  // the boxes array
  App.prototype.teardownBox = function(box, i) {
    if(box.$box[0] === this.removed) {
      this.boxes.splice(i, 1);
    }
  };

  // when a box is created, some events are setted for that box
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

  // events to run when a box is clicked
  App.prototype.addEvent = function(box, lastItem) {
    this.add(box || false);
    this.darkenBackground();

    if(!lastItem) {
      if(App.helpers.isIE()) this.polyFill();
      this.renderNeighbors();
    }
  };

  // polyfill for last-child to IE9
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

    this.applyBackground(rgb);
  };

  App.prototype.lightenBackground = function() {
    var bg = this.$container.data('bg'),
      rgb = App.helpers.lightenGray(bg);

    this.$container.data('bg', rgb);

    this.applyBackground(rgb);
  };

  App.prototype.applyBackground = function(rgb) {
    this.$container.css('background', 'rgb(' + rgb + ', ' + rgb + ', ' + rgb + ')');
  };

  // when a box is created/deleted, it updates all neighbors
  // values for all boxes
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

  // returns a color to a lighter gray
  helpers.lightenGray = function(color) {
    var darker = parseInt(color, 10) + 1;

    return (darker >= 255) ? 255 : darker;
  };

  // returns a color to a darker gray
  helpers.darkenGray = function(color) {
    var darker = parseInt(color, 10) - 1;

    return (darker <= 0) ? 0 : darker;
  };

  // trick to Google Chrome, when lots of boxes are
  // rendered at once
  helpers.chromeRenderFix = function() {
    document.body.style.display = 'inline-block';
    document.body.offsetHeight = document.body.offsetHeight;
    document.body.style.display = '';
  };

  // checks if it's IE
  helpers.isIE = function() {
    // thanks to browserhacks
    var isIE = /*@cc_on!@*/false;
    return isIE;
  };

  root.App.helpers = helpers;
} (this));
$(function() {
  // whenever the DOM is ready, starts the whole application
  // with .container2 as the main container
  new App('.container2');
});

(function(root) {
  // Constructor for each box
  var Box = function(id) {
    this.emitter = $({});
    this.on = this.emitter.on.bind(this.emitter);
    this.id = id;
    this.$box = $('<div class="box" id="' + this.id + '">');

    this.createHTML();
  };

  // creates the HTML of the box, and add events on it
  Box.prototype.createHTML = function() {
    var header = $('<header>').text(this.id),
      content = $('<section><span class="left"></span><span class="right"></span></section>');

    header.append('<a>×</a>');

    this.$box.append(header, content);

    this.addListeners();
  };

  // Add the neighbors values for the box
  Box.prototype.addNeighbors = function(l, r) {
    var left = l || '',
      right = r || '';

    this.$box.find('.left').html(left);
    this.$box.find('.right').html(right);
  };

  // set of listeners to the box
  Box.prototype.addListeners = function() {
    this.$box.on('click', function() {
      this.emitter.trigger('addEvent');
    }.bind(this));

    this.$box.find('a').on('click', function(event) {
      event.stopPropagation();

      this.emitter.trigger('removeEvent', $(event.target).closest('.box'));
    }.bind(this));

  };

  this.App.Box = Box;
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

  root.App.LocalStorage = LocalStorage;
} (this));

(function(root) {
  // constants
  var TIMEOUT = 3000,
    FADEOUT_TIMEOUT = 500;

  // constructor for all notifications
  var Notifications = function($content) {
    // creates a element in the dom for notifications
    this.$container = $('<div class="notifications">');

    $content.append(this.$container);
  };

  // add a new notification, and set some events
  Notifications.prototype.new = function(id) {
    var $notification = $('<div class="notification">');
    $notification.text('Item ' + id + ' was deleted');
    $notification.append('<a>×</a>');

    this.$container.prepend($notification);

    this.addEvents($notification);

    return $notification;
  };

  // events to destroy the notification, such as clicking the close
  // button and a timeout
  Notifications.prototype.addEvents = function($notification) {
    setTimeout(this.destroy.bind(this, $notification), TIMEOUT);
    $notification.find('a').on('click', this.destroy.bind(this, $notification));
  };

  Notifications.prototype.destroy = function($notification) {
    // checks if the element is still in the dom
    // and destroys it
    if($notification.closest(document.documentElement)) $notification.fadeOut(FADEOUT_TIMEOUT, function() { $notification.remove(); });
  };

  // helper for tests
  Notifications.prototype.destroyAll = function() {
    if(this.$container.find('.notification')) this.$container.empty();
  };

  root.App.Notifications = Notifications;
} (this));

(function(root) {
  // constructor to the statistic
  var Statistics = function($content, visible) {
    this.visible = visible;
    this.deleted = 0;

    this.$container = $('<div class="statistics">');
    $content.append(this.$container);

    this.render();
  };

  // updates the inner variables of statistics, with the passed parameters
  Statistics.prototype.update = function(visible, deleted) {
    this.visible = visible;
    this.deleted += deleted || 0;

    this.render();
  };

  // renders the statistic with new values
  Statistics.prototype.render = function() {
    var visibleMessage = 'Visible Boxes: ' + this.visible;
    var deletedMessage = 'Deleted Boxes: ' + this.deleted;
    this.$container.html(visibleMessage + ' | ' + deletedMessage);
  };

  root.App.Statistics = Statistics;
} (this));
