(function(root) {
  var Statistics = function($content, visible) {
    this.visible = visible;
    this.deleted = 0;

    this.$container = $('<div class="statistics">');
    $content.append(this.$container);

    this.render();
  };

  Statistics.prototype.update = function(visible, deleted) {
    this.visible = visible;
    this.deleted += deleted || 0;

    this.render();
  };

  Statistics.prototype.render = function() {
    var visibleMessage = 'Visible Boxes: ' + this.visible;
    var deletedMessage = 'Deleted Boxes: ' + this.deleted;
    this.$container.html(visibleMessage + ' | ' + deletedMessage);
  };

  root.Statistics = Statistics;
} (this));