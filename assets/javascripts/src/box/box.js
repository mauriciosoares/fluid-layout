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
