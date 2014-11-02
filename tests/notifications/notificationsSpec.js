describe('Notifications Constructor', function() {
  var $content = $('<div>'),
    notifications = new App.Notifications($content)

  afterEach(function() {
    notifications.destroyAll();
  });

  it('should create an instance of Notifications', function() {
    expect(notifications instanceof App.Notifications).toBeTruthy();
  });

  it('should append the .notifications div inside the $content', function() {
    expect($content.has('.notifications').length).toEqual(1);
  });

  it('should append a new notification', function() {
    notifications.new(5);
    expect($content.find('.notification').length).toEqual(1);
  });

  it('should accept multiple notifications', function() {
    notifications.new(5);
    notifications.new(10);
    notifications.new(15);
    expect($content.find('.notification').length).toEqual(3);
  });

  it('should show the parameter number inside the content', function() {
    notifications.new(3457);
    expect($content.find('.notification').text()).toEqual('Item 3457 was deleted×');
  });

  it('should destroy a specific notification', function() {
    var notification1 = notifications.new(5);
    var notification2 = notifications.new(10);

    notifications.destroy(notification1);

    expect($content.find('.notification').length).toEqual(1);
    expect($content.find('.notification').text()).toEqual('Item 10 was deleted×');
  });

  it('should call destroy when you click in the close button', function() {
    spyOn(notifications, 'destroy');

    var notification = notifications.new(5);
    notification.find('a').click();

    expect(notifications.destroy).toHaveBeenCalled();
  });

  // it('should destroy a notification after an timeout of 3000 miliseconds', function(done) {
  //   notifications.new(3457);
  //   setTimeout(function() {
  //     expect($content.find('.notification').length).toEqual(0);
  //     done();
  //   }, 3001);
  // });
});