(function(root) {
  var App = function(container) {
    this.$container = $(container);
    this.id = 0;
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
    }.bind(this));
  };

  this.App = App;
} (this));