(function(root) {
  var App = function(container) {
    this.$container = $(container);
    this.id = 0;
    this.boxes = [];
  };

  App.prototype.add = function(position) {
    var newBox = new Box(this.id += 1);
    debugger;

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
    box.on('click', this.add.call(this, box));
  };

  this.App = App;
} (this));