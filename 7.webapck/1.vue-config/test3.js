var obj = {
  a: {
    aa: {
      aaa: [1,2,3,4]
    }
  },
  b: {
    bb: {
      bbb: {
        bbbb: 2
      }
    }
  },
  c: {
    cc: {
      ccc: {
        cccc: 3
      }
    }
  },
  d: {
    dd: {
      ddd: {
        dddd: 4
      }
    }
  }
}


function fn(obj) {
  let arr = []
  let count = 0
  function reduce(obj, count) {
    if (!arr[count]) {
      arr[count] = []
    }
    Object.keys(obj).map((item) => {
      arr[count].push(item)
      if (Object.prototype.toString.call(obj[item]) === '[object Object]') {
        reduce(obj[item], count+1)
      }
    })
  }
  reduce(obj, count)
  return arr
}

console.log(fn(obj))

console.log('[object Object]'.split(' ')[1].replace(/\]/, '').toLowerCase())