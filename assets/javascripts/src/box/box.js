(function(root) {
  var Box = function(text) {
    this.$box = $('<div class="box">').text(text);

    this.addListeners();

    return this.$box;
  };

  Box.prototype.addListeners = function() {
    this.$box.on('click', function() {
      console.log('hue');
    });
  };

  this.Box = Box;
} (this));