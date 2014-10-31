(function(root) {
  var Statistics = function(visible) {
    this.visible = visible;
    this.deleted = 0;

    this.render();
  };

  Statistics.prototype.update = function(visible, deleted) {
    this.visible = visible;
    this.deleted += deleted || 0;

    this.render();
  };

  Statistics.prototype.render = function() {
    $('.statistics').html(this.visible + ' ------ ' + this.deleted);
  };

  root.Statistics = Statistics;
} (this));