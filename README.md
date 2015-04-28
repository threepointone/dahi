(work in progress)

dahi
---

a port of [kefir](https://pozadi.github.io/kefir/) for channels from [js-csp](https://github.com/ubolonton/js-csp)

`npm install dahi`

(these api docs are derived/modified from kefir)

create a channel
---

`never()`
creates a channel that's already closed 

`later(wait)`
creates a channel that produces a single `value` after `wait` milliseconds, and then closes.

`interval(wait, value)`
creates a channel that produces the same `value` each `interval` milliseconds, and never closes.

`sequentially(interval, values)`
creates a channel containing the `values`, delivered with the given `interval` milliseconds, and then closes

`fromPoll(interval, fn)`
creates a channel that polls the given `fn` function, with the given `interval` in milliseconds, and emits the values returned by `fn`. Never ends.

`withInterval(interval, handler)`
creates a channel that calls the given `handler` function, with the given `interval` in milliseconds. The `handler` function is called with one argument — a channel.

`fromCallback(callback)`
convert a function than accepts a `callback` as the first argument, to a channel. Emits at most one value when `callback` is called, then ends.

`fromNodeCallback(callback)`
like `fromCallback`, but accepts a node style callback which gets arguments in the form `(err, res)`. 


`fromEvents(emitter, event)`
returns a channel with every `event` from emitter

modify a channel
---
`transduce(ch, xf)`

`diff(channel, fn, seed)`
On each value from `channel`, calls `fn` with the previous and current values as arguments. At first time, calls `fn` with `seed` and current value. Puts whatever `fn` returns. If no `seed` is provided, the first value will be used as a seed, and the result channel won't put the first value. If no `fn` function is provided, `(a, b) => [a, b]` will be used.

`scan(channel, fn, seed)`
On each value from `channel`, calls `fn`with the previous result returned by `fn` and the current value put on the `channel`. At first time, calls `fn` with seed as previous result. Puts forward whatever `fn` returns. If no `seed` is provided, the first value will be used as a `seed`.

`delay(ch, wait)`

`debounce(ch, wait)`

`throttle(ch, wait)`

`bufferWhile(channel, predicate, flushOnEnd?)`

`zip(channels)`

`concat(channels)`

`filterBy(chan, otherChan)`

`sampledBy(chan, otherChan)`

`takeWhileBy(chan, otherChan)`

`takeUntilBy(chan, otherChan)`

`bufferBy(chan, otherChan)`

`log()`
logs every put onto the channel