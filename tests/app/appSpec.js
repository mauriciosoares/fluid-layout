describe('App Constructor', function() {
  localStorage.clear();

  var $container = $('<div data-bg="140">'),
    app = new App($container);

  it('should create an instance of App', function() {
    expect(app instanceof App).toBeTruthy();
  });

  it('should have created all instances from from other modules', function() {
    expect(app.storage instanceof App.LocalStorage).toBeTruthy();
    expect(app.notifications instanceof App.Notifications).toBeTruthy();
    expect(app.statistics instanceof App.Statistics).toBeTruthy();
  });

  it('should add a initialbox by default', function() {
    expect(app.$container.find('.box').length).toEqual(1);
  });

  it('should add a box in the end when no position is passed', function() {
    var newBox = app.add();

    expect(newBox[0]).toBe(app.$container.find('.box').last()[0]);
  });

  it('should add a box beside the clicked box', function() {
    var currentPosition = app.id,
      nextPosition;

    app.$container.find('.box').first().click();

    // gets the id of the box beside the clicked box
    nextPosition = parseInt(app.$container.find('.box').first().next()[0].id, 10);

    expect(currentPosition + 1).toEqual(nextPosition);
  });

  it('should remove the box whenever the close button is clicked', function() {
    var newBox = app.add();
    // make sure the box is in the element
    expect($container.find(newBox).length).toEqual(1);

    // after clicking the close button, its removed
    // from the element
    newBox.find('a').click();
    expect($container.find(newBox).length).toEqual(0);
  });

  it('should update storage whenever a box is created', function() {
    spyOn(app.storage, 'set');

    app.add();

    expect(app.storage.set).toHaveBeenCalled();
  });

  it('should update statistics whenever a box is created', function() {
    spyOn(app.statistics, 'update');

    app.add();

    expect(app.statistics.update).toHaveBeenCalled();
  });

  it('should darken background whenever a box is created', function() {
    $container.data('bg', 200);

    app.$container.find('.box').first().click();

    expect($container.css('background')).toEqual('rgb(199, 199, 199)');
  });

  it('should lighten background whenever a box is deleted', function() {
    $container.data('bg', 198);

    app.$container.find('.box a').first().click();

    expect($container.css('background')).toEqual('rgb(199, 199, 199)');
  });
});