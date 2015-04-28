
```

js-csp cheatsheet:

basic
---

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
- log
- offLog

- valuesToErrors
- errorsToValues
- mapErrors
- filterErrors
- endOnError
- skipValues
- skipErrors
- skipEnd
- beforeEnd

- slidingWindow

 use transducers for the following 
- map
- filter
- take
- takeWhile
- reduce
- flatten


- skip
- skipWhile
- skipDuplicates


- withHandler
- combine
- merge
- pool
- repeat
- flatMap
- flatMapLatest
- flatMapFirst
- flatMapConcat
- flatMapConcurLimit
- skipWhileBy
- skipUntilBy
- bufferWhileBy
- awaiting





