require('chai').should();
// todo - check time diffs on a range, not just > (gt)
import csp, {go, timeout, chan, putAsync} from 'js-csp';

import {EventEmitter} from 'events';

import {
  later,
  sequentially,
  interval,
  fromPoll,
  withInterval,
  fromCallback,
  fromNodeCallback,
  fromEvents
} from '../index.js';

let {into, take, reduce} = csp.operations;

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
    (yield fromCallback(function(fn){
          setTimeout(()=> fn(5), 200);
        })).should.eql(5);
    ((now() - start) >= 200).should.be.ok;
    done();
  }))

  it('fromNodeCallback', done => go(function*(){
    var start = now();
    (yield fromNodeCallback(function(fn){
          setTimeout(()=> fn(new Error('some error')), 200);
        })).should.be.an.Error;

    (yield fromNodeCallback(function(fn){
          setTimeout(()=> fn(null, 'value'), 200);
        })).should.eql('value');
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
    done();    
  }))

  
});

