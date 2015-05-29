// todo - accept chanopts
// todo - try to eliminate putAsync

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.chain = chain;
exports.never = never;
exports.later = later;
exports.interval = interval;
exports.sequentially = sequentially;
exports.fromPoll = fromPoll;
exports.withInterval = withInterval;
exports.fromCallback = fromCallback;
exports.fromNodeCallback = fromNodeCallback;
exports.fromEvents = fromEvents;
exports.log = log;
exports.transduce = transduce;
exports.map = map;
exports.filter = filter;
exports.takeWhile = takeWhile;
exports.last = last;
exports.flatten = flatten;
exports.skip = skip;
exports.skipWhile = skipWhile;
exports.skipDuplicates = skipDuplicates;
exports.diff = diff;
exports.scan = scan;
exports.delay = delay;
exports.debounce = debounce;
exports.throttle = throttle;
exports.bufferWhile = bufferWhile;
exports.zip = zip;
exports.concat = concat;
exports.filterBy = filterBy;
exports.sampledBy = sampledBy;
exports.takeWhileBy = takeWhileBy;
exports.takeUntilBy = takeUntilBy;
exports.bufferBy = bufferBy;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jsCsp = require('js-csp');

var _jsCsp2 = _interopRequireDefault(_jsCsp);

var _transducersJs = require('transducers.js');

var _transducersJs2 = _interopRequireDefault(_transducersJs);

var pipe = _jsCsp2['default'].operations.pipe;
var pipelineAsync = _jsCsp2['default'].operations.pipelineAsync;

// chaining helpers

var Chain = (function () {
  function Chain(o) {
    _classCallCheck(this, Chain);

    this.o = o;
  }

  _createClass(Chain, [{
    key: 'val',
    value: function val() {
      return this.o;
    }
  }]);

  return Chain;
})();

function $() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  fns.forEach(function (fn) {
    return Object.assign(Chain.prototype, _defineProperty({}, fn.name, function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this.o = fn.apply(undefined, [this.o].concat(args));
      return this;
    }));
  });
}

function chain(o) {
  return new Chain(o);
}

// some basics
$(function into(ch, coll) {
  return _jsCsp2['default'].operations.into(coll, ch);
});

//  CREATE

function never() {
  var c = (0, _jsCsp.chan)();
  c.close();
  return c;
}

function later(wait, value) {
  var c = (0, _jsCsp.chan)();
  setTimeout(function () {
    (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$2$0() {
      return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return (0, _jsCsp.put)(c, value);

          case 2:
            c.close();

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, callee$2$0, this);
    }));
  }, wait);
  return c;
}

function interval(duration, value) {
  var c = (0, _jsCsp.chan)();
  var intval = setInterval(function () {
    (0, _jsCsp.putAsync)(c, value);
  }, duration);

  c.stop = function () {
    clearInterval(intval);
    c.close();
  };
  return c;
}

function sequentially(duration, values) {
  var c = (0, _jsCsp.chan)();
  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, value;

    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          context$2$0.prev = 3;
          _iterator = values[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            context$2$0.next = 13;
            break;
          }

          value = _step.value;
          context$2$0.next = 9;
          return (0, _jsCsp.timeout)(duration);

        case 9:
          (0, _jsCsp.putAsync)(c, value);

        case 10:
          _iteratorNormalCompletion = true;
          context$2$0.next = 5;
          break;

        case 13:
          context$2$0.next = 19;
          break;

        case 15:
          context$2$0.prev = 15;
          context$2$0.t0 = context$2$0['catch'](3);
          _didIteratorError = true;
          _iteratorError = context$2$0.t0;

        case 19:
          context$2$0.prev = 19;
          context$2$0.prev = 20;

          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }

        case 22:
          context$2$0.prev = 22;

          if (!_didIteratorError) {
            context$2$0.next = 25;
            break;
          }

          throw _iteratorError;

        case 25:
          return context$2$0.finish(22);

        case 26:
          return context$2$0.finish(19);

        case 27:
          c.close();

        case 28:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this, [[3, 15, 19, 27], [20,, 22, 26]]);
  }));
  return c;
}

function fromPoll(duration, fn) {
  var c = (0, _jsCsp.chan)();
  var intval = setInterval(function () {
    (0, _jsCsp.putAsync)(c, fn());
  }, duration);
  c.stop = function () {
    clearInterval(intval);
    c.close();
  };
  return c;
}

function withInterval(duration, handler) {
  var c = (0, _jsCsp.chan)();
  var intval = setInterval(function () {
    handler(c);
  }, duration);
  c.stop = function () {
    clearInterval(intval);
    c.close();
  };
  return c;
}

function fromCallback(fn) {
  var c = (0, _jsCsp.chan)();
  fn(function (value) {
    (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$2$0() {
      return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return (0, _jsCsp.put)(c, value);

          case 2:
            c.close();

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, callee$2$0, this);
    }));
  });
  return c;
}

function fromNodeCallback(fn) {
  var c = (0, _jsCsp.chan)();
  fn(function (err, res) {
    (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$2$0() {
      return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return (0, _jsCsp.put)(c, err || res);

          case 2:
            c.close();

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, callee$2$0, this);
    }));
  });
  return c;
}

function fromEvents(emitter, event) {
  var c = (0, _jsCsp.chan)();
  var fn = function fn() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return (0, _jsCsp.putAsync)(c, args);
  };
  emitter.on(event, fn);
  c.stop = function () {
    emitter.removeListener(event, fn);
    c.close();
  };
  return c;
}

function log(ch) {
  var prefix = arguments[1] === undefined ? '' : arguments[1];

  var c = (0, _jsCsp.chan)();
  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return ch;

        case 2:
          context$2$0.t0 = el = context$2$0.sent;

          if (!(context$2$0.t0 !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 9;
            break;
          }

          console.log(prefix, el);
          context$2$0.next = 7;
          return (0, _jsCsp.put)(c, el);

        case 7:
          context$2$0.next = 0;
          break;

        case 9:
          c.close();

        case 10:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
  return c;
}

function transduce(ch, xf) {
  var bufferOrN = arguments[2] === undefined ? 1 : arguments[2];

  var c = (0, _jsCsp.chan)(bufferOrN, xf);
  pipe(ch, c);
  return c;
}

$(log, transduce);

// todo - stoplog?

// MODIFY

function map(ch, fn) {
  return transduce(ch, _transducersJs2['default'].map(fn));
}

function filter(ch, fn) {
  return transduce(ch, _transducersJs2['default'].filter(fn));
}

function takeWhile(ch, fn) {
  return transduce(ch, _transducersJs2['default'].takeWhile(fn));
}

function last(ch) {
  var c = (0, _jsCsp.chan)();
  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el, final;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return ch;

        case 2:
          context$2$0.t0 = el = context$2$0.sent;

          if (!(context$2$0.t0 !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 7;
            break;
          }

          final = el;
          context$2$0.next = 0;
          break;

        case 7:
          context$2$0.next = 9;
          return (0, _jsCsp.put)(c, final);

        case 9:
          c.close();

        case 10:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
  return c;
}

function flatten(ch, fn) {
  var c = (0, _jsCsp.chan)();
  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, e;

    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return ch;

        case 2:
          context$2$0.t0 = el = context$2$0.sent;

          if (!(context$2$0.t0 !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 32;
            break;
          }

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          context$2$0.prev = 7;
          _iterator2 = el[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            context$2$0.next = 16;
            break;
          }

          e = _step2.value;
          context$2$0.next = 13;
          return (0, _jsCsp.put)(c, e);

        case 13:
          _iteratorNormalCompletion2 = true;
          context$2$0.next = 9;
          break;

        case 16:
          context$2$0.next = 22;
          break;

        case 18:
          context$2$0.prev = 18;
          context$2$0.t1 = context$2$0['catch'](7);
          _didIteratorError2 = true;
          _iteratorError2 = context$2$0.t1;

        case 22:
          context$2$0.prev = 22;
          context$2$0.prev = 23;

          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }

        case 25:
          context$2$0.prev = 25;

          if (!_didIteratorError2) {
            context$2$0.next = 28;
            break;
          }

          throw _iteratorError2;

        case 28:
          return context$2$0.finish(25);

        case 29:
          return context$2$0.finish(22);

        case 30:
          context$2$0.next = 0;
          break;

        case 32:
          c.close();

        case 33:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this, [[7, 18, 22, 30], [23,, 25, 29]]);
  }));
  return c;
}

$(map, filter, takeWhile, last, flatten);

function skip(ch, n) {
  return transduce(ch, _transducersJs2['default'].drop(n));
}

function skipWhile(ch, fn) {
  return transduce(ch, _transducersJs2['default'].dropWhile(fn));
}

// todo - comparator fn

function skipDuplicates(ch) {
  return transduce(ch, _transducersJs2['default'].dedupe());
}

$(skip, skipWhile, skipDuplicates);

function diff(ch, _x3, seed) {
  var fn = arguments[1] === undefined ? function (a, b) {
    return [a, b];
  } : arguments[1];

  var c = (0, _jsCsp.chan)();
  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var final, current;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!(typeof seed === 'undefined')) {
            context$2$0.next = 4;
            break;
          }

          context$2$0.next = 3;
          return ch;

        case 3:
          seed = context$2$0.sent;

        case 4:
          final = seed;

        case 5:
          context$2$0.next = 7;
          return ch;

        case 7:
          context$2$0.t0 = current = context$2$0.sent;

          if (!(context$2$0.t0 !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 14;
            break;
          }

          context$2$0.next = 11;
          return (0, _jsCsp.put)(c, fn(final, current));

        case 11:
          final = current;
          context$2$0.next = 5;
          break;

        case 14:
          c.close();

        case 15:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
  return c;
}

function scan(ch, fn, seed) {
  var c = (0, _jsCsp.chan)();
  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var final, current;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!(typeof seed === 'undefined')) {
            context$2$0.next = 4;
            break;
          }

          context$2$0.next = 3;
          return ch;

        case 3:
          seed = context$2$0.sent;

        case 4:
          final = seed;

        case 5:
          context$2$0.next = 7;
          return ch;

        case 7:
          context$2$0.t0 = current = context$2$0.sent;

          if (!(context$2$0.t0 !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 13;
            break;
          }

          context$2$0.next = 11;
          return (0, _jsCsp.put)(c, final = fn(final, current));

        case 11:
          context$2$0.next = 5;
          break;

        case 13:
          c.close();

        case 14:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
  return c;
}

$(diff, scan);

function delay(ch, wait) {
  var c = (0, _jsCsp.chan)();
  pipelineAsync(10, c, function (val, sink) {
    return setTimeout(function () {
      return (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$3$0() {
        return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return (0, _jsCsp.put)(sink, val);

            case 2:
              sink.close();

            case 3:
            case 'end':
              return context$4$0.stop();
          }
        }, callee$3$0, this);
      }));
    }, wait);
  }, ch);
  return c;
}

// todo - immediate:true

function debounce(ch, wait) {
  var c = (0, _jsCsp.chan)();
  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var final, res;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return ch;

        case 2:
          final = context$2$0.sent;

        case 3:
          if (!(final !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 10;
            break;
          }

          context$2$0.next = 6;
          return (0, _jsCsp.alts)([(0, _jsCsp.timeout)(wait), ch]);

        case 6:
          res = context$2$0.sent;

          if (res.channel !== ch) {
            (0, _jsCsp.putAsync)(c, final);
          } else {
            final = res.value;
          }
          context$2$0.next = 3;
          break;

        case 10:
          c.close();

        case 11:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));

  return c;
}

function throttle(ch, wait) {
  var c = (0, _jsCsp.chan)();

  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var final, t, res;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return ch;

        case 2:
          final = context$2$0.sent;
          t = (0, _jsCsp.timeout)(wait);

        case 4:
          if (!(final !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 12;
            break;
          }

          t = t || (0, _jsCsp.timeout)(wait);
          context$2$0.next = 8;
          return (0, _jsCsp.alts)([ch, t]);

        case 8:
          res = context$2$0.sent;

          if (res.channel === ch) {
            final = res.value;
          } else if (res.channel === t) {
            if (final !== undefined) {
              (0, _jsCsp.putAsync)(c, final);
              final = undefined;
            }
            t = undefined;
          }
          context$2$0.next = 4;
          break;

        case 12:
          c.close();

        case 13:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
  return c;
}

function bufferWhile(ch, predicate) {
  var flushOnEnd = arguments[2] === undefined ? true : arguments[2];

  var arr = [],
      c = (0, _jsCsp.chan)();
  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          el = undefined;

        case 1:
          context$2$0.next = 3;
          return ch;

        case 3:
          context$2$0.t0 = el = context$2$0.sent;

          if (!(context$2$0.t0 !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 12;
            break;
          }

          arr.push(el);

          if (predicate(el)) {
            context$2$0.next = 10;
            break;
          }

          context$2$0.next = 9;
          return (0, _jsCsp.put)(c, arr);

        case 9:
          arr = [];

        case 10:
          context$2$0.next = 1;
          break;

        case 12:
          if (!(flushOnEnd && arr.length > 0)) {
            context$2$0.next = 15;
            break;
          }

          context$2$0.next = 15;
          return (0, _jsCsp.put)(c, arr);

        case 15:
          c.close();

        case 16:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
  return c;
}

$(delay, debounce, throttle, bufferWhile);

// COMBINE

// todo - combinator

function zip() {
  for (var _len4 = arguments.length, srcs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    srcs[_key4] = arguments[_key4];
  }

  var c = (0, _jsCsp.chan)();
  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var done, arr, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, src, el;

    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          done = false;

        case 1:
          if (done) {
            context$2$0.next = 35;
            break;
          }

          arr = [];
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          context$2$0.prev = 6;
          _iterator3 = srcs[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            context$2$0.next = 18;
            break;
          }

          src = _step3.value;

          if (done) {
            context$2$0.next = 15;
            break;
          }

          context$2$0.next = 13;
          return src;

        case 13:
          el = context$2$0.sent;

          if (el === _jsCsp2['default'].CLOSED) {
            done = true;
          } else {
            arr.push(el);
          }

        case 15:
          _iteratorNormalCompletion3 = true;
          context$2$0.next = 8;
          break;

        case 18:
          context$2$0.next = 24;
          break;

        case 20:
          context$2$0.prev = 20;
          context$2$0.t0 = context$2$0['catch'](6);
          _didIteratorError3 = true;
          _iteratorError3 = context$2$0.t0;

        case 24:
          context$2$0.prev = 24;
          context$2$0.prev = 25;

          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }

        case 27:
          context$2$0.prev = 27;

          if (!_didIteratorError3) {
            context$2$0.next = 30;
            break;
          }

          throw _iteratorError3;

        case 30:
          return context$2$0.finish(27);

        case 31:
          return context$2$0.finish(24);

        case 32:
          (0, _jsCsp.putAsync)(c, arr);
          context$2$0.next = 1;
          break;

        case 35:
          c.close();

        case 36:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this, [[6, 20, 24, 32], [25,, 27, 31]]);
  }));
  return c;
}

// todo - combinator

function concat() {
  for (var _len5 = arguments.length, srcs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    srcs[_key5] = arguments[_key5];
  }

  var c = (0, _jsCsp.chan)();
  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var sentinel, outs, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, out, el;

    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          sentinel = {};
          outs = srcs.map(function (src) {
            var out = (0, _jsCsp.chan)();
            (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$3$0() {
              var el;
              return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                while (1) switch (context$4$0.prev = context$4$0.next) {
                  case 0:
                    el = undefined;

                  case 1:
                    context$4$0.next = 3;
                    return src;

                  case 3:
                    context$4$0.t0 = el = context$4$0.sent;

                    if (!(context$4$0.t0 !== _jsCsp2['default'].CLOSED)) {
                      context$4$0.next = 8;
                      break;
                    }

                    (0, _jsCsp.putAsync)(out, el);
                    context$4$0.next = 1;
                    break;

                  case 8:
                    (0, _jsCsp.putAsync)(out, sentinel);

                  case 9:
                  case 'end':
                    return context$4$0.stop();
                }
              }, callee$3$0, this);
            }));
            return out;
          });
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          context$2$0.prev = 5;
          _iterator4 = outs[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            context$2$0.next = 21;
            break;
          }

          out = _step4.value;
          el = undefined;

        case 10:
          context$2$0.next = 12;
          return out;

        case 12:
          context$2$0.t0 = el = context$2$0.sent;

          if (!(context$2$0.t0 !== sentinel)) {
            context$2$0.next = 18;
            break;
          }

          context$2$0.next = 16;
          return (0, _jsCsp.put)(c, el);

        case 16:
          context$2$0.next = 10;
          break;

        case 18:
          _iteratorNormalCompletion4 = true;
          context$2$0.next = 7;
          break;

        case 21:
          context$2$0.next = 27;
          break;

        case 23:
          context$2$0.prev = 23;
          context$2$0.t1 = context$2$0['catch'](5);
          _didIteratorError4 = true;
          _iteratorError4 = context$2$0.t1;

        case 27:
          context$2$0.prev = 27;
          context$2$0.prev = 28;

          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
          }

        case 30:
          context$2$0.prev = 30;

          if (!_didIteratorError4) {
            context$2$0.next = 33;
            break;
          }

          throw _iteratorError4;

        case 33:
          return context$2$0.finish(30);

        case 34:
          return context$2$0.finish(27);

        case 35:
          outs.forEach(function (out) {
            return out.close();
          });
          c.close();

        case 37:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this, [[5, 23, 27, 35], [28,, 30, 34]]);
  }));
  return c;
}

$(zip, concat);

function filterBy(ch, other) {
  var bool = arguments[2] === undefined ? false : arguments[2];

  var c = (0, _jsCsp.chan)();

  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          el = undefined;

        case 1:
          context$2$0.next = 3;
          return other;

        case 3:
          context$2$0.t0 = el = context$2$0.sent;

          if (!(context$2$0.t0 !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 8;
            break;
          }

          bool = !!el;
          context$2$0.next = 1;
          break;

        case 8:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));

  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          el = undefined;

        case 1:
          context$2$0.next = 3;
          return ch;

        case 3:
          context$2$0.t0 = el = context$2$0.sent;

          if (!(context$2$0.t0 !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 10;
            break;
          }

          if (!bool) {
            context$2$0.next = 8;
            break;
          }

          context$2$0.next = 8;
          return (0, _jsCsp.put)(c, el);

        case 8:
          context$2$0.next = 1;
          break;

        case 10:
          c.close();

        case 11:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
  return c;
}

// todo - combinator

function sampledBy(ch, other) {
  var c = (0, _jsCsp.chan)(),
      final;

  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          el = undefined;

        case 1:
          context$2$0.next = 3;
          return ch;

        case 3:
          context$2$0.t0 = el = context$2$0.sent;

          if (!(context$2$0.t0 !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 8;
            break;
          }

          final = el;
          context$2$0.next = 1;
          break;

        case 8:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));

  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          el = undefined;

        case 1:
          context$2$0.next = 3;
          return other;

        case 3:
          context$2$0.t0 = el = context$2$0.sent;

          if (!(context$2$0.t0 !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 9;
            break;
          }

          context$2$0.next = 7;
          return (0, _jsCsp.put)(c, final);

        case 7:
          context$2$0.next = 1;
          break;

        case 9:
          c.close();

        case 10:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
  return c;
}

function takeWhileBy(ch, other) {
  var bool = arguments[2] === undefined ? true : arguments[2];

  var c = (0, _jsCsp.chan)();

  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          el = undefined;

        case 1:
          context$2$0.next = 3;
          return other;

        case 3:
          if (!(el = context$2$0.sent)) {
            context$2$0.next = 6;
            break;
          }

          context$2$0.next = 1;
          break;

        case 6:
          bool = false;

        case 7:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));

  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          el = undefined;

        case 1:
          context$2$0.next = 3;
          return ch;

        case 3:
          context$2$0.t1 = el = context$2$0.sent;
          context$2$0.t0 = context$2$0.t1 !== _jsCsp2['default'].CLOSED;

          if (!context$2$0.t0) {
            context$2$0.next = 7;
            break;
          }

          context$2$0.t0 = bool;

        case 7:
          if (!context$2$0.t0) {
            context$2$0.next = 12;
            break;
          }

          context$2$0.next = 10;
          return (0, _jsCsp.put)(c, el);

        case 10:
          context$2$0.next = 1;
          break;

        case 12:
          c.close();

        case 13:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
  return c;
}

function takeUntilBy(ch, other) {
  var bool = arguments[2] === undefined ? true : arguments[2];

  var c = (0, _jsCsp.chan)();

  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return other;

        case 2:
          bool = false;

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));

  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          el = undefined;

        case 1:
          context$2$0.next = 3;
          return ch;

        case 3:
          context$2$0.t1 = el = context$2$0.sent;
          context$2$0.t0 = context$2$0.t1 !== _jsCsp2['default'].CLOSED;

          if (!context$2$0.t0) {
            context$2$0.next = 7;
            break;
          }

          context$2$0.t0 = bool;

        case 7:
          if (!context$2$0.t0) {
            context$2$0.next = 12;
            break;
          }

          context$2$0.next = 10;
          return (0, _jsCsp.put)(c, el);

        case 10:
          context$2$0.next = 1;
          break;

        case 12:
          c.close();

        case 13:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
  return c;
}

function bufferBy(ch, other) {
  var flushOnEnd = arguments[2] === undefined ? true : arguments[2];

  var c = (0, _jsCsp.chan)(),
      arr = [];

  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          el = undefined;

        case 1:
          context$2$0.next = 3;
          return other;

        case 3:
          context$2$0.t0 = el = context$2$0.sent;

          if (!(context$2$0.t0 !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 9;
            break;
          }

          (0, _jsCsp.putAsync)(c, arr);
          arr = [];
          context$2$0.next = 1;
          break;

        case 9:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));

  (0, _jsCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var el;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          el = undefined;

        case 1:
          context$2$0.next = 3;
          return ch;

        case 3:
          context$2$0.t0 = el = context$2$0.sent;

          if (!(context$2$0.t0 !== _jsCsp2['default'].CLOSED)) {
            context$2$0.next = 8;
            break;
          }

          arr.push(el);
          context$2$0.next = 1;
          break;

        case 8:
          if (!(arr.length > 0 && flushOnEnd)) {
            context$2$0.next = 11;
            break;
          }

          context$2$0.next = 11;
          return (0, _jsCsp.put)(c, arr);

        case 11:
          c.close();

        case 12:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
  return c;
}

$(filterBy, sampledBy, takeWhileBy, takeUntilBy, bufferBy);

// we start the takes early or they might be lost on closed channels

