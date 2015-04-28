
```js
never()
returns a channel that is already closed

later(wait, value)
returns a channel that produces a single value after wait milliseconds, then closes 


interval(interval, value)
sequentially
fromPoll
withInterval
fromCallback
Convert a function than accepts a callback as the first argument. Emits at most one value when callback is called, then ends. The fn function will be called at most once, when the first subscriber will be added to the stream.


fromNodeCallback
fromEvents
stream

```

from js-csp :

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