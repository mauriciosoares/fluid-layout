(function(root) {
  var App = function(container, initialId) {
    this.$container = $(container);
    this.id = initialId;
    this.boxes = [];
  };

  App.prototype.add = function(position) {
    var newBox = new Box(this.id += 1);

    if(position) {
      this.$container.find(position.$box).after(newBox.$box);
    } else {
      this.$container.append(newBox.$box);
    }

    this.boxes.push(newBox);

    this.addBoxEvents(newBox);
  };

  App.prototype.remove = function(el) {
    $(el).remove();

    this.removed = el;

    // removes from the boxes index
    this.boxes.forEach(this.teardownBox.bind(this));
  };

  App.prototype.teardownBox = function(box, i) {
    if(box.$box[0] === this.removed) {
      this.boxes.splice(i, 1);
    }
  };

  App.prototype.addBoxEvents = function(box) {
    // when the addEvent is triggered, adds a new box
    box.on('addEvent', function() {
      this.add(box);
      this.renderNeighbors();
      this.darkenBackground();
    }.bind(this));

    box.on('removeEvent', function(event, el) {
      this.remove(el);
      this.renderNeighbors();
      this.lightenBackground();
    }.bind(this));
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

  root.App.helpers = helpers;
} (this));
$(function() {
  // by default, it adds 1 box in the document
  new App('.container2', 0).add();
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