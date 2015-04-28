// todo - accept chanopts
// todo - try to eliminate putAsync
"use strict";

import csp, {go, timeout, chan, putAsync, alts, put} from 'js-csp';


let {pipelineAsync, pipeline} = csp.operations;

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
      c.close()
    })
  }, wait);
  return c;
}

// todo - clearInterval?
export function interval(interval, value){
  var c = chan();
  setInterval(()=>{
    putAsync(c, value);
  }, interval);
  return c;  
}

export function sequentially(interval, values){
  var c = chan();
  go(function*(){
    for(let value of values){
      yield timeout(interval);
      putAsync(c, value);
    }
    c.close();
  })
  return c;
}

// todo - clearInterval? 
export function fromPoll(interval, fn){
  var c = chan();
  setInterval(()=>{
    putAsync(c, fn());
  }, interval);
  return c;  
}

// todo - clearInterval? 
export function withInterval(interval, handler){
  var c = chan();
  setInterval(()=>{
    handler(c);
  }, interval);
  return c;
}

export function fromCallback(fn){
  var c = chan();
  fn(function(value){
    go(function*(){
      yield put(c, value);
      c.close();  
    })
    
  })
  return c;
}

export function fromNodeCallback(fn){
  var c = chan();
  fn(function(err, res){
    go(function*(){
      yield put(c, err || res);
      c.close();  
    })
  })
  return c;
}

// todo - how to unbind?
export function fromEvents(emitter, event){
  var c = chan();
  var fn = (...args) => putAsync(c, args)
  emitter.on(event, fn);  
  return c;
}

// Create a property
// - constant
// - constantError
// - fromPromise
// Convert observables
// - toProperty
// - changes

// Main observable methods
// - onValue
// - offValue
// - onError
// - offError
// - onEnd
// - offEnd
// - onAny
// - offAny
// - log
// - offLog

export function log(ch, prefix=''){
  var c = chan();
  go(function*(){
    var el;
    while((el = yield ch)!== csp.CLOSED){
      console.log(prefix, el);
      yield put(c, el);
    }
    c.close();
  })
}

// todo - stoplog?

 // use transducers for the following 
// - map
// - filter
// - take
// - takeWhile
// - reduce
// - flatten





// - skip
// - skipWhile
// - skipDuplicates

export function diff(ch, fn, seed){
  var c = chan();
  go(function*(){
    if(typeof seed === 'undefined'){
      seed = yield ch;
    }
    var last = seed, current;
    while ((current = yield(ch))!=csp.CLOSED){
      yield put(c, fn(last, current));
      last = current;
    }
    c.close();
  })
  return c;
}


export function scan(ch, fn, seed){
  var c = chan();
  go(function*(){
    if(typeof seed === 'undefined'){
      seed = yield ch;
    }
    var last = seed, current;
    while ((current = yield(ch))!=csp.CLOSED){      
      yield put(c, last = fn(last, current));      
    }
    c.close();
  })
  return c;
}

export function delay(ch, wait){
  var c = chan();
  pipelineAsync(10, c, 
    (val, ch) => setTimeout(()=>go(function*(){ 
      yield put(ch, val); 
      ch.close(); 
    }), wait), ch);
  return c;
}



// todo - immediate:true
export function debounce(ch, wait){
  var c = chan();
  go(function*(){
    var last = yield ch;
    while(last !== csp.CLOSED){
      var res = yield alts([timeout(wait), ch]);
      if(res.channel!==ch){
        putAsync(c, last)
      }
      else{
        last = res.value;
      }
    }
    c.close();  
  })
  
  return c;
}

export function throttle(ch, wait){
  var c = chan(), t;

  go(function*(){
    var last = (yield ch), t = timeout(wait);
    while(last !== csp.CLOSED){
      t = t || timeout(wait);
      var res = yield alts([ch, t]);
      
      if(res.channel === ch){
        last = res.value;
      }
      else if(res.channel === t){        
        if(last !== undefined){
          putAsync(c, last);
          last = undefined;
        }
        t = undefined;
      }
    }
    c.close();
  });
  return c;
}

// - valuesToErrors
// - errorsToValues
// - mapErrors
// - filterErrors
// - endOnError
// - skipValues
// - skipErrors
// - skipEnd
// - beforeEnd

export function transduce(ch, xf, keepOpen=false, exHandler=()=>{}){
  var c = chan();  
  pipeline(c, xf, ch, keepOpen, exHandler)
  return c;
}

// withHandler

// - combine
export function zip(srcs){
  var c = chan();
  go(function*(){
    var done = false;
    while(!done){
      var arr = [];
      for (let src of srcs){
        if(!done){
          var el = yield src;
          if(el === csp.CLOSED){
            done = true  
          }
          else{
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

// - merge
export function concat(srcs) {
  var c = chan();
  go(function*(){
    // we start the takes early or they might be lost on closed channels
    var sentinel = {};
    var outs = srcs.map(src => {
      let out = chan();
      go(function*(){
        let el;  
        while((el = yield src)!== csp.CLOSED){
          putAsync(out, el);
        }     
        putAsync(out, sentinel);
      })
      return out;
    })
    for(let out of outs){
      let el;
      while((el = yield out)!== sentinel){
        yield put(c, el);
      }        
    }
    outs.forEach(out => out.close());
    c.close();        
  })
  return c;
}
// - pool
// - repeat
// - flatMap
// - flatMapLatest
// - flatMapFirst
// - flatMapConcat
// - flatMapConcurLimit

export function filterBy(ch, other, bool=false){
  var c = chan();

  go(function*(){
    let el;
    while((el = yield other)!==csp.CLOSED){
      bool = !!el
    }
  });

  go(function*(){
    let el;
    while((el = yield ch)!==csp.CLOSED){   // samsher - 78997 22826
      bool && (yield put(c, el))
    }
    c.close();
  });
  return c;
}

// - filterBy
// - sampledBy
// - takeWhileBy
// - skipWhileBy
// - skipUntilBy
// - takeUntilBy
// - bufferBy
// - bufferWhileBy
// - awaiting


















