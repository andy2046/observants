const { noop } = require('./index')

function pipe (...fns) {
  return pipeFromArray(fns)
}

function pipeFromArray (fns) {
  if (!fns) {
    return noop
  }
  if (fns.length === 1) {
    return fns[0]
  }
  return function piped (input) {
    return fns.reduce((prev, fn) => fn(prev), input)
  }
}

module.exports = {
  pipe,
  pipeFromArray
}
