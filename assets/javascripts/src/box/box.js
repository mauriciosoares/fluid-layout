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

  this.App.Box = Box;
} (this));
