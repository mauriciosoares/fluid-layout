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

  // returns a color to a lighter gray
  helpers.lightenGray = function(color) {
    var darker = parseInt(color, 10) + 1;

    return (darker >= 255) ? 255 : darker;
  };

  // returns a color to a darker gray
  helpers.darkenGray = function(color) {
    var darker = parseInt(color, 10) - 1;

    return (darker <= 0) ? 0 : darker;
  };

  // trick to Google Chrome, when lots of boxes are
  // rendered at once
  helpers.chromeRenderFix = function() {
    document.body.style.display = 'inline-block';
    document.body.offsetHeight = document.body.offsetHeight;
    document.body.style.display = '';
  };

  // checks if it's IE
  helpers.isIE = function() {
    // thanks to browserhacks
    var isIE = /*@cc_on!@*/false;
    return isIE;
  };

  root.App.helpers = helpers;
} (this));