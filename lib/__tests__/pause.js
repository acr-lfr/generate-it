const pause = require('../pause')

it('wait 1 second', (done) => {
  let start = (new Date()).getTime()
  pause(1000).then(() => {
    let diff = (new Date()).getTime() - start
    if(diff  > 1000 && diff < 1050){
      return done()
    }
    done('Time difference does not match the provides')
  })
})
