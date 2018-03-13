const { Observable, Observer, Subscriber } = require('../dist')


let observable1 = Observable.create(observer => {
  let i = 0
  observer.next(i++)
  const interval = setInterval(() => {
    observer.next(i++)
  }, 200)

  setTimeout(() => {
    observer.next('next') // next not dispatched after unsubscribe
    observer.complete() // complete not dispatched after unsubscribe
    observer.error('error') // error not dispatched after unsubscribe
  }, 600)

  return () => {
    console.log('clearInterval')
    clearInterval(interval)
  }
})

let subscription1 = observable1.subscribe(
  value => console.log(value),
  error => console.log(error),
  () => console.log('completed')
)

setTimeout(() => {
  subscription1.unsubscribe()
}, 500)

//=> 0
//=> 1
//=> 2
//=> clearInterval


let observable2 = new Observable(observer => {
  let timer = setTimeout(() => {
    observer.next('hello')
    observer.complete() // complete will trigger unsubscribe
    observer.next('world') // next not dispatched after complete
  }, 1000)

  return () => {
    clearTimeout(timer)
    console.log('clearTimeout')
  }
})

let subscription2 = observable2.subscribe(
  value => console.log(value),
  undefined,
  () => console.log('completed')
)

//=> hello
//=> completed
//=> clearTimeout


let observable3 = new Observable(observer => {
  let timer = setTimeout(() => {
    observer.next('hello')
    observer.error('error') // error will trigger unsubscribe
    observer.next('world') // next not dispatched after error
  }, 1000)

  return () => {
    clearTimeout(timer)
    console.log('clearTimeout')
  }
})

let subscription3 = observable3.subscribe(
  value => console.log(value),
  error => console.log(error),
  undefined
)

//=> hello
//=> error
//=> clearTimeout


setTimeout(() => {
  Observable.of(4, 5, 6).subscribe(
    x => console.log(x),
    error => console.log(error),
    () => console.log('completed')
  )
}, 1000)

//=> 4
//=> 5
//=> 6
//=> completed


setTimeout(() => {
  Observable.of(5, 6).map(x => x + 2).filter(x => x % 2 === 0).subscribe(
    x => console.log(x),
    error => console.log(error),
    () => console.log('completed')
  )
}, 1500)

//=> 8
//=> completed


setTimeout(() => {
  Observable.of(1, 2, 3).reduce((acc, x) => acc + x).subscribe(
    x => console.log(x),
    error => console.log(error),
    () => console.log('completed')
  )
}, 2000)

//=> 6
//=> completed


setTimeout(() => {
  Observable.of(1, 2, 3).scan((acc, x) => acc + x).subscribe(
    x => console.log(x),
    error => console.log(error),
    () => console.log('completed')
  )
}, 2500)

//=> 1
//=> 3
//=> 6
//=> completed


setTimeout(() => {
  Observable.of(5, 6).map(x => x + 2).do(x => console.log('do:' + x))
  .filter(x => x % 2 === 0).subscribe(
    x => console.log(x),
    error => console.log(error),
    () => console.log('completed')
  )
}, 3000)

//=> do:7
//=> do:8
//=> 8
//=> completed


setTimeout(() => {
  let subscription1 = Observable.interval(200).subscribe(
    x => console.log(x),
    error => console.log(error),
    () => console.log('completed')
  )
  setTimeout(() => {
    subscription1.unsubscribe()
  }, 500)
}, 3500)

//=> 0
//=> 1

setTimeout(() => {

  Observable.of().defaultIfEmpty('Empty!').subscribe(val => console.log(val))
  //=> Empty!

  Observable.range(1, 3).subscribe(val => console.log(val))
  //=> 1
  //=> 2
  //=> 3

  Observable.of(1, 2, 3).every(val => val % 2 === 0).subscribe(val => console.log(val))
  //=> false

  Observable.from([1, 2, 3]).subscribe(val => console.log(val))
  //=> 1
  //=> 2
  //=> 3

  Observable.of(1,2,3,4).skip(2).subscribe(console.log)
  //=> 3
  //=> 4

  Observable.of(1, 2, 3).take(1).subscribe(val => console.log(val))
  //=> 1

  Observable.fromPromise(new Promise(resolve => {resolve('Resolved!')}))
    .subscribe(val => console.log(val))
  //=> Resolved!

  Observable.timer(1000).subscribe(val => console.log(val))
  //=> 0

  let subscription1 = Observable.timer(1000, 2000).subscribe(val => console.log(val))

  setTimeout(() => {
    subscription1.unsubscribe()
  }, 3500)
  //=> 0
  //=> 1

}, 4500)

