// todo - accept chanopts
// todo - try to eliminate putAsync

import csp, {go, timeout, chan, putAsync, alts, put} from 'js-csp';
let {pipe} = csp.operations;
import xd from 'transducers.js';

let {pipelineAsync} = csp.operations;

// chaining helpers
class Chain{
  constructor(o){
    this.o = o;
  }
  val(){
    return this.o;
  }
}

function $(...fns){
  fns.forEach(fn => Object.assign(Chain.prototype, {[fn.name]: function(...args) {
    this.o = fn(this.o, ...args);
    return this;
  }}));
}

export function chain(o){
  return new Chain(o);
}


// some basics
$(function into(ch, coll){
  return csp.operations.into(coll, ch);
});

//  CREATE

export function never(){
  var c = chan();
  c.close();
  return c;
}

export function later(wait, value){
  var c = chan();
  setTimeout(()=>{
    go(function*(){
      yield put(c, value);
      c.close();
    });
  }, wait);
  return c;
}

export function interval(duration, value){
  var c = chan();
  var intval = setInterval(()=>{
    putAsync(c, value);
  }, duration);

  c.stop = ()=> {
    clearInterval(intval);
    c.close();
  };
  return c;
}

export function sequentially(duration, values){
  var c = chan();
  go(function*(){
    for(let value of values){
      yield timeout(duration);
      putAsync(c, value);
    }
    c.close();
  });
  return c;
}

export function fromPoll(duration, fn){
  var c = chan();
  var intval = setInterval(()=>{
    putAsync(c, fn());
  }, duration);
  c.stop = ()=> {
    clearInterval(intval);
    c.close();
  };
  return c;
}

export function withInterval(duration, handler){
  var c = chan();
  var intval = setInterval(()=>{
    handler(c);
  }, duration);
  c.stop = ()=> {
    clearInterval(intval);
    c.close();
  };
  return c;
}

export function fromCallback(fn){
  var c = chan();
  fn(function(value){
    go(function*(){
      yield put(c, value);
      c.close();
    });
  });
  return c;
}

export function fromNodeCallback(fn){
  var c = chan();
  fn(function(err, res){
    go(function*(){
      yield put(c, err || res);
      c.close();
    });
  });
  return c;
}

export function fromEvents(emitter, event){
  var c = chan();
  var fn = (...args) => putAsync(c, args);
  emitter.on(event, fn);
  c.stop = () => {
    emitter.removeListener(event, fn);
    c.close();
  };
  return c;
}

export function log(ch, prefix=''){
  var c = chan();
  go(function*(){
    var el;
    while((el = yield ch) !== csp.CLOSED){
      console.log(prefix, el);
      yield put(c, el);
    }
    c.close();
  });
  return c;
}

export function transduce(ch, xf, bufferOrN=1){
  var c = chan(bufferOrN, xf);
  pipe(ch, c);
  return c;
}

$(log, transduce);

// todo - stoplog?

// MODIFY

export function map(ch, fn){
  return transduce(ch, xd.map(fn));
}

export function filter(ch, fn){
 return transduce(ch, xd.filter(fn));
}

export function takeWhile(ch, fn){
  return transduce(ch, xd.takeWhile(fn));
}

export function last(ch){
  var c = chan();
  go(function*(){
    var el, final;
    while((el = yield ch) !== csp.CLOSED){
      final = el;
    }
    yield put(c, final);
    c.close();
  });
  return c;
}

export function flatten(ch, fn){
  var c = chan();
  go(function*(){
    var el;
    while(((el = yield ch) !== csp.CLOSED)){
      for(let e of el)
        yield put(c, e);
    }
    c.close();
  });
  return c;
}

$(map, filter, takeWhile, last, flatten);

export function skip(ch, n){
   return transduce(ch, xd.drop(n));
}

export function skipWhile(ch, fn){
  return transduce(ch, xd.dropWhile(fn));
}

// todo - comparator fn
export function skipDuplicates(ch){
  return transduce(ch, xd.dedupe());
}

$(skip, skipWhile, skipDuplicates);


export function diff(ch, fn = (a, b) => [a, b], seed){
  var c = chan();
  go(function*(){
    if(typeof seed === 'undefined'){
      seed = yield ch;
    }
    var final = seed, current;
    while ((current = yield(ch)) !== csp.CLOSED){
      yield put(c, fn(final, current));
      final = current;
    }
    c.close();
  });
  return c;
}


export function scan(ch, fn, seed){
  var c = chan();
  go(function*(){
    if(typeof seed === 'undefined'){
      seed = yield ch;
    }
    var final = seed, current;
    while ((current = yield(ch)) !== csp.CLOSED){
      yield put(c, final = fn(final, current));
    }
    c.close();
  });
  return c;
}

$(diff, scan);

export function delay(ch, wait){
  var c = chan();
  pipelineAsync(10, c,
    (val, sink) => setTimeout(()=>go(function*(){
      yield put(sink, val);
      sink.close();
    }), wait), ch);
  return c;
}



// todo - immediate:true
export function debounce(ch, wait){
  var c = chan();
  go(function*(){
    var final = yield ch;
    while(final !== csp.CLOSED){
      var res = yield alts([timeout(wait), ch]);
      if(res.channel !== ch){
        putAsync(c, final);
      }
      else{
        final = res.value;
      }
    }
    c.close();
  });

  return c;
}

export function throttle(ch, wait){
  var c = chan();

  go(function*(){
    var final = (yield ch), t = timeout(wait);
    while(final !== csp.CLOSED){
      t = t || timeout(wait);
      var res = yield alts([ch, t]);

      if(res.channel === ch){
        final = res.value;
      }
      else if(res.channel === t){
        if(final !== undefined){
          putAsync(c, final);
          final = undefined;
        }
        t = undefined;
      }
    }
    c.close();
  });
  return c;
}




export function bufferWhile(ch, predicate, flushOnEnd=true){
  var arr = [], c = chan();
  go(function*(){
    let el;
    while((el = yield ch) !== csp.CLOSED){
      arr.push(el);
      if(!predicate(el)){
        yield put(c, arr);
        arr = [];
      }
    }
    if(flushOnEnd && arr.length > 0){
      yield put(c, arr);
    }
    c.close();
  });
  return c;
}

$(delay, debounce, throttle, bufferWhile);

// COMBINE

// todo - combinator
export function zip(...srcs){
  var c = chan();
  go(function*(){
    var done = false;
    while(!done){
      var arr = [];
      for (let src of srcs){
        if(!done){
          var el = yield src;
          if(el === csp.CLOSED) {
            done = true;
          }
          else {
            arr.push(el);
          }
        }
      }
      putAsync(c, arr);
    }
    c.close();
  });
  return c;
}

// todo - combinator
export function concat(...srcs) {
  var c = chan();
  go(function*(){
    // we start the takes early or they might be lost on closed channels
    var sentinel = {};
    var outs = srcs.map(src => {
      let out = chan();
      go(function*(){
        let el;
        while((el = yield src) !== csp.CLOSED){
          putAsync(out, el);
        }
        putAsync(out, sentinel);
      });
      return out;
    });
    for(let out of outs){
      let el;
      while((el = yield out) !== sentinel){
        yield put(c, el);
      }
    }
    outs.forEach(out => out.close());
    c.close();
  });
  return c;
}

$(zip, concat);

export function filterBy(ch, other, bool=false){
  var c = chan();

  go(function*(){
    let el;
    while((el = yield other) !== csp.CLOSED){
      bool = !!el;
    }
  });

  go(function*(){
    let el;
    while((el = yield ch) !== csp.CLOSED){
      if(bool) {
        (yield put(c, el));
      }
    }
    c.close();
  });
  return c;
}
// todo - combinator
export function sampledBy(ch, other){
  var c = chan(), final;

  go(function*(){
    let el;
    while((el = yield ch) !== csp.CLOSED){
      final = el;
    }
  });

  go(function*(){
    let el;
    while((el = yield other) !== csp.CLOSED){
      yield put(c, final);
    }
    c.close();
  });
  return c;
}

export function takeWhileBy(ch, other, bool=true){
  var c = chan();

  go(function*(){
    let el;
    while(!!(el = yield other)){}
    bool = false;
  });

  go(function*(){
    let el;
    while(((el = yield ch) !== csp.CLOSED) && bool){
      yield put(c, el);
    }
    c.close();
  });
  return c;
}

export function takeUntilBy(ch, other, bool=true){
  var c = chan();

  go(function*(){
    yield other;
    bool = false;
  });

  go(function*(){
    let el;
    while(((el = yield ch) !== csp.CLOSED) && bool){
      yield put(c, el);
    }
    c.close();
  });
  return c;
}


export function bufferBy(ch, other){
  var c = chan(), arr = [];

  go(function*(){
    let el;
    while((el = yield other) !== csp.CLOSED){
      putAsync(c, arr);
      arr = [];
    }
  });

  go(function*(){
    let el;
    while(((el = yield ch) !== csp.CLOSED)){
      arr.push(el);
    }
    if(arr.length > 0) {
      (yield put(c, arr));
    }
    c.close();
  });
  return c;

}

$(filterBy, sampledBy, takeWhileBy, takeUntilBy, bufferBy);

