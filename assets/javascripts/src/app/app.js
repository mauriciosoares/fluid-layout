(function(root) {
  var App = function(container) {
    this.$container = $(container);
    this.id = 0;

    // start app adding the firts box
    this.add();
  };

  App.prototype.add = function(position) {
    var newBox = new Box(this.id += 1);

    if(!position) {
      this.$container.append(newBox);
    } else {
      this.$container.find(position).next(newBox);
    }

    // this.addListeners(newBox);
  };

  this.App = App;
} (this));