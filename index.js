import csp, {go, timeout, chan, putAsync} from 'js-csp';

export function never(){
  var c = chan();
  c.close();
  return c;
}

export function later(wait, value){
  var c = chan();
  setTimeout(()=>{
    putAsync(c, value);
    c.close();
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

export function fromPoll(interval, fn){
  var c = chan();
  setInterval(()=>{
    putAsync(c, fn());
  }, interval);
  return c;  
}

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
    putAsync(c, value);
    c.close();
  })
  return c;
}

export function fromNodeCallback(fn){
  var c = chan();
  fn(function(err, res){
    putAsync(c, err || res);
    c.close();
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

