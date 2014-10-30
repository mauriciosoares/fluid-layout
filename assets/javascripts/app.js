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
$(function() {
  // by default, it adds 1 box in the document
  new App('.container2').add();
});
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
      this.emitter.trigger('addEvent');
    }.bind(this));
  };

  this.Box = Box;
} (this));