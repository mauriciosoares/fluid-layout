(function(root) {
  var helpers = {};

  // little trick to get width in percentage,
  // to make sure the element is in the same line
  helpers.compareWidth = function(element, which) {
    var toCompare = element[which](),
      elementWidth = Math.floor(100 * element.width() / element.parent().width()),
      toCompareWidth = Math.floor(100 * toCompare.width() / toCompare.parent().width());

    return elementWidth === toCompareWidth;
  };

  helpers.darkenGray = function(color) {
    var splitedColor = String.prototype.split.call(color, ''),
      first = parseInt(splitedColor[0], 16),
      second = parseInt(splitedColor[1], 16),
      toString = Number.prototype.toString,
      hex;

    second += 1;

    if(second >= 16) {
      second = 0;
      first = (first > 15) ? 0 : first + 1;
    }

    hex = toString.call(first, 16) + toString.call(second, 16);

    return (hex === '100') ? 'ff' : hex;
  };

  root.App.helpers = helpers;
} (this));