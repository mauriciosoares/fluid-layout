(function(root) {
  var Box = function(id) {
    this.emitter = $({});
    // this.on receives the jquerys ON event
    this.on = this.emitter.on.bind(this.emitter);

    this.$box = $('<div class="box">');
    this.id = id;

    this.createHTML();
  };

  Box.prototype.createHTML = function() {
    var header = $('<header>').text(this.id),
      content = $('<section>');

    this.$box.append(header, content);

    this.addListeners();
  };

  Box.prototype.addListeners = function() {
    this.$box.on('click', function() {
      this.emitter.trigger('click');
    }.bind(this));
  };

  this.Box = Box;
} (this));