require('chai').should();
// todo - check time diffs on a range, not just > (gt)
import csp, {go, timeout, chan, putAsync} from 'js-csp';
let {into, take, reduce, fromColl} = csp.operations;
import xd from 'transducers.js';
import { EventEmitter } from 'events';

import {
  // create
  later,
  sequentially,
  interval,
  fromPoll,
  withInterval,
  fromCallback,
  fromNodeCallback,
  fromEvents,

  // modify
  diff,
  scan,
  delay,
  throttle,
  debounce,
  bufferWhile,
  transduce,

  // combine
  zip,
  concat,

  // combine two
  filterBy,
  sampledBy,
  takeWhileBy,
  takeUntilBy,
  bufferBy
} from '../index.js';

function times(n, fn){
  for(var i =0; i<n; i++) fn(i);
}

function now(){
  return new Date().getTime()
}

describe('create', ()=>{
  it('later', done => go(function*(){
    var start = now();
    (yield later(1000, 25)).should.eql(25);
    ((now() - start) > 1000).should.be.ok;
    done();
  }))

  it('interval', done => go(function*(){
    var start = now();
    (yield reduce((a,b)=> a+b, 0, take(5, interval(200, 5)))).should.eql(25);
    ((now() - start) > 1000).should.be.ok;
    done();
  }))

  it('sequentially', done => go(function*(){
    var start = now();
    (yield into([], sequentially(200, ['a', 'b', 'c', 'd', 'e'])))
      .should.eql(['a', 'b', 'c', 'd', 'e']);
    ((now() - start) > 1000).should.be.ok;
    done();
  }))


  it('fromPoll', done => go(function*(){
    var start = now();
    var i = 0;
    (yield reduce((a,b) => a+b, 0, take(5, fromPoll(200, ()=> i++)))).should.eql(10);
    ((now() - start) > 1000).should.be.ok;
    done();
  }))

  it('withInterval', done => go(function*(){
    var start = now();
    (yield into([], take(5, withInterval(200, ch => putAsync(ch, 5))))).should.eql([5, 5, 5, 5, 5]);
    ((now() - start) > 1000).should.be.ok;
    done();
  }))

  it('fromCallback', done => go(function*(){
    var start = now();
    (yield fromCallback((fn)=> setTimeout(()=> fn(5), 200))).should.eql(5);
    ((now() - start) >= 200).should.be.ok;
    done();
  }))

  it('fromNodeCallback', done => go(function*(){
    var start = now();
    (yield fromNodeCallback(fn => setTimeout(()=> fn(new Error('some error')), 200))).should.be.an.Error;
    (yield fromNodeCallback(fn => setTimeout(()=> fn(null, 'value'), 200))).should.eql('value');
    ((now() - start) > 200).should.be.ok;
    done();

  }))

  it('fromEvents', done => go(function*(){
    var emitter = new EventEmitter();
    var ch = fromEvents(emitter, 'beep');
    for(var i=0; i<20; i++){
      emitter.emit('beep', 1);
    }
    (yield into([], take(5, ch))).map(arr => arr[0]).should.eql([1, 1, 1, 1, 1]);
    ch.close();
    done();    
  }))  
});

describe('modify', ()=>{
  it('diff', done => go(function*(){  
    (yield into([], diff(fromColl([1, 2, 3, 4, 5]), (prev, next) => next - prev, 0)))
      .should.eql([1, 1, 1, 1, 1]);
    done();
  }));

  it('scan', done => go(function*(){
    var start = now();
    (yield into([], scan(fromColl([1, 2, 3, 4, 5]), (prev, next) => next + prev, 0)))
      .should.eql([1, 3, 6, 10, 15]);
    done();
  }))

  it('delay', done => go(function*(){
    var start = now();
    (yield into ([], delay(sequentially(100, [1, 2, 3, 4, 5]), 200))).should.eql([1, 2, 3, 4, 5]);
    ((now() - start) > 700).should.be.ok;
    done();
  }));

  it('debounce', done => go(function*(){
    var start = now();
    var c = chan(), tc = debounce(c, 20);
    times(10, i => putAsync(c, i));
    yield timeout(300);
    times(10, i => putAsync(c, i));    
    (yield into([], take(2, tc))).should.eql([9, 9]);    
    c.close();
    done();
  }))

  it('throttle', done => go(function*(){
    var start = now();
    (yield into([], take(3, throttle(sequentially(50, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 100))))
      .should.eql([2, 4, 6]);
    done();
  }))

  it('bufferWhile', done => go(function*(){
    (yield into([], bufferWhile(sequentially(50, [1, 2, 3, 4, 5, 6]), el => el%4!==0))).should.eql([[1, 2, 3, 4], [5, 6]]);
    done();
  }))

  it('transduce', done => go(function*(){
    (yield into([], transduce(sequentially(100, [1, 2, 3, 4, 5]), xd.compose(xd.map(x=> x*x), xd.filter(x => x%2!==0 )))))
      .should.eql([1, 9, 25]);
    done();
  }))

})

describe('combine', ()=>{
  it('zip', done => go(function*(){
    var c1 = sequentially(100, [1, 2, 3, 4, 5]);
    var c2 = sequentially(200, ['a', 'b', 'c']);
    var c3 = sequentially(300, ['Ω', '∫']);
    (yield into([], zip([c1, c2, c3]))).should.eql([ [1, 'a', 'Ω'], [2, 'b','∫']]);
    done();
  }))

  it('concat', done => go(function*(){
    var c1 = sequentially(50, [1, 2, 3, 4, 5]);
    var c2 = sequentially(100, ['a', 'b', 'c']);
    var c3 = sequentially(100, ['Ω', '∫']);
    (yield into([], concat([c1, c2, c3]))).should.eql([1, 2, 3, 4, 5, 'a', 'b', 'c', 'Ω', '∫'])
    done();
  }))  

})

describe('combine two', ()=> {
  it('filterBy', done => go(function*(){
    var c1 = sequentially(50, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    var c2 = sequentially(100, [true, false, true, false]);
    (yield into([], filterBy(c1, c2))).should.eql([2, 3, 6, 7])
    done();
  }))

  it('sampledBy', done => go(function*(){
    
    var c1 = sequentially(50, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    var c2 = sequentially(100, [0, 0, 0, 0]);
    (yield into([], sampledBy(c1, c2))).should.eql([1, 3, 5, 7])
    done();
  }))

  it('takeWhileBy', done => go(function*(){
    
    var c1 = sequentially(100, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    var c2 = sequentially(100, [true, true, false]);
    (yield into([], takeWhileBy(c1, c2))).should.eql([1, 2, 3])
    done();
  }))

  it('takeUntilBy', done => go(function*(){
    var c1 = sequentially(100, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    var c2 = later(500, 1);
    (yield into([], takeUntilBy(c1, c2))).should.eql([1, 2, 3, 4]);
    done();
  }))

  it('bufferBy', done => go(function*(){
    var c1 = sequentially(100, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    var c2 = sequentially(300, [1, 1, 1]);
    (yield into([], bufferBy(c1, c2))).should.eql([[1,2], [3, 4, 5], [6, 7, 8], [9, 10, 11, 12, 13]]); // iknorite!
    done();
  }))
  
})







