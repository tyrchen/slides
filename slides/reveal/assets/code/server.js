// RxJs: mimic server side metrics

const Rx = require('rx')

const log = console.log.bind(console)
const error = console.error.bind(console)
const boom = () => Math.floor((new Date()).getTime() * Math.random()) % 23 === 0

const INTERVAL = 100
const BUFFER_TIME = 2000
const BUFFER_COUNT = 1000

const randBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const rand100 = randBetween.bind(null, 0, 100)

// mimic server metric collection, with potential errors
function getMetrics(host) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (boom()) {
        error(`${host}: Oops, bad thing happened`)
        reject({})
      } else {
        const now = new Date().getTime()
        resolve({
          dt: now,
          metrics: [
            {name: `${host}.cpu`, value: rand100()},
            {name: `${host}.mem`, value: rand100()},
            {name: `${host}.disk`, value: rand100()},
            {name: `${host}.network`, value: rand100()},
          ]
        })
      }
    }, randBetween(10, 150))
  })
}

// these are the servers...
function getHosts() {
  return ['frodo', 'sam', 'pippin', 'merry', 'bilbo', 'gollum']
}

function getMetricObservable(interval, asyncFunc) {
  var inFlight = false

  return Rx.Observable.timer(randBetween(interval, interval * 5), interval)
    .filter(() => !inFlight)
    .do(() => inFlight = true)
    .map(() => Rx.Observable.onErrorResumeNext(Rx.Observable.fromPromise(asyncFunc())))
    .do(() => inFlight = false)
    .mergeAll()
}

const metrics$ = Rx.Observable.merge(
  getHosts().map(host => getMetricObservable(INTERVAL, getMetrics.bind(null, host)))
)

const handler = metrics$
  .flatMap(data => {
    return Rx.Observable.from(data.metrics.map(m => {
      m.dt = data.dt // this is not good to modify the data
      return m
    }))
  })
  .bufferWithTimeOrCount(BUFFER_TIME, BUFFER_COUNT)
  .subscribe(log, error, log)


