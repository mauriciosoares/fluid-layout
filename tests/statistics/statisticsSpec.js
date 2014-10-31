describe('Statistics Constructor', function() {
  var $content = $('<div>'),
    statistic = new Statistics($content, 0);

  it('should append the .statistics div inside the $content', function() {
    expect($content.has('.statistics').length).toEqual(1);
  });

  it('should have 0 as default value for visible boxes', function() {
    expect(statistic.visible).toEqual(0);
  });

  it('should have 0 as default value for deleted boxes', function() {
    expect(statistic.deleted).toEqual(0);
  });

  it('should update visible value to 5', function() {
    statistic.update(5);

    expect(statistic.visible).toEqual(5);
  });

  it('should incremented deleted value in 1', function() {
    statistic.update(5, 1);

    expect(statistic.deleted).toEqual(1);
  });

  it('should trigger render when value is updated', function() {
    spyOn(statistic, 'render');

    statistic.update(5, 1);

    expect(statistic.render).toHaveBeenCalled();
  });

  it('should show the right value in the statistic container', function() {
    statistic.deleted = 0;

    statistic.update(5, 1);

    expect(statistic.$container.html()).toEqual('Visible Boxes: 5 | Deleted Boxes: 1');
  });
});