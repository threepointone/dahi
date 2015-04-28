(work in progress)

dahi
---

a port of [kefir](https://pozadi.github.io/kefir/) for channels from [js-csp](https://github.com/ubolonton/js-csp)

`npm install dahi`

create a channel
---

`never()`
creates a channel that's already closed 

`later(wait)`
creates a channel that produces a single _value_ after _wait_ milliseconds, and then closes.

`interval(wait, value)`
creates a channel that produces the same _value_ each _interval_ milliseconds, and never closes.

`sequentially(interval, values)`
creates a channel containing the _values_, delivered with the given _interval_ milliseconds, and then closes

`fromPoll(interval, fn)`
creates a channel that polls the given _fn_ function, with the given _interval_ in milliseconds, and emits the values returned by _fn_. Never ends.

`withInterval(interval, handler)`
creates a channel that calls the given _handler_ function, with the given _interval_ in milliseconds. The _handler_ function is called with one argument — a channel.

`fromCallback(callback)`
convert a function than accepts a _callback_ as the first argument, to a channel. Emits at most one value when _callback_ is called, then ends.

`fromNodeCallback(callback)`
like `fromCallback`, but accepts a node style callback which gets arguments in the form `(err, res)`. throws when an error is passed. 


`fromEvents(emitter, event)`
returns a channel with every _event_ from emitter


`log()`
logs every put onto the channel

`diff(c1, c2)`

scan
delay
debounce
throttle
bufferWhile
transduce
zip
concat
filterBy
sampledBy
takeWhileBy
takeUntilBy
bufferBy


