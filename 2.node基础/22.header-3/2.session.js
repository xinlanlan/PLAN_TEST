// session的功能
// cookie 是不安全的 如果服务端设置的cookie 浏览器可以看到具体内容 
// session 来基于 cookie实现的安全些

const http = require('http')
const querystring = require('querystring')
const crypto = require('crypto')
const uuid = require('uuid')
const secret = 'zhang'
const cardName = 'hzi'
const session = {}

// 签名方法，转化加密过后的base64编码
const sign = (val) => {
  return crypto.createHmac('sha256', secret).update(val).digest("base64").replace(/\=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}


http.createServer((req, res) => {
  req.getCookie = function(key, opts={}) {
    let cookies = querystring.parse(req.headers['cookie'], '; ')
    if(cookies) {
      let cookie = cookies[key]
      
      if(cookie) {
        let [value, s] = cookie.includes('.') ? cookie.split('.') : [cookie]
        if(opts.signed) {
          if(sign(value) === s) {
            return value
          } else {
            return ''
          }
        }
        return value
      }
    }else {
      return ''
    }
  }

  let arr = []
  res.setCookie = function(key, value, option = {}) {
    let opts = []
    let cookie = `${key}=${value}`
    if(option.maxAge) {
      opts.push(`max-age=${option.maxAge}`)
    }
    if(option.domain) {
      opts.push(`domain=${option.domain}`)
    }
    if(option.httpOnly) {
      opts.push(`httpOnly=true`)
    }
    if(option.signed) {
      cookie = cookie + '.' + sign(value)
    }
    arr.push(`${cookie}; ${opts.join('; ')}`)
    res.setHeader('Set-cookie', arr)
  }

  if(req.url === '/visit') {
    let cardId = req.getCookie(cardName, {
      signed: true
    })
    if(cardId && session[cardId]) {
      session[cardId].visit ++
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      res.end(`这是第${session[cardId].visit}次访问`)
    } else {
      let cardId = uuid.v4()
      res.setCookie(cardName, cardId, {
        signed: true
      })
      session[cardId] = {
        visit: 1
      }
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      res.end(`这是第1次访问`)
    }
  } else {
    res.end('')
  }
}).listen(3000)