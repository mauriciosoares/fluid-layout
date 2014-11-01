(function(root) {
  // constants
  var TIMEOUT = 1000000,
    FADEOUT_TIMEOUT = 500;

  var Notifications = function($content) {
    // creates a element in the dom for notifications
    this.$container = $('<div class="notifications">');

    $content.append(this.$container);
  };

  Notifications.prototype.new = function(id) {
    var $notification = $('<div class="notification">');
    $notification.text('Item ' + id + ' was deleted');
    $notification.append('<a>×</a>');

    this.$container.prepend($notification);

    this.addEvents($notification);

    return $notification;
  };

  Notifications.prototype.addEvents = function($notification) {
    setTimeout(this.destroy.bind(this, $notification), TIMEOUT);
    $notification.find('a').on('click', this.destroy.bind(this, $notification));
  };

  Notifications.prototype.destroy = function($notification) {
    // checks if the element is still in the dom
    // and destroys it
    if($notification.closest(document.documentElement)) $notification.fadeOut(FADEOUT_TIMEOUT, function() { $notification.remove(); });
  };

  // kinda helper for testing
  Notifications.prototype.destroyAll = function() {
    if(this.$container.find('.notification')) this.$container.empty();
  };

  root.Notifications = Notifications;
} (this));
