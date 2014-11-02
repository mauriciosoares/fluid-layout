describe('Box Constructor', function() {
  var box;

  beforeEach(function() {
    box = null;
  });

  it('should create an instance of Box', function() {
    box = new App.Box(1);
    expect(box instanceof App.Box).toBeTruthy();
  });
});