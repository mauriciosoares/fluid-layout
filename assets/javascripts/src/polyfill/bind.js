(function() {
  if(typeof Function.prototype.bind === 'undefined') {
    Function.prototype.bind = function(thisArgs) {
      var slice = Array.prototype.slice,
        args = slice.call(arguments),
        fn = this;

      return function() {
        return fn.apply(thisArgs, args.concat(slice.call(arguments)));
      };
    };
  }
} ());
