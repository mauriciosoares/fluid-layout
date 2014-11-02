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
