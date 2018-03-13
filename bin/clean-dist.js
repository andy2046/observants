const deleted = require('del').sync([__dirname + '/../dist/*.js'])
console.log('Deleted:\n', deleted.join('\n'))
