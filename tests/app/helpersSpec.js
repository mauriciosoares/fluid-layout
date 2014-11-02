describe('Helpers', function() {
  describe('Testing compareWidth', function() {
    var $parent = $('<div>').width(960);

    beforeEach(function() {
      $parent.empty();
    })

    it('should return true if the next element has the same witdh', function() {
      var $element = $('<div>').width('350px'),
        $toCompare = $('<div>').width('350px');

      $parent.append($element, $toCompare);
      expect(App.helpers.compareWidth($element, 'next')).toBeTruthy();
    });

    it('should return false if the next element does not have the same witdh', function() {
      var $element = $('<div>').width('350px'),
        $toCompare = $('<div>').width('400px');

      $parent.append($element, $toCompare);

      expect(App.helpers.compareWidth($element, 'next')).toBeFalsy();
    });

    it('should return true if the prev element has the same witdh', function() {
      var $element = $('<div>').width('350px'),
        $toCompare = $('<div>').width('350px');

      $parent.prepend($toCompare, $element);

      expect(App.helpers.compareWidth($element, 'prev')).toBeTruthy();
    });

    it('should return false if the prev element does not have the same witdh', function() {
      var $element = $('<div>').width('350px'),
        $toCompare = $('<div>').width('400px');

      $parent.prepend($toCompare, $element);

      expect(App.helpers.compareWidth($element, 'prev')).toBeFalsy();
    });
  });

  describe('testing lightenGray', function() {
    it('should return the number +1', function() {
      expect(App.helpers.lightenGray(23)).toBe(24);
    });

    it('should not exceed 255', function() {
      expect(App.helpers.lightenGray(255)).toBe(255);
    });

    it('should return 255 if the number is higher then 255', function() {
      expect(App.helpers.lightenGray(9999)).toBe(255);
    });
  });

  describe('testing darkenGray', function() {
    it('should return the number -1', function() {
      expect(App.helpers.darkenGray(23)).toBe(22);
    });

    it('should not return less than 0', function() {
      expect(App.helpers.darkenGray(0)).toBe(0);
    });

    it('should return 0 if the number is lesser then 0', function() {
      expect(App.helpers.darkenGray(-123)).toBe(0);
    });
  });
});