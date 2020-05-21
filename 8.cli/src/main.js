const program = require('commander')
const {version} = require('./constants')

program
    .command('create')
    .alias('c')
    .description('create a project')
    .action(() => {
        console.log('create')
    })

program.version(version).parse(process.argv)