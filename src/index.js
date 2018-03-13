const Observable = require('./lib/Observable')
const Observer = require('./lib/Observer')
const Subscriber = require('./lib/Subscriber')
const Subscription = require('./lib/Subscription')

const staticOf = require('./lib/Observable/of')
Observable.of = staticOf

const staticFrom = require('./lib/Observable/from')
Observable.from = staticFrom

const staticEmpty = require('./lib/Observable/empty')
Observable.empty = staticEmpty

const staticNever = require('./lib/Observable/never')
Observable.never = staticNever

const staticInterval = require('./lib/Observable/interval')
Observable.interval = staticInterval

const staticThrow = require('./lib/Observable/throw')
Observable.throw = staticThrow

const staticFromPromise = require('./lib/Observable/fromPromise')
Observable.fromPromise = staticFromPromise

const staticRange = require('./lib/Observable/range')
Observable.range = staticRange

const staticTimer = require('./lib/Observable/timer')
Observable.timer = staticTimer

const staticFromEvent = require('./lib/Observable/fromEvent')
Observable.fromEvent = staticFromEvent

const doOperator = require('./lib/Observable/tap')
Observable.prototype.do = doOperator

const mapOperator = require('./lib/Observable/map')
Observable.prototype.map = mapOperator

const filterOperator = require('./lib/Observable/filter')
Observable.prototype.filter = filterOperator

const scanOperator = require('./lib/Observable/scan')
Observable.prototype.scan = scanOperator

const reduceOperator = require('./lib/Observable/reduce')
Observable.prototype.reduce = reduceOperator

const defaultIfEmptyOperator = require('./lib/Observable/defaultIfEmpty')
Observable.prototype.defaultIfEmpty = defaultIfEmptyOperator

const takeOperator = require('./lib/Observable/take')
Observable.prototype.take = takeOperator

const takeLastOperator = require('./lib/Observable/takeLast')
Observable.prototype.takeLast = takeLastOperator

const skipOperator = require('./lib/Observable/skip')
Observable.prototype.skip = skipOperator

const timeoutOperator = require('./lib/Observable/timeout')
Observable.prototype.timeout = timeoutOperator

const distinctUntilChanged = require('./lib/Observable/distinctUntilChanged')
Observable.prototype.distinctUntilChanged = distinctUntilChanged

const retryOperator = require('./lib/Observable/retry')
Observable.prototype.retry = retryOperator

const everyOperator = require('./lib/Observable/every')
Observable.prototype.every = everyOperator

const firstOperator = require('./lib/Observable/first')
Observable.prototype.first = firstOperator

const lastOperator = require('./lib/Observable/last')
Observable.prototype.last = lastOperator

const bufferCountOperator = require('./lib/Observable/bufferCount')
Observable.prototype.bufferCount = bufferCountOperator

const { pipe } = require('./lib/util/pipe')

module.exports = {
  Observable,
  Observer,
  Subscriber,
  Subscription,
  pipe
}
