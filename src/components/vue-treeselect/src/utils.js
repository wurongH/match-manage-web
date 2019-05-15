export const warning = process.env.NODE_ENV === 'production'
  ? /* istanbul ignore next */ noop
  : function warning(checker, complainer) {
    if (!checker()) {
      const message = [ '[Vue-Treeselect Warning]' ].concat(complainer())
      // eslint-disable-next-line no-console
      console.error(...message)
      // eslint-disable-next-line no-debugger
    }
  }

export const unreachable = process.env.NODE_ENV === 'production'
  ? /* istanbul ignore next */ noop
  : function unreachable() {
    // eslint-disable-next-line no-console
    console.error('[Vue-Treeselect Error] You should not reach here.')
    // eslint-disable-next-line no-debugger
    debugger
  }

export function onlyOnLeftClick(mouseDownHandler) {
  return function onMouseDown(evt) {
    if (evt.type === 'mousedown' && evt.button === 0) {
      mouseDownHandler.call(this, evt)
    }
  }
}

export function noop() {
  /* istanbul ignore next */
}

export function identity(x) {
  return x
}

// a simplified version of debounce from underscore
export function debounce(func, wait = 100) {
  let timeout, args, context, timestamp

  function later() {
    const diff = Date.now() - timestamp

    if (diff < wait && diff >= 0) {
      timeout = setTimeout(later, wait - diff)
    } else {
      timeout = null
      func.apply(context, args)
      context = args = null
    }
  }

  return function debounced(..._args) {
    context = this // eslint-disable-line consistent-this
    args = _args
    timestamp = Date.now()
    if (!timeout) timeout = setTimeout(later, wait)
  }
}

function isPlainObject(value) {
  if (value == null || typeof value !== 'object') return false
  return Object.getPrototypeOf(value) === Object.prototype
}

function copy(obj, key, value) {
  if (isPlainObject(value)) {
    obj[key] || (obj[key] = {})
    deepExtend(obj[key], value)
  } else {
    obj[key] = value
  }
}

export function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function deepExtend(target, source) {
  if (source == null) {
    // empty
  } else if (isPlainObject(source)) {
    const keys = Object.keys(source)
    for (let i = 0, len = keys.length; i < len; i++) {
      copy(target, keys[i], source[keys[i]])
    }
  } else {
    unreachable()
  }

  return target
}

export function last(arr) {
  warning(
    () => Array.isArray(arr),
    () => 'unexpected type',
  )
  return arr[arr.length - 1]
}

export function find(arr, predicate, ctx) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (predicate.call(ctx, arr[i], i, arr)) return arr[i]
  }
  return undefined
}

export function removeFromArray(arr, elem) {
  const idx = arr.indexOf(elem)
  if (idx !== -1) arr.splice(idx, 1)
}

export function quickDiff(arrA, arrB) {
  if (arrA.length !== arrB.length) return true

  for (let i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) return true
  }

  return false
}
