const rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
  Symbol.for('rxSubscriber') : '@@rxSubscriber'

module.exports = rxSubscriber
