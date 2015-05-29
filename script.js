import csp, {go, chan, putAsync} from 'js-csp';
let {fromColl, into, pipeline} = csp.operations;
import xd from 'transducers.js';

// console.log(xd.seq([1, 1, 1, 2, 2, 3, 4, 5, 5, 5, 5, 5, 6, 7], xd.dedupe()))
// // as expected - [ 1, 2, 3, 4, 5, 6, 7 ]

// go(function*(){
//   var c = chan(7);
//   pipeline(c, xd.dedupe(), fromColl([1, 1, 1, 2, 2, 3, 4, 5, 5, 5, 5, 5, 6, 7]));
//   var res = yield into([], c);
//   console.log(res);
//   // - expected - [ 1, 2, 3, 4, 5, 6, 7 ]
//   // - actual - [ 1, 1, 1, 2, 2, 3, 4, 5, 5, 5, 5, 5, 6, 7 ]
// })

import {withInterval, chain as _} from './index.js';

let now = () => Date.now();


go(function*(){
  var ch = _(withInterval(100, c => putAsync(c, now())))
    .map(x => Math.round((x / 100) % 100))
    .log()
    .val();

  while(true){
    yield ch;
  }

});

