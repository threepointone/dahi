not implemented
---

Create a property
- constant
- constantError
- fromPromise
Convert observables
- toProperty
- changes

Main observable methods
- onValue
- offValue
- onError
- offError
- onEnd
- offEnd
- onAny
- offAny
- offLog *

- valuesToErrors
- errorsToValues
- mapErrors
- filterErrors
- endOnError
- skipValues
- skipErrors
- skipEnd
- beforeEnd

- slidingWindow *

- map *
- filter *
- take *
- takeWhile *
- reduce *
- flatten *


- skip *
- skipWhile *
- skipDuplicates *


- withHandler *
- combine *
- merge *
- pool *
- repeat *
- flatMap *
- flatMapLatest *
- flatMapFirst *
- flatMapConcat *
- flatMapConcurLimit *
- skipWhileBy *
- skipUntilBy *
- bufferWhileBy *
- awaiting *

* = will implement/howto


```

js-csp cheatsheet:

basic
---
chan(bufferOrN?, transducer?, exHandler?)

buffers.fixed(n)
buffers.dropping(n)
buffers.sliding(n)
buffers.promise()

timeout(msecs)

go(f*, args?)
spawn(generator)

yield put(ch, value)
yield take(ch)
yield alts(operations, options?)
yield sleep(msecs)
ch.close()

csp.CLOSED
csp.DEFAULT

conversion
---
onto(ch, coll, keepOpen?)
fromColl(coll)
reduce(f, init, ch)
into(coll, ch)

flow control
---
pipe(in, out, keepOpen?)
split(predicate, ch, trueBufferOrN?, falseBufferOrN?)
merge(chs, bufferOrN?)
pipeline(to, xf, from, keepOpen?, exHandler?)
pipelineAsync(n, to, af, from, keepOpen?)


high level abstractions
---
mult 
pub-sub
mix
transducers

```

