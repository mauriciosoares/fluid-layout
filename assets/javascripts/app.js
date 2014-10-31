(function(root) {
  var App = function(container, initialId) {
    this.$container = $(container);
    this.id = initialId;
    this.boxes = [];
  };

  App.prototype.add = function(position) {
    var newBox = new Box(this.id += 1);

    /**
    / position is a reference to the clicked box
    / if there is a position, it adds next
    / if not, it just append into the container (first)
    **/
    if(position) {
      this.$container.find(position.$box).after(newBox.$box);
    } else {
      this.$container.append(newBox.$box);
    }

    this.boxes.push(newBox);

    // adds events for clicks
    this.addBoxEvents(newBox);
  };

  App.prototype.addBoxEvents = function(box) {
    // when the addEvent is triggered, adds a new box
    box.on('addEvent', function() {
      this.add(box);
      this.render();
      this.darkenBackground();
    }.bind(this));
  };

  App.prototype.darkenBackground = function() {
    var bg = this.$container.data('bg'),
      hex = App.helpers.darkenGray(bg);

    this.$container.data('bg', hex);

    this.applyBackground('#' + hex + hex + hex);
  };

  App.prototype.applyBackground = function(hex) {
    this.$container.css('background', hex);
  };

  App.prototype.render = function() {
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

  helpers.darkenGray = function(color) {
    var splitedColor = String.prototype.split.call(color, ''),
      first = parseInt(splitedColor[0], 16),
      second = parseInt(splitedColor[1], 16),
      toString = Number.prototype.toString,
      hex;

    second += 1;

    if(second >= 16) {
      second = 0;
      first = (first > 15) ? 0 : first + 1;
    }

    hex = toString.call(first, 16) + toString.call(second, 16);

    return (hex === '100') ? 'ff' : hex;
  };

  root.App.helpers = helpers;
} (this));
$(function() {
  // by default, it adds 1 box in the document
  new App('.container2', 0).add();
});
(function(root) {
  var Box = function(id) {
    this.emitter = $({});
    // this.on receives the jquerys ON event
    this.on = this.emitter.on.bind(this.emitter);

    this.id = id;
    this.$box = $('<div class="box" id="' + this.id + '">');

    this.createHTML();
  };

  Box.prototype.createHTML = function() {
    var header = $('<header>').text(this.id),
      content = $('<section><span class="left"></span><span class="right"></span></section>');

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
  };

  this.Box = Box;
} (this));