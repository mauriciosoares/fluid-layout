(function(root) {
  var LocalStorage = function() {

  };

  LocalStorage.prototype.set = function(index, data) {
    return localStorage.setItem(index, data);
  };

  LocalStorage.prototype.get = function(index) {
    return localStorage.getItem(index);
  };

  root.App.LocalStorage = LocalStorage;
} (this));
