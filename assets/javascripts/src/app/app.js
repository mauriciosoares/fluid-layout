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