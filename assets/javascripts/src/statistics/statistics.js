(function(root) {
  // constructor to the statistic
  var Statistics = function($content, visible) {
    this.visible = visible;
    this.deleted = 0;

    this.$container = $('<div class="statistics">');
    $content.append(this.$container);

    this.render();
  };

  // updates the inner variables of statistics, with the passed parameters
  Statistics.prototype.update = function(visible, deleted) {
    this.visible = visible;
    this.deleted += deleted || 0;

    this.render();
  };

  // renders the statistic with new values
  Statistics.prototype.render = function() {
    var visibleMessage = 'Visible Boxes: ' + this.visible;
    var deletedMessage = 'Deleted Boxes: ' + this.deleted;
    this.$container.html(visibleMessage + ' | ' + deletedMessage);
  };

  root.App.Statistics = Statistics;
} (this));
