describe('Box Constructor', function() {
  var box;

  beforeEach(function() {
    box = null;
  });

  it('should create an instance of Box', function() {
    box = new App.Box(1);
    expect(box instanceof App.Box).toBeTruthy();
  });

  it('should contain the parameter value inside the header of the box', function() {
    box = new App.Box(5);

    expect(box.$box.find('header').text()).toEqual('5×');
  });

  it('should add the neighbors value inside the box', function() {
    box = new App.Box(1);
    box.addNeighbors(5, 47);

    expect(box.$box.find('.left').text()).toEqual('5');
    expect(box.$box.find('.right').text()).toEqual('47');
  });

  it('should trigger addEvent when clicking in the box', function() {
    var triggerOnClick = {
      callback: function() {}
    };
    spyOn(triggerOnClick, 'callback')

    box = new App.Box(1);
    box.on('addEvent', triggerOnClick.callback);

    box.$box.click();

    expect(triggerOnClick.callback).toHaveBeenCalled();
  });

  it('should trigger removeEvent when clicking in the close button', function() {
    var triggerOnClick = {
      callback: function() {}
    };
    spyOn(triggerOnClick, 'callback')

    box = new App.Box(1);
    box.on('removeEvent', triggerOnClick.callback);

    box.$box.find('a').click();

    expect(triggerOnClick.callback).toHaveBeenCalled();
  });

  it('should not trigger addEvent when clicking in the close button', function() {
    // this test is because the bubbling effect causes both
    // triggers to be called, since the close button is inside
    // the box itself

    var triggerOnClick = {
      callback: function() {}
    };
    spyOn(triggerOnClick, 'callback')

    box = new App.Box(1);
    box.on('addEvent', triggerOnClick.callback);

    box.$box.find('a').click();

    expect(triggerOnClick.callback).not.toHaveBeenCalled();
  });
});