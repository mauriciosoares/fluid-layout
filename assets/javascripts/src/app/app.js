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