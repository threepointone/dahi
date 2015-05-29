(work in progress)

dahi
---

FRP + channels = max win.

a port of [kefir](https://pozadi.github.io/kefir/) for [js-csp](https://github.com/ubolonton/js-csp)

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

`map(channel, fn)`
applies `fn` to every value in `channel`

`filter(channel, predicate)`
applies `predicate` to every value in `channel`, and only allows truthy values to be passed on

`takeWhile(channel, predicate)`
puts values from `channel` until `predicate` applied to a value returns false. Ends when `predicate` returns false.

`flatten(channel)`
For this method it's expected that the `channel` 'emits' arrays. The result channel will then 'emit' each element of these arrays.

`last(channel)`
returns a channel with only the last value from `channel`

`skip(channel, n)`
drops the first `n` elements from `channel` and returns a channel with the rest

`skipWhile(channel, predicate)`
Skips values from `channel` until the `predicate` applied to a value returns false, then stops applying `predicate` to values and 'emits' all of them.

`skipDuplicates(channel)`
Skips duplicate values using === for comparison.

`transduce(channel, xf)`
applies the transducer `xf` to every value in `channel`

`diff(channel, fn, seed)`
On each value from `channel`, calls `fn` with the previous and current values as arguments. At first time, calls `fn` with `seed` and current value. Puts whatever `fn` returns. If no `seed` is provided, the first value will be used as a seed, and the result channel won't put the first value. If no `fn` function is provided, `(a, b) => [a, b]` will be used.

`scan(channel, fn, seed)`
On each value from `channel`, calls `fn` with the previous result returned by `fn` and the current value put on the `channel`. At first time, calls `fn` with seed as previous result. Puts forward whatever `fn` returns. If no `seed` is provided, the first value will be used as a `seed`.

`delay(ch, wait)`
Delays all takes by `wait` milliseconds.

`debounce(ch, wait)`
debounces all takes by `wait` milliseconds.

`throttle(ch, wait)`
throttles all takes by `wait` milliseconds.

`bufferWhile(channel, predicate, flushOnEnd?)`
adds every value from `channel` to a buffer, and then passes it to to `predicate()`. If it returns false, then it flushes the buffer. Also flushes the buffer before end, but you can disable that by passing `flushOnEnd` as `false`.


combine channels
---
`zip(...channels)`
Creates a channel with values from `channels` lined up with each other. For example if you have two channels with values `[1, 2, 3]` and `[4, 5, 6, 7]`, the result channel will 'emit' `[1, 4]`, `[2, 5]`, and `[3, 6]`. The result channel will 'emit' the next value only when it has at least one value from each source channel.

`concat(...channels)`
Concatenates several `channels` into one channel. Like `csp.merge`, but switches to the next source only after the previous one ends.


combine two channels
---
`filterBy(chan, otherChan)`
Works like filter, but instead of calling a predicate on each value from `chan`, it checks the last value from `otherChan`.

`sampledBy(chan, otherChan)`
Returns a channel that emits the latest value from `chan` on each value from `otherChan`. Closes when `otherChan` closes.

`takeWhileBy(chan, otherChan)`
Works like `csp.operations.takeWhile`, but instead of using a predicate function it uses another channel. It takes values from `chan` until the first falsey value from `otherChan`.

`takeUntilBy(chan, otherChan)`
Similar to `takeWhileBy`, but instead of waiting for the first falsey value from `otherChan`, it waits for just any value from it.

`bufferBy(chan, otherChan, flushOnEnd=true)`
Buffers all values from `chan`, and flushes the buffer on each value from `otherChan`. Also flushes the buffer before end, but you can disable that by passing `flushOnEnd` as `false`.

`log(chan)`
logs every put onto the channel


open issues
---
- unfinished functions - list.md
- accept custom chanopts per function
- debounce immediate: true
- combine combinators
- audit putAsync usage
- error handling story
- fromPromise vs promiseChan
- close from producer side on infinite channels