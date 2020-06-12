var obj = {
  a: {
    b: {
      c: {
        d: 1
      }
    }
  }
}

function getValue(obj, str) {
  return str.split('.').reduce((prev, current) => {
    return prev ? prev[current] : undefined
  }, obj)
}

// getValue(obj, 'a.b.c')
// console.log(getValue(obj, 'a.b.c'))

function setValue(obj, str) {
  let arr = str.split('.')
  let len = arr.length
  let path = null
  let last = obj
  for(let i = 0; i < len; i++) {
    let str1 = arr.slice(0, i + 1).join('.')
    let str2 = arr.slice(0, i).join('.')
    path = getValue(obj, str1)
    last = getValue(obj, str2)
    if(i === len - 1) {
      last[arr[i]] = 1
      break
    }
    if(!path) {
      let key = Object.keys(last).join('')
      if(key) {
        delete last[key]
      }
      last[arr[i]] = {}
    }
  }
  console.log(JSON.stringify(obj))
}

setValue(obj, 'a.b.e.f.g')