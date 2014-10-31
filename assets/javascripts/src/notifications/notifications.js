(function(root) {
  var Notifications = function($content) {
    // creates a element in the dom for notifications
    this.$container = $('<div class="notifications">');

    $content.append(this.$container);
  };

  Notifications.prototype.new = function(id) {
    var $notification = $('<div class="notification">');
    $notification.text('Item ' + id + ' was deleted');
    $notification.append('<a>×</a>');

    this.$container.append($notification);

    this.addEvents($notification);
  };

  Notifications.prototype.addEvents = function($notification) {
    setTimeout(this.destroy.bind(this, $notification), 3000);
    $notification.find('a').on('click', this.destroy.bind(this, $notification));
  };

  Notifications.prototype.destroy = function($notification) {
    if($notification.closest(document.documentElement)) $notification.fadeOut(500, function() { $notification.remove(); });
  };

  root.Notifications = Notifications;
} (this));