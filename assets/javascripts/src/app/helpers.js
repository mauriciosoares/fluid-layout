(function(root) {
  var helpers = {};

  // little trick to get width in percentage,
  // to make sure the element is in the same line
  helpers.compareWidth = function(element, which) {
    var toCompare = element[which](),
      parentWidth = element.parent().width(),
      elementWidth = Math.floor(100 * element.width() / parentWidth),
      toCompareWidth = Math.floor(100 * toCompare.width() / parentWidth);

    return elementWidth === toCompareWidth;
  };

  helpers.lightenGray = function(color) {
    var darker = parseInt(color, 10) + 1;

    return (darker >= 255) ? 255 : darker;
  };

  helpers.darkenGray = function(color) {
    var darker = parseInt(color, 10) - 1;

    return (darker <= 0) ? 0 : darker;
  };

  helpers.chromeRenderFix = function() {
    document.body.style.display = 'inline-block';
    document.body.offsetHeight = document.body.offsetHeight;
    document.body.style.display = '';
  };

  helpers.isIE = function() {
    // thanks to browserhacks
    var isIE = /*@cc_on!@*/false;
    return isIE;
  };

  root.App.helpers = helpers;
} (this));