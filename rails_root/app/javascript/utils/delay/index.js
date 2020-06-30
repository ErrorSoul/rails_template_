async function delayCancel() {
  if (this._delayTimeoutId) {
    clearTimeout(this._delayTimeoutId)
  }
  this._delayReject()
}

async function delay(ms) {
  let delayResolve
  let delayReject
  let delayTimeoutId
  const p = new Promise((resolve, reject) => {
    delayResolve = resolve
    delayReject= reject
    delayTimeoutId = setTimeout(() => {
      p._delayTimeoutId = null
      resolve()
    }, ms)
  })
  p.cancel = delayCancel
  p._delayResolve = delayResolve
  p._delayReject = delayReject
  p._delayTimeoutId = delayTimeoutId
  return p
}

async function delayReject(ms) {
  let delayResolve
  let delayReject
  let delayTimeoutId
  const p = new Promise((resolve, reject) => {
    delayResolve = resolve
    delayReject= reject
    delayTimeoutId = setTimeout(() => {
      p._delayTimeoutId = null
      reject()
    }, ms)
  })
  p.cancel = delayCancel
  p._delayResolve = delayResolve
  p._delayReject = delayReject
  p._delayTimeoutId = delayTimeoutId
  return p
}

delay.reject = delayReject

export default delay
