/******/ var __webpack_modules__ = ({

/***/ 405:
/***/ ((module) => {

module.exports = async function * (iterators) {
  for (let iterator of iterators) {
    // can be lazy functions returning streams
    if (typeof iterator === 'function') iterator = iterator()
    yield * iterator
  }
}


/***/ }),

/***/ 580:
/***/ ((module) => {

/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */



/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;

/**
 * Module exports.
 * @public
 */

module.exports = escapeHtml;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}


/***/ }),

/***/ 717:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addListener: () => (/* binding */ addListener),
/* harmony export */   argv: () => (/* binding */ argv),
/* harmony export */   binding: () => (/* binding */ binding),
/* harmony export */   browser: () => (/* binding */ browser),
/* harmony export */   chdir: () => (/* binding */ chdir),
/* harmony export */   cwd: () => (/* binding */ cwd),
/* harmony export */   emit: () => (/* binding */ emit),
/* harmony export */   env: () => (/* binding */ env),
/* harmony export */   listeners: () => (/* binding */ listeners),
/* harmony export */   nextTick: () => (/* binding */ nextTick),
/* harmony export */   off: () => (/* binding */ off),
/* harmony export */   on: () => (/* binding */ on),
/* harmony export */   once: () => (/* binding */ once),
/* harmony export */   prependListener: () => (/* binding */ prependListener),
/* harmony export */   prependOnceListener: () => (/* binding */ prependOnceListener),
/* harmony export */   removeAllListeners: () => (/* binding */ removeAllListeners),
/* harmony export */   removeListener: () => (/* binding */ removeListener),
/* harmony export */   title: () => (/* binding */ title),
/* harmony export */   umask: () => (/* binding */ umask),
/* harmony export */   version: () => (/* binding */ version),
/* harmony export */   versions: () => (/* binding */ versions)
/* harmony export */ });
/* harmony import */ var queue_microtask__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9596);
/*!
 * Fast node `require('process')` for modern browsers
 *
 * @author   Mathias Rasmussen <mathiasvr@gmail.com>
 * @license  MIT
 */


const title = 'browser'
const browser = true
const env = {}
const argv = []
const version = ''
const versions = {}

function noop () {}

const on = noop
const addListener = noop
const once = noop
const off = noop
const removeListener = noop
const removeAllListeners = noop
const emit = noop
const prependListener = noop
const prependOnceListener = noop

const nextTick = (func, ...args) => queue_microtask__WEBPACK_IMPORTED_MODULE_0__(() => func(...args))

const listeners = (name) => []

const cwd = () => '/'
const umask = () => 0
const binding = (name) => { throw new Error('process.binding is not supported') }
const chdir = (dir) => { throw new Error('process.chdir is not supported') }




/***/ }),

/***/ 736:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(6585);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		const split = (typeof namespaces === 'string' ? namespaces : '')
			.trim()
			.replace(/\s+/g, ',')
			.split(',')
			.filter(Boolean);

		for (const ns of split) {
			if (ns[0] === '-') {
				createDebug.skips.push(ns.slice(1));
			} else {
				createDebug.names.push(ns);
			}
		}
	}

	/**
	 * Checks if the given string matches a namespace template, honoring
	 * asterisks as wildcards.
	 *
	 * @param {String} search
	 * @param {String} template
	 * @return {Boolean}
	 */
	function matchesTemplate(search, template) {
		let searchIndex = 0;
		let templateIndex = 0;
		let starIndex = -1;
		let matchIndex = 0;

		while (searchIndex < search.length) {
			if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
				// Match character or proceed with wildcard
				if (template[templateIndex] === '*') {
					starIndex = templateIndex;
					matchIndex = searchIndex;
					templateIndex++; // Skip the '*'
				} else {
					searchIndex++;
					templateIndex++;
				}
			} else if (starIndex !== -1) { // eslint-disable-line no-negated-condition
				// Backtrack to the last '*' and try to match more characters
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else {
				return false; // No match
			}
		}

		// Handle trailing '*' in template
		while (templateIndex < template.length && template[templateIndex] === '*') {
			templateIndex++;
		}

		return templateIndex === template.length;
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names,
			...createDebug.skips.map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		for (const skip of createDebug.skips) {
			if (matchesTemplate(name, skip)) {
				return false;
			}
		}

		for (const ns of createDebug.names) {
			if (matchesTemplate(name, ns)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 815:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(717);
var once = __webpack_require__(3519)
var eos = __webpack_require__(6611)
var fs

try {
  fs = __webpack_require__(2376) // we only need fs to get the ReadStream and WriteStream prototypes
} catch (e) {}

var noop = function () {}
var ancient = typeof process === 'undefined' ? false : /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 988:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ bencode)
});

// EXTERNAL MODULE: ./node_modules/uint8-util/browser.js + 2 modules
var browser = __webpack_require__(9639);
;// ./node_modules/bencode/lib/util.js
function digitCount (value) {
  // Add a digit for negative numbers, as the sign will be prefixed
  const sign = value < 0 ? 1 : 0
  // Guard against negative numbers & zero going into log10(),
  // as that would return -Infinity
  value = Math.abs(Number(value || 1))
  return Math.floor(Math.log10(value)) + 1 + sign
}

function getType (value) {
  if (ArrayBuffer.isView(value)) return 'arraybufferview'
  if (Array.isArray(value)) return 'array'
  if (value instanceof Number) return 'number'
  if (value instanceof Boolean) return 'boolean'
  if (value instanceof Set) return 'set'
  if (value instanceof Map) return 'map'
  if (value instanceof String) return 'string'
  if (value instanceof ArrayBuffer) return 'arraybuffer'
  return typeof value
}

;// ./node_modules/bencode/lib/encode.js



/**
 * Encodes data in bencode.
 *
 * @param  {Uint8Array|Array|String|Object|Number|Boolean} data
 * @return {Uint8Array}
 */
function encode (data, buffer, offset) {
  const buffers = []
  let result = null

  encode._encode(buffers, data)
  result = (0,browser/* concat */.xW)(buffers)
  encode.bytes = result.length

  if (ArrayBuffer.isView(buffer)) {
    buffer.set(result, offset)
    return buffer
  }

  return result
}

encode.bytes = -1
encode._floatConversionDetected = false

encode._encode = function (buffers, data) {
  if (data == null) { return }

  switch (getType(data)) {
    case 'object': encode.dict(buffers, data); break
    case 'map': encode.dictMap(buffers, data); break
    case 'array': encode.list(buffers, data); break
    case 'set': encode.listSet(buffers, data); break
    case 'string': encode.string(buffers, data); break
    case 'number': encode.number(buffers, data); break
    case 'boolean': encode.number(buffers, data); break
    case 'arraybufferview': encode.buffer(buffers, new Uint8Array(data.buffer, data.byteOffset, data.byteLength)); break
    case 'arraybuffer': encode.buffer(buffers, new Uint8Array(data)); break
  }
}

const buffE = new Uint8Array([0x65])
const buffD = new Uint8Array([0x64])
const buffL = new Uint8Array([0x6C])

encode.buffer = function (buffers, data) {
  buffers.push((0,browser/* text2arr */.L0)(data.length + ':'), data)
}

encode.string = function (buffers, data) {
  buffers.push((0,browser/* text2arr */.L0)((0,browser/* text2arr */.L0)(data).byteLength + ':' + data))
}

encode.number = function (buffers, data) {
  if (Number.isInteger(data)) return buffers.push((0,browser/* text2arr */.L0)('i' + BigInt(data) + 'e'))

  const maxLo = 0x80000000
  const hi = (data / maxLo) << 0
  const lo = (data % maxLo) << 0
  const val = hi * maxLo + lo

  buffers.push((0,browser/* text2arr */.L0)('i' + val + 'e'))

  if (val !== data && !encode._floatConversionDetected) {
    encode._floatConversionDetected = true
    console.warn(
      'WARNING: Possible data corruption detected with value "' + data + '":',
      'Bencoding only defines support for integers, value was converted to "' + val + '"'
    )
    console.trace()
  }
}

encode.dict = function (buffers, data) {
  buffers.push(buffD)

  let j = 0
  let k
  // fix for issue #13 - sorted dicts
  const keys = Object.keys(data).sort()
  const kl = keys.length

  for (; j < kl; j++) {
    k = keys[j]
    if (data[k] == null) continue
    encode.string(buffers, k)
    encode._encode(buffers, data[k])
  }

  buffers.push(buffE)
}

encode.dictMap = function (buffers, data) {
  buffers.push(buffD)

  const keys = Array.from(data.keys()).sort()

  for (const key of keys) {
    if (data.get(key) == null) continue
    ArrayBuffer.isView(key)
      ? encode._encode(buffers, key)
      : encode.string(buffers, String(key))
    encode._encode(buffers, data.get(key))
  }

  buffers.push(buffE)
}

encode.list = function (buffers, data) {
  let i = 0
  const c = data.length
  buffers.push(buffL)

  for (; i < c; i++) {
    if (data[i] == null) continue
    encode._encode(buffers, data[i])
  }

  buffers.push(buffE)
}

encode.listSet = function (buffers, data) {
  buffers.push(buffL)

  for (const item of data) {
    if (item == null) continue
    encode._encode(buffers, item)
  }

  buffers.push(buffE)
}

/* harmony default export */ const lib_encode = (encode);

;// ./node_modules/bencode/lib/decode.js


const INTEGER_START = 0x69 // 'i'
const STRING_DELIM = 0x3A // ':'
const DICTIONARY_START = 0x64 // 'd'
const LIST_START = 0x6C // 'l'
const END_OF_TYPE = 0x65 // 'e'

/**
 * replaces parseInt(buffer.toString('ascii', start, end)).
 * For strings with less then ~30 charachters, this is actually a lot faster.
 *
 * @param {Uint8Array} data
 * @param {Number} start
 * @param {Number} end
 * @return {Number} calculated number
 */
function getIntFromBuffer (buffer, start, end) {
  let sum = 0
  let sign = 1

  for (let i = start; i < end; i++) {
    const num = buffer[i]

    if (num < 58 && num >= 48) {
      sum = sum * 10 + (num - 48)
      continue
    }

    if (i === start && num === 43) { // +
      continue
    }

    if (i === start && num === 45) { // -
      sign = -1
      continue
    }

    if (num === 46) { // .
      // its a float. break here.
      break
    }

    throw new Error('not a number: buffer[' + i + '] = ' + num)
  }

  return sum * sign
}

/**
 * Decodes bencoded data.
 *
 * @param  {Uint8Array} data
 * @param  {Number} start (optional)
 * @param  {Number} end (optional)
 * @param  {String} encoding (optional)
 * @return {Object|Array|Uint8Array|String|Number}
 */
function decode (data, start, end, encoding) {
  if (data == null || data.length === 0) {
    return null
  }

  if (typeof start !== 'number' && encoding == null) {
    encoding = start
    start = undefined
  }

  if (typeof end !== 'number' && encoding == null) {
    encoding = end
    end = undefined
  }

  decode.position = 0
  decode.encoding = encoding || null

  decode.data = !(ArrayBuffer.isView(data))
    ? (0,browser/* text2arr */.L0)(data)
    : new Uint8Array(data.slice(start, end))

  decode.bytes = decode.data.length

  return decode.next()
}

decode.bytes = 0
decode.position = 0
decode.data = null
decode.encoding = null

decode.next = function () {
  switch (decode.data[decode.position]) {
    case DICTIONARY_START:
      return decode.dictionary()
    case LIST_START:
      return decode.list()
    case INTEGER_START:
      return decode.integer()
    default:
      return decode.buffer()
  }
}

decode.find = function (chr) {
  let i = decode.position
  const c = decode.data.length
  const d = decode.data

  while (i < c) {
    if (d[i] === chr) return i
    i++
  }

  throw new Error(
    'Invalid data: Missing delimiter "' +
    String.fromCharCode(chr) + '" [0x' +
    chr.toString(16) + ']'
  )
}

decode.dictionary = function () {
  decode.position++

  const dict = {}

  while (decode.data[decode.position] !== END_OF_TYPE) {
    const buffer = decode.buffer()
    let key = (0,browser/* arr2text */.dU)(buffer)
    if (key.includes('\uFFFD')) key = (0,browser/* arr2hex */.V5)(buffer)
    dict[key] = decode.next()
  }

  decode.position++

  return dict
}

decode.list = function () {
  decode.position++

  const lst = []

  while (decode.data[decode.position] !== END_OF_TYPE) {
    lst.push(decode.next())
  }

  decode.position++

  return lst
}

decode.integer = function () {
  const end = decode.find(END_OF_TYPE)
  const number = getIntFromBuffer(decode.data, decode.position + 1, end)

  decode.position += end + 1 - decode.position

  return number
}

decode.buffer = function () {
  let sep = decode.find(STRING_DELIM)
  const length = getIntFromBuffer(decode.data, decode.position, sep)
  const end = ++sep + length

  decode.position = end

  return decode.encoding
    ? (0,browser/* arr2text */.dU)(decode.data.slice(sep, end))
    : decode.data.slice(sep, end)
}

/* harmony default export */ const lib_decode = (decode);

;// ./node_modules/bencode/lib/encoding-length.js



function listLength (list) {
  let length = 1 + 1 // type marker + end-of-type marker

  for (const value of list) {
    length += encodingLength(value)
  }

  return length
}

function mapLength (map) {
  let length = 1 + 1 // type marker + end-of-type marker

  for (const [key, value] of map) {
    const keyLength = (0,browser/* text2arr */.L0)(key).byteLength
    length += digitCount(keyLength) + 1 + keyLength
    length += encodingLength(value)
  }

  return length
}

function objectLength (value) {
  let length = 1 + 1 // type marker + end-of-type marker
  const keys = Object.keys(value)

  for (let i = 0; i < keys.length; i++) {
    const keyLength = (0,browser/* text2arr */.L0)(keys[i]).byteLength
    length += digitCount(keyLength) + 1 + keyLength
    length += encodingLength(value[keys[i]])
  }

  return length
}

function stringLength (value) {
  const length = (0,browser/* text2arr */.L0)(value).byteLength
  return digitCount(length) + 1 + length
}

function arrayBufferLength (value) {
  const length = value.byteLength - value.byteOffset
  return digitCount(length) + 1 + length
}

function encodingLength (value) {
  const length = 0

  if (value == null) return length

  const type = getType(value)

  switch (type) {
    case 'arraybufferview': return arrayBufferLength(value)
    case 'string': return stringLength(value)
    case 'array': case 'set': return listLength(value)
    case 'number': return 1 + digitCount(Math.floor(value)) + 1
    case 'bigint': return 1 + value.toString().length + 1
    case 'object': return objectLength(value)
    case 'map': return mapLength(value)
    default:
      throw new TypeError(`Unsupported value of type "${type}"`)
  }
}

/* harmony default export */ const encoding_length = (encodingLength);

;// ./node_modules/bencode/index.js



/**
 * Determines the amount of bytes
 * needed to encode the given value
 * @param  {Object|Array|Uint8Array|String|Number|Boolean} value
 * @return {Number} byteCount
 */
const bencode_encodingLength = encoding_length
/* harmony default export */ const bencode = ({ encode: lib_encode, decode: lib_decode, byteLength: encoding_length, encodingLength: bencode_encodingLength });


/***/ }),

/***/ 1035:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(717);
const hrtime = typeof process !== 'undefined' && !!process.hrtime
const maxTick = 65535
const resolution = 10
const timeDiff = hrtime
  ? 1e9 / resolution
  : 1e3 / resolution

const now = hrtime
  ? () => {
      const [seconds, nanoseconds] = process.hrtime()
      return (seconds * 1e9 + nanoseconds)
    }
  : () => performance.now()

/** @param {number} start */
function getTick (start) {
  return (now() - start) / timeDiff & maxTick
}

/** @param {number} seconds */
module.exports = function (seconds) {
  const start = now()

  const size = resolution * (seconds || 5)
  const buffer = [0]
  let pointer = 1
  let last = (getTick(start) - 1) & maxTick

  return function (delta) {
    const tick = getTick(start)
    let dist = (tick - last) & maxTick
    if (dist > size) dist = size
    last = tick

    while (dist--) {
      if (pointer === size) pointer = 0
      buffer[pointer] = buffer[pointer === 0 ? size - 1 : pointer - 1]
      pointer++
    }

    if (delta) buffer[pointer - 1] += delta

    /** @type {number} */
    const top = buffer[pointer - 1]
    /** @type {number} */
    const btm = buffer.length < size ? 0 : buffer[pointer === size ? 0 : pointer]

    return buffer.length < resolution ? top : (top - btm) * resolution / buffer.length
  }
}


/***/ }),

/***/ 1048:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 1133:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



let Mime = __webpack_require__(8673);
module.exports = new Mime(__webpack_require__(8446));


/***/ }),

/***/ 1314:
/***/ ((module) => {

module.exports = remove

function remove (arr, i) {
  if (i >= arr.length || i < 0) return
  var last = arr.pop()
  if (i < arr.length) {
    var tmp = arr[i]
    arr[i] = last
    return tmp
  }
  return last
}


/***/ }),

/***/ 1467:
/***/ ((module) => {

function concat (chunks, size) {
  if (typeof chunks[0] === 'string') return chunks.join('')
  if (typeof chunks[0] === 'number') return new Uint8Array(chunks)
  const b = new Uint8Array(size)
  let offset = 0
  for (let i = 0, l = chunks.length; i < l; i++) {
    const chunk = chunks[i]
    b.set(chunk, offset)
    offset += chunk.byteLength || chunk.length
  }

  return b
}

module.exports = async function * (iterator, size = 512, opts = {}) {
  if (typeof size === 'object') {
    opts = size
    size = opts.size
  }
  let { nopad, zeroPadding = true } = opts

  if (nopad) zeroPadding = false

  let buffered = []
  let bufferedBytes = 0

  for await (const value of iterator) {
    bufferedBytes += value.byteLength || value.length || 1
    buffered.push(value)

    if (bufferedBytes >= size) {
      const b = concat(buffered, bufferedBytes)
      let offset = 0

      while (bufferedBytes >= size) {
        yield b.slice(offset, offset + size)
        bufferedBytes -= size
        offset += size
      }

      buffered = [b.slice(offset, b.length)]
    }
  }
  if (bufferedBytes) yield concat(buffered, zeroPadding ? size : bufferedBytes)
}


/***/ }),

/***/ 1827:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 2072:
/***/ ((module) => {

function wait (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

module.exports = {
  wait
}


/***/ }),

/***/ 2123:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 2376:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 2532:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 2701:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 2799:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 2878:
/***/ ((module) => {

/*!
 * range-parser
 * Copyright(c) 2012-2014 TJ Holowaychuk
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = rangeParser

/**
 * Parse "Range" header `str` relative to the given file `size`.
 *
 * @param {Number} size
 * @param {String} str
 * @param {Object} [options]
 * @return {Array}
 * @public
 */

function rangeParser (size, str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string')
  }

  var index = str.indexOf('=')

  if (index === -1) {
    return -2
  }

  // split the range string
  var arr = str.slice(index + 1).split(',')
  var ranges = []

  // add ranges type
  ranges.type = str.slice(0, index)

  // parse all ranges
  for (var i = 0; i < arr.length; i++) {
    var range = arr[i].split('-')
    var start = parseInt(range[0], 10)
    var end = parseInt(range[1], 10)

    // -nnn
    if (isNaN(start)) {
      start = size - end
      end = size - 1
    // nnn-
    } else if (isNaN(end)) {
      end = size - 1
    }

    // limit last-byte-pos to current length
    if (end > size - 1) {
      end = size - 1
    }

    // invalid or unsatisifiable
    if (isNaN(start) || isNaN(end) || start > end || start < 0) {
      continue
    }

    // add range
    ranges.push({
      start: start,
      end: end
    })
  }

  if (ranges.length < 1) {
    // unsatisifiable
    return -1
  }

  return options && options.combine
    ? combineRanges(ranges)
    : ranges
}

/**
 * Combine overlapping & adjacent ranges.
 * @private
 */

function combineRanges (ranges) {
  var ordered = ranges.map(mapWithIndex).sort(sortByRangeStart)

  for (var j = 0, i = 1; i < ordered.length; i++) {
    var range = ordered[i]
    var current = ordered[j]

    if (range.start > current.end + 1) {
      // next range
      ordered[++j] = range
    } else if (range.end > current.end) {
      // extend range
      current.end = range.end
      current.index = Math.min(current.index, range.index)
    }
  }

  // trim ordered array
  ordered.length = j + 1

  // generate combined range
  var combined = ordered.sort(sortByRangeIndex).map(mapWithoutIndex)

  // copy ranges type
  combined.type = ranges.type

  return combined
}

/**
 * Map function to add index value to ranges.
 * @private
 */

function mapWithIndex (range, index) {
  return {
    start: range.start,
    end: range.end,
    index: index
  }
}

/**
 * Map function to remove index value from ranges.
 * @private
 */

function mapWithoutIndex (range) {
  return {
    start: range.start,
    end: range.end
  }
}

/**
 * Sort function to sort ranges by index.
 * @private
 */

function sortByRangeIndex (a, b) {
  return a.index - b.index
}

/**
 * Sort function to sort ranges by start position.
 * @private
 */

function sortByRangeStart (a, b) {
  return a.start - b.start
}


/***/ }),

/***/ 3033:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ BitField)
/* harmony export */ });
/**
 * Converts a number of bits to a number of bytes.
 *
 * @param numberOfBits The number of bits to convert.
 * @returns The number of bytes that are needed to store the given number of bits.
 */
function bitsToBytes(numberOfBits) {
    return (numberOfBits >> 3) + Number(numberOfBits % 8 !== 0);
}
class BitField {
    /** The number of bits in the bitfield. */
    get length() {
        return this.buffer.length << 3;
    }
    /**
     * Constructs a BitField.
     *
     * @param data Either a number representing the maximum number of supported bits, or a Uint8Array.
     * @param opts Options for the bitfield.
     */
    constructor(data = 0, options) {
        const grow = options === null || options === void 0 ? void 0 : options.grow;
        this.grow = grow
            ? Number.isFinite(grow)
                ? bitsToBytes(grow)
                : grow
            : 0;
        this.buffer =
            typeof data === "number" ? new Uint8Array(bitsToBytes(data)) : data;
    }
    /**
     * Get a particular bit.
     *
     * @param bitIndex Bit index to retrieve.
     * @returns A boolean indicating whether the `i`th bit is set.
     */
    get(bitIndex) {
        const byteIndex = bitIndex >> 3;
        return (byteIndex < this.buffer.length &&
            !!(this.buffer[byteIndex] & (128 >> bitIndex % 8)));
    }
    /**
     * Set a particular bit.
     *
     * Will grow the underlying array if the bit is out of bounds and the `grow` option is set.
     *
     * @param bitIndex Bit index to set.
     * @param value Value to set the bit to. Defaults to `true`.
     */
    set(bitIndex, value = true) {
        const byteIndex = bitIndex >> 3;
        if (value) {
            if (byteIndex >= this.buffer.length) {
                const newLength = Math.max(byteIndex + 1, Math.min(2 * this.buffer.length, this.grow));
                if (newLength <= this.grow) {
                    const newBuffer = new Uint8Array(newLength);
                    newBuffer.set(this.buffer);
                    this.buffer = newBuffer;
                }
            }
            this.buffer[byteIndex] |= 128 >> bitIndex % 8;
        }
        else if (byteIndex < this.buffer.length) {
            this.buffer[byteIndex] &= ~(128 >> bitIndex % 8);
        }
    }
    /**
     * Sets a value or an array of values.
     *
     * @param array An array of booleans to set.
     * @param offset The bit offset at which the values are to be written.
     */
    setAll(array, offset = 0) {
        const targetLength = Math.min(bitsToBytes(offset + array.length), this.grow);
        if (this.buffer.length < targetLength) {
            const newBuffer = new Uint8Array(targetLength);
            newBuffer.set(this.buffer);
            this.buffer = newBuffer;
        }
        let byteIndex = offset >> 3;
        let bitMask = 128 >> offset % 8;
        for (let index = 0; index < array.length; index++) {
            if (array[index]) {
                this.buffer[byteIndex] |= bitMask;
            }
            else {
                this.buffer[byteIndex] &= ~bitMask;
            }
            if (bitMask === 1) {
                byteIndex += 1;
                if (byteIndex >= this.buffer.length) {
                    break;
                }
                bitMask = 128;
            }
            else {
                bitMask >>= 1;
            }
        }
    }
    /**
     * Loop through the bits in the bitfield.
     *
     * @param callbackfn Function to be called with the bit value and index.
     * @param start Index of the first bit to look at.
     * @param end Index of the first bit that should no longer be considered.
     */
    forEach(callbackfn, start = 0, end = this.buffer.length * 8) {
        let byteIndex = start >> 3;
        let bitMask = 128 >> start % 8;
        for (let bitIndex = start; bitIndex < end; bitIndex++) {
            callbackfn(!!(this.buffer[byteIndex] & bitMask), bitIndex);
            if (bitMask === 1) {
                byteIndex += 1;
                bitMask = 128;
            }
            else {
                bitMask >>= 1;
            }
        }
    }
    /**
     * Check if all bits in the Bitfield are unset.
     *
     * @returns A boolean indicating whether all bits are unset.
     */
    isEmpty() {
        for (let i = 0; i < this.buffer.length; i++) {
            if (this.buffer[i] !== 0) {
                return false;
            }
        }
        return true;
    }
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3065:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(717);
var TokenBucket = __webpack_require__(5472);
var getMilliseconds = __webpack_require__(3085);

/**
 * A generic rate limiter. Underneath the hood, this uses a token bucket plus
 * an additional check to limit how many tokens we can remove each interval.
 * @author John Hurliman <jhurliman@jhurliman.org>
 *
 * @param {Number} tokensPerInterval Maximum number of tokens that can be
 *  removed at any given moment and over the course of one interval.
 * @param {String|Number} interval The interval length in milliseconds, or as
 *  one of the following strings: 'second', 'minute', 'hour', day'.
 * @param {Boolean} fireImmediately Optional. Whether or not the callback
 *  will fire immediately when rate limiting is in effect (default is false).
 */
var RateLimiter = function(tokensPerInterval, interval, fireImmediately) {
  this.tokenBucket = new TokenBucket(tokensPerInterval, tokensPerInterval,
    interval, null);

  // Fill the token bucket to start
  this.tokenBucket.content = tokensPerInterval;

  this.curIntervalStart = getMilliseconds();
  this.tokensThisInterval = 0;
  this.fireImmediately = fireImmediately;
};

RateLimiter.prototype = {
  tokenBucket: null,
  curIntervalStart: 0,
  tokensThisInterval: 0,
  fireImmediately: false,

  /**
   * Remove the requested number of tokens and fire the given callback. If the
   * rate limiter contains enough tokens and we haven't spent too many tokens
   * in this interval already, this will happen immediately. Otherwise, the
   * removal and callback will happen when enough tokens become available.
   * @param {Number} count The number of tokens to remove.
   * @param {Function} callback(err, remainingTokens)
   * @returns {Boolean} True if the callback was fired immediately, otherwise
   *  false.
   */
  removeTokens: function(count, callback) {
    // Make sure the request isn't for more than we can handle
    if (count > this.tokenBucket.bucketSize) {
      process.nextTick(callback.bind(null, 'Requested tokens ' + count +
        ' exceeds maximum tokens per interval ' + this.tokenBucket.bucketSize,
        null));
      return false;
    }

    var self = this;
    var now = getMilliseconds();

    // Advance the current interval and reset the current interval token count
    // if needed
    if (now < this.curIntervalStart
      || now - this.curIntervalStart >= this.tokenBucket.interval) {
      this.curIntervalStart = now;
      this.tokensThisInterval = 0;
    }

    // If we don't have enough tokens left in this interval, wait until the
    // next interval
    if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval) {
      if (this.fireImmediately) {
        process.nextTick(callback.bind(null, null, -1));
      } else {
        var waitInterval = Math.ceil(
          this.curIntervalStart + this.tokenBucket.interval - now);

        setTimeout(function() {
          self.tokenBucket.removeTokens(count, afterTokensRemoved);
        }, waitInterval);
      }
      return false;
    }

    // Remove the requested number of tokens from the token bucket
    return this.tokenBucket.removeTokens(count, afterTokensRemoved);

    function afterTokensRemoved(err, tokensRemaining) {
      if (err) return callback(err, null);

      self.tokensThisInterval += count;
      callback(null, tokensRemaining);
    }
  },

  /**
   * Attempt to remove the requested number of tokens and return immediately.
   * If the bucket (and any parent buckets) contains enough tokens and we
   * haven't spent too many tokens in this interval already, this will return
   * true. Otherwise, false is returned.
   * @param {Number} count The number of tokens to remove.
   * @param {Boolean} True if the tokens were successfully removed, otherwise
   *  false.
   */
  tryRemoveTokens: function(count) {
    // Make sure the request isn't for more than we can handle
    if (count > this.tokenBucket.bucketSize)
      return false;

    var now = getMilliseconds();

    // Advance the current interval and reset the current interval token count
    // if needed
    if (now < this.curIntervalStart
      || now - this.curIntervalStart >= this.tokenBucket.interval) {
      this.curIntervalStart = now;
      this.tokensThisInterval = 0;
    }

    // If we don't have enough tokens left in this interval, return false
    if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval)
      return false;

    // Try to remove the requested number of tokens from the token bucket
    var removed = this.tokenBucket.tryRemoveTokens(count);
    if (removed) {
      this.tokensThisInterval += count;
    }
    return removed;
  },

  /**
   * Returns the number of tokens remaining in the TokenBucket.
   * @returns {Number} The number of tokens remaining.
   */
  getTokensRemaining: function () {
    this.tokenBucket.drip();
    return this.tokenBucket.content;
  }
};

module.exports = RateLimiter;


/***/ }),

/***/ 3085:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(717);
var getMilliseconds = function() {
  if (typeof process !== 'undefined' && process.hrtime) {
    var hrtime = process.hrtime();
    var seconds = hrtime[0];
    var nanoseconds = hrtime[1];

    return seconds * 1e3 +  Math.floor(nanoseconds / 1e6);
  }

  return new Date().getTime();
}

module.exports = getMilliseconds;


/***/ }),

/***/ 3198:
/***/ ((module) => {

module.exports = class BrowserDecoder {
  constructor (encoding) {
    this.decoder = new TextDecoder(encoding === 'utf16le' ? 'utf16-le' : encoding)
  }

  get remaining () {
    return -1
  }

  decode (data) {
    return this.decoder.decode(data, { stream: true })
  }

  flush () {
    return this.decoder.decode(new Uint8Array(0))
  }
}


/***/ }),

/***/ 3208:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 3278:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 3468:
/***/ (() => {

if (typeof ReadableStream !== 'undefined') {
  if (!ReadableStream.prototype[Symbol.asyncIterator]) {
    ReadableStream.prototype[Symbol.asyncIterator] = function ({ preventCancel } = {}) {
      const reader = this.getReader()
      const stream = this
      let last = reader.read()
      return {
        next () {
          const temp = last
          last = reader.read()
          return temp
        },
        async return (value) {
          await last
          reader.releaseLock()
          if (!preventCancel) stream.cancel()
          return { done: true, value }
        },
        async throw (err) {
          await this.return()
          throw err
        },
        [Symbol.asyncIterator] () {
          return this
        }
      }
    }
  }
  if (!ReadableStream.prototype.getIterator) {
    ReadableStream.prototype.getIterator = function ({ preventCancel } = {}) {
      return this[Symbol.asyncIterator]({ preventCancel })
    }
  }
}


/***/ }),

/***/ 3519:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wrappy = __webpack_require__(6587)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 3714:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*! immediate-chunk-store. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
// TODO: remove when window.queueMicrotask() is well supported
const queueMicrotask = __webpack_require__(9596)

class ImmediateStore {
  constructor (store) {
    this.store = store
    this.chunkLength = store.chunkLength

    if (!this.store || !this.store.get || !this.store.put) {
      throw new Error('First argument must be abstract-chunk-store compliant')
    }

    this.mem = []
  }

  put (index, buf, cb = () => {}) {
    this.mem[index] = buf
    this.store.put(index, buf, err => {
      this.mem[index] = null
      cb(err)
    })
  }

  get (index, opts, cb = () => {}) {
    if (typeof opts === 'function') return this.get(index, null, opts)

    let buf = this.mem[index]

    // if the chunk isn't in the immediate memory cache
    if (!buf) {
      return this.store.get(index, opts, cb)
    }

    if (!opts) opts = {}

    const offset = opts.offset || 0
    const len = opts.length || (buf.length - offset)

    if (offset !== 0 || len !== buf.length) {
      buf = buf.slice(offset, len + offset)
    }
    queueMicrotask(() => cb(null, buf))
  }

  close (cb = () => {}) {
    this.store.close(cb)
  }

  destroy (cb = () => {}) {
    this.store.destroy(cb)
  }
}

module.exports = ImmediateStore


/***/ }),

/***/ 3970:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 4018:
/***/ ((module) => {

module.exports = function cpus () {
  var num = navigator.hardwareConcurrency || 1
  var cpus = []
  for (var i = 0; i < num; i++) {
    cpus.push({
      model: '',
      speed: 0,
      times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
    })
  }
  return cpus
}


/***/ }),

/***/ 4043:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 4343:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 4497:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*! cache-chunk-store. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
const LRU = __webpack_require__(8454)
const queueMicrotask = __webpack_require__(9596)

class CacheStore {
  constructor (store, opts) {
    this.store = store
    this.chunkLength = store.chunkLength
    this.inProgressGets = new Map() // Map from chunk index to info on callbacks waiting for that chunk

    if (!this.store || !this.store.get || !this.store.put) {
      throw new Error('First argument must be abstract-chunk-store compliant')
    }

    this.cache = new LRU(opts)
  }

  put (index, buf, cb = () => {}) {
    if (!this.cache) {
      return queueMicrotask(() => cb(new Error('CacheStore closed')))
    }

    this.cache.remove(index)
    this.store.put(index, buf, cb)
  }

  get (index, opts, cb = () => {}) {
    if (typeof opts === 'function') return this.get(index, null, opts)

    if (!this.cache) {
      return queueMicrotask(() => cb(new Error('CacheStore closed')))
    }

    if (!opts) opts = {}

    let buf = this.cache.get(index)
    if (buf) {
      const offset = opts.offset || 0
      const len = opts.length || (buf.length - offset)
      if (offset !== 0 || len !== buf.length) {
        buf = buf.slice(offset, len + offset)
      }
      return queueMicrotask(() => cb(null, buf))
    }

    // See if a get for this index has already started
    let waiters = this.inProgressGets.get(index)
    const getAlreadyStarted = !!waiters
    if (!waiters) {
      waiters = []
      this.inProgressGets.set(index, waiters)
    }

    waiters.push({
      opts,
      cb
    })

    if (!getAlreadyStarted) {
      this.store.get(index, (err, buf) => {
        if (!err && this.cache != null) this.cache.set(index, buf)

        const inProgressEntry = this.inProgressGets.get(index)
        this.inProgressGets.delete(index)

        for (const { opts, cb } of inProgressEntry) {
          if (err) {
            cb(err)
          } else {
            const offset = opts.offset || 0
            const len = opts.length || (buf.length - offset)
            let slicedBuf = buf
            if (offset !== 0 || len !== buf.length) {
              slicedBuf = buf.slice(offset, len + offset)
            }
            cb(null, slicedBuf)
          }
        }
      })
    }
  }

  close (cb = () => {}) {
    if (!this.cache) {
      return queueMicrotask(() => cb(new Error('CacheStore closed')))
    }

    this.cache = null
    this.store.close(cb)
  }

  destroy (cb = () => {}) {
    if (!this.cache) {
      return queueMicrotask(() => cb(new Error('CacheStore closed')))
    }

    this.cache = null
    this.store.destroy(cb)
  }
}

module.exports = CacheStore


/***/ }),

/***/ 4862:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = Storage

const queueMicrotask = __webpack_require__(9596)

function Storage (chunkLength, opts) {
  if (!(this instanceof Storage)) return new Storage(chunkLength, opts)
  if (!opts) opts = {}

  this.chunkLength = Number(chunkLength)
  if (!this.chunkLength) throw new Error('First argument must be a chunk length')

  this.chunks = []
  this.closed = false
  this.length = Number(opts.length) || Infinity

  if (this.length !== Infinity) {
    this.lastChunkLength = (this.length % this.chunkLength) || this.chunkLength
    this.lastChunkIndex = Math.ceil(this.length / this.chunkLength) - 1
  }
}

Storage.prototype.put = function (index, buf, cb = () => {}) {
  if (this.closed) return queueMicrotask(() => cb(new Error('Storage is closed')))

  const isLastChunk = (index === this.lastChunkIndex)
  if (isLastChunk && buf.length !== this.lastChunkLength) {
    return queueMicrotask(() => cb(new Error('Last chunk length must be ' + this.lastChunkLength)))
  }
  if (!isLastChunk && buf.length !== this.chunkLength) {
    return queueMicrotask(() => cb(new Error('Chunk length must be ' + this.chunkLength)))
  }
  this.chunks[index] = buf
  queueMicrotask(() => cb(null))
}

Storage.prototype.get = function (index, opts, cb = () => {}) {
  if (typeof opts === 'function') return this.get(index, null, opts)
  if (this.closed) return queueMicrotask(() => cb(new Error('Storage is closed')))

  let buf = this.chunks[index]

  if (!buf) {
    const err = new Error('Chunk not found')
    err.notFound = true
    return queueMicrotask(() => cb(err))
  }

  if (!opts) opts = {}

  const offset = opts.offset || 0
  const len = opts.length || (buf.length - offset)

  if (offset !== 0 || len !== buf.length) {
    buf = buf.slice(offset, len + offset)
  }

  queueMicrotask(() => cb(null, buf))
}

Storage.prototype.close = Storage.prototype.destroy = function (cb = () => {}) {
  if (this.closed) return queueMicrotask(() => cb(new Error('Storage is closed')))
  this.closed = true
  this.chunks = null
  queueMicrotask(() => cb(null))
}


/***/ }),

/***/ 5335:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const PassThroughDecoder = __webpack_require__(3198)
const UTF8Decoder = __webpack_require__(3198)

module.exports = class TextDecoder {
  constructor (encoding = 'utf8') {
    this.encoding = normalizeEncoding(encoding)

    switch (this.encoding) {
      case 'utf8':
        this.decoder = new UTF8Decoder()
        break
      case 'utf16le':
      case 'base64':
        throw new Error('Unsupported encoding: ' + this.encoding)
      default:
        this.decoder = new PassThroughDecoder(this.encoding)
    }
  }

  get remaining () {
    return this.decoder.remaining
  }

  push (data) {
    if (typeof data === 'string') return data
    return this.decoder.decode(data)
  }

  // For Node.js compatibility
  write (data) {
    return this.push(data)
  }

  end (data) {
    let result = ''
    if (data) result = this.push(data)
    result += this.decoder.flush()
    return result
  }
}

function normalizeEncoding (encoding) {
  encoding = encoding.toLowerCase()

  switch (encoding) {
    case 'utf8':
    case 'utf-8':
      return 'utf8'
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return 'utf16le'
    case 'latin1':
    case 'binary':
      return 'latin1'
    case 'base64':
    case 'ascii':
    case 'hex':
      return encoding
    default:
      throw new Error('Unknown encoding: ' + encoding)
  }
};


/***/ }),

/***/ 5372:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*! run-parallel-limit. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
module.exports = runParallelLimit

const queueMicrotask = __webpack_require__(9596)

function runParallelLimit (tasks, limit, cb) {
  if (typeof limit !== 'number') throw new Error('second argument must be a Number')
  let results, len, pending, keys, isErrored
  let isSync = true
  let next

  if (Array.isArray(tasks)) {
    results = []
    pending = len = tasks.length
  } else {
    keys = Object.keys(tasks)
    results = {}
    pending = len = keys.length
  }

  function done (err) {
    function end () {
      if (cb) cb(err, results)
      cb = null
    }
    if (isSync) queueMicrotask(end)
    else end()
  }

  function each (i, err, result) {
    results[i] = result
    if (err) isErrored = true
    if (--pending === 0 || err) {
      done(err)
    } else if (!isErrored && next < len) {
      let key
      if (keys) {
        key = keys[next]
        next += 1
        tasks[key](function (err, result) { each(key, err, result) })
      } else {
        key = next
        next += 1
        tasks[key](function (err, result) { each(key, err, result) })
      }
    }
  }

  next = limit
  if (!pending) {
    // empty
    done(null)
  } else if (keys) {
    // object
    keys.some(function (key, i) {
      tasks[key](function (err, result) { each(key, err, result) })
      if (i === limit - 1) return true // early return
      return false
    })
  } else {
    // array
    tasks.some(function (task, i) {
      task(function (err, result) { each(i, err, result) })
      if (i === limit - 1) return true // early return
      return false
    })
  }

  isSync = false
}


/***/ }),

/***/ 5472:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(717);

/**
 * A hierarchical token bucket for rate limiting. See
 * http://en.wikipedia.org/wiki/Token_bucket for more information.
 * @author John Hurliman <jhurliman@cull.tv>
 *
 * @param {Number} bucketSize Maximum number of tokens to hold in the bucket.
 *  Also known as the burst rate.
 * @param {Number} tokensPerInterval Number of tokens to drip into the bucket
 *  over the course of one interval.
 * @param {String|Number} interval The interval length in milliseconds, or as
 *  one of the following strings: 'second', 'minute', 'hour', day'.
 * @param {TokenBucket} parentBucket Optional. A token bucket that will act as
 *  the parent of this bucket.
 */
var TokenBucket = function(bucketSize, tokensPerInterval, interval, parentBucket) {
  this.bucketSize = bucketSize;
  this.tokensPerInterval = tokensPerInterval;

  if (typeof interval === 'string') {
    switch (interval) {
      case 'sec': case 'second':
        this.interval = 1000; break;
      case 'min': case 'minute':
        this.interval = 1000 * 60; break;
      case 'hr': case 'hour':
        this.interval = 1000 * 60 * 60; break;
      case 'day':
        this.interval = 1000 * 60 * 60 * 24; break;
      default:
        throw new Error('Invaid interval ' + interval);
    }
  } else {
    this.interval = interval;
  }

  this.parentBucket = parentBucket;
  this.content = 0;
  this.lastDrip = +new Date();
};

TokenBucket.prototype = {
  bucketSize: 1,
  tokensPerInterval: 1,
  interval: 1000,
  parentBucket: null,
  content: 0,
  lastDrip: 0,

  /**
   * Remove the requested number of tokens and fire the given callback. If the
   * bucket (and any parent buckets) contains enough tokens this will happen
   * immediately. Otherwise, the removal and callback will happen when enough
   * tokens become available.
   * @param {Number} count The number of tokens to remove.
   * @param {Function} callback(err, remainingTokens)
   * @returns {Boolean} True if the callback was fired immediately, otherwise
   *  false.
   */
  removeTokens: function(count, callback) {
    var self = this;

    // Is this an infinite size bucket?
    if (!this.bucketSize) {
      process.nextTick(callback.bind(null, null, count, Number.POSITIVE_INFINITY));
      return true;
    }

    // Make sure the bucket can hold the requested number of tokens
    if (count > this.bucketSize) {
      process.nextTick(callback.bind(null, 'Requested tokens ' + count + ' exceeds bucket size ' +
        this.bucketSize, null));
      return false;
    }

    // Drip new tokens into this bucket
    this.drip();

    // If we don't have enough tokens in this bucket, come back later
    if (count > this.content)
      return comeBackLater();

    if (this.parentBucket) {
      // Remove the requested from the parent bucket first
      return this.parentBucket.removeTokens(count, function(err, remainingTokens) {
        if (err) return callback(err, null);

        // Check that we still have enough tokens in this bucket
        if (count > self.content)
          return comeBackLater();

        // Tokens were removed from the parent bucket, now remove them from
        // this bucket and fire the callback. Note that we look at the current
        // bucket and parent bucket's remaining tokens and return the smaller
        // of the two values
        self.content -= count;
        callback(null, Math.min(remainingTokens, self.content));
      });
    } else {
      // Remove the requested tokens from this bucket and fire the callback
      this.content -= count;
      process.nextTick(callback.bind(null, null, this.content));
      return true;
    }

    function comeBackLater() {
      // How long do we need to wait to make up the difference in tokens?
      var waitInterval = Math.ceil(
        (count - self.content) * (self.interval / self.tokensPerInterval));
      setTimeout(function() { self.removeTokens(count, callback); }, waitInterval);
      return false;
    }
  },

  /**
   * Attempt to remove the requested number of tokens and return immediately.
   * If the bucket (and any parent buckets) contains enough tokens this will
   * return true, otherwise false is returned.
   * @param {Number} count The number of tokens to remove.
   * @param {Boolean} True if the tokens were successfully removed, otherwise
   *  false.
   */
  tryRemoveTokens: function(count) {
    // Is this an infinite size bucket?
    if (!this.bucketSize)
      return true;

    // Make sure the bucket can hold the requested number of tokens
    if (count > this.bucketSize)
      return false;

    // Drip new tokens into this bucket
    this.drip();

    // If we don't have enough tokens in this bucket, return false
    if (count > this.content)
      return false;

    // Try to remove the requested tokens from the parent bucket
    if (this.parentBucket && !this.parentBucket.tryRemoveTokens(count))
      return false;

    // Remove the requested tokens from this bucket and return
    this.content -= count;
    return true;
  },

  /**
   * Add any new tokens to the bucket since the last drip.
   * @returns {Boolean} True if new tokens were added, otherwise false.
   */
  drip: function() {
    if (!this.tokensPerInterval) {
      this.content = this.bucketSize;
      return;
    }

    var now = +new Date();
    var deltaMS = Math.max(now - this.lastDrip, 0);
    this.lastDrip = now;

    var dripAmount = deltaMS * (this.tokensPerInterval / this.interval);
    this.content = Math.min(this.content + dripAmount, this.bucketSize);
  }
};

module.exports = TokenBucket;


/***/ }),

/***/ 5658:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Peer),
/* harmony export */   enableSecure: () => (/* binding */ enableSecure)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7007);
/* harmony import */ var streamx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8179);
/* harmony import */ var unordered_array_remove__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1314);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7833);
/* harmony import */ var bittorrent_protocol__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6458);






const CONNECT_TIMEOUT_TCP = 5_000
const CONNECT_TIMEOUT_UTP = 5_000
const CONNECT_TIMEOUT_WEBRTC = 25_000
const HANDSHAKE_TIMEOUT = 25_000

// Types of peers
const TYPE_TCP_INCOMING = 'tcpIncoming'
const TYPE_TCP_OUTGOING = 'tcpOutgoing'
const TYPE_UTP_INCOMING = 'utpIncoming'
const TYPE_UTP_OUTGOING = 'utpOutgoing'
const TYPE_WEBRTC = 'webrtc'
const TYPE_WEBSEED = 'webSeed'

// Source used to obtain the peer
const SOURCE_MANUAL = 'manual'
const SOURCE_TRACKER = 'tracker'
const SOURCE_DHT = 'dht'
const SOURCE_LSD = 'lsd'
const SOURCE_UT_PEX = 'ut_pex'

const debug = debug__WEBPACK_IMPORTED_MODULE_3__('webtorrent:peer')

let secure = false

const enableSecure = () => {
  secure = true
}

/**
 * Peer. Represents a peer in the torrent swarm.
 *
 * @param {string} id "ip:port" string, peer id (for WebRTC peers), or url (for Web Seeds)
 * @param {string} type the type of the peer
 */
class Peer extends events__WEBPACK_IMPORTED_MODULE_0__ {
  constructor (id, type) {
    super()

    this.id = id
    this.type = type

    debug('new %s Peer %s', type, id)

    this.addr = null
    this.conn = null
    this.swarm = null
    this.wire = null
    this.source = null

    this.connected = false
    this.destroyed = false
    this.timeout = null // handshake timeout
    this.retries = 0 // outgoing TCP connection retry count

    this.sentPe1 = false
    this.sentPe2 = false
    this.sentPe3 = false
    this.sentPe4 = false
    this.sentHandshake = false
  }

  /**
   * Called once the peer is connected (i.e. fired 'connect' event)
   * @param {Socket} conn
   */
  onConnect () {
    if (this.destroyed) return
    this.connected = true
    this.emit('connect')

    debug('Peer %s connected', this.id)

    clearTimeout(this.connectTimeout)

    const conn = this.conn
    conn.once('end', () => {
      this.destroy()
    })
    conn.once('close', () => {
      this.destroy()
    })
    conn.once('finish', () => {
      this.destroy()
    })
    conn.once('error', err => {
      this.destroy(err)
    })

    const wire = this.wire = new bittorrent_protocol__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A(this.type, this.retries, secure)

    wire.once('end', () => {
      this.destroy()
    })
    wire.once('close', () => {
      this.destroy()
    })
    wire.once('finish', () => {
      this.destroy()
    })
    wire.once('error', err => {
      this.destroy(err)
    })

    wire.once('pe1', () => {
      this.onPe1()
    })
    wire.once('pe2', () => {
      this.onPe2()
    })
    wire.once('pe3', () => {
      this.onPe3()
    })
    wire.once('pe4', () => {
      this.onPe4()
    })
    wire.once('handshake', (infoHash, peerId) => {
      this.onHandshake(infoHash, peerId)
    })
    this.startHandshakeTimeout()

    this.setThrottlePipes()

    if (this.swarm) {
      if (this.type === 'tcpOutgoing') {
        if (secure && this.retries === 0 && !this.sentPe1) this.sendPe1()
        else if (!this.sentHandshake) this.handshake()
      } else if (this.type !== 'tcpIncoming' && !this.sentHandshake) this.handshake()
    }
  }

  sendPe1 () {
    this.wire.sendPe1()
    this.sentPe1 = true
  }

  onPe1 () {
    this.sendPe2()
  }

  sendPe2 () {
    this.wire.sendPe2()
    this.sentPe2 = true
  }

  onPe2 () {
    this.sendPe3()
  }

  sendPe3 () {
    this.wire.sendPe3(this.swarm.infoHash)
    this.sentPe3 = true
  }

  onPe3 (infoHashHash) {
    if (this.swarm) {
      if (this.swarm.infoHashHash !== infoHashHash) {
        this.destroy(new Error('unexpected crypto handshake info hash for this swarm'))
      }
      this.sendPe4()
    }
  }

  sendPe4 () {
    this.wire.sendPe4(this.swarm.infoHash)
    this.sentPe4 = true
  }

  onPe4 () {
    if (!this.sentHandshake) this.handshake()
  }

  clearPipes () {
    this.conn.unpipe()
    this.wire.unpipe()
  }

  setThrottlePipes () {
    const self = this
    ;(0,streamx__WEBPACK_IMPORTED_MODULE_1__.pipeline)(
      this.conn,
      this.throttleGroups.down.throttle(),
      new streamx__WEBPACK_IMPORTED_MODULE_1__.Transform({
        transform (chunk, callback) {
          self.emit('download', chunk.length)
          if (self.destroyed) return
          callback(null, chunk)
        }
      }),
      this.wire,
      this.throttleGroups.up.throttle(),
      new streamx__WEBPACK_IMPORTED_MODULE_1__.Transform({
        transform (chunk, callback) {
          self.emit('upload', chunk.length)
          if (self.destroyed) return
          callback(null, chunk)
        }
      }),
      this.conn
    )
  }

  /**
   * Called when handshake is received from remote peer.
   * @param {string} infoHash
   * @param {string} peerId
   */
  onHandshake (infoHash, peerId) {
    if (!this.swarm) return // `this.swarm` not set yet, so do nothing
    if (this.destroyed) return

    if (this.swarm.destroyed) {
      return this.destroy(new Error('swarm already destroyed'))
    }
    if (infoHash !== this.swarm.infoHash) {
      return this.destroy(new Error('unexpected handshake info hash for this swarm'))
    }
    if (peerId === this.swarm.peerId) {
      return this.destroy(new Error('refusing to connect to ourselves'))
    }

    debug('Peer %s got handshake %s', this.id, infoHash)

    clearTimeout(this.handshakeTimeout)

    this.retries = 0

    let addr = this.addr
    if (!addr && this.conn.remoteAddress && this.conn.remotePort) {
      addr = `${this.conn.remoteAddress}:${this.conn.remotePort}`
    }
    this.swarm._onWire(this.wire, addr)

    // swarm could be destroyed in user's 'wire' event handler
    if (!this.swarm || this.swarm.destroyed) return

    if (!this.sentHandshake) this.handshake()
  }

  handshake () {
    const opts = {
      dht: this.swarm.private ? false : !!this.swarm.client.dht,
      fast: true
    }
    this.wire.handshake(this.swarm.infoHash, this.swarm.client.peerId, opts)
    this.sentHandshake = true
  }

  startConnectTimeout () {
    clearTimeout(this.connectTimeout)

    const connectTimeoutValues = {
      webrtc: CONNECT_TIMEOUT_WEBRTC,
      tcpOutgoing: CONNECT_TIMEOUT_TCP,
      utpOutgoing: CONNECT_TIMEOUT_UTP
    }

    this.connectTimeout = setTimeout(() => {
      this.destroy(new Error('connect timeout'))
    }, connectTimeoutValues[this.type])
    if (this.connectTimeout.unref) this.connectTimeout.unref()
  }

  startHandshakeTimeout () {
    clearTimeout(this.handshakeTimeout)
    this.handshakeTimeout = setTimeout(() => {
      this.destroy(new Error('handshake timeout'))
    }, HANDSHAKE_TIMEOUT)
    if (this.handshakeTimeout.unref) this.handshakeTimeout.unref()
  }

  destroy (err) {
    if (this.destroyed) return
    this.destroyed = true
    if (this.connected) this.emit('disconnect', err)
    this.connected = false

    debug('destroy %s %s (error: %s)', this.type, this.id, err && (err.message || err))

    clearTimeout(this.connectTimeout)
    clearTimeout(this.handshakeTimeout)

    const swarm = this.swarm
    const conn = this.conn
    const wire = this.wire

    this.swarm = null
    this.conn = null
    this.wire = null

    if (swarm && wire) {
      unordered_array_remove__WEBPACK_IMPORTED_MODULE_2__(swarm.wires, swarm.wires.indexOf(wire))
    }
    if (conn) {
      conn.on('error', () => {})
      conn.destroy()
    }
    if (wire) wire.destroy()
    if (swarm) swarm.removePeer(this.id)
  }
}

Peer.TYPE_TCP_INCOMING = TYPE_TCP_INCOMING
Peer.TYPE_TCP_OUTGOING = TYPE_TCP_OUTGOING
Peer.TYPE_UTP_INCOMING = TYPE_UTP_INCOMING
Peer.TYPE_UTP_OUTGOING = TYPE_UTP_OUTGOING
Peer.TYPE_WEBRTC = TYPE_WEBRTC
Peer.TYPE_WEBSEED = TYPE_WEBSEED

Peer.SOURCE_MANUAL = SOURCE_MANUAL
Peer.SOURCE_TRACKER = SOURCE_TRACKER
Peer.SOURCE_DHT = SOURCE_DHT
Peer.SOURCE_LSD = SOURCE_LSD
Peer.SOURCE_UT_PEX = SOURCE_UT_PEX

/**
 * WebRTC peer connections start out connected, because WebRTC peers require an
 * "introduction" (i.e. WebRTC signaling), and there's no equivalent to an IP address
 * that lets you refer to a WebRTC endpoint.
 */
Peer.createWebRTCPeer = (conn, swarm, throttleGroups, source = null) => {
  const peer = new Peer(conn.id, 'webrtc')
  peer.conn = conn
  peer.swarm = swarm
  peer.throttleGroups = throttleGroups
  peer.source = source

  if (peer.conn.connected) {
    peer.onConnect()
  } else {
    const cleanup = () => {
      peer.conn.removeListener('connect', onConnect)
      peer.conn.removeListener('error', onError)
    }
    const onConnect = () => {
      cleanup()
      peer.onConnect()
    }
    const onError = err => {
      cleanup()
      peer.destroy(err)
    }
    peer.conn.once('connect', onConnect)
    peer.conn.once('error', onError)
    peer.startConnectTimeout()
  }

  return peer
}

/**
 * Incoming TCP peers start out connected, because the remote peer connected to the
 * listening port of the TCP server. Until the remote peer sends a handshake, we don't
 * know what swarm the connection is intended for.
 */
Peer.createTCPIncomingPeer = (conn, throttleGroups) => {
  return Peer._createIncomingPeer(conn, TYPE_TCP_INCOMING, throttleGroups)
}

/**
 * Incoming uTP peers start out connected, because the remote peer connected to the
 * listening port of the uTP server. Until the remote peer sends a handshake, we don't
 * know what swarm the connection is intended for.
 */
Peer.createUTPIncomingPeer = (conn, throttleGroups) => {
  return Peer._createIncomingPeer(conn, TYPE_UTP_INCOMING, throttleGroups)
}

/**
 * Outgoing TCP peers start out with just an IP address. At some point (when there is an
 * available connection), the client can attempt to connect to the address.
 */
Peer.createTCPOutgoingPeer = (addr, swarm, throttleGroups, source) => {
  return Peer._createOutgoingPeer(addr, swarm, TYPE_TCP_OUTGOING, throttleGroups, source)
}

/**
 * Outgoing uTP peers start out with just an IP address. At some point (when there is an
 * available connection), the client can attempt to connect to the address.
 */
Peer.createUTPOutgoingPeer = (addr, swarm, throttleGroups, source) => {
  return Peer._createOutgoingPeer(addr, swarm, TYPE_UTP_OUTGOING, throttleGroups, source)
}

Peer._createIncomingPeer = (conn, type, throttleGroups) => {
  const addr = `${conn.remoteAddress}:${conn.remotePort}`
  const peer = new Peer(addr, type)
  peer.conn = conn
  peer.addr = addr
  peer.throttleGroups = throttleGroups

  peer.onConnect()

  return peer
}

Peer._createOutgoingPeer = (addr, swarm, type, throttleGroups, source = null) => {
  const peer = new Peer(addr, type)
  peer.addr = addr
  peer.swarm = swarm
  peer.throttleGroups = throttleGroups
  peer.source = source

  return peer
}

/**
 * Peer that represents a Web Seed (BEP17 / BEP19).
 */

Peer.createWebSeedPeer = (conn, id, swarm, throttleGroups) => {
  const peer = new Peer(id, TYPE_WEBSEED)

  peer.swarm = swarm
  peer.conn = conn
  peer.throttleGroups = throttleGroups

  peer.onConnect()

  return peer
}


/***/ }),

/***/ 5809:
/***/ ((module) => {

module.exports = class FixedFIFO {
  constructor (hwm) {
    if (!(hwm > 0) || ((hwm - 1) & hwm) !== 0) throw new Error('Max size for a FixedFIFO should be a power of two')
    this.buffer = new Array(hwm)
    this.mask = hwm - 1
    this.top = 0
    this.btm = 0
    this.next = null
  }

  clear () {
    this.top = this.btm = 0
    this.next = null
    this.buffer.fill(undefined)
  }

  push (data) {
    if (this.buffer[this.top] !== undefined) return false
    this.buffer[this.top] = data
    this.top = (this.top + 1) & this.mask
    return true
  }

  shift () {
    const last = this.buffer[this.btm]
    if (last === undefined) return undefined
    this.buffer[this.btm] = undefined
    this.btm = (this.btm + 1) & this.mask
    return last
  }

  peek () {
    return this.buffer[this.btm]
  }

  isEmpty () {
    return this.buffer[this.btm] === undefined
  }
}


/***/ }),

/***/ 6080:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const FixedFIFO = __webpack_require__(5809)

module.exports = class FastFIFO {
  constructor (hwm) {
    this.hwm = hwm || 16
    this.head = new FixedFIFO(this.hwm)
    this.tail = this.head
    this.length = 0
  }

  clear () {
    this.head = this.tail
    this.head.clear()
    this.length = 0
  }

  push (val) {
    this.length++
    if (!this.head.push(val)) {
      const prev = this.head
      this.head = prev.next = new FixedFIFO(2 * this.head.buffer.length)
      this.head.push(val)
    }
  }

  shift () {
    if (this.length !== 0) this.length--
    const val = this.tail.shift()
    if (val === undefined && this.tail.next) {
      const next = this.tail.next
      this.tail.next = null
      this.tail = next
      return this.tail.shift()
    }

    return val
  }

  peek () {
    const val = this.tail.peek()
    if (val === undefined && this.tail.next) return this.tail.next.peek()
    return val
  }

  isEmpty () {
    return this.length === 0
  }
}


/***/ }),

/***/ 6310:
/***/ ((module) => {



/**
 * @typedef {{ [key: string]: any }} Extensions
 * @typedef {Error} Err
 * @property {string} message
 */

/**
 *
 * @param {Error} obj
 * @param {Extensions} props
 * @returns {Error & Extensions}
 */
function assign(obj, props) {
    for (const key in props) {
        Object.defineProperty(obj, key, {
            value: props[key],
            enumerable: true,
            configurable: true,
        });
    }

    return obj;
}

/**
 *
 * @param {any} err - An Error
 * @param {string|Extensions} code - A string code or props to set on the error
 * @param {Extensions} [props] - Props to set on the error
 * @returns {Error & Extensions}
 */
function createError(err, code, props) {
    if (!err || typeof err === 'string') {
        throw new TypeError('Please pass an Error to err-code');
    }

    if (!props) {
        props = {};
    }

    if (typeof code === 'object') {
        props = code;
        code = '';
    }

    if (code) {
        props.code = code;
    }

    try {
        return assign(err, props);
    } catch (_) {
        props.message = err.message;
        props.stack = err.stack;

        const ErrClass = function () {};

        ErrClass.prototype = Object.create(Object.getPrototypeOf(err));

        // @ts-ignore
        const output = assign(new ErrClass(), props);

        return output;
    }
}

module.exports = createError;


/***/ }),

/***/ 6458:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var bencode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(988);
/* harmony import */ var bitfield__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3033);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7264);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7833);
/* harmony import */ var rc4__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8727);
/* harmony import */ var streamx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8179);
/* harmony import */ var uint8_util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9639);
/* harmony import */ var throughput__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1035);
/* harmony import */ var unordered_array_remove__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1314);
/*! bittorrent-protocol. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */










const debug = debug__WEBPACK_IMPORTED_MODULE_3__('bittorrent-protocol')

const BITFIELD_GROW = 400000
const KEEP_ALIVE_TIMEOUT = 55000
const ALLOWED_FAST_SET_MAX_LENGTH = 100

const MESSAGE_PROTOCOL = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .text2arr */ .L0)('\u0013BitTorrent protocol')
const MESSAGE_KEEP_ALIVE = new Uint8Array([0x00, 0x00, 0x00, 0x00])
const MESSAGE_CHOKE = new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x00])
const MESSAGE_UNCHOKE = new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x01])
const MESSAGE_INTERESTED = new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x02])
const MESSAGE_UNINTERESTED = new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x03])

const MESSAGE_RESERVED = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
const MESSAGE_PORT = [0x00, 0x00, 0x00, 0x03, 0x09, 0x00, 0x00]

// BEP6 Fast Extension
const MESSAGE_HAVE_ALL = new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x0E])
const MESSAGE_HAVE_NONE = new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x0F])

const DH_PRIME = 'ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a36210000000000090563'
const DH_GENERATOR = 2
const VC = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
const CRYPTO_PROVIDE = new Uint8Array([0x00, 0x00, 0x01, 0x02])
const CRYPTO_SELECT = new Uint8Array([0x00, 0x00, 0x00, 0x02]) // always try to choose RC4 encryption instead of plaintext

function xor (a, b) {
  for (let len = a.length; len--;) a[len] ^= b[len]
  return a
}
/**
 * @param {Uint8Array} buffer
 * @param {number} at
 * @returns number
 */
function getUint32 (buffer, at = 0) {
  return (buffer[at] << 24) | (buffer[at + 1] << 16) | (buffer[at + 2] << 8) | buffer[at + 3]
}

/**
 * @param {Uint8Array} buffer
 * @param {number} at
 * @param {number} value
 */
function setUint32 (buffer, at, value) {
  buffer[at] = (value >>> 24) & 0xFF
  buffer[at + 1] = (value >>> 16) & 0xFF
  buffer[at + 2] = (value >>> 8) & 0xFF
  buffer[at + 3] = value & 0xFF
}

class Request {
  constructor (piece, offset, length, callback) {
    this.piece = piece
    this.offset = offset
    this.length = length
    this.callback = callback
  }
}

class HaveAllBitField {
  constructor () {
    this.buffer = new Uint8Array() // dummy
  }

  get (index) {
    return true
  }

  set (index) {}
}

class Wire extends streamx__WEBPACK_IMPORTED_MODULE_5__.Duplex {
  constructor (type = null, retries = 0, peEnabled = false) {
    super()

    this._debugId = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .arr2hex */ .V5)((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .randomBytes */ .po)(4))
    this._debug('new wire')

    this.peerId = null // remote peer id (hex string)
    this.peerIdBuffer = null // remote peer id (buffer)
    this.type = type // connection type ('webrtc', 'tcpIncoming', 'tcpOutgoing', 'webSeed')

    this.amChoking = true // are we choking the peer?
    this.amInterested = false // are we interested in the peer?

    this.peerChoking = true // is the peer choking us?
    this.peerInterested = false // is the peer interested in us?

    // The largest torrent that I know of (the Geocities archive) is ~641 GB and has
    // ~41,000 pieces. Therefore, cap bitfield to 10x larger (400,000 bits) to support all
    // possible torrents but prevent malicious peers from growing bitfield to fill memory.
    this.peerPieces = new bitfield__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A(0, { grow: BITFIELD_GROW })

    this.extensions = {}
    this.peerExtensions = {}

    this.requests = [] // outgoing
    this.peerRequests = [] // incoming

    this.extendedMapping = {} // number -> string, ex: 1 -> 'ut_metadata'
    this.peerExtendedMapping = {} // string -> number, ex: 9 -> 'ut_metadata'

    // The extended handshake to send, minus the "m" field, which gets automatically
    // filled from `this.extendedMapping`
    this.extendedHandshake = {}

    this.peerExtendedHandshake = {} // remote peer's extended handshake

    // BEP6 Fast Estension
    this.hasFast = false // is fast extension enabled?
    this.allowedFastSet = [] // allowed fast set
    this.peerAllowedFastSet = [] // peer's allowed fast set

    this._ext = {} // string -> function, ex 'ut_metadata' -> ut_metadata()
    this._nextExt = 1

    this.uploaded = 0
    this.downloaded = 0
    this.uploadSpeed = throughput__WEBPACK_IMPORTED_MODULE_7__()
    this.downloadSpeed = throughput__WEBPACK_IMPORTED_MODULE_7__()

    this._keepAliveInterval = null
    this._timeout = null
    this._timeoutMs = 0
    this._timeoutExpiresAt = null

    this._finished = false

    this._parserSize = 0 // number of needed bytes to parse next message from remote peer
    this._parser = null // function to call once `this._parserSize` bytes are available

    this._buffer = [] // incomplete message data
    this._bufferSize = 0 // cached total length of buffers in `this._buffer`

    this._peEnabled = peEnabled
    if (peEnabled) {
      this._dh = crypto__WEBPACK_IMPORTED_MODULE_2__.createDiffieHellman(DH_PRIME, 'hex', DH_GENERATOR) // crypto object used to generate keys/secret
      this._myPubKey = this._dh.generateKeys('hex') // my DH public key
    } else {
      this._myPubKey = null
    }
    this._peerPubKey = null // peer's DH public key
    this._sharedSecret = null // shared DH secret
    this._peerCryptoProvide = [] // encryption methods provided by peer; we expect this to always contain 0x02
    this._cryptoHandshakeDone = false

    this._cryptoSyncPattern = null // the pattern to search for when resynchronizing after receiving pe1/pe2
    this._waitMaxBytes = null // the maximum number of bytes resynchronization must occur within
    this._encryptionMethod = null // 1 for plaintext, 2 for RC4
    this._encryptGenerator = null // RC4 keystream generator for encryption
    this._decryptGenerator = null // RC4 keystream generator for decryption
    this._setGenerators = false // a flag for whether setEncrypt() has successfully completed

    this.once('finish', () => this._onFinish())

    this.on('finish', this._onFinish)
    this._debug('type:', this.type)

    if (this.type === 'tcpIncoming' && this._peEnabled) {
      // If we are not the initiator, we should wait to see if the client begins
      // with PE/MSE handshake or the standard bittorrent handshake.
      this._determineHandshakeType()
    } else if (this.type === 'tcpOutgoing' && this._peEnabled && retries === 0) {
      this._parsePe2()
    } else {
      this._parseHandshake(null)
    }
  }

  /**
   * Set whether to send a "keep-alive" ping (sent every 55s)
   * @param {boolean} enable
   */
  setKeepAlive (enable) {
    this._debug('setKeepAlive %s', enable)
    clearInterval(this._keepAliveInterval)
    if (enable === false) return
    this._keepAliveInterval = setInterval(() => {
      this.keepAlive()
    }, KEEP_ALIVE_TIMEOUT)
  }

  /**
   * Set the amount of time to wait before considering a request to be "timed out"
   * @param {number} ms
   * @param {boolean=} unref (should the timer be unref'd? default: false)
   */
  setTimeout (ms, unref) {
    this._debug('setTimeout ms=%d unref=%s', ms, unref)
    this._timeoutMs = ms
    this._timeoutUnref = !!unref
    this._resetTimeout(true)
  }

  destroy () {
    if (this.destroyed) return
    this._debug('destroy')
    this.end()
    return this
  }

  end (data) {
    if (this.destroyed || this.destroying) return
    this._debug('end')
    this._onUninterested()
    this._onChoke()
    return super.end(data)
  }

  /**
   * Use the specified protocol extension.
   * @param  {function} Extension
   */
  use (Extension) {
    const name = Extension.prototype.name
    if (!name) {
      throw new Error('Extension class requires a "name" property on the prototype')
    }
    this._debug('use extension.name=%s', name)

    const ext = this._nextExt
    const handler = new Extension(this)

    function noop () {}

    if (typeof handler.onHandshake !== 'function') {
      handler.onHandshake = noop
    }
    if (typeof handler.onExtendedHandshake !== 'function') {
      handler.onExtendedHandshake = noop
    }
    if (typeof handler.onMessage !== 'function') {
      handler.onMessage = noop
    }

    this.extendedMapping[ext] = name
    this._ext[name] = handler
    this[name] = handler

    this._nextExt += 1
  }

  //
  // OUTGOING MESSAGES
  //

  /**
   * Message "keep-alive": <len=0000>
   */
  keepAlive () {
    this._debug('keep-alive')
    this._push(MESSAGE_KEEP_ALIVE)
  }

  sendPe1 () {
    if (this._peEnabled) {
      const padALen = Math.floor(Math.random() * 513)
      const padA = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .randomBytes */ .po)(padALen)
      this._push((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .concat */ .xW)([(0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hex2arr */ .fk)(this._myPubKey), padA]))
    }
  }

  sendPe2 () {
    const padBLen = Math.floor(Math.random() * 513)
    const padB = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .randomBytes */ .po)(padBLen)
    this._push((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .concat */ .xW)([(0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hex2arr */ .fk)(this._myPubKey), padB]))
  }

  async sendPe3 (infoHash) {
    await this.setEncrypt(this._sharedSecret, infoHash)

    const hash1Buffer = await (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hash */ .tW)((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hex2arr */ .fk)(this._utfToHex('req1') + this._sharedSecret))

    const hash2Buffer = await (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hash */ .tW)((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hex2arr */ .fk)(this._utfToHex('req2') + infoHash))
    const hash3Buffer = await (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hash */ .tW)((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hex2arr */ .fk)(this._utfToHex('req3') + this._sharedSecret))
    const hashesXorBuffer = xor(hash2Buffer, hash3Buffer)

    const padCLen = new DataView((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .randomBytes */ .po)(2).buffer).getUint16(0) % 512
    const padCBuffer = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .randomBytes */ .po)(padCLen)

    let vcAndProvideBuffer = new Uint8Array(8 + 4 + 2 + padCLen + 2)
    vcAndProvideBuffer.set(VC)
    vcAndProvideBuffer.set(CRYPTO_PROVIDE, 8)

    const view = new DataView(vcAndProvideBuffer.buffer)

    view.setInt16(12, padCLen) // pad C length
    padCBuffer.copy(vcAndProvideBuffer, 14)
    view.setInt16(14 + padCLen, 0) // IA length
    vcAndProvideBuffer = this._encryptHandshake(vcAndProvideBuffer)

    this._push((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .concat */ .xW)([hash1Buffer, hashesXorBuffer, vcAndProvideBuffer]))
  }

  async sendPe4 (infoHash) {
    await this.setEncrypt(this._sharedSecret, infoHash)

    const padDLen = new DataView((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .randomBytes */ .po)(2).buffer).getUint16(0) % 512
    const padDBuffer = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .randomBytes */ .po)(padDLen)
    let vcAndSelectBuffer = new Uint8Array(8 + 4 + 2 + padDLen)
    const view = new DataView(vcAndSelectBuffer.buffer)

    vcAndSelectBuffer.set(VC)
    vcAndSelectBuffer.set(CRYPTO_SELECT, 8)
    view.setInt16(12, padDLen) // lenD?
    vcAndSelectBuffer.set(padDBuffer, 14)
    vcAndSelectBuffer = this._encryptHandshake(vcAndSelectBuffer)
    this._push(vcAndSelectBuffer)
    this._cryptoHandshakeDone = true
    this._debug('completed crypto handshake')
  }

  /**
   * Message: "handshake" <pstrlen><pstr><reserved><info_hash><peer_id>
   * @param  {Uint8Array|string} infoHash (as Buffer or *hex* string)
   * @param  {Uint8Array|string} peerId
   * @param  {Object} extensions
   */
  handshake (infoHash, peerId, extensions) {
    let infoHashBuffer
    let peerIdBuffer
    if (typeof infoHash === 'string') {
      infoHash = infoHash.toLowerCase()
      infoHashBuffer = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hex2arr */ .fk)(infoHash)
    } else {
      infoHashBuffer = infoHash
      infoHash = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .arr2hex */ .V5)(infoHashBuffer)
    }
    if (typeof peerId === 'string') {
      peerIdBuffer = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hex2arr */ .fk)(peerId)
    } else {
      peerIdBuffer = peerId
      peerId = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .arr2hex */ .V5)(peerIdBuffer)
    }

    this._infoHash = infoHashBuffer

    if (infoHashBuffer.length !== 20 || peerIdBuffer.length !== 20) {
      throw new Error('infoHash and peerId MUST have length 20')
    }

    this._debug('handshake i=%s p=%s exts=%o', infoHash, peerId, extensions)

    const reserved = new Uint8Array(MESSAGE_RESERVED)

    this.extensions = {
      extended: true,
      dht: !!(extensions && extensions.dht),
      fast: !!(extensions && extensions.fast)
    }

    reserved[5] |= 0x10 // enable extended message
    if (this.extensions.dht) reserved[7] |= 0x01
    if (this.extensions.fast) reserved[7] |= 0x04

    // BEP6 Fast Extension: The extension is enabled only if both ends of the connection set this bit.
    if (this.extensions.fast && this.peerExtensions.fast) {
      this._debug('fast extension is enabled')
      this.hasFast = true
    }
    this._push((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .concat */ .xW)([MESSAGE_PROTOCOL, reserved, infoHashBuffer, peerIdBuffer]))
    this._handshakeSent = true

    if (this.peerExtensions.extended && !this._extendedHandshakeSent) {
      // Peer's handshake indicated support already
      // (incoming connection)
      this._sendExtendedHandshake()
    }
  }

  /* Peer supports BEP-0010, send extended handshake.
   *
   * This comes after the 'handshake' event to give the user a chance to populate
   * `this.extendedHandshake` and `this.extendedMapping` before the extended handshake
   * is sent to the remote peer.
   */
  _sendExtendedHandshake () {
    // Create extended message object from registered extensions
    const msg = Object.assign({}, this.extendedHandshake)
    msg.m = {}
    for (const ext in this.extendedMapping) {
      const name = this.extendedMapping[ext]
      msg.m[name] = Number(ext)
    }

    // Send extended handshake
    this.extended(0, bencode__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.encode(msg))
    this._extendedHandshakeSent = true
  }

  /**
   * Message "choke": <len=0001><id=0>
   */
  choke () {
    if (this.amChoking) return
    this.amChoking = true
    this._debug('choke')
    this._push(MESSAGE_CHOKE)

    if (this.hasFast) {
      // BEP6: If a peer sends a choke, it MUST reject all requests from the peer to whom the choke
      // was sent except it SHOULD NOT reject requests for pieces that are in the allowed fast set.
      let allowedCount = 0
      while (this.peerRequests.length > allowedCount) { // until only allowed requests are left
        const request = this.peerRequests[allowedCount] // first non-allowed request
        if (this.allowedFastSet.includes(request.piece)) {
          ++allowedCount // count request as allowed
        } else {
          this.reject(request.piece, request.offset, request.length) // removes from this.peerRequests
        }
      }
    } else {
      while (this.peerRequests.length) {
        this.peerRequests.pop()
      }
    }
  }

  /**
   * Message "unchoke": <len=0001><id=1>
   */
  unchoke () {
    if (!this.amChoking) return
    this.amChoking = false
    this._debug('unchoke')
    this._push(MESSAGE_UNCHOKE)
  }

  /**
   * Message "interested": <len=0001><id=2>
   */
  interested () {
    if (this.amInterested) return
    this.amInterested = true
    this._debug('interested')
    this._push(MESSAGE_INTERESTED)
  }

  /**
   * Message "uninterested": <len=0001><id=3>
   */
  uninterested () {
    if (!this.amInterested) return
    this.amInterested = false
    this._debug('uninterested')
    this._push(MESSAGE_UNINTERESTED)
  }

  /**
   * Message "have": <len=0005><id=4><piece index>
   * @param  {number} index
   */
  have (index) {
    this._debug('have %d', index)
    this._message(4, [index], null)
  }

  /**
   * Message "bitfield": <len=0001+X><id=5><bitfield>
   * @param  {BitField|Buffer} bitfield
   */
  bitfield (bitfield) {
    this._debug('bitfield')
    if (!ArrayBuffer.isView(bitfield)) bitfield = bitfield.buffer
    this._message(5, [], bitfield)
  }

  /**
   * Message "request": <len=0013><id=6><index><begin><length>
   * @param  {number}   index
   * @param  {number}   offset
   * @param  {number}   length
   * @param  {function} cb
   */
  request (index, offset, length, cb) {
    if (!cb) cb = () => {}
    if (this._finished) return cb(new Error('wire is closed'))

    if (this.peerChoking && !(this.hasFast && this.peerAllowedFastSet.includes(index))) {
      return cb(new Error('peer is choking'))
    }

    this._debug('request index=%d offset=%d length=%d', index, offset, length)

    this.requests.push(new Request(index, offset, length, cb))
    if (!this._timeout) {
      this._resetTimeout(true)
    }
    this._message(6, [index, offset, length], null)
  }

  /**
   * Message "piece": <len=0009+X><id=7><index><begin><block>
   * @param  {number} index
   * @param  {number} offset
   * @param  {Uint8Array} buffer
   */
  piece (index, offset, buffer) {
    this._debug('piece index=%d offset=%d', index, offset)
    this._message(7, [index, offset], buffer)
    this.uploaded += buffer.length
    this.uploadSpeed(buffer.length)
    this.emit('upload', buffer.length)
  }

  /**
   * Message "cancel": <len=0013><id=8><index><begin><length>
   * @param  {number} index
   * @param  {number} offset
   * @param  {number} length
   */
  cancel (index, offset, length) {
    this._debug('cancel index=%d offset=%d length=%d', index, offset, length)
    this._callback(
      this._pull(this.requests, index, offset, length),
      new Error('request was cancelled'),
      null
    )
    this._message(8, [index, offset, length], null)
  }

  /**
   * Message: "port" <len=0003><id=9><listen-port>
   * @param {Number} port
   */
  port (port) {
    this._debug('port %d', port)
    const message = new Uint8Array(MESSAGE_PORT)
    const view = new DataView(message.buffer)
    view.setUint16(5, port)
    this._push(message)
  }

  /**
   * Message: "suggest" <len=0x0005><id=0x0D><piece index> (BEP6)
   * @param {number} index
   */
  suggest (index) {
    if (!this.hasFast) throw Error('fast extension is disabled')
    this._debug('suggest %d', index)
    this._message(0x0D, [index], null)
  }

  /**
   * Message: "have-all" <len=0x0001><id=0x0E> (BEP6)
   */
  haveAll () {
    if (!this.hasFast) throw Error('fast extension is disabled')
    this._debug('have-all')
    this._push(MESSAGE_HAVE_ALL)
  }

  /**
   * Message: "have-none" <len=0x0001><id=0x0F> (BEP6)
   */
  haveNone () {
    if (!this.hasFast) throw Error('fast extension is disabled')
    this._debug('have-none')
    this._push(MESSAGE_HAVE_NONE)
  }

  /**
   * Message "reject": <len=0x000D><id=0x10><index><offset><length> (BEP6)
   * @param  {number}   index
   * @param  {number}   offset
   * @param  {number}   length
   */
  reject (index, offset, length) {
    if (!this.hasFast) throw Error('fast extension is disabled')
    this._debug('reject index=%d offset=%d length=%d', index, offset, length)
    this._pull(this.peerRequests, index, offset, length)
    this._message(0x10, [index, offset, length], null)
  }

  /**
   * Message: "allowed-fast" <len=0x0005><id=0x11><piece index> (BEP6)
   * @param {number} index
   */
  allowedFast (index) {
    if (!this.hasFast) throw Error('fast extension is disabled')
    this._debug('allowed-fast %d', index)
    if (!this.allowedFastSet.includes(index)) this.allowedFastSet.push(index)
    this._message(0x11, [index], null)
  }

  /**
   * Message: "extended" <len=0005+X><id=20><ext-number><payload>
   * @param  {number|string} ext
   * @param  {Object} obj
   */
  extended (ext, obj) {
    this._debug('extended ext=%s', ext)
    if (typeof ext === 'string' && this.peerExtendedMapping[ext]) {
      ext = this.peerExtendedMapping[ext]
    }
    if (typeof ext === 'number') {
      const extId = new Uint8Array([ext])
      const buf = ArrayBuffer.isView(obj) ? obj : bencode__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.encode(obj)

      this._message(20, [], (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .concat */ .xW)([extId, buf]))
    } else {
      throw new Error(`Unrecognized extension: ${ext}`)
    }
  }

  /**
   * Sets the encryption method for this wire, as per PSE/ME specification
   *
   * @param {string} sharedSecret:  A hex-encoded string, which is the shared secret agreed
   *                                upon from DH key exchange
   * @param {string} infoHash:  A hex-encoded info hash
   * @returns boolean, true if encryption setting succeeds, false if it fails.
   */
  async setEncrypt (sharedSecret, infoHash) {
    if (!this.type.startsWith('tcp')) return false

    const outgoing = this.type === 'tcpOutgoing'

    const keyAGenerator = new rc4__WEBPACK_IMPORTED_MODULE_4__([...await (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hash */ .tW)((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hex2arr */ .fk)(this._utfToHex('keyA') + sharedSecret + infoHash))])
    const keyBGenerator = new rc4__WEBPACK_IMPORTED_MODULE_4__([...await (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hash */ .tW)((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hex2arr */ .fk)(this._utfToHex('keyB') + sharedSecret + infoHash))])

    this._encryptGenerator = outgoing ? keyAGenerator : keyBGenerator
    this._decryptGenerator = outgoing ? keyBGenerator : keyAGenerator

    // Discard the first 1024 bytes, as per MSE/PE implementation
    for (let i = 0; i < 1024; i++) {
      this._encryptGenerator.randomByte()
      this._decryptGenerator.randomByte()
    }

    this._setGenerators = true
    this.emit('_generators')
    return true
  }

  /**
   * Send a message to the remote peer.
   */
  _message (id, numbers, data) {
    const dataLength = data ? data.length : 0
    const buffer = new Uint8Array(5 + (4 * numbers.length))

    setUint32(buffer, 0, buffer.length + dataLength - 4)
    buffer[4] = id
    for (let i = 0; i < numbers.length; i++) {
      setUint32(buffer, 5 + (4 * i), numbers[i])
    }

    this._push(buffer)
    if (data) this._push(data)
  }

  _push (data) {
    if (this._finished) return
    if (this._encryptionMethod === 2 && this._cryptoHandshakeDone) {
      data = this._encrypt(data)
    }
    return this.push(data)
  }

  //
  // INCOMING MESSAGES
  //

  _onKeepAlive () {
    this._debug('got keep-alive')
    this.emit('keep-alive')
  }

  _onPe1 (pubKeyBuffer) {
    this._peerPubKey = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .arr2hex */ .V5)(pubKeyBuffer)
    this._sharedSecret = this._dh.computeSecret(this._peerPubKey, 'hex', 'hex')
    this.emit('pe1')
  }

  _onPe2 (pubKeyBuffer) {
    this._peerPubKey = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .arr2hex */ .V5)(pubKeyBuffer)
    this._sharedSecret = this._dh.computeSecret(this._peerPubKey, 'hex', 'hex')
    this.emit('pe2')
  }

  async _onPe3 (hashesXorBuffer) {
    const hash3 = await (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hash */ .tW)((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hex2arr */ .fk)(this._utfToHex('req3') + this._sharedSecret))
    const sKeyHash = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .arr2hex */ .V5)(xor(hash3, hashesXorBuffer))
    this.emit('pe3', sKeyHash)
  }

  _onPe3Encrypted (vcBuffer, peerProvideBuffer) {
    if (!(0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .equal */ .LC)(vcBuffer, VC)) {
      this._debug('Error: verification constant did not match')
      this.destroy()
      return
    }

    for (const provideByte of peerProvideBuffer.values()) {
      if (provideByte !== 0) {
        this._peerCryptoProvide.push(provideByte)
      }
    }
    if (this._peerCryptoProvide.includes(2)) {
      this._encryptionMethod = 2
    } else {
      this._debug('Error: RC4 encryption method not provided by peer')
      this.destroy()
    }
  }

  _onPe4 (peerSelectBuffer) {
    this._encryptionMethod = peerSelectBuffer[3]
    if (!CRYPTO_PROVIDE.includes(this._encryptionMethod)) {
      this._debug('Error: peer selected invalid crypto method')
      this.destroy()
    }
    this._cryptoHandshakeDone = true
    this._debug('crypto handshake done')
    this.emit('pe4')
  }

  _onHandshake (infoHashBuffer, peerIdBuffer, extensions) {
    const infoHash = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .arr2hex */ .V5)(infoHashBuffer)
    const peerId = (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .arr2hex */ .V5)(peerIdBuffer)

    this._debug('got handshake i=%s p=%s exts=%o', infoHash, peerId, extensions)

    this.peerId = peerId
    this.peerIdBuffer = peerIdBuffer
    this.peerExtensions = extensions

    // BEP6 Fast Extension: The extension is enabled only if both ends of the connection set this bit.
    if (this.extensions.fast && this.peerExtensions.fast) {
      this._debug('fast extension is enabled')
      this.hasFast = true
    }

    this.emit('handshake', infoHash, peerId, extensions)

    for (const name in this._ext) {
      this._ext[name].onHandshake(infoHash, peerId, extensions)
    }

    if (extensions.extended && this._handshakeSent &&
        !this._extendedHandshakeSent) {
      // outgoing connection
      this._sendExtendedHandshake()
    }
  }

  _onChoke () {
    this.peerChoking = true
    this._debug('got choke')
    this.emit('choke')
    if (!this.hasFast) {
      // BEP6 Fast Extension: Choke no longer implicitly rejects all pending requests
      while (this.requests.length) {
        this._callback(this.requests.pop(), new Error('peer is choking'), null)
      }
    }
  }

  _onUnchoke () {
    this.peerChoking = false
    this._debug('got unchoke')
    this.emit('unchoke')
  }

  _onInterested () {
    this.peerInterested = true
    this._debug('got interested')
    this.emit('interested')
  }

  _onUninterested () {
    this.peerInterested = false
    this._debug('got uninterested')
    this.emit('uninterested')
  }

  _onHave (index) {
    if (this.peerPieces.get(index)) return
    this._debug('got have %d', index)

    this.peerPieces.set(index, true)
    this.emit('have', index)
  }

  _onBitField (buffer) {
    this.peerPieces = new bitfield__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A(buffer)
    this._debug('got bitfield')
    this.emit('bitfield', this.peerPieces)
  }

  _onRequest (index, offset, length) {
    if (this.amChoking && !(this.hasFast && this.allowedFastSet.includes(index))) {
      // BEP6: If a peer receives a request from a peer its choking, the peer receiving
      // the request SHOULD send a reject unless the piece is in the allowed fast set.
      if (this.hasFast) this.reject(index, offset, length)
      return
    }
    this._debug('got request index=%d offset=%d length=%d', index, offset, length)

    const respond = (err, buffer) => {
      if (request !== this._pull(this.peerRequests, index, offset, length)) return
      if (err) {
        this._debug('error satisfying request index=%d offset=%d length=%d (%s)', index, offset, length, err.message)
        if (this.hasFast) this.reject(index, offset, length)
        return
      }
      this.piece(index, offset, buffer)
    }

    const request = new Request(index, offset, length, respond)
    this.peerRequests.push(request)
    this.emit('request', index, offset, length, respond)
  }

  _onPiece (index, offset, buffer) {
    this._debug('got piece index=%d offset=%d', index, offset)
    this._callback(this._pull(this.requests, index, offset, buffer.length), null, buffer)
    this.downloaded += buffer.length
    this.downloadSpeed(buffer.length)
    this.emit('download', buffer.length)
    this.emit('piece', index, offset, buffer)
  }

  _onCancel (index, offset, length) {
    this._debug('got cancel index=%d offset=%d length=%d', index, offset, length)
    this._pull(this.peerRequests, index, offset, length)
    this.emit('cancel', index, offset, length)
  }

  _onPort (port) {
    this._debug('got port %d', port)
    this.emit('port', port)
  }

  _onSuggest (index) {
    if (!this.hasFast) {
      // BEP6: the peer MUST close the connection
      this._debug('Error: got suggest whereas fast extension is disabled')
      this.destroy()
      return
    }
    this._debug('got suggest %d', index)
    this.emit('suggest', index)
  }

  _onHaveAll () {
    if (!this.hasFast) {
      // BEP6: the peer MUST close the connection
      this._debug('Error: got have-all whereas fast extension is disabled')
      this.destroy()
      return
    }
    this._debug('got have-all')
    this.peerPieces = new HaveAllBitField()
    this.emit('have-all')
  }

  _onHaveNone () {
    if (!this.hasFast) {
      // BEP6: the peer MUST close the connection
      this._debug('Error: got have-none whereas fast extension is disabled')
      this.destroy()
      return
    }
    this._debug('got have-none')
    this.emit('have-none')
  }

  _onReject (index, offset, length) {
    if (!this.hasFast) {
      // BEP6: the peer MUST close the connection
      this._debug('Error: got reject whereas fast extension is disabled')
      this.destroy()
      return
    }
    this._debug('got reject index=%d offset=%d length=%d', index, offset, length)
    this._callback(
      this._pull(this.requests, index, offset, length),
      new Error('request was rejected'),
      null
    )
    this.emit('reject', index, offset, length)
  }

  _onAllowedFast (index) {
    if (!this.hasFast) {
      // BEP6: the peer MUST close the connection
      this._debug('Error: got allowed-fast whereas fast extension is disabled')
      this.destroy()
      return
    }
    this._debug('got allowed-fast %d', index)
    if (!this.peerAllowedFastSet.includes(index)) this.peerAllowedFastSet.push(index)
    if (this.peerAllowedFastSet.length > ALLOWED_FAST_SET_MAX_LENGTH) this.peerAllowedFastSet.shift()
    this.emit('allowed-fast', index)
  }

  _onExtended (ext, buf) {
    if (ext === 0) {
      let info
      try {
        info = bencode__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.decode(buf)
      } catch (err) {
        this._debug('ignoring invalid extended handshake: %s', err.message || err)
      }

      if (!info) return
      this.peerExtendedHandshake = info

      if (typeof info.m === 'object') {
        for (const name in info.m) {
          this.peerExtendedMapping[name] = Number(info.m[name].toString())
        }
      }
      for (const name in this._ext) {
        if (this.peerExtendedMapping[name]) {
          this._ext[name].onExtendedHandshake(this.peerExtendedHandshake)
        }
      }
      this._debug('got extended handshake')
      this.emit('extended', 'handshake', this.peerExtendedHandshake)
    } else {
      if (this.extendedMapping[ext]) {
        ext = this.extendedMapping[ext] // friendly name for extension
        if (this._ext[ext]) {
          // there is an registered extension handler, so call it
          this._ext[ext].onMessage(buf)
        }
      }
      this._debug('got extended message ext=%s', ext)
      this.emit('extended', ext, buf)
    }
  }

  _onTimeout () {
    this._debug('request timed out')
    this._callback(this.requests.shift(), new Error('request has timed out'), null)
    this.emit('timeout')
  }

  /**
   * Duplex stream method. Called whenever the remote peer has data for us. Data that the
   * remote peer sends gets buffered (i.e. not actually processed) until the right number
   * of bytes have arrived, determined by the last call to `this._parse(number, callback)`.
   * Once enough bytes have arrived to process the message, the callback function
   * (i.e. `this._parser`) gets called with the full buffer of data.
   * @param  {Uint8Array} data
   * @param  {function} cb
   */
  _write (data, cb) {
    if (this._encryptionMethod === 2 && this._cryptoHandshakeDone) {
      data = this._decrypt(data)
    }
    this._bufferSize += data.length
    this._buffer.push(data)
    if (this._buffer.length > 1) {
      this._buffer = [(0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .concat */ .xW)(this._buffer, this._bufferSize)]
    }
    // now this._buffer is an array containing a single Buffer
    if (this._cryptoSyncPattern) {
      const index = this._buffer[0].indexOf(this._cryptoSyncPattern)
      if (index !== -1) {
        this._buffer[0] = this._buffer[0].slice(index + this._cryptoSyncPattern.length)
        this._bufferSize -= (index + this._cryptoSyncPattern.length)
        this._cryptoSyncPattern = null
      } else if (this._bufferSize + data.length > this._waitMaxBytes + this._cryptoSyncPattern.length) {
        this._debug('Error: could not resynchronize')
        this.destroy()
        return
      }
    }

    while (this._bufferSize >= this._parserSize && !this._cryptoSyncPattern) {
      if (this._parserSize === 0) {
        this._parser(new Uint8Array())
      } else {
        const buffer = this._buffer[0]

        this._bufferSize -= this._parserSize
        this._buffer = this._bufferSize
          ? [buffer.subarray(this._parserSize)]
          : []
        this._parser(buffer.subarray(0, this._parserSize))
      }
    }

    cb(null) // Signal that we're ready for more data
  }

  _callback (request, err, buffer) {
    if (!request) return

    this._resetTimeout(!this.peerChoking && !this._finished)

    request.callback(err, buffer)
  }

  _resetTimeout (setAgain) {
    if (!setAgain || !this._timeoutMs || !this.requests.length) {
      clearTimeout(this._timeout)
      this._timeout = null
      this._timeoutExpiresAt = null
      return
    }

    const timeoutExpiresAt = Date.now() + this._timeoutMs

    if (this._timeout) {
      // If existing expiration is already within 5% of correct, it's close enough
      if (timeoutExpiresAt - this._timeoutExpiresAt < this._timeoutMs * 0.05) {
        return
      }
      clearTimeout(this._timeout)
    }

    this._timeoutExpiresAt = timeoutExpiresAt
    this._timeout = setTimeout(() => this._onTimeout(), this._timeoutMs)
    if (this._timeoutUnref && this._timeout.unref) this._timeout.unref()
  }

  /**
   * Takes a number of bytes that the local peer is waiting to receive from the remote peer
   * in order to parse a complete message, and a callback function to be called once enough
   * bytes have arrived.
   * @param  {number} size
   * @param  {function} parser
   */
  _parse (size, parser) {
    this._parserSize = size
    this._parser = parser
  }

  _parseUntil (pattern, maxBytes) {
    this._cryptoSyncPattern = pattern
    this._waitMaxBytes = maxBytes
  }

  /**
   * Handle the first 4 bytes of a message, to determine the length of bytes that must be
   * waited for in order to have the whole message.
   * @param  {Uint8Array} buffer
   */
  _onMessageLength (buffer) {
    const length = getUint32(buffer)
    if (length > 0) {
      this._parse(length, this._onMessage)
    } else {
      this._onKeepAlive()
      this._parse(4, this._onMessageLength)
    }
  }

  /**
   * Handle a message from the remote peer.
   * @param  {Uint8Array} buffer
   */
  _onMessage (buffer) {
    this._parse(4, this._onMessageLength)
    switch (buffer[0]) {
      case 0:
        return this._onChoke()
      case 1:
        return this._onUnchoke()
      case 2:
        return this._onInterested()
      case 3:
        return this._onUninterested()
      case 4:
        return this._onHave(getUint32(buffer, 1))
      case 5:
        return this._onBitField(buffer.subarray(1))
      case 6:
        return this._onRequest(
          getUint32(buffer, 1),
          getUint32(buffer, 5),
          getUint32(buffer, 9)
        )
      case 7:
        return this._onPiece(
          getUint32(buffer, 1),
          getUint32(buffer, 5),
          buffer.subarray(9)
        )
      case 8:
        return this._onCancel(
          getUint32(buffer, 1),
          getUint32(buffer, 5),
          getUint32(buffer, 9)
        )
      case 9:
        return this._onPort((buffer[1] << 8) | buffer[2])
      case 0x0D:
        return this._onSuggest(getUint32(buffer, 1))
      case 0x0E:
        return this._onHaveAll()
      case 0x0F:
        return this._onHaveNone()
      case 0x10:
        return this._onReject(
          getUint32(buffer, 1),
          getUint32(buffer, 5),
          getUint32(buffer, 9)
        )
      case 0x11:
        return this._onAllowedFast(getUint32(buffer, 1))
      case 20:
        return this._onExtended(buffer[1], buffer.subarray(2))
      default:
        this._debug('got unknown message')
        return this.emit('unknownmessage', buffer)
    }
  }

  _determineHandshakeType () {
    this._parse(1, pstrLenBuffer => {
      const pstrlen = pstrLenBuffer[0]
      if (pstrlen === 19) {
        this._parse(pstrlen + 48, this._onHandshakeBuffer)
      } else {
        this._parsePe1(pstrLenBuffer)
      }
    })
  }

  _parsePe1 (pubKeyPrefix) {
    this._parse(95, pubKeySuffix => {
      this._onPe1((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .concat */ .xW)([pubKeyPrefix, pubKeySuffix]))
      this._parsePe3()
    })
  }

  _parsePe2 () {
    this._parse(96, async pubKey => {
      this._onPe2(pubKey)
      if (!this._setGenerators) {
        // Wait until generators have been set
        await new Promise(resolve => this.once('_generators', resolve))
      }
      this._parsePe4()
    })
  }

  // Handles the unencrypted portion of step 4
  async _parsePe3 () {
    const hash1Buffer = await (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hash */ .tW)((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .hex2arr */ .fk)(this._utfToHex('req1') + this._sharedSecret))
    // synchronize on HASH('req1', S)
    this._parseUntil(hash1Buffer, 512)
    this._parse(20, async buffer => {
      this._onPe3(buffer)
      if (!this._setGenerators) {
        // Wait until generators have been set
        await new Promise(resolve => this.once('_generators', resolve))
      }
      this._parsePe3Encrypted()
    })
  }

  _parsePe3Encrypted () {
    this._parse(14, buffer => {
      const vcBuffer = this._decryptHandshake(buffer.slice(0, 8))
      const peerProvideBuffer = this._decryptHandshake(buffer.slice(8, 12))
      const padCLen = new DataView(this._decryptHandshake(buffer.slice(12, 14)).buffer).getUint16(0)
      this._parse(padCLen, padCBuffer => {
        padCBuffer = this._decryptHandshake(padCBuffer)
        this._parse(2, iaLenBuf => {
          const iaLen = new DataView(this._decryptHandshake(iaLenBuf).buffer).getUint16(0)
          this._parse(iaLen, iaBuffer => {
            iaBuffer = this._decryptHandshake(iaBuffer)
            this._onPe3Encrypted(vcBuffer, peerProvideBuffer, padCBuffer, iaBuffer)
            const pstrlen = iaLen ? iaBuffer[0] : null
            const protocol = iaLen ? iaBuffer.slice(1, 20) : null
            if (pstrlen === 19 && (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .arr2text */ .dU)(protocol) === 'BitTorrent protocol') {
              this._onHandshakeBuffer(iaBuffer.slice(1))
            } else {
              this._parseHandshake()
            }
          })
        })
      })
    })
  }

  _parsePe4 () {
    // synchronize on ENCRYPT(VC).
    // since we encrypt using bitwise xor, decryption and encryption are the same operation.
    // calling _decryptHandshake here advances the decrypt generator keystream forward 8 bytes
    const vcBufferEncrypted = this._decryptHandshake(VC)
    this._parseUntil(vcBufferEncrypted, 512)
    this._parse(6, buffer => {
      const peerSelectBuffer = this._decryptHandshake(buffer.slice(0, 4))
      const padDLen = new DataView(this._decryptHandshake(buffer.slice(4, 6)).buffer).getUint16(0)
      this._parse(padDLen, padDBuf => {
        this._decryptHandshake(padDBuf)
        this._onPe4(peerSelectBuffer)
        this._parseHandshake(null)
      })
    })
  }

  /**
   * Reads the handshake as specified by the bittorrent wire protocol.
   */
  _parseHandshake () {
    this._parse(1, buffer => {
      const pstrlen = buffer[0]
      if (pstrlen !== 19) {
        this._debug('Error: wire not speaking BitTorrent protocol (%s)', pstrlen.toString())
        this.end()
        return
      }
      this._parse(pstrlen + 48, this._onHandshakeBuffer)
    })
  }

  _onHandshakeBuffer (handshake) {
    const protocol = handshake.slice(0, 19)
    if ((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .arr2text */ .dU)(protocol) !== 'BitTorrent protocol') {
      this._debug('Error: wire not speaking BitTorrent protocol (%s)', (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .arr2text */ .dU)(protocol))
      this.end()
      return
    }
    handshake = handshake.slice(19)
    this._onHandshake(handshake.slice(8, 28), handshake.slice(28, 48), {
      dht: !!(handshake[7] & 0x01), // see bep_0005
      fast: !!(handshake[7] & 0x04), // see bep_0006
      extended: !!(handshake[5] & 0x10) // see bep_0010
    })
    this._parse(4, this._onMessageLength)
  }

  _onFinish () {
    this._finished = true

    this.push(null) // stream cannot be half open, so signal the end of it
    while (this.read()) {
      // body intentionally empty
      // consume and discard the rest of the stream data
    }

    clearInterval(this._keepAliveInterval)
    this._parse(Number.MAX_VALUE, () => {})
    while (this.peerRequests.length) {
      this.peerRequests.pop()
    }
    while (this.requests.length) {
      this._callback(this.requests.pop(), new Error('wire was closed'), null)
    }
  }

  _debug (...args) {
    args[0] = `[${this._debugId}] ${args[0]}`
    debug(...args)
  }

  _pull (requests, piece, offset, length) {
    for (let i = 0; i < requests.length; i++) {
      const req = requests[i]
      if (req.piece === piece && req.offset === offset && req.length === length) {
        unordered_array_remove__WEBPACK_IMPORTED_MODULE_8__(requests, i)
        return req
      }
    }
    return null
  }

  _encryptHandshake (buf) {
    const crypt = new Uint8Array(buf)
    if (!this._encryptGenerator) {
      this._debug('Warning: Encrypting without any generator')
      return crypt
    }

    for (let i = 0; i < buf.length; i++) {
      const keystream = this._encryptGenerator.randomByte()
      crypt[i] = crypt[i] ^ keystream
    }

    return crypt
  }

  _encrypt (buf) {
    const crypt = new Uint8Array(buf)

    if (!this._encryptGenerator || this._encryptionMethod !== 2) {
      return crypt
    }
    for (let i = 0; i < buf.length; i++) {
      const keystream = this._encryptGenerator.randomByte()
      crypt[i] = crypt[i] ^ keystream
    }

    return crypt
  }

  _decryptHandshake (buf) {
    const decrypt = new Uint8Array(buf)

    if (!this._decryptGenerator) {
      this._debug('Warning: Decrypting without any generator')
      return decrypt
    }
    for (let i = 0; i < buf.length; i++) {
      const keystream = this._decryptGenerator.randomByte()
      decrypt[i] = decrypt[i] ^ keystream
    }

    return decrypt
  }

  _decrypt (buf) {
    const decrypt = new Uint8Array(buf)

    if (!this._decryptGenerator || this._encryptionMethod !== 2) {
      return decrypt
    }
    for (let i = 0; i < buf.length; i++) {
      const keystream = this._decryptGenerator.randomByte()
      decrypt[i] = decrypt[i] ^ keystream
    }

    return decrypt
  }

  _utfToHex (str) {
    return (0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .arr2hex */ .V5)((0,uint8_util__WEBPACK_IMPORTED_MODULE_6__/* .text2arr */ .L0)(str))
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Wire);


/***/ }),

/***/ 6585:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 6587:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 6611:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(717);
var once = __webpack_require__(3519);

var noop = function() {};

var qnt = globalThis.Bare ? queueMicrotask : process.nextTick.bind(process);

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		qnt(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 6664:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 6686:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 6698:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 6819:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Exports package.json to work around "with" and "assert" for backwards compatability.
module.exports = __webpack_require__(8330).version


/***/ }),

/***/ 6889:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 7007:
/***/ ((module) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    // removed by dead control flow

  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}


/***/ }),

/***/ 7264:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 7373:
/***/ ((module) => {

var iterate = function (list) {
  var offset = 0
  return function () {
    if (offset === list.length) return null

    var len = list.length - offset
    var i = (Math.random() * len) | 0
    var el = list[offset + i]

    var tmp = list[offset]
    list[offset] = el
    list[offset + i] = tmp
    offset++

    return el
  }
}

module.exports = iterate


/***/ }),

/***/ 7541:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Throttle = __webpack_require__(8765)
const ThrottleGroup = __webpack_require__(8499)

module.exports = {
  Throttle,
  ThrottleGroup
}


/***/ }),

/***/ 7828:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 7833:
/***/ ((module, exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(717);
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	let m;

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	// eslint-disable-next-line no-return-assign
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug') || exports.storage.getItem('DEBUG') ;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(736)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 8179:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { EventEmitter } = __webpack_require__(7007)
const STREAM_DESTROYED = new Error('Stream was destroyed')
const PREMATURE_CLOSE = new Error('Premature close')

const FIFO = __webpack_require__(6080)
const TextDecoder = __webpack_require__(5335)

// if we do a future major, expect queue microtask to be there always, for now a bit defensive
const qmt = typeof queueMicrotask === 'undefined' ? fn => globalThis.process.nextTick(fn) : queueMicrotask

/* eslint-disable no-multi-spaces */

// 29 bits used total (4 from shared, 14 from read, and 11 from write)
const MAX = ((1 << 29) - 1)

// Shared state
const OPENING       = 0b0001
const PREDESTROYING = 0b0010
const DESTROYING    = 0b0100
const DESTROYED     = 0b1000

const NOT_OPENING = MAX ^ OPENING
const NOT_PREDESTROYING = MAX ^ PREDESTROYING

// Read state (4 bit offset from shared state)
const READ_ACTIVE           = 0b00000000000001 << 4
const READ_UPDATING         = 0b00000000000010 << 4
const READ_PRIMARY          = 0b00000000000100 << 4
const READ_QUEUED           = 0b00000000001000 << 4
const READ_RESUMED          = 0b00000000010000 << 4
const READ_PIPE_DRAINED     = 0b00000000100000 << 4
const READ_ENDING           = 0b00000001000000 << 4
const READ_EMIT_DATA        = 0b00000010000000 << 4
const READ_EMIT_READABLE    = 0b00000100000000 << 4
const READ_EMITTED_READABLE = 0b00001000000000 << 4
const READ_DONE             = 0b00010000000000 << 4
const READ_NEXT_TICK        = 0b00100000000000 << 4
const READ_NEEDS_PUSH       = 0b01000000000000 << 4
const READ_READ_AHEAD       = 0b10000000000000 << 4

// Combined read state
const READ_FLOWING = READ_RESUMED | READ_PIPE_DRAINED
const READ_ACTIVE_AND_NEEDS_PUSH = READ_ACTIVE | READ_NEEDS_PUSH
const READ_PRIMARY_AND_ACTIVE = READ_PRIMARY | READ_ACTIVE
const READ_EMIT_READABLE_AND_QUEUED = READ_EMIT_READABLE | READ_QUEUED
const READ_RESUMED_READ_AHEAD = READ_RESUMED | READ_READ_AHEAD

const READ_NOT_ACTIVE             = MAX ^ READ_ACTIVE
const READ_NON_PRIMARY            = MAX ^ READ_PRIMARY
const READ_NON_PRIMARY_AND_PUSHED = MAX ^ (READ_PRIMARY | READ_NEEDS_PUSH)
const READ_PUSHED                 = MAX ^ READ_NEEDS_PUSH
const READ_PAUSED                 = MAX ^ READ_RESUMED
const READ_NOT_QUEUED             = MAX ^ (READ_QUEUED | READ_EMITTED_READABLE)
const READ_NOT_ENDING             = MAX ^ READ_ENDING
const READ_PIPE_NOT_DRAINED       = MAX ^ READ_FLOWING
const READ_NOT_NEXT_TICK          = MAX ^ READ_NEXT_TICK
const READ_NOT_UPDATING           = MAX ^ READ_UPDATING
const READ_NO_READ_AHEAD          = MAX ^ READ_READ_AHEAD
const READ_PAUSED_NO_READ_AHEAD   = MAX ^ READ_RESUMED_READ_AHEAD

// Write state (18 bit offset, 4 bit offset from shared state and 14 from read state)
const WRITE_ACTIVE     = 0b00000000001 << 18
const WRITE_UPDATING   = 0b00000000010 << 18
const WRITE_PRIMARY    = 0b00000000100 << 18
const WRITE_QUEUED     = 0b00000001000 << 18
const WRITE_UNDRAINED  = 0b00000010000 << 18
const WRITE_DONE       = 0b00000100000 << 18
const WRITE_EMIT_DRAIN = 0b00001000000 << 18
const WRITE_NEXT_TICK  = 0b00010000000 << 18
const WRITE_WRITING    = 0b00100000000 << 18
const WRITE_FINISHING  = 0b01000000000 << 18
const WRITE_CORKED     = 0b10000000000 << 18

const WRITE_NOT_ACTIVE    = MAX ^ (WRITE_ACTIVE | WRITE_WRITING)
const WRITE_NON_PRIMARY   = MAX ^ WRITE_PRIMARY
const WRITE_NOT_FINISHING = MAX ^ (WRITE_ACTIVE | WRITE_FINISHING)
const WRITE_DRAINED       = MAX ^ WRITE_UNDRAINED
const WRITE_NOT_QUEUED    = MAX ^ WRITE_QUEUED
const WRITE_NOT_NEXT_TICK = MAX ^ WRITE_NEXT_TICK
const WRITE_NOT_UPDATING  = MAX ^ WRITE_UPDATING
const WRITE_NOT_CORKED    = MAX ^ WRITE_CORKED

// Combined shared state
const ACTIVE = READ_ACTIVE | WRITE_ACTIVE
const NOT_ACTIVE = MAX ^ ACTIVE
const DONE = READ_DONE | WRITE_DONE
const DESTROY_STATUS = DESTROYING | DESTROYED | PREDESTROYING
const OPEN_STATUS = DESTROY_STATUS | OPENING
const AUTO_DESTROY = DESTROY_STATUS | DONE
const NON_PRIMARY = WRITE_NON_PRIMARY & READ_NON_PRIMARY
const ACTIVE_OR_TICKING = WRITE_NEXT_TICK | READ_NEXT_TICK
const TICKING = ACTIVE_OR_TICKING & NOT_ACTIVE
const IS_OPENING = OPEN_STATUS | TICKING

// Combined shared state and read state
const READ_PRIMARY_STATUS = OPEN_STATUS | READ_ENDING | READ_DONE
const READ_STATUS = OPEN_STATUS | READ_DONE | READ_QUEUED
const READ_ENDING_STATUS = OPEN_STATUS | READ_ENDING | READ_QUEUED
const READ_READABLE_STATUS = OPEN_STATUS | READ_EMIT_READABLE | READ_QUEUED | READ_EMITTED_READABLE
const SHOULD_NOT_READ = OPEN_STATUS | READ_ACTIVE | READ_ENDING | READ_DONE | READ_NEEDS_PUSH | READ_READ_AHEAD
const READ_BACKPRESSURE_STATUS = DESTROY_STATUS | READ_ENDING | READ_DONE
const READ_UPDATE_SYNC_STATUS = READ_UPDATING | OPEN_STATUS | READ_NEXT_TICK | READ_PRIMARY
const READ_NEXT_TICK_OR_OPENING = READ_NEXT_TICK | OPENING

// Combined write state
const WRITE_PRIMARY_STATUS = OPEN_STATUS | WRITE_FINISHING | WRITE_DONE
const WRITE_QUEUED_AND_UNDRAINED = WRITE_QUEUED | WRITE_UNDRAINED
const WRITE_QUEUED_AND_ACTIVE = WRITE_QUEUED | WRITE_ACTIVE
const WRITE_DRAIN_STATUS = WRITE_QUEUED | WRITE_UNDRAINED | OPEN_STATUS | WRITE_ACTIVE
const WRITE_STATUS = OPEN_STATUS | WRITE_ACTIVE | WRITE_QUEUED | WRITE_CORKED
const WRITE_PRIMARY_AND_ACTIVE = WRITE_PRIMARY | WRITE_ACTIVE
const WRITE_ACTIVE_AND_WRITING = WRITE_ACTIVE | WRITE_WRITING
const WRITE_FINISHING_STATUS = OPEN_STATUS | WRITE_FINISHING | WRITE_QUEUED_AND_ACTIVE | WRITE_DONE
const WRITE_BACKPRESSURE_STATUS = WRITE_UNDRAINED | DESTROY_STATUS | WRITE_FINISHING | WRITE_DONE
const WRITE_UPDATE_SYNC_STATUS = WRITE_UPDATING | OPEN_STATUS | WRITE_NEXT_TICK | WRITE_PRIMARY
const WRITE_DROP_DATA = WRITE_FINISHING | WRITE_DONE | DESTROY_STATUS

const asyncIterator = Symbol.asyncIterator || Symbol('asyncIterator')

class WritableState {
  constructor (stream, { highWaterMark = 16384, map = null, mapWritable, byteLength, byteLengthWritable } = {}) {
    this.stream = stream
    this.queue = new FIFO()
    this.highWaterMark = highWaterMark
    this.buffered = 0
    this.error = null
    this.pipeline = null
    this.drains = null // if we add more seldomly used helpers we might them into a subobject so its a single ptr
    this.byteLength = byteLengthWritable || byteLength || defaultByteLength
    this.map = mapWritable || map
    this.afterWrite = afterWrite.bind(this)
    this.afterUpdateNextTick = updateWriteNT.bind(this)
  }

  get ended () {
    return (this.stream._duplexState & WRITE_DONE) !== 0
  }

  push (data) {
    if ((this.stream._duplexState & WRITE_DROP_DATA) !== 0) return false
    if (this.map !== null) data = this.map(data)

    this.buffered += this.byteLength(data)
    this.queue.push(data)

    if (this.buffered < this.highWaterMark) {
      this.stream._duplexState |= WRITE_QUEUED
      return true
    }

    this.stream._duplexState |= WRITE_QUEUED_AND_UNDRAINED
    return false
  }

  shift () {
    const data = this.queue.shift()

    this.buffered -= this.byteLength(data)
    if (this.buffered === 0) this.stream._duplexState &= WRITE_NOT_QUEUED

    return data
  }

  end (data) {
    if (typeof data === 'function') this.stream.once('finish', data)
    else if (data !== undefined && data !== null) this.push(data)
    this.stream._duplexState = (this.stream._duplexState | WRITE_FINISHING) & WRITE_NON_PRIMARY
  }

  autoBatch (data, cb) {
    const buffer = []
    const stream = this.stream

    buffer.push(data)
    while ((stream._duplexState & WRITE_STATUS) === WRITE_QUEUED_AND_ACTIVE) {
      buffer.push(stream._writableState.shift())
    }

    if ((stream._duplexState & OPEN_STATUS) !== 0) return cb(null)
    stream._writev(buffer, cb)
  }

  update () {
    const stream = this.stream

    stream._duplexState |= WRITE_UPDATING

    do {
      while ((stream._duplexState & WRITE_STATUS) === WRITE_QUEUED) {
        const data = this.shift()
        stream._duplexState |= WRITE_ACTIVE_AND_WRITING
        stream._write(data, this.afterWrite)
      }

      if ((stream._duplexState & WRITE_PRIMARY_AND_ACTIVE) === 0) this.updateNonPrimary()
    } while (this.continueUpdate() === true)

    stream._duplexState &= WRITE_NOT_UPDATING
  }

  updateNonPrimary () {
    const stream = this.stream

    if ((stream._duplexState & WRITE_FINISHING_STATUS) === WRITE_FINISHING) {
      stream._duplexState = stream._duplexState | WRITE_ACTIVE
      stream._final(afterFinal.bind(this))
      return
    }

    if ((stream._duplexState & DESTROY_STATUS) === DESTROYING) {
      if ((stream._duplexState & ACTIVE_OR_TICKING) === 0) {
        stream._duplexState |= ACTIVE
        stream._destroy(afterDestroy.bind(this))
      }
      return
    }

    if ((stream._duplexState & IS_OPENING) === OPENING) {
      stream._duplexState = (stream._duplexState | ACTIVE) & NOT_OPENING
      stream._open(afterOpen.bind(this))
    }
  }

  continueUpdate () {
    if ((this.stream._duplexState & WRITE_NEXT_TICK) === 0) return false
    this.stream._duplexState &= WRITE_NOT_NEXT_TICK
    return true
  }

  updateCallback () {
    if ((this.stream._duplexState & WRITE_UPDATE_SYNC_STATUS) === WRITE_PRIMARY) this.update()
    else this.updateNextTick()
  }

  updateNextTick () {
    if ((this.stream._duplexState & WRITE_NEXT_TICK) !== 0) return
    this.stream._duplexState |= WRITE_NEXT_TICK
    if ((this.stream._duplexState & WRITE_UPDATING) === 0) qmt(this.afterUpdateNextTick)
  }
}

class ReadableState {
  constructor (stream, { highWaterMark = 16384, map = null, mapReadable, byteLength, byteLengthReadable } = {}) {
    this.stream = stream
    this.queue = new FIFO()
    this.highWaterMark = highWaterMark === 0 ? 1 : highWaterMark
    this.buffered = 0
    this.readAhead = highWaterMark > 0
    this.error = null
    this.pipeline = null
    this.byteLength = byteLengthReadable || byteLength || defaultByteLength
    this.map = mapReadable || map
    this.pipeTo = null
    this.afterRead = afterRead.bind(this)
    this.afterUpdateNextTick = updateReadNT.bind(this)
  }

  get ended () {
    return (this.stream._duplexState & READ_DONE) !== 0
  }

  pipe (pipeTo, cb) {
    if (this.pipeTo !== null) throw new Error('Can only pipe to one destination')
    if (typeof cb !== 'function') cb = null

    this.stream._duplexState |= READ_PIPE_DRAINED
    this.pipeTo = pipeTo
    this.pipeline = new Pipeline(this.stream, pipeTo, cb)

    if (cb) this.stream.on('error', noop) // We already error handle this so supress crashes

    if (isStreamx(pipeTo)) {
      pipeTo._writableState.pipeline = this.pipeline
      if (cb) pipeTo.on('error', noop) // We already error handle this so supress crashes
      pipeTo.on('finish', this.pipeline.finished.bind(this.pipeline)) // TODO: just call finished from pipeTo itself
    } else {
      const onerror = this.pipeline.done.bind(this.pipeline, pipeTo)
      const onclose = this.pipeline.done.bind(this.pipeline, pipeTo, null) // onclose has a weird bool arg
      pipeTo.on('error', onerror)
      pipeTo.on('close', onclose)
      pipeTo.on('finish', this.pipeline.finished.bind(this.pipeline))
    }

    pipeTo.on('drain', afterDrain.bind(this))
    this.stream.emit('piping', pipeTo)
    pipeTo.emit('pipe', this.stream)
  }

  push (data) {
    const stream = this.stream

    if (data === null) {
      this.highWaterMark = 0
      stream._duplexState = (stream._duplexState | READ_ENDING) & READ_NON_PRIMARY_AND_PUSHED
      return false
    }

    if (this.map !== null) {
      data = this.map(data)
      if (data === null) {
        stream._duplexState &= READ_PUSHED
        return this.buffered < this.highWaterMark
      }
    }

    this.buffered += this.byteLength(data)
    this.queue.push(data)

    stream._duplexState = (stream._duplexState | READ_QUEUED) & READ_PUSHED

    return this.buffered < this.highWaterMark
  }

  shift () {
    const data = this.queue.shift()

    this.buffered -= this.byteLength(data)
    if (this.buffered === 0) this.stream._duplexState &= READ_NOT_QUEUED
    return data
  }

  unshift (data) {
    const pending = [this.map !== null ? this.map(data) : data]
    while (this.buffered > 0) pending.push(this.shift())

    for (let i = 0; i < pending.length - 1; i++) {
      const data = pending[i]
      this.buffered += this.byteLength(data)
      this.queue.push(data)
    }

    this.push(pending[pending.length - 1])
  }

  read () {
    const stream = this.stream

    if ((stream._duplexState & READ_STATUS) === READ_QUEUED) {
      const data = this.shift()
      if (this.pipeTo !== null && this.pipeTo.write(data) === false) stream._duplexState &= READ_PIPE_NOT_DRAINED
      if ((stream._duplexState & READ_EMIT_DATA) !== 0) stream.emit('data', data)
      return data
    }

    if (this.readAhead === false) {
      stream._duplexState |= READ_READ_AHEAD
      this.updateNextTick()
    }

    return null
  }

  drain () {
    const stream = this.stream

    while ((stream._duplexState & READ_STATUS) === READ_QUEUED && (stream._duplexState & READ_FLOWING) !== 0) {
      const data = this.shift()
      if (this.pipeTo !== null && this.pipeTo.write(data) === false) stream._duplexState &= READ_PIPE_NOT_DRAINED
      if ((stream._duplexState & READ_EMIT_DATA) !== 0) stream.emit('data', data)
    }
  }

  update () {
    const stream = this.stream

    stream._duplexState |= READ_UPDATING

    do {
      this.drain()

      while (this.buffered < this.highWaterMark && (stream._duplexState & SHOULD_NOT_READ) === READ_READ_AHEAD) {
        stream._duplexState |= READ_ACTIVE_AND_NEEDS_PUSH
        stream._read(this.afterRead)
        this.drain()
      }

      if ((stream._duplexState & READ_READABLE_STATUS) === READ_EMIT_READABLE_AND_QUEUED) {
        stream._duplexState |= READ_EMITTED_READABLE
        stream.emit('readable')
      }

      if ((stream._duplexState & READ_PRIMARY_AND_ACTIVE) === 0) this.updateNonPrimary()
    } while (this.continueUpdate() === true)

    stream._duplexState &= READ_NOT_UPDATING
  }

  updateNonPrimary () {
    const stream = this.stream

    if ((stream._duplexState & READ_ENDING_STATUS) === READ_ENDING) {
      stream._duplexState = (stream._duplexState | READ_DONE) & READ_NOT_ENDING
      stream.emit('end')
      if ((stream._duplexState & AUTO_DESTROY) === DONE) stream._duplexState |= DESTROYING
      if (this.pipeTo !== null) this.pipeTo.end()
    }

    if ((stream._duplexState & DESTROY_STATUS) === DESTROYING) {
      if ((stream._duplexState & ACTIVE_OR_TICKING) === 0) {
        stream._duplexState |= ACTIVE
        stream._destroy(afterDestroy.bind(this))
      }
      return
    }

    if ((stream._duplexState & IS_OPENING) === OPENING) {
      stream._duplexState = (stream._duplexState | ACTIVE) & NOT_OPENING
      stream._open(afterOpen.bind(this))
    }
  }

  continueUpdate () {
    if ((this.stream._duplexState & READ_NEXT_TICK) === 0) return false
    this.stream._duplexState &= READ_NOT_NEXT_TICK
    return true
  }

  updateCallback () {
    if ((this.stream._duplexState & READ_UPDATE_SYNC_STATUS) === READ_PRIMARY) this.update()
    else this.updateNextTick()
  }

  updateNextTickIfOpen () {
    if ((this.stream._duplexState & READ_NEXT_TICK_OR_OPENING) !== 0) return
    this.stream._duplexState |= READ_NEXT_TICK
    if ((this.stream._duplexState & READ_UPDATING) === 0) qmt(this.afterUpdateNextTick)
  }

  updateNextTick () {
    if ((this.stream._duplexState & READ_NEXT_TICK) !== 0) return
    this.stream._duplexState |= READ_NEXT_TICK
    if ((this.stream._duplexState & READ_UPDATING) === 0) qmt(this.afterUpdateNextTick)
  }
}

class TransformState {
  constructor (stream) {
    this.data = null
    this.afterTransform = afterTransform.bind(stream)
    this.afterFinal = null
  }
}

class Pipeline {
  constructor (src, dst, cb) {
    this.from = src
    this.to = dst
    this.afterPipe = cb
    this.error = null
    this.pipeToFinished = false
  }

  finished () {
    this.pipeToFinished = true
  }

  done (stream, err) {
    if (err) this.error = err

    if (stream === this.to) {
      this.to = null

      if (this.from !== null) {
        if ((this.from._duplexState & READ_DONE) === 0 || !this.pipeToFinished) {
          this.from.destroy(this.error || new Error('Writable stream closed prematurely'))
        }
        return
      }
    }

    if (stream === this.from) {
      this.from = null

      if (this.to !== null) {
        if ((stream._duplexState & READ_DONE) === 0) {
          this.to.destroy(this.error || new Error('Readable stream closed before ending'))
        }
        return
      }
    }

    if (this.afterPipe !== null) this.afterPipe(this.error)
    this.to = this.from = this.afterPipe = null
  }
}

function afterDrain () {
  this.stream._duplexState |= READ_PIPE_DRAINED
  this.updateCallback()
}

function afterFinal (err) {
  const stream = this.stream
  if (err) stream.destroy(err)
  if ((stream._duplexState & DESTROY_STATUS) === 0) {
    stream._duplexState |= WRITE_DONE
    stream.emit('finish')
  }
  if ((stream._duplexState & AUTO_DESTROY) === DONE) {
    stream._duplexState |= DESTROYING
  }

  stream._duplexState &= WRITE_NOT_FINISHING

  // no need to wait the extra tick here, so we short circuit that
  if ((stream._duplexState & WRITE_UPDATING) === 0) this.update()
  else this.updateNextTick()
}

function afterDestroy (err) {
  const stream = this.stream

  if (!err && this.error !== STREAM_DESTROYED) err = this.error
  if (err) stream.emit('error', err)
  stream._duplexState |= DESTROYED
  stream.emit('close')

  const rs = stream._readableState
  const ws = stream._writableState

  if (rs !== null && rs.pipeline !== null) rs.pipeline.done(stream, err)

  if (ws !== null) {
    while (ws.drains !== null && ws.drains.length > 0) ws.drains.shift().resolve(false)
    if (ws.pipeline !== null) ws.pipeline.done(stream, err)
  }
}

function afterWrite (err) {
  const stream = this.stream

  if (err) stream.destroy(err)
  stream._duplexState &= WRITE_NOT_ACTIVE

  if (this.drains !== null) tickDrains(this.drains)

  if ((stream._duplexState & WRITE_DRAIN_STATUS) === WRITE_UNDRAINED) {
    stream._duplexState &= WRITE_DRAINED
    if ((stream._duplexState & WRITE_EMIT_DRAIN) === WRITE_EMIT_DRAIN) {
      stream.emit('drain')
    }
  }

  this.updateCallback()
}

function afterRead (err) {
  if (err) this.stream.destroy(err)
  this.stream._duplexState &= READ_NOT_ACTIVE
  if (this.readAhead === false && (this.stream._duplexState & READ_RESUMED) === 0) this.stream._duplexState &= READ_NO_READ_AHEAD
  this.updateCallback()
}

function updateReadNT () {
  if ((this.stream._duplexState & READ_UPDATING) === 0) {
    this.stream._duplexState &= READ_NOT_NEXT_TICK
    this.update()
  }
}

function updateWriteNT () {
  if ((this.stream._duplexState & WRITE_UPDATING) === 0) {
    this.stream._duplexState &= WRITE_NOT_NEXT_TICK
    this.update()
  }
}

function tickDrains (drains) {
  for (let i = 0; i < drains.length; i++) {
    // drains.writes are monotonic, so if one is 0 its always the first one
    if (--drains[i].writes === 0) {
      drains.shift().resolve(true)
      i--
    }
  }
}

function afterOpen (err) {
  const stream = this.stream

  if (err) stream.destroy(err)

  if ((stream._duplexState & DESTROYING) === 0) {
    if ((stream._duplexState & READ_PRIMARY_STATUS) === 0) stream._duplexState |= READ_PRIMARY
    if ((stream._duplexState & WRITE_PRIMARY_STATUS) === 0) stream._duplexState |= WRITE_PRIMARY
    stream.emit('open')
  }

  stream._duplexState &= NOT_ACTIVE

  if (stream._writableState !== null) {
    stream._writableState.updateCallback()
  }

  if (stream._readableState !== null) {
    stream._readableState.updateCallback()
  }
}

function afterTransform (err, data) {
  if (data !== undefined && data !== null) this.push(data)
  this._writableState.afterWrite(err)
}

function newListener (name) {
  if (this._readableState !== null) {
    if (name === 'data') {
      this._duplexState |= (READ_EMIT_DATA | READ_RESUMED_READ_AHEAD)
      this._readableState.updateNextTick()
    }
    if (name === 'readable') {
      this._duplexState |= READ_EMIT_READABLE
      this._readableState.updateNextTick()
    }
  }

  if (this._writableState !== null) {
    if (name === 'drain') {
      this._duplexState |= WRITE_EMIT_DRAIN
      this._writableState.updateNextTick()
    }
  }
}

class Stream extends EventEmitter {
  constructor (opts) {
    super()

    this._duplexState = 0
    this._readableState = null
    this._writableState = null

    if (opts) {
      if (opts.open) this._open = opts.open
      if (opts.destroy) this._destroy = opts.destroy
      if (opts.predestroy) this._predestroy = opts.predestroy
      if (opts.signal) {
        opts.signal.addEventListener('abort', abort.bind(this))
      }
    }

    this.on('newListener', newListener)
  }

  _open (cb) {
    cb(null)
  }

  _destroy (cb) {
    cb(null)
  }

  _predestroy () {
    // does nothing
  }

  get readable () {
    return this._readableState !== null ? true : undefined
  }

  get writable () {
    return this._writableState !== null ? true : undefined
  }

  get destroyed () {
    return (this._duplexState & DESTROYED) !== 0
  }

  get destroying () {
    return (this._duplexState & DESTROY_STATUS) !== 0
  }

  destroy (err) {
    if ((this._duplexState & DESTROY_STATUS) === 0) {
      if (!err) err = STREAM_DESTROYED
      this._duplexState = (this._duplexState | DESTROYING) & NON_PRIMARY

      if (this._readableState !== null) {
        this._readableState.highWaterMark = 0
        this._readableState.error = err
      }
      if (this._writableState !== null) {
        this._writableState.highWaterMark = 0
        this._writableState.error = err
      }

      this._duplexState |= PREDESTROYING
      this._predestroy()
      this._duplexState &= NOT_PREDESTROYING

      if (this._readableState !== null) this._readableState.updateNextTick()
      if (this._writableState !== null) this._writableState.updateNextTick()
    }
  }
}

class Readable extends Stream {
  constructor (opts) {
    super(opts)

    this._duplexState |= OPENING | WRITE_DONE | READ_READ_AHEAD
    this._readableState = new ReadableState(this, opts)

    if (opts) {
      if (this._readableState.readAhead === false) this._duplexState &= READ_NO_READ_AHEAD
      if (opts.read) this._read = opts.read
      if (opts.eagerOpen) this._readableState.updateNextTick()
      if (opts.encoding) this.setEncoding(opts.encoding)
    }
  }

  setEncoding (encoding) {
    const dec = new TextDecoder(encoding)
    const map = this._readableState.map || echo
    this._readableState.map = mapOrSkip
    return this

    function mapOrSkip (data) {
      const next = dec.push(data)
      return next === '' && (data.byteLength !== 0 || dec.remaining > 0) ? null : map(next)
    }
  }

  _read (cb) {
    cb(null)
  }

  pipe (dest, cb) {
    this._readableState.updateNextTick()
    this._readableState.pipe(dest, cb)
    return dest
  }

  read () {
    this._readableState.updateNextTick()
    return this._readableState.read()
  }

  push (data) {
    this._readableState.updateNextTickIfOpen()
    return this._readableState.push(data)
  }

  unshift (data) {
    this._readableState.updateNextTickIfOpen()
    return this._readableState.unshift(data)
  }

  resume () {
    this._duplexState |= READ_RESUMED_READ_AHEAD
    this._readableState.updateNextTick()
    return this
  }

  pause () {
    this._duplexState &= (this._readableState.readAhead === false ? READ_PAUSED_NO_READ_AHEAD : READ_PAUSED)
    return this
  }

  static _fromAsyncIterator (ite, opts) {
    let destroy

    const rs = new Readable({
      ...opts,
      read (cb) {
        ite.next().then(push).then(cb.bind(null, null)).catch(cb)
      },
      predestroy () {
        destroy = ite.return()
      },
      destroy (cb) {
        if (!destroy) return cb(null)
        destroy.then(cb.bind(null, null)).catch(cb)
      }
    })

    return rs

    function push (data) {
      if (data.done) rs.push(null)
      else rs.push(data.value)
    }
  }

  static from (data, opts) {
    if (isReadStreamx(data)) return data
    if (data[asyncIterator]) return this._fromAsyncIterator(data[asyncIterator](), opts)
    if (!Array.isArray(data)) data = data === undefined ? [] : [data]

    let i = 0
    return new Readable({
      ...opts,
      read (cb) {
        this.push(i === data.length ? null : data[i++])
        cb(null)
      }
    })
  }

  static isBackpressured (rs) {
    return (rs._duplexState & READ_BACKPRESSURE_STATUS) !== 0 || rs._readableState.buffered >= rs._readableState.highWaterMark
  }

  static isPaused (rs) {
    return (rs._duplexState & READ_RESUMED) === 0
  }

  [asyncIterator] () {
    const stream = this

    let error = null
    let promiseResolve = null
    let promiseReject = null

    this.on('error', (err) => { error = err })
    this.on('readable', onreadable)
    this.on('close', onclose)

    return {
      [asyncIterator] () {
        return this
      },
      next () {
        return new Promise(function (resolve, reject) {
          promiseResolve = resolve
          promiseReject = reject
          const data = stream.read()
          if (data !== null) ondata(data)
          else if ((stream._duplexState & DESTROYED) !== 0) ondata(null)
        })
      },
      return () {
        return destroy(null)
      },
      throw (err) {
        return destroy(err)
      }
    }

    function onreadable () {
      if (promiseResolve !== null) ondata(stream.read())
    }

    function onclose () {
      if (promiseResolve !== null) ondata(null)
    }

    function ondata (data) {
      if (promiseReject === null) return
      if (error) promiseReject(error)
      else if (data === null && (stream._duplexState & READ_DONE) === 0) promiseReject(STREAM_DESTROYED)
      else promiseResolve({ value: data, done: data === null })
      promiseReject = promiseResolve = null
    }

    function destroy (err) {
      stream.destroy(err)
      return new Promise((resolve, reject) => {
        if (stream._duplexState & DESTROYED) return resolve({ value: undefined, done: true })
        stream.once('close', function () {
          if (err) reject(err)
          else resolve({ value: undefined, done: true })
        })
      })
    }
  }
}

class Writable extends Stream {
  constructor (opts) {
    super(opts)

    this._duplexState |= OPENING | READ_DONE
    this._writableState = new WritableState(this, opts)

    if (opts) {
      if (opts.writev) this._writev = opts.writev
      if (opts.write) this._write = opts.write
      if (opts.final) this._final = opts.final
      if (opts.eagerOpen) this._writableState.updateNextTick()
    }
  }

  cork () {
    this._duplexState |= WRITE_CORKED
  }

  uncork () {
    this._duplexState &= WRITE_NOT_CORKED
    this._writableState.updateNextTick()
  }

  _writev (batch, cb) {
    cb(null)
  }

  _write (data, cb) {
    this._writableState.autoBatch(data, cb)
  }

  _final (cb) {
    cb(null)
  }

  static isBackpressured (ws) {
    return (ws._duplexState & WRITE_BACKPRESSURE_STATUS) !== 0
  }

  static drained (ws) {
    if (ws.destroyed) return Promise.resolve(false)
    const state = ws._writableState
    const pending = (isWritev(ws) ? Math.min(1, state.queue.length) : state.queue.length)
    const writes = pending + ((ws._duplexState & WRITE_WRITING) ? 1 : 0)
    if (writes === 0) return Promise.resolve(true)
    if (state.drains === null) state.drains = []
    return new Promise((resolve) => {
      state.drains.push({ writes, resolve })
    })
  }

  write (data) {
    this._writableState.updateNextTick()
    return this._writableState.push(data)
  }

  end (data) {
    this._writableState.updateNextTick()
    this._writableState.end(data)
    return this
  }
}

class Duplex extends Readable { // and Writable
  constructor (opts) {
    super(opts)

    this._duplexState = OPENING | (this._duplexState & READ_READ_AHEAD)
    this._writableState = new WritableState(this, opts)

    if (opts) {
      if (opts.writev) this._writev = opts.writev
      if (opts.write) this._write = opts.write
      if (opts.final) this._final = opts.final
    }
  }

  cork () {
    this._duplexState |= WRITE_CORKED
  }

  uncork () {
    this._duplexState &= WRITE_NOT_CORKED
    this._writableState.updateNextTick()
  }

  _writev (batch, cb) {
    cb(null)
  }

  _write (data, cb) {
    this._writableState.autoBatch(data, cb)
  }

  _final (cb) {
    cb(null)
  }

  write (data) {
    this._writableState.updateNextTick()
    return this._writableState.push(data)
  }

  end (data) {
    this._writableState.updateNextTick()
    this._writableState.end(data)
    return this
  }
}

class Transform extends Duplex {
  constructor (opts) {
    super(opts)
    this._transformState = new TransformState(this)

    if (opts) {
      if (opts.transform) this._transform = opts.transform
      if (opts.flush) this._flush = opts.flush
    }
  }

  _write (data, cb) {
    if (this._readableState.buffered >= this._readableState.highWaterMark) {
      this._transformState.data = data
    } else {
      this._transform(data, this._transformState.afterTransform)
    }
  }

  _read (cb) {
    if (this._transformState.data !== null) {
      const data = this._transformState.data
      this._transformState.data = null
      cb(null)
      this._transform(data, this._transformState.afterTransform)
    } else {
      cb(null)
    }
  }

  destroy (err) {
    super.destroy(err)
    if (this._transformState.data !== null) {
      this._transformState.data = null
      this._transformState.afterTransform()
    }
  }

  _transform (data, cb) {
    cb(null, data)
  }

  _flush (cb) {
    cb(null)
  }

  _final (cb) {
    this._transformState.afterFinal = cb
    this._flush(transformAfterFlush.bind(this))
  }
}

class PassThrough extends Transform {}

function transformAfterFlush (err, data) {
  const cb = this._transformState.afterFinal
  if (err) return cb(err)
  if (data !== null && data !== undefined) this.push(data)
  this.push(null)
  cb(null)
}

function pipelinePromise (...streams) {
  return new Promise((resolve, reject) => {
    return pipeline(...streams, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function pipeline (stream, ...streams) {
  const all = Array.isArray(stream) ? [...stream, ...streams] : [stream, ...streams]
  const done = (all.length && typeof all[all.length - 1] === 'function') ? all.pop() : null

  if (all.length < 2) throw new Error('Pipeline requires at least 2 streams')

  let src = all[0]
  let dest = null
  let error = null

  for (let i = 1; i < all.length; i++) {
    dest = all[i]

    if (isStreamx(src)) {
      src.pipe(dest, onerror)
    } else {
      errorHandle(src, true, i > 1, onerror)
      src.pipe(dest)
    }

    src = dest
  }

  if (done) {
    let fin = false

    const autoDestroy = isStreamx(dest) || !!(dest._writableState && dest._writableState.autoDestroy)

    dest.on('error', (err) => {
      if (error === null) error = err
    })

    dest.on('finish', () => {
      fin = true
      if (!autoDestroy) done(error)
    })

    if (autoDestroy) {
      dest.on('close', () => done(error || (fin ? null : PREMATURE_CLOSE)))
    }
  }

  return dest

  function errorHandle (s, rd, wr, onerror) {
    s.on('error', onerror)
    s.on('close', onclose)

    function onclose () {
      if (rd && s._readableState && !s._readableState.ended) return onerror(PREMATURE_CLOSE)
      if (wr && s._writableState && !s._writableState.ended) return onerror(PREMATURE_CLOSE)
    }
  }

  function onerror (err) {
    if (!err || error) return
    error = err

    for (const s of all) {
      s.destroy(err)
    }
  }
}

function echo (s) {
  return s
}

function isStream (stream) {
  return !!stream._readableState || !!stream._writableState
}

function isStreamx (stream) {
  return typeof stream._duplexState === 'number' && isStream(stream)
}

function isEnded (stream) {
  return !!stream._readableState && stream._readableState.ended
}

function isFinished (stream) {
  return !!stream._writableState && stream._writableState.ended
}

function getStreamError (stream, opts = {}) {
  const err = (stream._readableState && stream._readableState.error) || (stream._writableState && stream._writableState.error)

  // avoid implicit errors by default
  return (!opts.all && err === STREAM_DESTROYED) ? null : err
}

function isReadStreamx (stream) {
  return isStreamx(stream) && stream.readable
}

function isDisturbed (stream) {
  return (stream._duplexState & OPENING) !== OPENING || (stream._duplexState & ACTIVE_OR_TICKING) !== 0
}

function isTypedArray (data) {
  return typeof data === 'object' && data !== null && typeof data.byteLength === 'number'
}

function defaultByteLength (data) {
  return isTypedArray(data) ? data.byteLength : 1024
}

function noop () {}

function abort () {
  this.destroy(new Error('Stream aborted.'))
}

function isWritev (s) {
  return s._writev !== Writable.prototype._writev && s._writev !== Duplex.prototype._writev
}

module.exports = {
  pipeline,
  pipelinePromise,
  isStream,
  isStreamx,
  isEnded,
  isFinished,
  isDisturbed,
  getStreamError,
  Stream,
  Writable,
  Readable,
  Duplex,
  Transform,
  // Export PassThrough for compatibility with Node.js core's stream module
  PassThrough
}


/***/ }),

/***/ 8190:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
module.exports = runParallel

const queueMicrotask = __webpack_require__(9596)

function runParallel (tasks, cb) {
  let results, pending, keys
  let isSync = true

  if (Array.isArray(tasks)) {
    results = []
    pending = tasks.length
  } else {
    keys = Object.keys(tasks)
    results = {}
    pending = keys.length
  }

  function done (err) {
    function end () {
      if (cb) cb(err, results)
      cb = null
    }
    if (isSync) queueMicrotask(end)
    else end()
  }

  function each (i, err, result) {
    results[i] = result
    if (--pending === 0 || err) {
      done(err)
    }
  }

  if (!pending) {
    // empty
    done(null)
  } else if (keys) {
    // object
    keys.forEach(function (key) {
      tasks[key](function (err, result) { each(key, err, result) })
    })
  } else {
    // array
    tasks.forEach(function (task, i) {
      task(function (err, result) { each(i, err, result) })
    })
  }

  isSync = false
}


/***/ }),

/***/ 8271:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 8330:
/***/ ((module) => {

module.exports = {"version":"2.8.5"};

/***/ }),

/***/ 8436:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 8444:
/***/ ((module) => {

module.exports = length

function length (bytes) {
  return Math.max(16384, 1 << Math.log2(bytes < 1024 ? 1 : bytes / 1024) + 0.5 | 0)
}


/***/ }),

/***/ 8446:
/***/ ((module) => {

module.exports = {"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomdeleted+xml":["atomdeleted"],"application/atomsvc+xml":["atomsvc"],"application/atsc-dwd+xml":["dwd"],"application/atsc-held+xml":["held"],"application/atsc-rsat+xml":["rsat"],"application/bdoc":["bdoc"],"application/calendar+xml":["xcs"],"application/ccxml+xml":["ccxml"],"application/cdfx+xml":["cdfx"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["es","ecma"],"application/emma+xml":["emma"],"application/emotionml+xml":["emotionml"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/express":["exp"],"application/fdt+xml":["fdt"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/its+xml":["its"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lgr+xml":["lgr"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mmt-aei+xml":["maei"],"application/mmt-usd+xml":["musd"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/node":["cjs"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/p2p-overlay+xml":["relo"],"application/patch-ops-error+xml":["xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/provenance+xml":["provx"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/route-apd+xml":["rapd"],"application/route-s-tsid+xml":["sls"],"application/route-usd+xml":["rusd"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/senml+xml":["senmlx"],"application/sensml+xml":["sensmlx"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/swid+xml":["swidtag"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/toml":["toml"],"application/trig":["trig"],"application/ttml+xml":["ttml"],"application/ubjson":["ubj"],"application/urc-ressheet+xml":["rsheet"],"application/urc-targetdesc+xml":["td"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-att+xml":["xav"],"application/xcap-caps+xml":["xca"],"application/xcap-diff+xml":["xdf"],"application/xcap-el+xml":["xel"],"application/xcap-ns+xml":["xns"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xliff+xml":["xlf"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["*xsl","xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/amr":["amr"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mobile-xmf":["mxmf"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx","opus"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/avif":["avif"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/hej2k":["hej2"],"image/hsj2":["hsj2"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jph":["jph"],"image/jphc":["jhc"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/jxra":["jxra"],"image/jxrs":["jxrs"],"image/jxs":["jxs"],"image/jxsc":["jxsc"],"image/jxsi":["jxsi"],"image/jxss":["jxss"],"image/ktx":["ktx"],"image/ktx2":["ktx2"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/mtl":["mtl"],"model/obj":["obj"],"model/step+xml":["stpx"],"model/step+zip":["stpz"],"model/step-xml+zip":["stpxz"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/spdx":["spdx"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/iso.segment":["m4s"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]};

/***/ }),

/***/ 8454:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var events = __webpack_require__(7007)
var inherits = __webpack_require__(6698)

module.exports = LRU

function LRU (opts) {
  if (!(this instanceof LRU)) return new LRU(opts)
  if (typeof opts === 'number') opts = {max: opts}
  if (!opts) opts = {}
  events.EventEmitter.call(this)
  this.cache = {}
  this.head = this.tail = null
  this.length = 0
  this.max = opts.max || 1000
  this.maxAge = opts.maxAge || 0
}

inherits(LRU, events.EventEmitter)

Object.defineProperty(LRU.prototype, 'keys', {
  get: function () { return Object.keys(this.cache) }
})

LRU.prototype.clear = function () {
  this.cache = {}
  this.head = this.tail = null
  this.length = 0
}

LRU.prototype.remove = function (key) {
  if (typeof key !== 'string') key = '' + key
  if (!this.cache.hasOwnProperty(key)) return

  var element = this.cache[key]
  delete this.cache[key]
  this._unlink(key, element.prev, element.next)
  return element.value
}

LRU.prototype._unlink = function (key, prev, next) {
  this.length--

  if (this.length === 0) {
    this.head = this.tail = null
  } else {
    if (this.head === key) {
      this.head = prev
      this.cache[this.head].next = null
    } else if (this.tail === key) {
      this.tail = next
      this.cache[this.tail].prev = null
    } else {
      this.cache[prev].next = next
      this.cache[next].prev = prev
    }
  }
}

LRU.prototype.peek = function (key) {
  if (!this.cache.hasOwnProperty(key)) return

  var element = this.cache[key]

  if (!this._checkAge(key, element)) return
  return element.value
}

LRU.prototype.set = function (key, value) {
  if (typeof key !== 'string') key = '' + key

  var element

  if (this.cache.hasOwnProperty(key)) {
    element = this.cache[key]
    element.value = value
    if (this.maxAge) element.modified = Date.now()

    // If it's already the head, there's nothing more to do:
    if (key === this.head) return value
    this._unlink(key, element.prev, element.next)
  } else {
    element = {value: value, modified: 0, next: null, prev: null}
    if (this.maxAge) element.modified = Date.now()
    this.cache[key] = element

    // Eviction is only possible if the key didn't already exist:
    if (this.length === this.max) this.evict()
  }

  this.length++
  element.next = null
  element.prev = this.head

  if (this.head) this.cache[this.head].next = key
  this.head = key

  if (!this.tail) this.tail = key
  return value
}

LRU.prototype._checkAge = function (key, element) {
  if (this.maxAge && (Date.now() - element.modified) > this.maxAge) {
    this.remove(key)
    this.emit('evict', {key: key, value: element.value})
    return false
  }
  return true
}

LRU.prototype.get = function (key) {
  if (typeof key !== 'string') key = '' + key
  if (!this.cache.hasOwnProperty(key)) return

  var element = this.cache[key]

  if (!this._checkAge(key, element)) return

  if (this.head !== key) {
    if (key === this.tail) {
      this.tail = element.next
      this.cache[this.tail].prev = null
    } else {
      // Set prev.next -> element.next:
      this.cache[element.prev].next = element.next
    }

    // Set element.next.prev -> element.prev:
    this.cache[element.next].prev = element.prev

    // Element is the new head
    this.cache[this.head].next = key
    element.prev = this.head
    element.next = null
    this.head = key
  }

  return element.value
}

LRU.prototype.evict = function () {
  if (!this.tail) return
  var key = this.tail
  var value = this.remove(this.tail)
  this.emit('evict', {key: key, value: value})
}


/***/ }),

/***/ 8499:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { TokenBucket } = __webpack_require__(9439)
const Throttle = __webpack_require__(8765)

class ThrottleGroup {
  constructor (opts = {}) {
    if (typeof opts !== 'object') throw new Error('Options must be an object')

    this.throttles = []
    this.setEnabled(opts.enabled)
    this.setRate(opts.rate, opts.chunksize)
  }

  getEnabled () {
    return this._enabled
  }

  getRate () {
    // Note: bucketSize === tokensPerInterval
    return this.bucket.tokensPerInterval
  }

  getChunksize () {
    return this.chunksize
  }

  setEnabled (val = true) {
    if (typeof val !== 'boolean') throw new Error('Enabled must be a boolean')

    this._enabled = val
    for (const throttle of this.throttles) {
      throttle.setEnabled(val)
    }
  }

  setRate (rate, chunksize = null) {
    // Note: rate = 0, means we should stop processing chunks
    if (!Number.isInteger(rate) || rate < 0) throw new Error('Rate must be an integer bigger than zero')
    rate = parseInt(rate)

    if (chunksize && (typeof chunksize !== 'number' || chunksize <= 0)) throw new Error('Chunksize must be bigger than zero')
    chunksize = chunksize || Math.max(parseInt(rate / 10), 1)
    chunksize = parseInt(chunksize)
    if (rate > 0 && chunksize > rate) throw new Error('Chunk size must be smaller than rate')

    if (!this.bucket) this.bucket = new TokenBucket(rate, rate, 'second', null)

    this.bucket.bucketSize = rate
    this.bucket.tokensPerInterval = rate
    this.chunksize = chunksize
  }

  setChunksize (chunksize) {
    if (!Number.isInteger(chunksize) || chunksize <= 0) throw new Error('Chunk size must be an integer bigger than zero')
    const rate = this.getRate()
    chunksize = parseInt(chunksize)
    if (rate > 0 && chunksize > rate) throw new Error('Chunk size must be smaller than rate')
    this.chunksize = chunksize
  }

  throttle (opts = {}) {
    if (typeof opts !== 'object') throw new Error('Options must be an object')

    const newThrottle = new Throttle({
      ...opts,
      group: this
    })

    return newThrottle
  }

  destroy () {
    for (const throttle of this.throttles) {
      throttle.destroy()
    }

    this.throttles = []
  }

  _addThrottle (throttle) {
    if (!(throttle instanceof Throttle)) throw new Error('Throttle must be an instance of Throttle')

    this.throttles.push(throttle)
  }

  _removeThrottle (throttle) {
    const index = this.throttles.indexOf(throttle)
    if (index > -1) this.throttles.splice(index, 1)
  }
}

module.exports = ThrottleGroup


/***/ }),

/***/ 8529:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 8673:
/***/ ((module) => {



/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
function Mime() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);

  for (let i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }

  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * If a type declares an extension that has already been defined, an error will
 * be thrown.  To suppress this error and force the extension to be associated
 * with the new type, pass `force`=true.  Alternatively, you may prefix the
 * extension with "*" to map the type to extension, without mapping the
 * extension to the type.
 *
 * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
 *
 *
 * @param map (Object) type definitions
 * @param force (Boolean) if true, force overriding of existing definitions
 */
Mime.prototype.define = function(typeMap, force) {
  for (let type in typeMap) {
    let extensions = typeMap[type].map(function(t) {
      return t.toLowerCase();
    });
    type = type.toLowerCase();

    for (let i = 0; i < extensions.length; i++) {
      const ext = extensions[i];

      // '*' prefix = not the preferred type for this extension.  So fixup the
      // extension, and skip it.
      if (ext[0] === '*') {
        continue;
      }

      if (!force && (ext in this._types)) {
        throw new Error(
          'Attempt to change mapping for "' + ext +
          '" extension from "' + this._types[ext] + '" to "' + type +
          '". Pass `force=true` to allow this, otherwise remove "' + ext +
          '" from the list of extensions for "' + type + '".'
        );
      }

      this._types[ext] = type;
    }

    // Use first extension as default
    if (force || !this._extensions[type]) {
      const ext = extensions[0];
      this._extensions[type] = (ext[0] !== '*') ? ext : ext.substr(1);
    }
  }
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.getType = function(path) {
  path = String(path);
  let last = path.replace(/^.*[/\\]/, '').toLowerCase();
  let ext = last.replace(/^.*\./, '').toLowerCase();

  let hasPath = last.length < path.length;
  let hasDot = ext.length < last.length - 1;

  return (hasDot || !hasPath) && this._types[ext] || null;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};

module.exports = Mime;


/***/ }),

/***/ 8727:
/***/ ((module) => {



// Based on RC4 algorithm, as described in
// http://en.wikipedia.org/wiki/RC4

function isInteger(n) {
  return parseInt(n, 10) === n;
}

function createRC4(N) {
  function identityPermutation() {
    var s = new Array(N);
    for (var i = 0; i < N; i++) {
      s[i] = i;
    }
    return s;
  }

  // :: string | array integer -> array integer
  function seed(key) {
    if (key === undefined) {
      key = new Array(N);
      for (var k = 0; k < N; k++) {
        key[k] = Math.floor(Math.random() * N);
      }
    } else if (typeof key === "string") {
      // to string
      key = "" + key;
      key = key.split("").map(function (c) { return c.charCodeAt(0) % N; });
    } else if (Array.isArray(key)) {
      if (!key.every(function (v) {
        return typeof v === "number" && v === (v | 0);
      })) {
        throw new TypeError("invalid seed key specified: not array of integers");
      }
    } else {
      throw new TypeError("invalid seed key specified");
    }

    var keylen = key.length;

    // resed state
    var s = identityPermutation();

    var j = 0;
    for (var i = 0; i < N; i++) {
      j = (j + s[i] + key[i % keylen]) % N;
      var tmp = s[i];
      s[i] = s[j];
      s[j] = tmp;
    }

    return s;
  }

  /* eslint-disable no-shadow */
  function RC4(key) {
    this.s = seed(key);
    this.i = 0;
    this.j = 0;
  }
  /* eslint-enable no-shadow */

  RC4.prototype.randomNative = function () {
    this.i = (this.i + 1) % N;
    this.j = (this.j + this.s[this.i]) % N;

    var tmp = this.s[this.i];
    this.s[this.i] = this.s[this.j];
    this.s[this.j] = tmp;

    var k = this.s[(this.s[this.i] + this.s[this.j]) % N];

    return k;
  };

  RC4.prototype.randomUInt32 = function () {
    var a = this.randomByte();
    var b = this.randomByte();
    var c = this.randomByte();
    var d = this.randomByte();

    return ((a * 256 + b) * 256 + c) * 256 + d;
  };

  RC4.prototype.randomFloat = function () {
    return this.randomUInt32() / 0x100000000;
  };

  RC4.prototype.random = function () {
    var a;
    var b;

    if (arguments.length === 1) {
      a = 0;
      b = arguments[0];
    } else if (arguments.length === 2) {
      a = arguments[0];
      b = arguments[1];
    } else {
      throw new TypeError("random takes one or two integer arguments");
    }

    if (!isInteger(a) || !isInteger(b)) {
      throw new TypeError("random takes one or two integer arguments");
    }

    return a + this.randomUInt32() % (b - a + 1);
  };

  RC4.prototype.currentState = function () {
    return {
      i: this.i,
      j: this.j,
      s: this.s.slice(), // copy
    };
  };

  RC4.prototype.setState = function (state) {
    var s = state.s;
    var i = state.i;
    var j = state.j;

    /* eslint-disable yoda */
    if (!(i === (i | 0) && 0 <= i && i < N)) {
      throw new Error("state.i should be integer [0, " + (N - 1) + "]");
    }

    if (!(j === (j | 0) && 0 <= j && j < N)) {
      throw new Error("state.j should be integer [0, " + (N - 1) + "]");
    }
    /* eslint-enable yoda */

    // check length
    if (!Array.isArray(s) || s.length !== N) {
      throw new Error("state should be array of length " + N);
    }

    // check that all params are there
    for (var k = 0; k < N; k++) {
      if (s.indexOf(k) === -1) {
        throw new Error("state should be permutation of 0.." + (N - 1) + ": " + k + " is missing");
      }
    }

    this.i = i;
    this.j = j;
    this.s = s.slice(); // assign copy
  };

  return RC4;
}

var RC4 = createRC4(256);
RC4.prototype.randomByte = RC4.prototype.randomNative;

var RC4small = createRC4(16);
RC4small.prototype.randomByte = function () {
  var a = this.randomNative();
  var b = this.randomNative();

  return a * 16 + b;
};

var ordA = "a".charCodeAt(0);
var ord0 = "0".charCodeAt(0);

function toHex(n) {
  return n < 10 ? String.fromCharCode(ord0 + n) : String.fromCharCode(ordA + n - 10);
}

function fromHex(c) {
  return parseInt(c, 16);
}

RC4small.prototype.currentStateString = function () {
  var state = this.currentState();

  var i = toHex(state.i);
  var j = toHex(state.j);

  var res = i + j + state.s.map(toHex).join("");
  return res;
};

RC4small.prototype.setStateString = function (stateString) {
  if (!stateString.match(/^[0-9a-f]{18}$/)) {
    throw new TypeError("RC4small stateString should be 18 hex character string");
  }

  var i = fromHex(stateString[0]);
  var j = fromHex(stateString[1]);
  var s = stateString.split("").slice(2).map(fromHex);

  this.setState({
    i: i,
    j: j,
    s: s,
  });
};

RC4.RC4small = RC4small;

module.exports = RC4;


/***/ }),

/***/ 8765:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { EventEmitter } = __webpack_require__(7007)
const { Transform } = __webpack_require__(8179)
const { wait } = __webpack_require__(2072)

class Throttle extends Transform {
  constructor (opts = {}) {
    super()

    if (typeof opts !== 'object') throw new Error('Options must be an object')

    const params = Object.assign({}, opts)

    if (params.group && !(params.group instanceof ThrottleGroup)) throw new Error('Group must be an instanece of ThrottleGroup')
    else if (!params.group) params.group = new ThrottleGroup(params)

    this._setEnabled(params.enabled || params.group.enabled)
    this._group = params.group
    this._emitter = new EventEmitter()
    this._destroyed = false

    this._group._addThrottle(this)
  }

  getEnabled () {
    return this._enabled
  }

  getGroup () {
    return this._group
  }

  _setEnabled (val = true) {
    if (typeof val !== 'boolean') throw new Error('Enabled must be a boolean')
    this._enabled = val
  }

  setEnabled (val) {
    this._setEnabled(val)
    if (this._enabled) this._emitter.emit('enabled')
    else this._emitter.emit('disabled')
  }

  _transform (chunk, done) {
    this._processChunk(chunk, done)
  }

  /* async _waitForPositiveRate () {
    // Stop pushing chunks if rate is zero
    while (this._group.getRate() === 0 && !this._destroyed && this._areBothEnabled()) {
      await wait(1 * 1000) // wait 1 second
    }
  } */

  async _waitForTokens (amount) {
    // Wait for enabled, destroyed or tokens
    return new Promise((resolve, reject) => {
      let done = false
      const self = this
      function isDone (err) {
        self._emitter.removeListener('disabled', isDone)
        self._emitter.removeListener('destroyed', isDone)

        if (done) return
        done = true
        if (err) return reject(err)
        resolve()
      }
      this._emitter.once('disabled', isDone)
      this._emitter.once('destroyed', isDone)
      // TODO: next version remove lisener in "isDone"
      this._group.bucket.removeTokens(amount, isDone)
    })
  }

  _areBothEnabled () {
    return this._enabled && this._group.getEnabled()
  }

  /* async _throttleChunk (size) {
    // Stop pushing chunks if rate is zero
    await this._waitForPositiveRate()
    if (this._destroyed) return
    if (!this._areBothEnabled()) return

    // Get tokens from bucket
    await this._waitForTokens(size)
  } */

  async _processChunk (chunk, done) {
    if (!this._areBothEnabled()) return done(null, chunk)

    let pos = 0
    let chunksize = this._group.getChunksize()
    let slice = chunk.slice(pos, pos + chunksize)
    while (slice.length > 0) {
      // Check here again because we might be in the middle of a big chunk
      // with a lot of small slices
      if (this._areBothEnabled()) {
        try {
          // WAIT FOR POSITIVE RATE
          // Stop pushing chunks if rate is zero
          while (this._group.getRate() === 0 && !this._destroyed && this._areBothEnabled()) {
            await wait(1000) // wait 1 second
            if (this._destroyed) return
          }

          // WAIT FOR TOKENS
          if (this._areBothEnabled() && !this._group.bucket.tryRemoveTokens(slice.length)) {
            await this._waitForTokens(slice.length)
            if (this._destroyed) return
          }
        } catch (err) {
          return done(err)
        }
      }

      this.push(slice)
      pos += chunksize

      // Calculate params for next slice
      chunksize = (this._areBothEnabled())
        ? this._group.getChunksize() // Chunksize might have changed
        : chunk.length - pos // Get the rest of the chunk
      slice = chunk.slice(pos, pos + chunksize)
    }

    return done()
  }

  destroy (...args) {
    this._group._removeThrottle(this)

    this._destroyed = true
    this._emitter.emit('destroyed')

    super.destroy(...args)
  }
}

module.exports = Throttle

// Fix circular dependency
const ThrottleGroup = __webpack_require__(8499)


/***/ }),

/***/ 8878:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 9439:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.RateLimiter = __webpack_require__(3065);
exports.TokenBucket = __webpack_require__(5472);


/***/ }),

/***/ 9596:
/***/ ((module) => {

/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
let promise

module.exports = typeof queueMicrotask === 'function'
  ? queueMicrotask.bind(typeof window !== 'undefined' ? window : globalThis)
  // reuse resolved promise, and allocate it lazily
  : cb => (promise || (promise = Promise.resolve()))
    .then(cb)
    .catch(err => setTimeout(() => { throw err }, 0))


/***/ }),

/***/ 9639:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  NJ: () => (/* binding */ arr2base),
  V5: () => (/* reexport */ arr2hex),
  dU: () => (/* binding */ arr2text),
  HB: () => (/* binding */ bin2hex),
  xW: () => (/* reexport */ concat),
  LC: () => (/* reexport */ equal),
  tW: () => (/* binding */ hash),
  fk: () => (/* reexport */ hex2arr),
  Ht: () => (/* binding */ hex2bin),
  po: () => (/* binding */ randomBytes),
  L0: () => (/* binding */ text2arr)
});

// UNUSED EXPORTS: alphabet, base2arr

;// ./node_modules/uint8-util/util.js
/* Common package for dealing with hex/string/uint8 conversions (and sha1 hashing)
*
* @author   Jimmy Wärting <jimmy@warting.se> (https://jimmy.warting.se/opensource)
* @license  MIT
*/
const alphabet = '0123456789abcdef'
const encodeLookup = []
const decodeLookup = []

for (let i = 0; i < 256; i++) {
  encodeLookup[i] = alphabet[i >> 4 & 0xf] + alphabet[i & 0xf]
  if (i < 16) {
    if (i < 10) {
      decodeLookup[0x30 + i] = i
    } else {
      decodeLookup[0x61 - 10 + i] = i
    }
  }
}

const arr2hex = data => {
  const length = data.length
  let string = ''
  let i = 0
  while (i < length) {
    string += encodeLookup[data[i++]]
  }
  return string
}

const hex2arr = str => {
  const sizeof = str.length >> 1
  const length = sizeof << 1
  const array = new Uint8Array(sizeof)
  let n = 0
  let i = 0
  while (i < length) {
    array[n++] = decodeLookup[str.charCodeAt(i++)] << 4 | decodeLookup[str.charCodeAt(i++)]
  }
  return array
}

const concat = (chunks, size = 0) => {
  const length = chunks.length || 0
  if (!size) {
    let i = length
    while (i--) size += chunks[i].length
  }
  const b = new Uint8Array(size)
  let offset = size
  let i = length
  while (i--) {
    offset -= chunks[i].length
    b.set(chunks[i], offset)
  }

  return b
}

const equal = (a, b) => {
  if (a.length !== b.length) return false
  for (let i = a.length; i > -1; i -= 1) {
    if ((a[i] !== b[i])) return false
  }
  return true
}

;// ./node_modules/base64-arraybuffer/dist/base64-arraybuffer.es5.js
/*
 * base64-arraybuffer 1.0.2 <https://github.com/niklasvh/base64-arraybuffer>
 * Copyright (c) 2022 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Use a lookup table to find the index.
var lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}
var encode = function (arraybuffer) {
    var bytes = new Uint8Array(arraybuffer), i, len = bytes.length, base64 = '';
    for (i = 0; i < len; i += 3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
    }
    if (len % 3 === 2) {
        base64 = base64.substring(0, base64.length - 1) + '=';
    }
    else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + '==';
    }
    return base64;
};
var base64_arraybuffer_es5_decode = function (base64) {
    var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }
    var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return arraybuffer;
};


//# sourceMappingURL=base64-arraybuffer.es5.js.map

;// ./node_modules/uint8-util/browser.js



const decoder = new TextDecoder()
// 50% slower at < 48 chars, but little impact at 4M OPS/s vs 8M OPS/s
const arr2text = (data, enc) => {
  if (!enc) return decoder.decode(data)
  const dec = new TextDecoder(enc)
  return dec.decode(data)
}

// sacrifice ~20% speed for bundle size
const encoder = new TextEncoder()
const text2arr = str => encoder.encode(str)

const arr2base = data => encode(data)

const base2arr = str => new Uint8Array(decode(str))

const bin2hex = str => {
  let res = ''
  let c
  let i = 0
  const len = str.length

  while (i < len) {
    c = str.charCodeAt(i++)
    res += alphabet[c >> 4] + alphabet[c & 0xF]
  }

  return res
}

const MAX_ARGUMENTS_LENGTH = 0x10000
const hex2bin = hex => {
  const points = hex2arr(hex)
  if (points.length <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode(...points)

  let res = ''
  let i = 0
  while (i < points.length) {
    res += String.fromCharCode(...points.subarray(i, i += MAX_ARGUMENTS_LENGTH))
  }
  return res
}

const scope = typeof window !== 'undefined' ? window : self
const browser_crypto = scope.crypto || scope.msCrypto || {}
const subtle = browser_crypto.subtle || browser_crypto.webkitSubtle

const formatMap = {
  hex: arr2hex,
  base64: arr2base
}

const hash = async (data, format, algo = 'sha-1') => {
  if (!subtle) throw new Error('no web crypto support')
  if (typeof data === 'string') data = text2arr(data)
  const out = new Uint8Array(await subtle.digest(algo, data))
  return format ? formatMap[format](out) : out
}

const randomBytes = size => {
  const view = new Uint8Array(size)
  return browser_crypto.getRandomValues(view)
}




/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/create fake namespace object */
/******/ (() => {
/******/ 	var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 	var leafPrototypes;
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 16: return value when it's Promise-like
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = this(value);
/******/ 		if(mode & 8) return value;
/******/ 		if(typeof value === 'object' && value) {
/******/ 			if((mode & 4) && value.__esModule) return value;
/******/ 			if((mode & 16) && typeof value.then === 'function') return value;
/******/ 		}
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		var def = {};
/******/ 		leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 		for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 			Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 		}
/******/ 		def['default'] = () => (value);
/******/ 		__webpack_require__.d(ns, def);
/******/ 		return ns;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./node_modules/events/events.js
var events = __webpack_require__(7007);
;// ./node_modules/path-esm/lib/util.js
function assertPath (path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path))
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix (path, allowAboveRoot) {
  let res = ''
  let lastSegmentLength = 0
  let lastSlash = -1
  let dots = 0
  let code
  for (let i = 0; i <= path.length; ++i) {
    if (i < path.length) { code = path.charCodeAt(i) } else if (code === 47) { break } else { code = 47 }
    if (code === 47) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf('/')
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = ''
                lastSegmentLength = 0
              } else {
                res = res.slice(0, lastSlashIndex)
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/')
              }
              lastSlash = i
              dots = 0
              continue
            }
          } else if (res.length === 2 || res.length === 1) {
            res = ''
            lastSegmentLength = 0
            lastSlash = i
            dots = 0
            continue
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) { res += '/..' } else { res = '..' }
          lastSegmentLength = 2
        }
      } else {
        if (res.length > 0) { res += '/' + path.slice(lastSlash + 1, i) } else { res = path.slice(lastSlash + 1, i) }
        lastSegmentLength = i - lastSlash - 1
      }
      lastSlash = i
      dots = 0
    } else if (code === 46 && dots !== -1) {
      ++dots
    } else {
      dots = -1
    }
  }
  return res
}

function _format (sep, pathObject) {
  const dir = pathObject.dir || pathObject.root
  const base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '')
  if (!dir) {
    return base
  }
  if (dir === pathObject.root) {
    return dir + base
  }
  return dir + sep + base
}

;// ./node_modules/path-esm/lib/basename.js


function basename (path, ext) {
  if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string')
  assertPath(path)

  let start = 0
  let end = -1
  let matchedSlash = true
  let i

  if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
    if (ext.length === path.length && ext === path) return ''
    let extIdx = ext.length - 1
    let firstNonSlashEnd = -1
    for (i = path.length - 1; i >= 0; --i) {
      const code = path.charCodeAt(i)
      if (code === 47) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1
          break
        }
      } else {
        if (firstNonSlashEnd === -1) {
          // We saw the first non-path separator, remember this index in case
          // we need it if the extension ends up not matching
          matchedSlash = false
          firstNonSlashEnd = i + 1
        }
        if (extIdx >= 0) {
          // Try to match the explicit extension
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              // We matched the extension, so mark this as the end of our path
              // component
              end = i
            }
          } else {
            // Extension does not match, so our result is the entire path
            // component
            extIdx = -1
            end = firstNonSlashEnd
          }
        }
      }
    }

    if (start === end) end = firstNonSlashEnd; else if (end === -1) end = path.length
    return path.slice(start, end)
  } else {
    for (i = path.length - 1; i >= 0; --i) {
      if (path.charCodeAt(i) === 47) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1
          break
        }
      } else if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // path component
        matchedSlash = false
        end = i + 1
      }
    }

    if (end === -1) return ''
    return path.slice(start, end)
  }
}

;// ./node_modules/path-esm/lib/dirname.js


function dirname (path) {
  assertPath(path)
  if (path.length === 0) return '.'
  let code = path.charCodeAt(0)
  const hasRoot = code === 47
  let end = -1
  let matchedSlash = true
  for (let i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i)
    if (code === 47) {
      if (!matchedSlash) {
        end = i
        break
      }
    } else {
      // We saw the first non-path separator
      matchedSlash = false
    }
  }

  if (end === -1) return hasRoot ? '/' : '.'
  if (hasRoot && end === 1) return '//'
  return path.slice(0, end)
}

;// ./node_modules/path-esm/lib/extname.js


function extname (path) {
  assertPath(path)
  let startDot = -1
  let startPart = 0
  let end = -1
  let matchedSlash = true
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  let preDotState = 0
  for (let i = path.length - 1; i >= 0; --i) {
    const code = path.charCodeAt(i)
    if (code === 47) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now
      if (!matchedSlash) {
        startPart = i + 1
        break
      }
      continue
    }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false
      end = i + 1
    }
    if (code === 46 /* . */) {
      // If this is our first dot, mark it as the start of our extension
      if (startDot === -1) { startDot = i } else if (preDotState !== 1) { preDotState = 1 }
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return ''
  }
  return path.slice(startDot, end)
}

;// ./node_modules/path-esm/lib/format.js


function format (pathObject) {
  if (pathObject == null || typeof pathObject !== 'object') {
    throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject)
  }
  return _format('/', pathObject)
}

;// ./node_modules/path-esm/lib/isAbsolute.js


function isAbsolute (path) {
  assertPath(path)
  return path.length > 0 && path.charCodeAt(0) === 47
}

;// ./node_modules/path-esm/lib/normalize.js


function normalize (path) {
  assertPath(path)

  if (path.length === 0) return '.'

  const isAbsolute = path.charCodeAt(0) === 47
  const trailingSeparator = path.charCodeAt(path.length - 1) === 47

  // Normalize the path
  path = normalizeStringPosix(path, !isAbsolute)

  if (path.length === 0 && !isAbsolute) path = '.'
  if (path.length > 0 && trailingSeparator) path += '/'

  if (isAbsolute) return '/' + path
  return path
}

;// ./node_modules/path-esm/lib/join.js



function join () {
  if (arguments.length === 0) { return '.' }
  let joined
  for (let i = 0; i < arguments.length; ++i) {
    const arg = arguments[i]
    assertPath(arg)
    if (arg.length > 0) {
      if (joined === undefined) { joined = arg } else { joined += '/' + arg }
    }
  }
  if (joined === undefined) { return '.' }
  return normalize(joined)
}

;// ./node_modules/path-esm/lib/parse.js


function parse (path) {
  assertPath(path)

  const ret = { root: '', dir: '', base: '', ext: '', name: '' }
  if (path.length === 0) return ret
  let code = path.charCodeAt(0)
  const isAbsolute = code === 47
  let start
  if (isAbsolute) {
    ret.root = '/'
    start = 1
  } else {
    start = 0
  }
  let startDot = -1
  let startPart = 0
  let end = -1
  let matchedSlash = true
  let i = path.length - 1

  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  let preDotState = 0

  // Get non-dir info
  for (; i >= start; --i) {
    code = path.charCodeAt(i)
    if (code === 47) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now
      if (!matchedSlash) {
        startPart = i + 1
        break
      }
      continue
    }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false
      end = i + 1
    }
    if (code === 46 /* . */) {
      // If this is our first dot, mark it as the start of our extension
      if (startDot === -1) startDot = i; else if (preDotState !== 1) preDotState = 1
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1
    }
  }

  if (startDot === -1 || end === -1 ||
  // We saw a non-dot character immediately before the dot
  preDotState === 0 ||
  // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end); else ret.base = ret.name = path.slice(startPart, end)
    }
  } else {
    if (startPart === 0 && isAbsolute) {
      ret.name = path.slice(1, startDot)
      ret.base = path.slice(1, end)
    } else {
      ret.name = path.slice(startPart, startDot)
      ret.base = path.slice(startPart, end)
    }
    ret.ext = path.slice(startDot, end)
  }

  if (startPart > 0) ret.dir = path.slice(0, startPart - 1); else if (isAbsolute) ret.dir = '/'

  return ret
}

;// ./node_modules/path-esm/lib/resolve.js
/* provided dependency */ var process = __webpack_require__(717);


function resolve () {
  let resolvedPath = ''
  let resolvedAbsolute = false
  let cwd

  for (let i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path
    if (i >= 0) { path = arguments[i] } else {
      if (cwd === undefined) { cwd = process.cwd() }
      path = cwd
    }

    assertPath(path)

    // Skip empty entries
    if (path.length === 0) {
      continue
    }

    resolvedPath = path + '/' + resolvedPath
    resolvedAbsolute = path.charCodeAt(0) === 47
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute)

  if (resolvedAbsolute) {
    if (resolvedPath.length > 0) { return '/' + resolvedPath } else { return '/' }
  } else if (resolvedPath.length > 0) {
    return resolvedPath
  } else {
    return '.'
  }
}

;// ./node_modules/path-esm/lib/relative.js



function relative (from, to) {
  assertPath(from)
  assertPath(to)

  if (from === to) return ''

  from = resolve(from)
  to = resolve(to)

  if (from === to) return ''

  // Trim any leading backslashes
  let fromStart = 1
  for (; fromStart < from.length; ++fromStart) {
    if (from.charCodeAt(fromStart) !== 47) { break }
  }
  const fromEnd = from.length
  const fromLen = fromEnd - fromStart

  // Trim any leading backslashes
  let toStart = 1
  for (; toStart < to.length; ++toStart) {
    if (to.charCodeAt(toStart) !== 47) { break }
  }
  const toEnd = to.length
  const toLen = toEnd - toStart

  // Compare paths to find the longest common path from root
  const length = fromLen < toLen ? fromLen : toLen
  let lastCommonSep = -1
  let i = 0
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === 47) {
          // We get here if `from` is the exact base path for `to`.
          // For example: from='/foo/bar'; to='/foo/bar/baz'
          return to.slice(toStart + i + 1)
        } else if (i === 0) {
          // We get here if `from` is the root
          // For example: from='/'; to='/foo'
          return to.slice(toStart + i)
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === 47) {
          // We get here if `to` is the exact base path for `from`.
          // For example: from='/foo/bar/baz'; to='/foo/bar'
          lastCommonSep = i
        } else if (i === 0) {
          // We get here if `to` is the root.
          // For example: from='/foo'; to='/'
          lastCommonSep = 0
        }
      }
      break
    }
    const fromCode = from.charCodeAt(fromStart + i)
    const toCode = to.charCodeAt(toStart + i)
    if (fromCode !== toCode) { break } else if (fromCode === 47) { lastCommonSep = i }
  }

  let out = ''
  // Generate the relative path based on the path difference between `to`
  // and `from`
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === 47) {
      if (out.length === 0) { out += '..' } else { out += '/..' }
    }
  }

  // Lastly, append the rest of the destination (`to`) path that comes after
  // the common path parts
  if (out.length > 0) { return out + to.slice(toStart + lastCommonSep) } else {
    toStart += lastCommonSep
    if (to.charCodeAt(toStart) === 47) { ++toStart }
    return to.slice(toStart)
  }
}

;// ./node_modules/path-esm/index.js
const _makeLong = a => a
const sep = '/'
const delimiter = ':'
















// EXTERNAL MODULE: ./node_modules/bencode/index.js + 4 modules
var bencode = __webpack_require__(988);
// EXTERNAL MODULE: ./node_modules/block-iterator/index.js
var block_iterator = __webpack_require__(1467);
// EXTERNAL MODULE: ./node_modules/piece-length/index.js
var piece_length = __webpack_require__(8444);
// EXTERNAL MODULE: is-file (ignored)
var is_file_ignored_ = __webpack_require__(2123);
;// ./node_modules/junk/index.js
const ignoreList = [
	// # All
	'^npm-debug\\.log$', // Error log for npm
	'^\\..*\\.swp$', // Swap file for vim state

	// # macOS
	'^\\.DS_Store$', // Stores custom folder attributes
	'^\\.AppleDouble$', // Stores additional file resources
	'^\\.LSOverride$', // Contains the absolute path to the app to be used
	'^Icon\\r$', // Custom Finder icon: http://superuser.com/questions/298785/icon-file-on-os-x-desktop
	'^\\._.*', // Thumbnail
	'^\\.Spotlight-V100(?:$|\\/)', // Directory that might appear on external disk
	'\\.Trashes', // File that might appear on external disk
	'^__MACOSX$', // Resource fork

	// # Linux
	'~$', // Backup file

	// # Windows
	'^Thumbs\\.db$', // Image file cache
	'^ehthumbs\\.db$', // Folder config file
	'^[Dd]esktop\\.ini$', // Stores custom folder attributes
	'@eaDir$', // Synology Diskstation "hidden" folder where the server stores thumbnails
];

const junkRegex = new RegExp(ignoreList.join('|'));

function isJunk(filename) {
	return junkRegex.test(filename);
}

function isNotJunk(filename) {
	return !isJunk(filename);
}

// EXTERNAL MODULE: ./node_modules/join-async-iterator/index.js
var join_async_iterator = __webpack_require__(405);
// EXTERNAL MODULE: ./node_modules/run-parallel/index.js
var run_parallel = __webpack_require__(8190);
// EXTERNAL MODULE: ./node_modules/queue-microtask/index.js
var queue_microtask = __webpack_require__(9596);
// EXTERNAL MODULE: ./node_modules/uint8-util/browser.js + 2 modules
var browser = __webpack_require__(9639);
// EXTERNAL MODULE: ./node_modules/fast-readable-async-iterator/index.js
var fast_readable_async_iterator = __webpack_require__(3468);
// EXTERNAL MODULE: ./get-files.js (ignored)
var get_files_ignored_ = __webpack_require__(2532);
;// ./node_modules/create-torrent/index.js
/*! create-torrent. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */












 // browser exclude

const announceList = [
  ['udp://tracker.leechers-paradise.org:6969'],
  ['udp://tracker.coppersurfer.tk:6969'],
  ['udp://tracker.opentrackr.org:1337'],
  ['udp://explodie.org:6969'],
  ['udp://tracker.empire-js.us:1337'],
  ['wss://tracker.btorrent.xyz'],
  ['wss://tracker.openwebtorrent.com'],
  ['wss://tracker.webtorrent.dev']
]

/**
 * Create a torrent.
 * @param  {string|File|FileList|Buffer|Stream|Array.<string|File|Buffer|Stream>} input
 * @param  {Object} opts
 * @param  {string=} opts.name
 * @param  {Date=} opts.creationDate
 * @param  {string=} opts.comment
 * @param  {string=} opts.createdBy
 * @param  {boolean|number=} opts.private
 * @param  {number=} opts.pieceLength
 * @param  {number=} opts.maxPieceLength
 * @param  {Array.<Array.<string>>=} opts.announceList
 * @param  {Array.<string>=} opts.urlList
 * @param  {Object=} opts.info
 * @param  {Function} opts.onProgress
 * @param  {function} cb
 * @return {Buffer} buffer of .torrent file data
 */
function createTorrent (input, opts, cb) {
  if (typeof opts === 'function') [opts, cb] = [cb, opts]
  opts = opts ? Object.assign({}, opts) : {}

  _parseInput(input, opts, (err, files, singleFileTorrent) => {
    if (err) return cb(err)
    opts.singleFileTorrent = singleFileTorrent
    onFiles(files, opts, cb)
  })
}

function parseInput (input, opts, cb) {
  if (typeof opts === 'function') [opts, cb] = [cb, opts]
  opts = opts ? Object.assign({}, opts) : {}
  _parseInput(input, opts, cb)
}

const pathSymbol = Symbol('itemPath')

/**
 * Parse input file and return file information.
 */
function _parseInput (input, opts, cb) {
  if (isFileList(input)) input = Array.from(input)
  if (!Array.isArray(input)) input = [input]

  if (input.length === 0) throw new Error('invalid input type')

  input.forEach(item => {
    if (item == null) throw new Error(`invalid input type: ${item}`)
  })

  // In Electron, use the true file path
  input = input.map(item => {
    if (isBlob(item) && typeof item.path === 'string' && typeof get_files_ignored_ === 'function') return item.path
    return item
  })

  // If there's just one file, allow the name to be set by `opts.name`
  if (input.length === 1 && typeof input[0] !== 'string' && !input[0].name) input[0].name = opts.name

  let commonPrefix = null
  input.forEach((item, i) => {
    if (typeof item === 'string') {
      return
    }

    let path = item.fullPath || item.name
    if (!path) {
      path = `Unknown File ${i + 1}`
      item.unknownName = true
    }

    item[pathSymbol] = path.split('/')

    // Remove initial slash
    if (!item[pathSymbol][0]) {
      item[pathSymbol].shift()
    }

    if (item[pathSymbol].length < 2) { // No real prefix
      commonPrefix = null
    } else if (i === 0 && input.length > 1) { // The first file has a prefix
      commonPrefix = item[pathSymbol][0]
    } else if (item[pathSymbol][0] !== commonPrefix) { // The prefix doesn't match
      commonPrefix = null
    }
  })

  const filterJunkFiles = opts.filterJunkFiles === undefined ? true : opts.filterJunkFiles
  if (filterJunkFiles) {
    // Remove junk files
    input = input.filter(item => {
      if (typeof item === 'string') {
        return true
      }
      return !isJunkPath(item[pathSymbol])
    })
  }

  if (commonPrefix) {
    input.forEach(item => {
      const pathless = (ArrayBuffer.isView(item) || isReadable(item)) && !item[pathSymbol]
      if (typeof item === 'string' || pathless) return
      item[pathSymbol].shift()
    })
  }

  if (!opts.name && commonPrefix) {
    opts.name = commonPrefix
  }

  if (!opts.name) {
    // use first user-set file name
    input.some(item => {
      if (typeof item === 'string') {
        opts.name = basename(item)
        return true
      } else if (!item.unknownName) {
        opts.name = item[pathSymbol][item[pathSymbol].length - 1]
        return true
      }
      return false
    })
  }

  if (!opts.name) {
    opts.name = `Unnamed Torrent ${Date.now()}`
  }

  if (!opts.maxPieceLength) {
    opts.maxPieceLength = 4 * 1024 * 1024
  }

  const numPaths = input.reduce((sum, item) => sum + Number(typeof item === 'string'), 0)

  let isSingleFileTorrent = (input.length === 1)

  if (input.length === 1 && typeof input[0] === 'string') {
    if (typeof get_files_ignored_ !== 'function') {
      throw new Error('filesystem paths do not work in the browser')
    }
    // If there's a single path, verify it's a file before deciding this is a single
    // file torrent
    is_file_ignored_(input[0], (err, pathIsFile) => {
      if (err) return cb(err)
      isSingleFileTorrent = pathIsFile
      processInput()
    })
  } else {
    queue_microtask(processInput)
  }

  function processInput () {
    run_parallel(input.map(item => cb => {
      const file = {}

      if (isBlob(item)) {
        file.getStream = item.stream()
        file.length = item.size
      } else if (ArrayBuffer.isView(item)) {
        file.getStream = [item] // wrap in iterable to write entire buffer at once instead of unwrapping all bytes
        file.length = item.length
      } else if (isReadable(item)) {
        file.getStream = getStreamStream(item, file)
        file.length = 0
      } else if (typeof item === 'string') {
        if (typeof get_files_ignored_ !== 'function') {
          throw new Error('filesystem paths do not work in the browser')
        }
        const keepRoot = numPaths > 1 || isSingleFileTorrent
        get_files_ignored_(item, keepRoot, cb)
        return // early return!
      } else {
        throw new Error('invalid input type')
      }
      file.path = item[pathSymbol]
      cb(null, file)
    }), (err, files) => {
      if (err) return cb(err)
      files = files.flat()
      cb(null, files, isSingleFileTorrent)
    })
  }
}

const MAX_OUTSTANDING_HASHES = 5

async function getPieceList (files, pieceLength, estimatedTorrentLength, opts, cb) {
  const pieces = []
  let length = 0
  let hashedLength = 0

  const streams = files.map(file => file.getStream)

  const onProgress = opts.onProgress

  let remainingHashes = 0
  let pieceNum = 0
  let ended = false

  const iterator = block_iterator(join_async_iterator(streams), pieceLength, { zeroPadding: false })
  try {
    for await (const chunk of iterator) {
      await new Promise(resolve => {
        length += chunk.length
        const i = pieceNum
        ++pieceNum
        if (++remainingHashes < MAX_OUTSTANDING_HASHES) resolve()
        ;(0,browser/* hash */.tW)(chunk, 'hex').then(hash => {
          pieces[i] = hash
          --remainingHashes
          hashedLength += chunk.length
          if (onProgress) onProgress(hashedLength, estimatedTorrentLength)
          resolve()
          if (ended && remainingHashes === 0) cb(null, (0,browser/* hex2arr */.fk)(pieces.join('')), length)
        })
      })
    }
    if (remainingHashes === 0) return cb(null, (0,browser/* hex2arr */.fk)(pieces.join('')), length)
    ended = true
  } catch (err) {
    cb(err)
  }
}

function onFiles (files, opts, cb) {
  let _announceList = opts.announceList

  if (!_announceList) {
    if (typeof opts.announce === 'string') _announceList = [[opts.announce]]
    else if (Array.isArray(opts.announce)) {
      _announceList = opts.announce.map(u => [u])
    }
  }

  if (!_announceList) _announceList = []

  if (globalThis.WEBTORRENT_ANNOUNCE) {
    if (typeof globalThis.WEBTORRENT_ANNOUNCE === 'string') {
      _announceList.push([[globalThis.WEBTORRENT_ANNOUNCE]])
    } else if (Array.isArray(globalThis.WEBTORRENT_ANNOUNCE)) {
      _announceList = _announceList.concat(globalThis.WEBTORRENT_ANNOUNCE.map(u => [u]))
    }
  }

  // When no trackers specified, use some reasonable defaults
  if (opts.announce === undefined && opts.announceList === undefined) {
    _announceList = _announceList.concat(announceList)
  }

  if (typeof opts.urlList === 'string') opts.urlList = [opts.urlList]

  const torrent = {
    info: {
      name: opts.name
    },
    'creation date': Math.ceil((Number(opts.creationDate) || Date.now()) / 1000),
    encoding: 'UTF-8'
  }

  if (_announceList.length !== 0) {
    torrent.announce = _announceList[0][0]
    torrent['announce-list'] = _announceList
  }

  if (opts.comment !== undefined) torrent.comment = opts.comment

  if (opts.createdBy !== undefined) torrent['created by'] = opts.createdBy

  if (opts.private !== undefined) torrent.info.private = Number(opts.private)

  if (opts.info !== undefined) Object.assign(torrent.info, opts.info)

  // "ssl-cert" key is for SSL torrents, see:
  //   - http://blog.libtorrent.org/2012/01/bittorrent-over-ssl/
  //   - http://www.libtorrent.org/manual-ref.html#ssl-torrents
  //   - http://www.libtorrent.org/reference-Create_Torrents.html
  if (opts.sslCert !== undefined) torrent.info['ssl-cert'] = opts.sslCert

  if (opts.urlList !== undefined) torrent['url-list'] = opts.urlList

  const estimatedTorrentLength = files.reduce(sumLength, 0)
  const pieceLength = opts.pieceLength || Math.min(piece_length(estimatedTorrentLength), opts.maxPieceLength)
  torrent.info['piece length'] = pieceLength

  getPieceList(
    files,
    pieceLength,
    estimatedTorrentLength,
    opts,
    (err, pieces, torrentLength) => {
      if (err) return cb(err)
      torrent.info.pieces = pieces

      files.forEach(file => {
        delete file.getStream
      })

      if (opts.singleFileTorrent) {
        torrent.info.length = torrentLength
      } else {
        torrent.info.files = files
      }

      cb(null, bencode/* default */.A.encode(torrent))
    }
  )
}

/**
 * Determine if a a file is junk based on its path
 * (defined as hidden OR recognized by the `junk` package)
 *
 * @param  {string} path
 * @return {boolean}
 */
function isJunkPath (path) {
  const filename = path[path.length - 1]
  return filename[0] === '.' && isJunk(filename)
}

/**
 * Accumulator to sum file lengths
 * @param  {number} sum
 * @param  {Object} file
 * @return {number}
 */
function sumLength (sum, file) {
  return sum + file.length
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob (obj) {
  return typeof Blob !== 'undefined' && obj instanceof Blob
}

/**
 * Check if `obj` is a W3C `FileList` object
 * @param  {*} obj
 * @return {boolean}
 */
function isFileList (obj) {
  return typeof FileList !== 'undefined' && obj instanceof FileList
}

/**
 * Check if `obj` is a node Readable stream
 * @param  {*} obj
 * @return {boolean}
 */
function isReadable (obj) {
  return typeof obj === 'object' && obj != null && typeof obj.pipe === 'function'
}

/**
 * Convert a readable stream to a lazy async iterator. Adds instrumentation to track
 * the number of bytes in the stream and set `file.length`.
 *
 * @generator
 * @param  {Stream} readable
 * @param  {Object} file
 * @return {Uint8Array} stream data/chunk
 */
async function * getStreamStream (readable, file) {
  for await (const chunk of readable) {
    file.length += chunk.length
    yield chunk
  }
}

/* harmony default export */ const create_torrent = (createTorrent);


// EXTERNAL MODULE: ./node_modules/debug/src/browser.js
var src_browser = __webpack_require__(7833);
// EXTERNAL MODULE: bittorrent-dht (ignored)
var bittorrent_dht_ignored_ = __webpack_require__(6664);
// EXTERNAL MODULE: load-ip-set (ignored)
var load_ip_set_ignored_ = __webpack_require__(1827);
// EXTERNAL MODULE: fs (ignored)
var fs_ignored_ = __webpack_require__(3208);
;// ./node_modules/cross-fetch-ponyfill/browser.js
const browser_Blob = self.Blob
const File = self.File
const FormData = self.FormData
const Headers = self.Headers
const Request = self.Request
const browser_Response = self.Response
const browser_AbortController = self.AbortController
const browser_AbortSignal = self.AbortSignal

const browser_fetch = self.fetch || (() => { throw new Error('global fetch is not available!') })
/* harmony default export */ const cross_fetch_ponyfill_browser = (browser_fetch);

;// ./node_modules/@thaunknown/thirty-two/lib/thirty-two/index.js

/*
Copyright (c) 2011, Chris Umbel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
const charTable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const byteTable = [
  0xff, 0xff, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f,
  0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
  0xff, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
  0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
  0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16,
  0x17, 0x18, 0x19, 0xff, 0xff, 0xff, 0xff, 0xff,
  0xff, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
  0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
  0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16,
  0x17, 0x18, 0x19, 0xff, 0xff, 0xff, 0xff, 0xff
]
function quintetCount (buff) {
  const quintets = Math.floor(buff.length / 5)
  return buff.length % 5 === 0 ? quintets : quintets + 1
}
const encode = function (plain) {
  if (!ArrayBuffer.isView(plain) && typeof plain !== 'string') {
    throw new TypeError('base32.encode only takes Buffer or string as parameter')
  }
  if (!ArrayBuffer.isView(plain)) {
    plain = (0,browser/* text2arr */.L0)(plain)
  }
  let i = 0
  let j = 0
  let shiftIndex = 0
  let digit = 0
  const encoded = new Uint8Array(quintetCount(plain) * 8)
  /* byte by byte isn't as pretty as quintet by quintet but tests a bit
        faster. will have to revisit. */
  while (i < plain.length) {
    const current = plain[i]
    if (shiftIndex > 3) {
      digit = current & (0xff >> shiftIndex)
      shiftIndex = (shiftIndex + 5) % 8
      digit = (digit << shiftIndex) | ((i + 1 < plain.length)
        ? plain[i + 1]
        : 0) >> (8 - shiftIndex)
      i++
    } else {
      digit = (current >> (8 - (shiftIndex + 5))) & 0x1f
      shiftIndex = (shiftIndex + 5) % 8
      if (shiftIndex === 0) { i++ }
    }
    encoded[j] = charTable.charCodeAt(digit)
    j++
  }
  for (i = j; i < encoded.length; i++) {
    encoded[i] = 0x3d // '='.charCodeAt(0)
  }
  return encoded
}
const index_decode = function (encoded) {
  if (!ArrayBuffer.isView(encoded) && typeof encoded !== 'string') {
    throw new TypeError('base32.decode only takes Buffer or string as parameter')
  }
  let shiftIndex = 0
  let plainDigit = 0
  let plainChar
  let plainPos = 0
  if (!ArrayBuffer.isView(encoded)) {
    encoded = (0,browser/* text2arr */.L0)(encoded)
  }
  const decoded = new Uint8Array(Math.ceil(encoded.length * 5 / 8))
  /* byte by byte isn't as pretty as octet by octet but tests a bit
        faster. will have to revisit. */
  for (let i = 0; i < encoded.length; i++) {
    if (encoded[i] === 0x3d) { // '='
      break
    }
    const encodedByte = encoded[i] - 0x30
    if (encodedByte < byteTable.length) {
      plainDigit = byteTable[encodedByte]
      if (shiftIndex <= 3) {
        shiftIndex = (shiftIndex + 5) % 8
        if (shiftIndex === 0) {
          plainChar |= plainDigit
          decoded[plainPos] = plainChar
          plainPos++
          plainChar = 0
        } else {
          plainChar |= 0xff & (plainDigit << (8 - shiftIndex))
        }
      } else {
        shiftIndex = (shiftIndex + 5) % 8
        plainChar |= 0xff & (plainDigit >>> shiftIndex)
        decoded[plainPos] = plainChar
        plainPos++
        plainChar = 0xff & (plainDigit << (8 - shiftIndex))
      }
    } else {
      throw new Error('Invalid input - it is not base32 encoded string')
    }
  }
  return decoded.subarray(0, plainPos)
}
/* harmony default export */ const thirty_two = ({ encode, decode: index_decode });


;// ./node_modules/bep53-range/index.js
function composeRange (range) {
  return range
    .reduce((acc, cur, idx, arr) => {
      if (idx === 0 || cur !== arr[idx - 1] + 1) acc.push([])
      acc[acc.length - 1].push(cur)
      return acc
    }, [])
    .map((cur) => {
      return cur.length > 1 ? `${cur[0]}-${cur[cur.length - 1]}` : `${cur[0]}`
    })
}

function parseRange (range) {
  const generateRange = (start, end = start) => Array.from({ length: end - start + 1 }, (cur, idx) => idx + start)

  return range
    .reduce((acc, cur, idx, arr) => {
      const r = cur.split('-').map(cur => parseInt(cur))
      return acc.concat(generateRange(...r))
    }, [])
}

/* harmony default export */ const bep53_range = ((/* unused pure expression or super */ null && (parseRange)));



;// ./node_modules/magnet-uri/index.js
/*! magnet-uri. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */




/**
 * Parse a magnet URI and return an object of keys/values
 *
 * @param  {string} uri
 * @return {Object} parsed uri
 */
function magnetURIDecode (uri) {
  const result = {}

  // Support 'magnet:' and 'stream-magnet:' uris
  const data = uri.split('magnet:?')[1]

  const params = (data && data.length >= 0)
    ? data.split('&')
    : []

  params.forEach(param => {
    const keyval = param.split('=')

    // This keyval is invalid, skip it
    if (keyval.length !== 2) return

    const key = keyval[0]
    let val = keyval[1]

    // Clean up torrent name
    if (key === 'dn') val = decodeURIComponent(val).replace(/\+/g, ' ')

    // Address tracker (tr), exact source (xs), and acceptable source (as) are encoded
    // URIs, so decode them
    if (key === 'tr' || key === 'xs' || key === 'as' || key === 'ws') {
      val = decodeURIComponent(val)
    }

    // Return keywords as an array
    if (key === 'kt') val = decodeURIComponent(val).split('+')

    // Cast file index (ix) to a number
    if (key === 'ix') val = Number(val)

    // bep53
    if (key === 'so') val = parseRange(decodeURIComponent(val).split(','))

    // If there are repeated parameters, return an array of values
    if (result[key]) {
      if (!Array.isArray(result[key])) {
        result[key] = [result[key]]
      }

      result[key].push(val)
    } else {
      result[key] = val
    }
  })

  // Convenience properties for parity with `parse-torrent-file` module
  let m
  if (result.xt) {
    const xts = Array.isArray(result.xt) ? result.xt : [result.xt]
    xts.forEach(xt => {
      if ((m = xt.match(/^urn:btih:(.{40})/))) {
        result.infoHash = m[1].toLowerCase()
      } else if ((m = xt.match(/^urn:btih:(.{32})/))) {
        result.infoHash = (0,browser/* arr2hex */.V5)(index_decode(m[1]))
      } else if ((m = xt.match(/^urn:btmh:1220(.{64})/))) {
        result.infoHashV2 = m[1].toLowerCase()
      }
    })
  }

  if (result.xs) {
    const xss = Array.isArray(result.xs) ? result.xs : [result.xs]
    xss.forEach(xs => {
      if ((m = xs.match(/^urn:btpk:(.{64})/))) {
        result.publicKey = m[1].toLowerCase()
      }
    })
  }

  if (result.infoHash) result.infoHashBuffer = (0,browser/* hex2arr */.fk)(result.infoHash)
  if (result.infoHashV2) result.infoHashV2Buffer = (0,browser/* hex2arr */.fk)(result.infoHashV2)
  if (result.publicKey) result.publicKeyBuffer = (0,browser/* hex2arr */.fk)(result.publicKey)

  if (result.dn) result.name = result.dn
  if (result.kt) result.keywords = result.kt

  result.announce = []
  if (typeof result.tr === 'string' || Array.isArray(result.tr)) {
    result.announce = result.announce.concat(result.tr)
  }

  result.urlList = []
  if (typeof result.as === 'string' || Array.isArray(result.as)) {
    result.urlList = result.urlList.concat(result.as)
  }
  if (typeof result.ws === 'string' || Array.isArray(result.ws)) {
    result.urlList = result.urlList.concat(result.ws)
  }

  result.peerAddresses = []
  if (typeof result['x.pe'] === 'string' || Array.isArray(result['x.pe'])) {
    result.peerAddresses = result.peerAddresses.concat(result['x.pe'])
  }

  // remove duplicates by converting to Set and back
  result.announce = Array.from(new Set(result.announce))
  result.urlList = Array.from(new Set(result.urlList))
  result.peerAddresses = Array.from(new Set(result.peerAddresses))

  return result
}

function magnetURIEncode (obj) {
  obj = Object.assign({}, obj) // clone obj, so we can mutate it

  // support using convenience names, in addition to spec names
  // (example: `infoHash` for `xt`, `name` for `dn`)

  // Deduplicate xt by using a set
  let xts = new Set()
  if (obj.xt && typeof obj.xt === 'string') xts.add(obj.xt)
  if (obj.xt && Array.isArray(obj.xt)) xts = new Set(obj.xt)
  if (obj.infoHashBuffer) xts.add(`urn:btih:${(0,browser/* arr2hex */.V5)(obj.infoHashBuffer)}`)
  if (obj.infoHash) xts.add(`urn:btih:${obj.infoHash}`)
  if (obj.infoHashV2Buffer) xts.add(obj.xt = `urn:btmh:1220${(0,browser/* arr2hex */.V5)(obj.infoHashV2Buffer)}`)
  if (obj.infoHashV2) xts.add(`urn:btmh:1220${obj.infoHashV2}`)
  const xtsDeduped = Array.from(xts)
  if (xtsDeduped.length === 1) obj.xt = xtsDeduped[0]
  if (xtsDeduped.length > 1) obj.xt = xtsDeduped

  if (obj.publicKeyBuffer) obj.xs = `urn:btpk:${(0,browser/* arr2hex */.V5)(obj.publicKeyBuffer)}`
  if (obj.publicKey) obj.xs = `urn:btpk:${obj.publicKey}`
  if (obj.name) obj.dn = obj.name
  if (obj.keywords) obj.kt = obj.keywords
  if (obj.announce) obj.tr = obj.announce
  if (obj.urlList) {
    obj.ws = obj.urlList
    delete obj.as
  }
  if (obj.peerAddresses) obj['x.pe'] = obj.peerAddresses

  let result = 'magnet:?'
  Object.keys(obj)
    .filter(key => key.length === 2 || key === 'x.pe')
    .forEach((key, i) => {
      const values = Array.isArray(obj[key]) ? obj[key] : [obj[key]]
      values.forEach((val, j) => {
        if ((i > 0 || j > 0) && ((key !== 'kt' && key !== 'so') || j === 0)) result += '&'

        if (key === 'dn') val = encodeURIComponent(val).replace(/%20/g, '+')
        if (key === 'tr' || key === 'as' || key === 'ws') {
          val = encodeURIComponent(val)
        }
        // Don't URI encode BEP46 keys
        if (key === 'xs' && !val.startsWith('urn:btpk:')) {
          val = encodeURIComponent(val)
        }
        if (key === 'kt') val = encodeURIComponent(val)
        if (key === 'so') return

        if (key === 'kt' && j > 0) result += `+${val}`
        else result += `${key}=${val}`
      })
      if (key === 'so') result += `${key}=${composeRange(values)}`
    })

  return result
}

/* harmony default export */ const magnet_uri = (magnetURIDecode);


;// ./node_modules/parse-torrent/index.js
/*! parse-torrent. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */


 // browser exclude






/**
 * Parse a torrent identifier (magnet uri, .torrent file, info hash)
 * @param  {string|ArrayBufferView|Object} torrentId
 * @return {Object}
 */
async function parseTorrent (torrentId) {
  if (typeof torrentId === 'string' && /^(stream-)?magnet:/.test(torrentId)) {
    // if magnet uri (string)
    const torrentObj = magnet_uri(torrentId)

    // infoHash won't be defined if a non-bittorrent magnet is passed
    if (!torrentObj.infoHash) {
      throw new Error('Invalid torrent identifier')
    }

    return torrentObj
  } else if (typeof torrentId === 'string' && (/^[a-f0-9]{40}$/i.test(torrentId) || /^[a-z2-7]{32}$/i.test(torrentId))) {
    // if info hash (hex/base-32 string)
    return magnet_uri(`magnet:?xt=urn:btih:${torrentId}`)
  } else if (ArrayBuffer.isView(torrentId) && torrentId.length === 20) {
    // if info hash (buffer)
    return magnet_uri(`magnet:?xt=urn:btih:${(0,browser/* arr2hex */.V5)(torrentId)}`)
  } else if (ArrayBuffer.isView(torrentId)) {
    // if .torrent file (buffer)
    return await decodeTorrentFile(torrentId) // might throw
  } else if (torrentId && torrentId.infoHash) {
    // if parsed torrent (from `parse-torrent` or `magnet-uri`)
    torrentId.infoHash = torrentId.infoHash.toLowerCase()

    if (!torrentId.announce) torrentId.announce = []

    if (typeof torrentId.announce === 'string') {
      torrentId.announce = [torrentId.announce]
    }

    if (!torrentId.urlList) torrentId.urlList = []

    return torrentId
  } else {
    throw new Error('Invalid torrent identifier')
  }
}

async function parseTorrentRemote (torrentId, opts, cb) {
  if (typeof opts === 'function') return parseTorrentRemote(torrentId, {}, opts)
  if (typeof cb !== 'function') throw new Error('second argument must be a Function')

  let parsedTorrent
  try {
    parsedTorrent = await parseTorrent(torrentId)
  } catch (err) {
    // If torrent fails to parse, it could be a Blob, http/https URL or
    // filesystem path, so don't consider it an error yet.
  }

  if (parsedTorrent && parsedTorrent.infoHash) {
    queue_microtask(() => {
      cb(null, parsedTorrent)
    })
  } else if (parse_torrent_isBlob(torrentId)) {
    try {
      const torrentBuf = new Uint8Array(await torrentId.arrayBuffer())
      parseOrThrow(torrentBuf)
    } catch (err) {
      return cb(new Error(`Error converting Blob: ${err.message}`))
    }
  } else if (/^https?:/.test(torrentId)) {
    try {
      const res = await cross_fetch_ponyfill_browser(torrentId, {
        headers: { 'user-agent': 'WebTorrent (https://webtorrent.io)' },
        signal: AbortSignal.timeout(30 * 1000),
        ...opts
      })
      const torrentBuf = new Uint8Array(await res.arrayBuffer())
      parseOrThrow(torrentBuf)
    } catch (err) {
      return cb(new Error(`Error downloading torrent: ${err.message}`))
    }
  } else if (typeof fs_ignored_.readFile === 'function' && typeof torrentId === 'string') {
    // assume it's a filesystem path
    fs_ignored_.readFile(torrentId, (err, torrentBuf) => {
      if (err) return cb(new Error('Invalid torrent identifier'))
      parseOrThrow(torrentBuf)
    })
  } else {
    queue_microtask(() => {
      cb(new Error('Invalid torrent identifier'))
    })
  }

  async function parseOrThrow (torrentBuf) {
    try {
      parsedTorrent = await parseTorrent(torrentBuf)
    } catch (err) {
      return cb(err)
    }
    if (parsedTorrent && parsedTorrent.infoHash) cb(null, parsedTorrent)
    else cb(new Error('Invalid torrent identifier'))
  }
}

/**
 * Parse a torrent. Throws an exception if the torrent is missing required fields.
 * @param  {ArrayBufferView|Object} torrent
 * @return {Object}        parsed torrent
 */
async function decodeTorrentFile (torrent) {
  if (ArrayBuffer.isView(torrent)) {
    torrent = bencode/* default */.A.decode(torrent)
  }

  // sanity check
  ensure(torrent.info, 'info')
  ensure(torrent.info['name.utf-8'] || torrent.info.name, 'info.name')
  ensure(torrent.info['piece length'], 'info[\'piece length\']')
  ensure(torrent.info.pieces, 'info.pieces')

  if (torrent.info.files) {
    torrent.info.files.forEach(file => {
      ensure(typeof file.length === 'number', 'info.files[0].length')
      ensure(file['path.utf-8'] || file.path, 'info.files[0].path')
    })
  } else {
    ensure(typeof torrent.info.length === 'number', 'info.length')
  }

  const result = {
    info: torrent.info,
    infoBuffer: bencode/* default */.A.encode(torrent.info),
    name: (0,browser/* arr2text */.dU)(torrent.info['name.utf-8'] || torrent.info.name),
    announce: []
  }

  result.infoHashBuffer = await (0,browser/* hash */.tW)(result.infoBuffer)
  result.infoHash = (0,browser/* arr2hex */.V5)(result.infoHashBuffer)

  if (torrent.info.private !== undefined) result.private = !!torrent.info.private

  if (torrent['creation date']) result.created = new Date(torrent['creation date'] * 1000)
  if (torrent['created by']) result.createdBy = (0,browser/* arr2text */.dU)(torrent['created by'])

  if (ArrayBuffer.isView(torrent.comment)) result.comment = (0,browser/* arr2text */.dU)(torrent.comment)

  // announce and announce-list will be missing if metadata fetched via ut_metadata
  if (Array.isArray(torrent['announce-list']) && torrent['announce-list'].length > 0) {
    torrent['announce-list'].forEach(urls => {
      urls.forEach(url => {
        result.announce.push((0,browser/* arr2text */.dU)(url))
      })
    })
  } else if (torrent.announce) {
    result.announce.push((0,browser/* arr2text */.dU)(torrent.announce))
  }

  // handle url-list (BEP19 / web seeding)
  if (ArrayBuffer.isView(torrent['url-list'])) {
    // some clients set url-list to empty string
    torrent['url-list'] = torrent['url-list'].length > 0
      ? [torrent['url-list']]
      : []
  }
  result.urlList = (torrent['url-list'] || []).map(url => (0,browser/* arr2text */.dU)(url))

  // remove duplicates by converting to Set and back
  result.announce = Array.from(new Set(result.announce))
  result.urlList = Array.from(new Set(result.urlList))

  let sum = 0
  const files = torrent.info.files || [torrent.info]
  result.files = files.map((file, i) => {
    const parts = [].concat(result.name, file['path.utf-8'] || file.path || []).map(p => ArrayBuffer.isView(p) ? (0,browser/* arr2text */.dU)(p) : p)
    sum += file.length
    return {
      path: join.apply(null, [sep].concat(parts)).slice(1),
      name: parts[parts.length - 1],
      length: file.length,
      offset: sum - file.length
    }
  })

  result.length = sum

  const lastFile = result.files[result.files.length - 1]

  result.pieceLength = torrent.info['piece length']
  result.lastPieceLength = ((lastFile.offset + lastFile.length) % result.pieceLength) || result.pieceLength
  result.pieces = splitPieces(torrent.info.pieces)

  return result
}

/**
 * Convert a parsed torrent object back into a .torrent file buffer.
 * @param  {Object} parsed parsed torrent
 * @return {Uint8Array}
 */
function encodeTorrentFile (parsed) {
  const torrent = {
    info: parsed.info
  }

  torrent['announce-list'] = (parsed.announce || []).map(url => {
    if (!torrent.announce) torrent.announce = url
    url = (0,browser/* text2arr */.L0)(url)
    return [url]
  })

  torrent['url-list'] = parsed.urlList || []

  if (parsed.private !== undefined) {
    torrent.private = Number(parsed.private)
  }

  if (parsed.created) {
    torrent['creation date'] = (parsed.created.getTime() / 1000) | 0
  }

  if (parsed.createdBy) {
    torrent['created by'] = parsed.createdBy
  }

  if (parsed.comment) {
    torrent.comment = parsed.comment
  }

  return bencode/* default */.A.encode(torrent)
}

/**
 * Check if `obj` is a W3C `Blob` or `File` object
 * @param  {*} obj
 * @return {boolean}
 */
function parse_torrent_isBlob (obj) {
  return typeof Blob !== 'undefined' && obj instanceof Blob
}

function splitPieces (buf) {
  const pieces = []
  for (let i = 0; i < buf.length; i += 20) {
    pieces.push((0,browser/* arr2hex */.V5)(buf.slice(i, i + 20)))
  }
  return pieces
}

function ensure (bool, fieldName) {
  if (!bool) throw new Error(`Torrent is missing required field: ${fieldName}`)
}

/* harmony default export */ const parse_torrent = (parseTorrent);
const toMagnetURI = magnetURIEncode


;// ./node_modules/webrtc-polyfill/browser.js
const scope = typeof window !== 'undefined' ? window : self

// @ts-ignore
const RTCPeerConnection = scope.RTCPeerConnection || scope.mozRTCPeerConnection || scope.webkitRTCPeerConnection
// @ts-ignore
const RTCSessionDescription = scope.RTCSessionDescription || scope.mozRTCSessionDescription || scope.webkitRTCSessionDescription
// @ts-ignore
const RTCIceCandidate = scope.RTCIceCandidate || scope.mozRTCIceCandidate || scope.webkitRTCIceCandidate
const RTCIceTransport = scope.RTCIceTransport
const RTCDataChannel = scope.RTCDataChannel
const RTCSctpTransport = scope.RTCSctpTransport
const RTCDtlsTransport = scope.RTCDtlsTransport
const RTCCertificate = scope.RTCCertificate
const MediaStream = scope.MediaStream
const MediaStreamTrack = scope.MediaStreamTrack
const MediaStreamTrackEvent = scope.MediaStreamTrackEvent
const RTCPeerConnectionIceEvent = scope.RTCPeerConnectionIceEvent
const RTCDataChannelEvent = scope.RTCDataChannelEvent
const RTCTrackEvent = scope.RTCTrackEvent
const RTCError = scope.RTCError
const RTCErrorEvent = scope.RTCErrorEvent
const RTCRtpTransceiver = scope.RTCRtpTransceiver
const RTCRtpReceiver = scope.RTCRtpReceiver
const RTCRtpSender = scope.RTCRtpSender



// EXTERNAL MODULE: ./node_modules/streamx/index.js
var streamx = __webpack_require__(8179);
// EXTERNAL MODULE: ./node_modules/err-code/index.js
var err_code = __webpack_require__(6310);
;// ./node_modules/@thaunknown/simple-peer/lite.js
/*! simple-peer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */






const Debug = src_browser('simple-peer')

const MAX_BUFFERED_AMOUNT = 64 * 1024
const ICECOMPLETE_TIMEOUT = 5 * 1000
const CHANNEL_CLOSING_TIMEOUT = 5 * 1000

// HACK: Filter trickle lines when trickle is disabled #354
function filterTrickle (sdp) {
  return sdp.replace(/a=ice-options:trickle\s\n/g, '')
}

function warn (message) {
  console.warn(message)
}

/**
 * WebRTC peer connection. Same API as node core `net.Socket`, plus a few extra methods.
 * Duplex stream.
 * @param {Object} opts
 */
class Peer extends streamx.Duplex {
  /** @type {RTCPeerConnection} */
  _pc
  constructor (opts) {
    opts = Object.assign({
      allowHalfOpen: false
    }, opts)

    super(opts)

    this.__objectMode = !!opts.objectMode // streamx is objectMode by default, so implement readable's fuctionality

    this._id = (0,browser/* arr2hex */.V5)((0,browser/* randomBytes */.po)(4)).slice(0, 7)
    this._debug('new peer %o', opts)

    this.channelName = opts.initiator
      ? opts.channelName || (0,browser/* arr2hex */.V5)((0,browser/* randomBytes */.po)(20))
      : null

    this.initiator = opts.initiator || false
    this.channelConfig = opts.channelConfig || Peer.channelConfig
    this.channelNegotiated = this.channelConfig.negotiated
    this.config = Object.assign({}, Peer.config, opts.config)
    this.offerOptions = opts.offerOptions || {}
    this.answerOptions = opts.answerOptions || {}
    this.sdpTransform = opts.sdpTransform || (sdp => sdp)
    this.trickle = opts.trickle !== undefined ? opts.trickle : true
    this.allowHalfTrickle = opts.allowHalfTrickle !== undefined ? opts.allowHalfTrickle : false
    this.iceCompleteTimeout = opts.iceCompleteTimeout || ICECOMPLETE_TIMEOUT

    this._destroying = false
    this._connected = false

    this.remoteAddress = undefined
    this.remoteFamily = undefined
    this.remotePort = undefined
    this.localAddress = undefined
    this.localFamily = undefined
    this.localPort = undefined

    if (!RTCPeerConnection) {
      if (typeof window === 'undefined') {
        throw err_code(new Error('No WebRTC support: Specify `opts.wrtc` option in this environment'), 'ERR_WEBRTC_SUPPORT')
      } else {
        throw err_code(new Error('No WebRTC support: Not a supported browser'), 'ERR_WEBRTC_SUPPORT')
      }
    }

    this._pcReady = false
    this._channelReady = false
    this._iceComplete = false // ice candidate trickle done (got null candidate)
    this._iceCompleteTimer = null // send an offer/answer anyway after some timeout
    this._channel = null
    this._pendingCandidates = []

    this._isNegotiating = false // is this peer waiting for negotiation to complete?
    this._firstNegotiation = true
    this._batchedNegotiation = false // batch synchronous negotiations
    this._queuedNegotiation = false // is there a queued negotiation request?
    this._sendersAwaitingStable = []
    this._closingInterval = null

    this._remoteTracks = []
    this._remoteStreams = []

    this._chunk = null
    this._cb = null
    this._interval = null

    try {
      this._pc = new RTCPeerConnection(this.config)
    } catch (err) {
      this.__destroy(err_code(err, 'ERR_PC_CONSTRUCTOR'))
      return
    }

    // We prefer feature detection whenever possible, but sometimes that's not
    // possible for certain implementations.
    this._isReactNativeWebrtc = typeof this._pc._peerConnectionId === 'number'

    this._pc.oniceconnectionstatechange = () => {
      this._onIceStateChange()
    }
    this._pc.onicegatheringstatechange = () => {
      this._onIceStateChange()
    }
    this._pc.onconnectionstatechange = () => {
      this._onConnectionStateChange()
    }
    this._pc.onsignalingstatechange = () => {
      this._onSignalingStateChange()
    }
    this._pc.onicecandidate = event => {
      this._onIceCandidate(event)
    }

    // HACK: Fix for odd Firefox behavior, see: https://github.com/feross/simple-peer/pull/783
    if (typeof this._pc.peerIdentity === 'object') {
      this._pc.peerIdentity.catch(err => {
        this.__destroy(err_code(err, 'ERR_PC_PEER_IDENTITY'))
      })
    }

    // Other spec events, unused by this implementation:
    // - onconnectionstatechange
    // - onicecandidateerror
    // - onfingerprintfailure
    // - onnegotiationneeded

    if (this.initiator || this.channelNegotiated) {
      this._setupData({
        channel: this._pc.createDataChannel(this.channelName, this.channelConfig)
      })
    } else {
      this._pc.ondatachannel = event => {
        this._setupData(event)
      }
    }

    this._debug('initial negotiation')
    this._needsNegotiation()

    this._onFinishBound = () => {
      this._onFinish()
    }
    this.once('finish', this._onFinishBound)
  }

  get bufferSize () {
    return (this._channel && this._channel.bufferedAmount) || 0
  }

  // HACK: it's possible channel.readyState is "closing" before peer.destroy() fires
  // https://bugs.chromium.org/p/chromium/issues/detail?id=882743
  get connected () {
    return (this._connected && this._channel.readyState === 'open')
  }

  address () {
    return { port: this.localPort, family: this.localFamily, address: this.localAddress }
  }

  signal (data) {
    if (this._destroying) return
    if (this.destroyed) throw err_code(new Error('cannot signal after peer is destroyed'), 'ERR_DESTROYED')
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
    }
    this._debug('signal()')

    if (data.renegotiate && this.initiator) {
      this._debug('got request to renegotiate')
      this._needsNegotiation()
    }
    if (data.transceiverRequest && this.initiator) {
      this._debug('got request for transceiver')
      this.addTransceiver(data.transceiverRequest.kind, data.transceiverRequest.init)
    }
    if (data.candidate) {
      if (this._pc.remoteDescription && this._pc.remoteDescription.type) {
        this._addIceCandidate(data.candidate)
      } else {
        this._pendingCandidates.push(data.candidate)
      }
    }
    if (data.sdp) {
      this._pc.setRemoteDescription(new RTCSessionDescription(data))
        .then(() => {
          if (this.destroyed) return

          this._pendingCandidates.forEach(candidate => {
            this._addIceCandidate(candidate)
          })
          this._pendingCandidates = []

          if (this._pc.remoteDescription.type === 'offer') this._createAnswer()
        })
        .catch(err => {
          this.__destroy(err_code(err, 'ERR_SET_REMOTE_DESCRIPTION'))
        })
    }
    if (!data.sdp && !data.candidate && !data.renegotiate && !data.transceiverRequest) {
      this.__destroy(err_code(new Error('signal() called with invalid signal data'), 'ERR_SIGNALING'))
    }
  }

  _addIceCandidate (candidate) {
    const iceCandidateObj = new RTCIceCandidate(candidate)
    this._pc.addIceCandidate(iceCandidateObj)
      .catch(err => {
        if (!iceCandidateObj.address || iceCandidateObj.address.endsWith('.local')) {
          warn('Ignoring unsupported ICE candidate.')
        } else {
          this.__destroy(err_code(err, 'ERR_ADD_ICE_CANDIDATE'))
        }
      })
  }

  /**
   * Send text/binary data to the remote peer.
   * @param {ArrayBufferView|ArrayBuffer|Uint8Array|string|Blob} chunk
   */
  send (chunk) {
    if (this._destroying) return
    if (this.destroyed) throw err_code(new Error('cannot send after peer is destroyed'), 'ERR_DESTROYED')
    this._channel.send(chunk)
  }

  _needsNegotiation () {
    this._debug('_needsNegotiation')
    if (this._batchedNegotiation) return // batch synchronous renegotiations
    this._batchedNegotiation = true
    queueMicrotask(() => {
      this._batchedNegotiation = false
      if (this.initiator || !this._firstNegotiation) {
        this._debug('starting batched negotiation')
        this.negotiate()
      } else {
        this._debug('non-initiator initial negotiation request discarded')
      }
      this._firstNegotiation = false
    })
  }

  negotiate () {
    if (this._destroying) return
    if (this.destroyed) throw err_code(new Error('cannot negotiate after peer is destroyed'), 'ERR_DESTROYED')

    if (this.initiator) {
      if (this._isNegotiating) {
        this._queuedNegotiation = true
        this._debug('already negotiating, queueing')
      } else {
        this._debug('start negotiation')
        setTimeout(() => { // HACK: Chrome crashes if we immediately call createOffer
          this._createOffer()
        }, 0)
      }
    } else {
      if (this._isNegotiating) {
        this._queuedNegotiation = true
        this._debug('already negotiating, queueing')
      } else {
        this._debug('requesting negotiation from initiator')
        this.emit('signal', { // request initiator to renegotiate
          type: 'renegotiate',
          renegotiate: true
        })
      }
    }
    this._isNegotiating = true
  }

  _final (cb) {
    if (!this._readableState.ended) this.push(null)
    cb(null)
  }

  __destroy (err) {
    this.end()
    this._destroy(() => {}, err)
  }

  _destroy (cb, err) {
    if (this.destroyed || this._destroying) return
    this._destroying = true

    this._debug('destroying (error: %s)', err && (err.message || err))

    setTimeout(() => { // allow events concurrent with the call to _destroy() to fire (see #692)
      if (this._connected) this.emit('disconnect')
      this._connected = false
      this._pcReady = false
      this._channelReady = false
      this._remoteTracks = null
      this._remoteStreams = null
      this._senderMap = null

      clearInterval(this._closingInterval)
      this._closingInterval = null

      clearInterval(this._interval)
      this._interval = null
      this._chunk = null
      this._cb = null

      if (this._onFinishBound) this.removeListener('finish', this._onFinishBound)
      this._onFinishBound = null

      if (this._channel) {
        try {
          this._channel.close()
        } catch (err) {}

        // allow events concurrent with destruction to be handled
        this._channel.onmessage = null
        this._channel.onopen = null
        this._channel.onclose = null
        this._channel.onerror = null
      }
      if (this._pc) {
        try {
          this._pc.close()
        } catch (err) {}

        // allow events concurrent with destruction to be handled
        this._pc.oniceconnectionstatechange = null
        this._pc.onicegatheringstatechange = null
        this._pc.onsignalingstatechange = null
        this._pc.onicecandidate = null
        this._pc.ontrack = null
        this._pc.ondatachannel = null
      }
      this._pc = null
      this._channel = null
      if (err) this.emit('error', err)
      cb()
    }, 0)
  }

  _setupData (event) {
    if (!event.channel) {
      // In some situations `pc.createDataChannel()` returns `undefined` (in wrtc),
      // which is invalid behavior. Handle it gracefully.
      // See: https://github.com/feross/simple-peer/issues/163
      return this.__destroy(err_code(new Error('Data channel event is missing `channel` property'), 'ERR_DATA_CHANNEL'))
    }

    this._channel = event.channel
    this._channel.binaryType = 'arraybuffer'

    if (typeof this._channel.bufferedAmountLowThreshold === 'number') {
      this._channel.bufferedAmountLowThreshold = MAX_BUFFERED_AMOUNT
    }

    this.channelName = this._channel.label

    this._channel.onmessage = event => {
      this._onChannelMessage(event)
    }
    this._channel.onbufferedamountlow = () => {
      this._onChannelBufferedAmountLow()
    }
    this._channel.onopen = () => {
      this._onChannelOpen()
    }
    this._channel.onclose = () => {
      this._onChannelClose()
    }
    this._channel.onerror = event => {
      const err = event.error instanceof Error
        ? event.error
        : new Error(`Datachannel error: ${event.message} ${event.filename}:${event.lineno}:${event.colno}`)
      this.__destroy(err_code(err, 'ERR_DATA_CHANNEL'))
    }

    // HACK: Chrome will sometimes get stuck in readyState "closing", let's check for this condition
    // https://bugs.chromium.org/p/chromium/issues/detail?id=882743
    let isClosing = false
    this._closingInterval = setInterval(() => { // No "onclosing" event
      if (this._channel && this._channel.readyState === 'closing') {
        if (isClosing) this._onChannelClose() // closing timed out: equivalent to onclose firing
        isClosing = true
      } else {
        isClosing = false
      }
    }, CHANNEL_CLOSING_TIMEOUT)
  }

  _write (chunk, cb) {
    if (this.destroyed) return cb(err_code(new Error('cannot write after peer is destroyed'), 'ERR_DATA_CHANNEL'))

    if (this._connected) {
      try {
        this.send(chunk)
      } catch (err) {
        return this.__destroy(err_code(err, 'ERR_DATA_CHANNEL'))
      }
      if (this._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
        this._debug('start backpressure: bufferedAmount %d', this._channel.bufferedAmount)
        this._cb = cb
      } else {
        cb(null)
      }
    } else {
      this._debug('write before connect')
      this._chunk = chunk
      this._cb = cb
    }
  }

  // When stream finishes writing, close socket. Half open connections are not
  // supported.
  _onFinish () {
    if (this.destroyed) return

    // Wait a bit before destroying so the socket flushes.
    // TODO: is there a more reliable way to accomplish this?
    const destroySoon = () => {
      setTimeout(() => this.__destroy(), 1000)
    }

    if (this._connected) {
      destroySoon()
    } else {
      this.once('connect', destroySoon)
    }
  }

  _startIceCompleteTimeout () {
    if (this.destroyed) return
    if (this._iceCompleteTimer) return
    this._debug('started iceComplete timeout')
    this._iceCompleteTimer = setTimeout(() => {
      if (!this._iceComplete) {
        this._iceComplete = true
        this._debug('iceComplete timeout completed')
        this.emit('iceTimeout')
        this.emit('_iceComplete')
      }
    }, this.iceCompleteTimeout)
  }

  _createOffer () {
    if (this.destroyed) return

    this._pc.createOffer(this.offerOptions)
      .then(offer => {
        if (this.destroyed) return
        if (!this.trickle && !this.allowHalfTrickle) offer.sdp = filterTrickle(offer.sdp)
        offer.sdp = this.sdpTransform(offer.sdp)

        const sendOffer = () => {
          if (this.destroyed) return
          const signal = this._pc.localDescription || offer
          this._debug('signal')
          this.emit('signal', {
            type: signal.type,
            sdp: signal.sdp
          })
        }

        const onSuccess = () => {
          this._debug('createOffer success')
          if (this.destroyed) return
          if (this.trickle || this._iceComplete) sendOffer()
          else this.once('_iceComplete', sendOffer) // wait for candidates
        }

        const onError = err => {
          this.__destroy(err_code(err, 'ERR_SET_LOCAL_DESCRIPTION'))
        }

        this._pc.setLocalDescription(offer)
          .then(onSuccess)
          .catch(onError)
      })
      .catch(err => {
        this.__destroy(err_code(err, 'ERR_CREATE_OFFER'))
      })
  }

  _createAnswer () {
    if (this.destroyed) return

    this._pc.createAnswer(this.answerOptions)
      .then(answer => {
        if (this.destroyed) return
        if (!this.trickle && !this.allowHalfTrickle) answer.sdp = filterTrickle(answer.sdp)
        answer.sdp = this.sdpTransform(answer.sdp)

        const sendAnswer = () => {
          if (this.destroyed) return
          const signal = this._pc.localDescription || answer
          this._debug('signal')
          this.emit('signal', {
            type: signal.type,
            sdp: signal.sdp
          })
          if (!this.initiator) this._requestMissingTransceivers?.()
        }

        const onSuccess = () => {
          if (this.destroyed) return
          if (this.trickle || this._iceComplete) sendAnswer()
          else this.once('_iceComplete', sendAnswer)
        }

        const onError = err => {
          this.__destroy(err_code(err, 'ERR_SET_LOCAL_DESCRIPTION'))
        }

        this._pc.setLocalDescription(answer)
          .then(onSuccess)
          .catch(onError)
      })
      .catch(err => {
        this.__destroy(err_code(err, 'ERR_CREATE_ANSWER'))
      })
  }

  _onConnectionStateChange () {
    if (this.destroyed || this._destroying) return
    if (this._pc.connectionState === 'failed') {
      this.__destroy(err_code(new Error('Connection failed.'), 'ERR_CONNECTION_FAILURE'))
    }
  }

  _onIceStateChange () {
    if (this.destroyed) return
    const iceConnectionState = this._pc.iceConnectionState
    const iceGatheringState = this._pc.iceGatheringState

    this._debug(
      'iceStateChange (connection: %s) (gathering: %s)',
      iceConnectionState,
      iceGatheringState
    )
    this.emit('iceStateChange', iceConnectionState, iceGatheringState)

    if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
      this._pcReady = true
      this._maybeReady()
    }
    if (iceConnectionState === 'failed') {
      this.__destroy(err_code(new Error('Ice connection failed.'), 'ERR_ICE_CONNECTION_FAILURE'))
    }
    if (iceConnectionState === 'closed') {
      this.__destroy(err_code(new Error('Ice connection closed.'), 'ERR_ICE_CONNECTION_CLOSED'))
    }
  }

  getStats (cb) {
    // statreports can come with a value array instead of properties
    const flattenValues = report => {
      if (Object.prototype.toString.call(report.values) === '[object Array]') {
        report.values.forEach(value => {
          Object.assign(report, value)
        })
      }
      return report
    }

    // Promise-based getStats() (standard)
    if (this._pc.getStats.length === 0 || this._isReactNativeWebrtc) {
      this._pc.getStats()
        .then(res => {
          const reports = []
          res.forEach(report => {
            reports.push(flattenValues(report))
          })
          cb(null, reports)
        }, err => cb(err))

    // Single-parameter callback-based getStats() (non-standard)
    } else if (this._pc.getStats.length > 0) {
      this._pc.getStats(res => {
        // If we destroy connection in `connect` callback this code might happen to run when actual connection is already closed
        if (this.destroyed) return

        const reports = []
        res.result().forEach(result => {
          const report = {}
          result.names().forEach(name => {
            report[name] = result.stat(name)
          })
          report.id = result.id
          report.type = result.type
          report.timestamp = result.timestamp
          reports.push(flattenValues(report))
        })
        cb(null, reports)
      }, err => cb(err))

    // Unknown browser, skip getStats() since it's anyone's guess which style of
    // getStats() they implement.
    } else {
      cb(null, [])
    }
  }

  _maybeReady () {
    this._debug('maybeReady pc %s channel %s', this._pcReady, this._channelReady)
    if (this._connected || this._connecting || !this._pcReady || !this._channelReady) return

    this._connecting = true

    // HACK: We can't rely on order here, for details see https://github.com/js-platform/node-webrtc/issues/339
    const findCandidatePair = () => {
      if (this.destroyed || this._destroying) return

      this.getStats((err, items) => {
        if (this.destroyed || this._destroying) return

        // Treat getStats error as non-fatal. It's not essential.
        if (err) items = []

        const remoteCandidates = {}
        const localCandidates = {}
        const candidatePairs = {}
        let foundSelectedCandidatePair = false

        items.forEach(item => {
          // TODO: Once all browsers support the hyphenated stats report types, remove
          // the non-hypenated ones
          if (item.type === 'remotecandidate' || item.type === 'remote-candidate') {
            remoteCandidates[item.id] = item
          }
          if (item.type === 'localcandidate' || item.type === 'local-candidate') {
            localCandidates[item.id] = item
          }
          if (item.type === 'candidatepair' || item.type === 'candidate-pair') {
            candidatePairs[item.id] = item
          }
        })

        const setSelectedCandidatePair = selectedCandidatePair => {
          foundSelectedCandidatePair = true

          let local = localCandidates[selectedCandidatePair.localCandidateId]

          if (local && (local.ip || local.address)) {
            // Spec
            this.localAddress = local.ip || local.address
            this.localPort = Number(local.port)
          } else if (local && local.ipAddress) {
            // Firefox
            this.localAddress = local.ipAddress
            this.localPort = Number(local.portNumber)
          } else if (typeof selectedCandidatePair.googLocalAddress === 'string') {
            // TODO: remove this once Chrome 58 is released
            local = selectedCandidatePair.googLocalAddress.split(':')
            this.localAddress = local[0]
            this.localPort = Number(local[1])
          }
          if (this.localAddress) {
            this.localFamily = this.localAddress.includes(':') ? 'IPv6' : 'IPv4'
          }

          let remote = remoteCandidates[selectedCandidatePair.remoteCandidateId]

          if (remote && (remote.ip || remote.address)) {
            // Spec
            this.remoteAddress = remote.ip || remote.address
            this.remotePort = Number(remote.port)
          } else if (remote && remote.ipAddress) {
            // Firefox
            this.remoteAddress = remote.ipAddress
            this.remotePort = Number(remote.portNumber)
          } else if (typeof selectedCandidatePair.googRemoteAddress === 'string') {
            // TODO: remove this once Chrome 58 is released
            remote = selectedCandidatePair.googRemoteAddress.split(':')
            this.remoteAddress = remote[0]
            this.remotePort = Number(remote[1])
          }
          if (this.remoteAddress) {
            this.remoteFamily = this.remoteAddress.includes(':') ? 'IPv6' : 'IPv4'
          }

          this._debug(
            'connect local: %s:%s remote: %s:%s',
            this.localAddress,
            this.localPort,
            this.remoteAddress,
            this.remotePort
          )
        }

        items.forEach(item => {
          // Spec-compliant
          if (item.type === 'transport' && item.selectedCandidatePairId) {
            setSelectedCandidatePair(candidatePairs[item.selectedCandidatePairId])
          }

          // Old implementations
          if (
            (item.type === 'googCandidatePair' && item.googActiveConnection === 'true') ||
            ((item.type === 'candidatepair' || item.type === 'candidate-pair') && item.selected)
          ) {
            setSelectedCandidatePair(item)
          }
        })

        // Ignore candidate pair selection in browsers like Safari 11 that do not have any local or remote candidates
        // But wait until at least 1 candidate pair is available
        if (!foundSelectedCandidatePair && (!Object.keys(candidatePairs).length || Object.keys(localCandidates).length)) {
          setTimeout(findCandidatePair, 100)
          return
        } else {
          this._connecting = false
          this._connected = true
          this.emit('connect')
        }

        if (this._chunk) {
          try {
            this.send(this._chunk)
          } catch (err) {
            return this.__destroy(err_code(err, 'ERR_DATA_CHANNEL'))
          }
          this._chunk = null
          this._debug('sent chunk from "write before connect"')

          const cb = this._cb
          this._cb = null
          cb(null)
        }

        // If `bufferedAmountLowThreshold` and 'onbufferedamountlow' are unsupported,
        // fallback to using setInterval to implement backpressure.
        if (typeof this._channel.bufferedAmountLowThreshold !== 'number') {
          this._interval = setInterval(() => this._onInterval(), 150)
          if (this._interval.unref) this._interval.unref()
        }

        this._debug('connect')
        this.emit('connect')
      })
    }
    findCandidatePair()
  }

  _onInterval () {
    if (!this._cb || !this._channel || this._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
      return
    }
    this._onChannelBufferedAmountLow()
  }

  _onSignalingStateChange () {
    if (this.destroyed) return

    if (this._pc.signalingState === 'stable') {
      this._isNegotiating = false

      // HACK: Firefox doesn't yet support removing tracks when signalingState !== 'stable'
      this._debug('flushing sender queue', this._sendersAwaitingStable)
      this._sendersAwaitingStable.forEach(sender => {
        this._pc.removeTrack(sender)
        this._queuedNegotiation = true
      })
      this._sendersAwaitingStable = []

      if (this._queuedNegotiation) {
        this._debug('flushing negotiation queue')
        this._queuedNegotiation = false
        this._needsNegotiation() // negotiate again
      } else {
        this._debug('negotiated')
        this.emit('negotiated')
      }
    }

    this._debug('signalingStateChange %s', this._pc.signalingState)
    this.emit('signalingStateChange', this._pc.signalingState)
  }

  _onIceCandidate (event) {
    if (this.destroyed) return
    if (event.candidate && this.trickle) {
      this.emit('signal', {
        type: 'candidate',
        candidate: {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid
        }
      })
    } else if (!event.candidate && !this._iceComplete) {
      this._iceComplete = true
      this.emit('_iceComplete')
    }
    // as soon as we've received one valid candidate start timeout
    if (event.candidate) {
      this._startIceCompleteTimeout()
    }
  }

  _onChannelMessage (event) {
    if (this.destroyed) return
    let data = event.data
    if (data instanceof ArrayBuffer) {
      data = new Uint8Array(data)
    } else if (this.__objectMode === false) {
      data = (0,browser/* text2arr */.L0)(data)
    }
    this.push(data)
  }

  _onChannelBufferedAmountLow () {
    if (this.destroyed || !this._cb) return
    this._debug('ending backpressure: bufferedAmount %d', this._channel.bufferedAmount)
    const cb = this._cb
    this._cb = null
    cb(null)
  }

  _onChannelOpen () {
    if (this._connected || this.destroyed) return
    this._debug('on channel open')
    this._channelReady = true
    this._maybeReady()
  }

  _onChannelClose () {
    if (this.destroyed) return
    this._debug('on channel close')
    this.__destroy()
  }

  _debug () {
    const args = [].slice.call(arguments)
    args[0] = '[' + this._id + '] ' + args[0]
    Debug.apply(null, args)
  }
}

Peer.WEBRTC_SUPPORT = !!RTCPeerConnection

/**
 * Expose peer and data channel config for overriding all Peer
 * instances. Otherwise, just set opts.config or opts.channelConfig
 * when constructing a Peer.
 */
Peer.config = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:global.stun.twilio.com:3478'
      ]
    }
  ],
  sdpSemantics: 'unified-plan'
}

Peer.channelConfig = {}

/* harmony default export */ const lite = (Peer);

// EXTERNAL MODULE: ./node_modules/throughput/index.js
var throughput = __webpack_require__(1035);
// EXTERNAL MODULE: ./node_modules/speed-limiter/index.js
var speed_limiter = __webpack_require__(7541);
// EXTERNAL MODULE: @silentbot1/nat-api (ignored)
var nat_api_ignored_ = __webpack_require__(3278);
// EXTERNAL MODULE: ./lib/conn-pool.js (ignored)
var conn_pool_ignored_ = __webpack_require__(8271);
// EXTERNAL MODULE: fs (ignored)
var fs_ignored_0 = __webpack_require__(6686);
// EXTERNAL MODULE: net (ignored)
var net_ignored_ = __webpack_require__(7828);
// EXTERNAL MODULE: os (ignored)
var os_ignored_ = __webpack_require__(6889);
;// ./node_modules/addr-to-ip-port/index.js
const ADDR_RE = /^\[?([^\]]+)]?:(\d+)$/ // ipv4/ipv6/hostname + port

let cache = new Map()

// reset cache when it gets to 100,000 elements (~ 600KB of ipv4 addresses)
// so it will not grow to consume all memory in long-running processes
function addrToIPPort (addr) {
  if (cache.size === 100000) cache.clear()
  if (!cache.has(addr)) {
    const m = ADDR_RE.exec(addr)
    if (!m) throw new Error(`invalid addr: ${addr}`)
    cache.set(addr, [ m[1], Number(m[2]) ])
  }
  return cache.get(addr)
}

// EXTERNAL MODULE: ./node_modules/bitfield/lib/esm/index.js
var esm = __webpack_require__(3033);
// EXTERNAL MODULE: ./node_modules/cache-chunk-store/index.js
var cache_chunk_store = __webpack_require__(4497);
;// ./node_modules/chunk-store-iterator/index.js


async function * chunkStoreRead (store, opts = {}) {
  if (store?.[Symbol.asyncIterator]) {
    yield * store[Symbol.asyncIterator](opts.offset)
    return
  }
  if (!store?.get) throw new Error('First argument must be an abstract-chunk-store compliant store')

  const chunkLength = opts.chunkLength || store.chunkLength
  if (!chunkLength) throw new Error('missing required `chunkLength` property')

  let length = opts.length || store.length
  if (!Number.isFinite(length)) throw new Error('missing required `length` property')

  const offset = opts.offset || 0

  const get = (i, length, offset) => new Promise((resolve, reject) => {
    store.get(i, { offset, length }, (err, chunk) => {
      if (err) reject(err)
      resolve(chunk)
    })
  })

  let index = Math.floor(offset / chunkLength)
  const chunkOffset = offset % chunkLength
  if (offset) {
    const target = Math.min(length, chunkLength - chunkOffset)
    length -= target
    yield get(index++, target, chunkOffset)
  }

  for (let remainingLength = length; remainingLength > 0; ++index, remainingLength -= chunkLength) {
    yield get(index, Math.min(remainingLength, chunkLength))
  }
}

async function chunkStoreWrite (store, stream, opts = {}) {
  if (!store?.put) throw new Error('First argument must be an abstract-chunk-store compliant store')

  const chunkLength = opts.chunkLength || store.chunkLength
  if (!chunkLength) throw new Error('missing required `chunkLength` property')

  const storeMaxOutstandingPuts = opts.storeMaxOutstandingPuts || 16
  let outstandingPuts = 0

  let index = 0

  let cb = () => {}
  let ended = false

  for await (const chunk of block_iterator(stream, chunkLength, { zeroPadding: opts.zeroPadding || false })) {
    await new Promise((resolve, reject) => {
      if (outstandingPuts++ <= storeMaxOutstandingPuts) resolve()
      store.put(index++, chunk, err => {
        if (err) return reject(err)
        --outstandingPuts
        resolve()
        if (ended && outstandingPuts === 0) cb()
      })
    })
  }
  if (outstandingPuts === 0) return
  ended = new Promise(resolve => { cb = resolve })
  await ended
}


/* harmony default export */ const chunk_store_iterator = ({ chunkStoreRead, chunkStoreWrite });

// EXTERNAL MODULE: ./node_modules/cpus/browser.js
var cpus_browser = __webpack_require__(4018);
// EXTERNAL MODULE: bittorrent-dht (ignored)
var bittorrent_dht_ignored_0 = __webpack_require__(3970);
// EXTERNAL MODULE: ./node_modules/once/once.js
var once = __webpack_require__(3519);
// EXTERNAL MODULE: ./common-node.js (ignored)
var common_node_ignored_ = __webpack_require__(8436);
var common_node_ignored_namespaceObject = /*#__PURE__*/__webpack_require__.t(common_node_ignored_, 2);
;// ./node_modules/torrent-discovery/node_modules/bittorrent-tracker/lib/common.js
/**
 * Functions/constants needed by both the client and server.
 */



const DEFAULT_ANNOUNCE_PEERS = 50
const MAX_ANNOUNCE_PEERS = 82

// HACK: Fix for WHATWG URL object not parsing non-standard URL schemes like
// 'udp:'. Just replace it with 'http:' since we only need a few properties.
//
// Note: Only affects Chrome and Firefox. Works fine in Node.js, Safari, and
// Edge.
//
// Note: UDP trackers aren't used in the normal browser build, but they are
// used in a Chrome App build (i.e. by Brave Browser).
//
// Bug reports:
// - Chrome: https://bugs.chromium.org/p/chromium/issues/detail?id=734880
// - Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1374505
const parseUrl = str => {
  const url = new URL(str.replace(/^udp:/, 'http:'))

  if (str.match(/^udp:/)) {
    Object.defineProperties(url, {
      href: { value: url.href.replace(/^http/, 'udp') },
      protocol: { value: url.protocol.replace(/^http/, 'udp') },
      origin: { value: url.origin.replace(/^http/, 'udp') }
    })
  }

  return url
}

/* harmony default export */ const common = ({
  DEFAULT_ANNOUNCE_PEERS,
  MAX_ANNOUNCE_PEERS,
  parseUrl,
  ...common_node_ignored_namespaceObject
});

// EXTERNAL MODULE: ./lib/client/http-tracker.js (ignored)
var http_tracker_ignored_ = __webpack_require__(8529);
// EXTERNAL MODULE: ./lib/client/udp-tracker.js (ignored)
var udp_tracker_ignored_ = __webpack_require__(1048);
// EXTERNAL MODULE: ws (ignored)
var ws_ignored_ = __webpack_require__(2701);
;// ./node_modules/@thaunknown/simple-websocket/index.js
/*! simple-websocket. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* global WebSocket */


 // TODO: remove when Node 10 is not supported
 // websockets in node - will be empty object in browser



const debug = src_browser('simple-websocket')

const _WebSocket = typeof ws_ignored_ !== 'function' ? WebSocket : ws_ignored_

const simple_websocket_MAX_BUFFERED_AMOUNT = 64 * 1024

/**
 * WebSocket. Same API as node core `net.Socket`. Duplex stream.
 * @param {Object} opts
 * @param {string=} opts.url websocket server url
 * @param {string=} opts.socket raw websocket instance to wrap
 */
class Socket extends streamx.Duplex {
  constructor (opts = {}) {
    // Support simple usage: `new Socket(url)`
    if (typeof opts === 'string') {
      opts = { url: opts }
    }

    opts = Object.assign({
      allowHalfOpen: false
    }, opts)

    super(opts)

    this.__objectMode = !!opts.objectMode // streamx is objectMode by default, so implement readable's fuctionality
    if (opts.objectMode != null) delete opts.objectMode // causes error with ws...

    if (opts.url == null && opts.socket == null) {
      throw new Error('Missing required `url` or `socket` option')
    }
    if (opts.url != null && opts.socket != null) {
      throw new Error('Must specify either `url` or `socket` option, not both')
    }

    this._id = (0,browser/* arr2hex */.V5)((0,browser/* randomBytes */.po)(4)).slice(0, 7)
    this._debug('new websocket: %o', opts)

    this.connected = false

    this._chunk = null
    this._cb = null
    this._interval = null

    if (opts.socket) {
      this.url = opts.socket.url
      this._ws = opts.socket
      this.connected = opts.socket.readyState === _WebSocket.OPEN
    } else {
      this.url = opts.url
      try {
        if (typeof ws_ignored_ === 'function') {
          // `ws` package accepts options
          this._ws = new _WebSocket(opts.url, {
            ...opts,
            encoding: undefined // encoding option breaks ws internals
          })
        } else {
          this._ws = new _WebSocket(opts.url)
        }
      } catch (err) {
        queue_microtask(() => this.destroy(err))
        return
      }
    }

    this._ws.binaryType = 'arraybuffer'

    if (opts.socket && this.connected) {
      queue_microtask(() => this._handleOpen())
    } else {
      this._ws.onopen = () => this._handleOpen()
    }

    this._ws.onmessage = event => this._handleMessage(event)
    this._ws.onclose = () => this._handleClose()
    this._ws.onerror = err => this._handleError(err)

    this._handleFinishBound = () => this._handleFinish()
    this.once('finish', this._handleFinishBound)
  }

  /**
   * Send text/binary data to the WebSocket server.
   * @param {TypedArrayView|ArrayBuffer|Uint8Array|string|Blob|Object} chunk
   */
  send (chunk) {
    this._ws.send(chunk)
  }

  _final (cb) {
    if (!this._readableState.ended) this.push(null)
    cb(null)
  }

  _destroy (cb) {
    if (this.destroyed) return
    if (!this._writableState.ended) this.end()

    this.connected = false

    clearInterval(this._interval)
    this._interval = null
    this._chunk = null
    this._cb = null

    if (this._handleFinishBound) {
      this.removeListener('finish', this._handleFinishBound)
    }
    this._handleFinishBound = null

    if (this._ws) {
      const ws = this._ws
      const onClose = () => {
        ws.onclose = null
      }
      if (ws.readyState === _WebSocket.CLOSED) {
        onClose()
      } else {
        try {
          ws.onclose = onClose
          ws.close()
        } catch (err) {
          onClose()
        }
      }

      ws.onopen = null
      ws.onmessage = null
      ws.onerror = () => {}
    }
    this._ws = null

    cb()
  }

  _write (chunk, cb) {
    if (this.destroyed) return cb(new Error('cannot write after socket is destroyed'))

    if (this.connected) {
      try {
        this.send(chunk)
      } catch (err) {
        return this.destroy(err)
      }
      if (typeof ws_ignored_ !== 'function' && this._ws.bufferedAmount > simple_websocket_MAX_BUFFERED_AMOUNT) {
        this._debug('start backpressure: bufferedAmount %d', this._ws.bufferedAmount)
        this._cb = cb
      } else {
        cb(null)
      }
    } else {
      this._debug('write before connect')
      this._chunk = chunk
      this._cb = cb
    }
  }

  _handleOpen () {
    if (this.connected || this.destroyed) return
    this.connected = true

    if (this._chunk) {
      try {
        this.send(this._chunk)
      } catch (err) {
        return this.destroy(err)
      }
      this._chunk = null
      this._debug('sent chunk from "write before connect"')

      const cb = this._cb
      this._cb = null
      cb(null)
    }

    // Backpressure is not implemented in Node.js. The `ws` module has a buggy
    // `bufferedAmount` property. See: https://github.com/websockets/ws/issues/492
    if (typeof ws_ignored_ !== 'function') {
      this._interval = setInterval(() => this._onInterval(), 150)
      if (this._interval.unref) this._interval.unref()
    }

    this._debug('connect')
    this.emit('connect')
  }

  _handleMessage (event) {
    if (this.destroyed) return
    let data = event.data
    if (data instanceof ArrayBuffer) data = new Uint8Array(data)
    if (this.__objectMode === false) data = (0,browser/* text2arr */.L0)(data)
    this.push(data)
  }

  _handleClose () {
    if (this.destroyed) return
    this._debug('on close')
    this.destroy()
  }

  _handleError (_) {
    this.destroy(new Error(`Error connecting to ${this.url}`))
  }

  // When stream finishes writing, close socket. Half open connections are not
  // supported.
  _handleFinish () {
    if (this.destroyed) return

    // Wait a bit before destroying so the socket flushes.
    // TODO: is there a more reliable way to accomplish this?
    const destroySoon = () => {
      setTimeout(() => this.destroy(), 1000)
    }

    if (this.connected) {
      destroySoon()
    } else {
      this.once('connect', destroySoon)
    }
  }

  _onInterval () {
    if (!this._cb || !this._ws || this._ws.bufferedAmount > simple_websocket_MAX_BUFFERED_AMOUNT) {
      return
    }
    this._debug('ending backpressure: bufferedAmount %d', this._ws.bufferedAmount)
    const cb = this._cb
    this._cb = null
    cb(null)
  }

  _debug () {
    const args = [].slice.call(arguments)
    args[0] = '[' + this._id + '] ' + args[0]
    debug.apply(null, args)
  }
}

Socket.WEBSOCKET_SUPPORT = !!_WebSocket

;// ./node_modules/torrent-discovery/node_modules/bittorrent-tracker/lib/client/tracker.js


class Tracker extends events {
  constructor (client, announceUrl) {
    super()

    this.client = client
    this.announceUrl = announceUrl

    this.interval = null
    this.destroyed = false
  }

  setInterval (intervalMs) {
    if (intervalMs == null) intervalMs = this.DEFAULT_ANNOUNCE_INTERVAL

    clearInterval(this.interval)

    if (intervalMs) {
      this.interval = setInterval(() => {
        this.announce(this.client._defaultAnnounceOpts())
      }, intervalMs)
      if (this.interval.unref) this.interval.unref()
    }
  }
}

/* harmony default export */ const tracker = (Tracker);

;// ./node_modules/torrent-discovery/node_modules/bittorrent-tracker/lib/client/websocket-tracker.js








const websocket_tracker_debug = src_browser('bittorrent-tracker:websocket-tracker')

// Use a socket pool, so tracker clients share WebSocket objects for the same server.
// In practice, WebSockets are pretty slow to establish, so this gives a nice performance
// boost, and saves browser resources.
const socketPool = {}

const RECONNECT_MINIMUM = 10 * 1000
const RECONNECT_MAXIMUM = 60 * 60 * 1000
const RECONNECT_VARIANCE = 5 * 60 * 1000
const OFFER_TIMEOUT = 50 * 1000

class WebSocketTracker extends tracker {
  constructor (client, announceUrl) {
    super(client, announceUrl)
    websocket_tracker_debug('new websocket tracker %s', announceUrl)

    this.peers = {} // peers (offer id -> peer)
    this.socket = null

    this.reconnecting = false
    this.retries = 0
    this.reconnectTimer = null

    // Simple boolean flag to track whether the socket has received data from
    // the websocket server since the last time socket.send() was called.
    this.expectingResponse = false

    this._openSocket()
  }

  announce (opts) {
    if (this.destroyed || this.reconnecting) return
    if (!this.socket.connected) {
      this.socket.once('connect', () => {
        this.announce(opts)
      })
      return
    }

    const params = Object.assign({}, opts, {
      action: 'announce',
      info_hash: this.client._infoHashBinary,
      peer_id: this.client._peerIdBinary
    })
    if (this._trackerId) params.trackerid = this._trackerId

    if (opts.event === 'stopped' || opts.event === 'completed') {
      // Don't include offers with 'stopped' or 'completed' event
      this._send(params)
    } else {
      // Limit the number of offers that are generated, since it can be slow
      const numwant = Math.min(opts.numwant, 5)

      this._generateOffers(numwant, offers => {
        params.numwant = numwant
        params.offers = offers
        this._send(params)
      })
    }
  }

  scrape (opts) {
    if (this.destroyed || this.reconnecting) return
    if (!this.socket.connected) {
      this.socket.once('connect', () => {
        this.scrape(opts)
      })
      return
    }

    const infoHashes = (Array.isArray(opts.infoHash) && opts.infoHash.length > 0)
      ? opts.infoHash.map(infoHash => (0,browser/* hex2bin */.Ht)(infoHash))
      : (opts.infoHash && (0,browser/* hex2bin */.Ht)(opts.infoHash)) || this.client._infoHashBinary
    const params = {
      action: 'scrape',
      info_hash: infoHashes
    }

    this._send(params)
  }

  destroy (cb = noop) {
    if (this.destroyed) return cb(null)

    this.destroyed = true

    clearInterval(this.interval)
    clearTimeout(this.reconnectTimer)

    // Destroy peers
    for (const peerId in this.peers) {
      const peer = this.peers[peerId]
      clearTimeout(peer.trackerTimeout)
      peer.destroy()
    }
    this.peers = null

    if (this.socket) {
      this.socket.removeListener('connect', this._onSocketConnectBound)
      this.socket.removeListener('data', this._onSocketDataBound)
      this.socket.removeListener('close', this._onSocketCloseBound)
      this.socket.removeListener('error', this._onSocketErrorBound)
      this.socket = null
    }

    this._onSocketConnectBound = null
    this._onSocketErrorBound = null
    this._onSocketDataBound = null
    this._onSocketCloseBound = null

    if (socketPool[this.announceUrl]) {
      socketPool[this.announceUrl].consumers -= 1
    }

    // Other instances are using the socket, so there's nothing left to do here
    if (socketPool[this.announceUrl].consumers > 0) return cb()

    let socket = socketPool[this.announceUrl]
    delete socketPool[this.announceUrl]
    socket.on('error', noop) // ignore all future errors
    socket.once('close', cb)

    let timeout

    // If there is no data response expected, destroy immediately.
    if (!this.expectingResponse) return destroyCleanup()

    // Otherwise, wait a short time for potential responses to come in from the
    // server, then force close the socket.
    timeout = setTimeout(destroyCleanup, common.DESTROY_TIMEOUT)

    // But, if a response comes from the server before the timeout fires, do cleanup
    // right away.
    socket.once('data', destroyCleanup)

    function destroyCleanup () {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      socket.removeListener('data', destroyCleanup)
      socket.destroy()
      socket = null
    }
  }

  _openSocket () {
    this.destroyed = false

    if (!this.peers) this.peers = {}

    this._onSocketConnectBound = () => {
      this._onSocketConnect()
    }
    this._onSocketErrorBound = err => {
      this._onSocketError(err)
    }
    this._onSocketDataBound = data => {
      this._onSocketData(data)
    }
    this._onSocketCloseBound = () => {
      this._onSocketClose()
    }

    this.socket = socketPool[this.announceUrl]
    if (this.socket) {
      socketPool[this.announceUrl].consumers += 1
      if (this.socket.connected) {
        this._onSocketConnectBound()
      }
    } else {
      const parsedUrl = new URL(this.announceUrl)
      let agent
      if (this.client._proxyOpts) {
        agent = parsedUrl.protocol === 'wss:' ? this.client._proxyOpts.httpsAgent : this.client._proxyOpts.httpAgent
        if (!agent && this.client._proxyOpts.socksProxy) {
          agent = this.client._proxyOpts.socksProxy
        }
      }
      this.socket = socketPool[this.announceUrl] = new Socket({ url: this.announceUrl, agent })
      this.socket.consumers = 1
      this.socket.once('connect', this._onSocketConnectBound)
    }

    this.socket.on('data', this._onSocketDataBound)
    this.socket.once('close', this._onSocketCloseBound)
    this.socket.once('error', this._onSocketErrorBound)
  }

  _onSocketConnect () {
    if (this.destroyed) return

    if (this.reconnecting) {
      this.reconnecting = false
      this.retries = 0
      this.announce(this.client._defaultAnnounceOpts())
    }
  }

  _onSocketData (data) {
    if (this.destroyed) return

    this.expectingResponse = false

    try {
      data = JSON.parse((0,browser/* arr2text */.dU)(data))
    } catch (err) {
      this.client.emit('warning', new Error('Invalid tracker response'))
      return
    }

    if (data.action === 'announce') {
      this._onAnnounceResponse(data)
    } else if (data.action === 'scrape') {
      this._onScrapeResponse(data)
    } else {
      this._onSocketError(new Error(`invalid action in WS response: ${data.action}`))
    }
  }

  _onAnnounceResponse (data) {
    if (data.info_hash !== this.client._infoHashBinary) {
      websocket_tracker_debug(
        'ignoring websocket data from %s for %s (looking for %s: reused socket)',
        this.announceUrl, (0,browser/* bin2hex */.HB)(data.info_hash), this.client.infoHash
      )
      return
    }

    if (data.peer_id && data.peer_id === this.client._peerIdBinary) {
      // ignore offers/answers from this client
      return
    }

    websocket_tracker_debug(
      'received %s from %s for %s',
      JSON.stringify(data), this.announceUrl, this.client.infoHash
    )

    const failure = data['failure reason']
    if (failure) return this.client.emit('warning', new Error(failure))

    const warning = data['warning message']
    if (warning) this.client.emit('warning', new Error(warning))

    const interval = data.interval || data['min interval']
    if (interval) this.setInterval(interval * 1000)

    const trackerId = data['tracker id']
    if (trackerId) {
      // If absent, do not discard previous trackerId value
      this._trackerId = trackerId
    }

    if (data.complete != null) {
      const response = Object.assign({}, data, {
        announce: this.announceUrl,
        infoHash: (0,browser/* bin2hex */.HB)(data.info_hash)
      })
      this.client.emit('update', response)
    }

    let peer
    if (data.offer && data.peer_id) {
      websocket_tracker_debug('creating peer (from remote offer)')
      peer = this._createPeer()
      peer.id = (0,browser/* bin2hex */.HB)(data.peer_id)
      peer.once('signal', answer => {
        const params = {
          action: 'announce',
          info_hash: this.client._infoHashBinary,
          peer_id: this.client._peerIdBinary,
          to_peer_id: data.peer_id,
          answer,
          offer_id: data.offer_id
        }
        if (this._trackerId) params.trackerid = this._trackerId
        this._send(params)
      })
      this.client.emit('peer', peer)
      peer.signal(data.offer)
    }

    if (data.answer && data.peer_id) {
      const offerId = (0,browser/* bin2hex */.HB)(data.offer_id)
      peer = this.peers[offerId]
      if (peer) {
        peer.id = (0,browser/* bin2hex */.HB)(data.peer_id)
        this.client.emit('peer', peer)
        peer.signal(data.answer)

        clearTimeout(peer.trackerTimeout)
        peer.trackerTimeout = null
        delete this.peers[offerId]
      } else {
        websocket_tracker_debug(`got unexpected answer: ${JSON.stringify(data.answer)}`)
      }
    }
  }

  _onScrapeResponse (data) {
    data = data.files || {}

    const keys = Object.keys(data)
    if (keys.length === 0) {
      this.client.emit('warning', new Error('invalid scrape response'))
      return
    }

    keys.forEach(infoHash => {
      // TODO: optionally handle data.flags.min_request_interval
      // (separate from announce interval)
      const response = Object.assign(data[infoHash], {
        announce: this.announceUrl,
        infoHash: (0,browser/* bin2hex */.HB)(infoHash)
      })
      this.client.emit('scrape', response)
    })
  }

  _onSocketClose () {
    if (this.destroyed) return
    this.destroy()
    this._startReconnectTimer()
  }

  _onSocketError (err) {
    if (this.destroyed) return
    this.destroy()
    // errors will often happen if a tracker is offline, so don't treat it as fatal
    this.client.emit('warning', err)
    this._startReconnectTimer()
  }

  _startReconnectTimer () {
    const ms = Math.floor(Math.random() * RECONNECT_VARIANCE) + Math.min(Math.pow(2, this.retries) * RECONNECT_MINIMUM, RECONNECT_MAXIMUM)

    this.reconnecting = true
    clearTimeout(this.reconnectTimer)
    this.reconnectTimer = setTimeout(() => {
      this.retries++
      this._openSocket()
    }, ms)
    if (this.reconnectTimer.unref) this.reconnectTimer.unref()

    websocket_tracker_debug('reconnecting socket in %s ms', ms)
  }

  _send (params) {
    if (this.destroyed) return
    this.expectingResponse = true
    const message = JSON.stringify(params)
    websocket_tracker_debug('send %s', message)
    this.socket.send(message)
  }

  _generateOffers (numwant, cb) {
    const self = this
    const offers = []
    websocket_tracker_debug('generating %s offers', numwant)

    for (let i = 0; i < numwant; ++i) {
      generateOffer()
    }
    checkDone()

    function generateOffer () {
      const offerId = (0,browser/* arr2hex */.V5)((0,browser/* randomBytes */.po)(20))
      websocket_tracker_debug('creating peer (from _generateOffers)')
      const peer = self.peers[offerId] = self._createPeer({ initiator: true })
      peer.once('signal', offer => {
        offers.push({
          offer,
          offer_id: (0,browser/* hex2bin */.Ht)(offerId)
        })
        checkDone()
      })
      peer.trackerTimeout = setTimeout(() => {
        websocket_tracker_debug('tracker timeout: destroying peer')
        peer.trackerTimeout = null
        delete self.peers[offerId]
        peer.destroy()
      }, OFFER_TIMEOUT)
      if (peer.trackerTimeout.unref) peer.trackerTimeout.unref()
    }

    function checkDone () {
      if (offers.length === numwant) {
        websocket_tracker_debug('generated %s offers', numwant)
        cb(offers)
      }
    }
  }

  _createPeer (opts) {
    const self = this

    opts = Object.assign({
      trickle: false,
      config: self.client._rtcConfig,
      wrtc: self.client._wrtc
    }, opts)

    const peer = new lite(opts)

    peer.once('error', onError)
    peer.once('connect', onConnect)

    return peer

    // Handle peer 'error' events that are fired *before* the peer is emitted in
    // a 'peer' event.
    function onError (err) {
      self.client.emit('warning', new Error(`Connection error: ${err.message}`))
      peer.destroy()
    }

    // Once the peer is emitted in a 'peer' event, then it's the consumer's
    // responsibility to listen for errors, so the listeners are removed here.
    function onConnect () {
      peer.removeListener('error', onError)
      peer.removeListener('connect', onConnect)
    }
  }
}

WebSocketTracker.prototype.DEFAULT_ANNOUNCE_INTERVAL = 30 * 1000 // 30 seconds
// Normally this shouldn't be accessed but is occasionally useful
WebSocketTracker._socketPool = socketPool

function noop () {}

/* harmony default export */ const websocket_tracker = (WebSocketTracker);

;// ./node_modules/torrent-discovery/node_modules/bittorrent-tracker/client.js
/* provided dependency */ var client_process = __webpack_require__(717);









 // empty object in browser
 // empty object in browser


const client_debug = src_browser('bittorrent-tracker:client')

/**
 * BitTorrent tracker client.
 *
 * Find torrent peers, to help a torrent client participate in a torrent swarm.
 *
 * @param {Object} opts                          options object
 * @param {string|Uint8Array} opts.infoHash          torrent info hash
 * @param {string|Uint8Array} opts.peerId            peer id
 * @param {string|Array.<string>} opts.announce  announce
 * @param {number} opts.port                     torrent client listening port
 * @param {function} opts.getAnnounceOpts        callback to provide data to tracker
 * @param {number} opts.rtcConfig                RTCPeerConnection configuration object
 * @param {number} opts.userAgent                User-Agent header for http requests
 * @param {number} opts.wrtc                     custom webrtc impl (useful in node.js)
 * @param {object} opts.proxyOpts                proxy options (useful in node.js)
 */
class client_Client extends events {
  constructor (opts = {}) {
    super()

    if (!opts.peerId) throw new Error('Option `peerId` is required')
    if (!opts.infoHash) throw new Error('Option `infoHash` is required')
    if (!opts.announce) throw new Error('Option `announce` is required')
    if (!client_process.browser && !opts.port) throw new Error('Option `port` is required')

    this.peerId = typeof opts.peerId === 'string'
      ? opts.peerId
      : (0,browser/* arr2hex */.V5)(opts.peerId)
    this._peerIdBuffer = (0,browser/* hex2arr */.fk)(this.peerId)
    this._peerIdBinary = (0,browser/* hex2bin */.Ht)(this.peerId)

    this.infoHash = typeof opts.infoHash === 'string'
      ? opts.infoHash.toLowerCase()
      : (0,browser/* arr2hex */.V5)(opts.infoHash)
    this._infoHashBuffer = (0,browser/* hex2arr */.fk)(this.infoHash)
    this._infoHashBinary = (0,browser/* hex2bin */.Ht)(this.infoHash)

    client_debug('new client %s', this.infoHash)

    this.destroyed = false

    this._port = opts.port
    this._getAnnounceOpts = opts.getAnnounceOpts
    this._rtcConfig = opts.rtcConfig
    this._userAgent = opts.userAgent
    this._proxyOpts = opts.proxyOpts

    // Support lazy 'wrtc' module initialization
    // See: https://github.com/webtorrent/webtorrent-hybrid/issues/46
    this._wrtc = typeof opts.wrtc === 'function' ? opts.wrtc() : opts.wrtc

    let announce = typeof opts.announce === 'string'
      ? [opts.announce]
      : opts.announce == null ? [] : opts.announce

    // Remove trailing slash from trackers to catch duplicates
    announce = announce.map(announceUrl => {
      if (ArrayBuffer.isView(announceUrl)) announceUrl = (0,browser/* arr2text */.dU)(announceUrl)
      if (announceUrl[announceUrl.length - 1] === '/') {
        announceUrl = announceUrl.substring(0, announceUrl.length - 1)
      }
      return announceUrl
    })
    // remove duplicates by converting to Set and back
    announce = Array.from(new Set(announce))

    const webrtcSupport = this._wrtc !== false && (!!this._wrtc || lite.WEBRTC_SUPPORT)

    const nextTickWarn = err => {
      queue_microtask(() => {
        this.emit('warning', err)
      })
    }

    this._trackers = announce
      .map(announceUrl => {
        let parsedUrl
        try {
          parsedUrl = common.parseUrl(announceUrl)
        } catch (err) {
          nextTickWarn(new Error(`Invalid tracker URL: ${announceUrl}`))
          return null
        }

        const port = parsedUrl.port
        if (port < 0 || port > 65535) {
          nextTickWarn(new Error(`Invalid tracker port: ${announceUrl}`))
          return null
        }

        const protocol = parsedUrl.protocol
        if ((protocol === 'http:' || protocol === 'https:') &&
            typeof http_tracker_ignored_ === 'function') {
          return new http_tracker_ignored_(this, announceUrl)
        } else if (protocol === 'udp:' && typeof udp_tracker_ignored_ === 'function') {
          return new udp_tracker_ignored_(this, announceUrl)
        } else if ((protocol === 'ws:' || protocol === 'wss:') && webrtcSupport) {
          // Skip ws:// trackers on https:// sites because they throw SecurityError
          if (protocol === 'ws:' && typeof window !== 'undefined' &&
              window.location.protocol === 'https:') {
            nextTickWarn(new Error(`Unsupported tracker protocol: ${announceUrl}`))
            return null
          }
          return new websocket_tracker(this, announceUrl)
        } else {
          nextTickWarn(new Error(`Unsupported tracker protocol: ${announceUrl}`))
          return null
        }
      })
      .filter(Boolean)
  }

  /**
   * Send a `start` announce to the trackers.
   * @param {Object} opts
   * @param {number=} opts.uploaded
   * @param {number=} opts.downloaded
   * @param {number=} opts.left (if not set, calculated automatically)
   */
  start (opts) {
    opts = this._defaultAnnounceOpts(opts)
    opts.event = 'started'
    client_debug('send `start` %o', opts)
    this._announce(opts)

    // start announcing on intervals
    this._trackers.forEach(tracker => {
      tracker.setInterval()
    })
  }

  /**
   * Send a `stop` announce to the trackers.
   * @param {Object} opts
   * @param {number=} opts.uploaded
   * @param {number=} opts.downloaded
   * @param {number=} opts.numwant
   * @param {number=} opts.left (if not set, calculated automatically)
   */
  stop (opts) {
    opts = this._defaultAnnounceOpts(opts)
    opts.event = 'stopped'
    client_debug('send `stop` %o', opts)
    this._announce(opts)
  }

  /**
   * Send a `complete` announce to the trackers.
   * @param {Object} opts
   * @param {number=} opts.uploaded
   * @param {number=} opts.downloaded
   * @param {number=} opts.numwant
   * @param {number=} opts.left (if not set, calculated automatically)
   */
  complete (opts) {
    if (!opts) opts = {}
    opts = this._defaultAnnounceOpts(opts)
    opts.event = 'completed'
    client_debug('send `complete` %o', opts)
    this._announce(opts)
  }

  /**
   * Send a `update` announce to the trackers.
   * @param {Object} opts
   * @param {number=} opts.uploaded
   * @param {number=} opts.downloaded
   * @param {number=} opts.numwant
   * @param {number=} opts.left (if not set, calculated automatically)
   */
  update (opts) {
    opts = this._defaultAnnounceOpts(opts)
    if (opts.event) delete opts.event
    client_debug('send `update` %o', opts)
    this._announce(opts)
  }

  _announce (opts) {
    this._trackers.forEach(tracker => {
      // tracker should not modify `opts` object, it's passed to all trackers
      tracker.announce(opts)
    })
  }

  /**
   * Send a scrape request to the trackers.
   * @param {Object} opts
   */
  scrape (opts) {
    client_debug('send `scrape`')
    if (!opts) opts = {}
    this._trackers.forEach(tracker => {
      // tracker should not modify `opts` object, it's passed to all trackers
      tracker.scrape(opts)
    })
  }

  setInterval (intervalMs) {
    client_debug('setInterval %d', intervalMs)
    this._trackers.forEach(tracker => {
      tracker.setInterval(intervalMs)
    })
  }

  destroy (cb) {
    if (this.destroyed) return
    this.destroyed = true
    client_debug('destroy')

    const tasks = this._trackers.map(tracker => cb => {
      tracker.destroy(cb)
    })

    run_parallel(tasks, cb)

    this._trackers = []
    this._getAnnounceOpts = null
  }

  _defaultAnnounceOpts (opts = {}) {
    if (opts.numwant == null) opts.numwant = common.DEFAULT_ANNOUNCE_PEERS

    if (opts.uploaded == null) opts.uploaded = 0
    if (opts.downloaded == null) opts.downloaded = 0

    if (this._getAnnounceOpts) opts = Object.assign({}, opts, this._getAnnounceOpts())

    return opts
  }
}

/**
 * Simple convenience function to scrape a tracker for an info hash without needing to
 * create a Client, pass it a parsed torrent, etc. Support scraping a tracker for multiple
 * torrents at the same time.
 * @params {Object} opts
 * @param  {string|Array.<string>} opts.infoHash
 * @param  {string} opts.announce
 * @param  {function} cb
 */
client_Client.scrape = (opts, cb) => {
  cb = once(cb)

  if (!opts.infoHash) throw new Error('Option `infoHash` is required')
  if (!opts.announce) throw new Error('Option `announce` is required')

  const clientOpts = Object.assign({}, opts, {
    infoHash: Array.isArray(opts.infoHash) ? opts.infoHash[0] : opts.infoHash,
    peerId: (0,browser/* text2arr */.L0)('01234567890123456789'), // dummy value
    port: 6881 // dummy value
  })

  const client = new client_Client(clientOpts)
  client.once('error', cb)
  client.once('warning', cb)

  let len = Array.isArray(opts.infoHash) ? opts.infoHash.length : 1
  const results = {}
  client.on('scrape', data => {
    len -= 1
    results[data.infoHash] = data
    if (len === 0) {
      client.destroy()
      const keys = Object.keys(results)
      if (keys.length === 1) {
        cb(null, results[keys[0]])
      } else {
        cb(null, results)
      }
    }
  })

  client.scrape({ infoHash: opts.infoHash })
  return client
}

/* harmony default export */ const client = (client_Client);

;// ./node_modules/torrent-discovery/node_modules/bittorrent-tracker/index.js
/*! bittorrent-tracker. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */



/* harmony default export */ const bittorrent_tracker = ((/* unused pure expression or super */ null && (Client)));


// EXTERNAL MODULE: bittorrent-lsd (ignored)
var bittorrent_lsd_ignored_ = __webpack_require__(2799);
;// ./node_modules/torrent-discovery/index.js
/* provided dependency */ var torrent_discovery_process = __webpack_require__(717);
/*! torrent-discovery. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */

 // empty object in browser





const torrent_discovery_debug = src_browser('torrent-discovery')

class Discovery extends events.EventEmitter {
  constructor (opts) {
    super()

    if (!opts.peerId) throw new Error('Option `peerId` is required')
    if (!opts.infoHash) throw new Error('Option `infoHash` is required')
    if (!torrent_discovery_process.browser && !opts.port) throw new Error('Option `port` is required')

    this.peerId = typeof opts.peerId === 'string'
      ? opts.peerId
      : opts.peerId.toString('hex')
    this.infoHash = typeof opts.infoHash === 'string'
      ? opts.infoHash.toLowerCase()
      : opts.infoHash.toString('hex')
    this._port = opts.port // torrent port
    this._userAgent = opts.userAgent // User-Agent header for http requests

    this.destroyed = false

    this._announce = opts.announce || []
    this._intervalMs = opts.intervalMs || (15 * 60 * 1000)
    this._trackerOpts = null
    this._dhtAnnouncing = false
    this._dhtTimeout = false
    this._internalDHT = false // is the DHT created internally?

    this._onWarning = err => {
      this.emit('warning', err)
    }
    this._onError = err => {
      this.emit('error', err)
    }
    this._onDHTPeer = (peer, infoHash) => {
      if (infoHash.toString('hex') !== this.infoHash) return
      this.emit('peer', `${peer.host}:${peer.port}`, 'dht')
    }
    this._onTrackerPeer = peer => {
      this.emit('peer', peer, 'tracker')
    }
    this._onTrackerAnnounce = () => {
      this.emit('trackerAnnounce')
    }
    this._onLSDPeer = (peer, infoHash) => {
      this.emit('peer', peer, 'lsd')
    }

    const createDHT = (port, opts) => {
      const dht = new bittorrent_dht_ignored_0.Client(opts)
      dht.on('warning', this._onWarning)
      dht.on('error', this._onError)
      dht.listen(port)
      this._internalDHT = true
      return dht
    }

    if (opts.tracker === false) {
      this.tracker = null
    } else if (opts.tracker && typeof opts.tracker === 'object') {
      this._trackerOpts = Object.assign({}, opts.tracker)
      this.tracker = this._createTracker()
    } else {
      this.tracker = this._createTracker()
    }

    if (opts.dht === false || typeof bittorrent_dht_ignored_0.Client !== 'function') {
      this.dht = null
    } else if (opts.dht && typeof opts.dht.addNode === 'function') {
      this.dht = opts.dht
    } else if (opts.dht && typeof opts.dht === 'object') {
      this.dht = createDHT(opts.dhtPort, opts.dht)
    } else {
      this.dht = createDHT(opts.dhtPort)
    }

    if (this.dht) {
      this.dht.on('peer', this._onDHTPeer)
      this._dhtAnnounce()
    }

    if (opts.lsd === false || typeof bittorrent_lsd_ignored_ !== 'function') {
      this.lsd = null
    } else {
      this.lsd = this._createLSD()
    }
  }

  updatePort (port) {
    if (port === this._port) return
    this._port = port

    if (this.dht) this._dhtAnnounce()

    if (this.tracker) {
      this.tracker.stop()
      this.tracker.destroy(() => {
        this.tracker = this._createTracker()
      })
    }
  }

  complete (opts) {
    if (this.tracker) {
      this.tracker.complete(opts)
    }
  }

  destroy (cb) {
    if (this.destroyed) return
    this.destroyed = true

    clearTimeout(this._dhtTimeout)

    const tasks = []

    if (this.tracker) {
      this.tracker.stop()
      this.tracker.removeListener('warning', this._onWarning)
      this.tracker.removeListener('error', this._onError)
      this.tracker.removeListener('peer', this._onTrackerPeer)
      this.tracker.removeListener('update', this._onTrackerAnnounce)
      tasks.push(cb => {
        this.tracker.destroy(cb)
      })
    }

    if (this.dht) {
      this.dht.removeListener('peer', this._onDHTPeer)
    }

    if (this._internalDHT) {
      this.dht.removeListener('warning', this._onWarning)
      this.dht.removeListener('error', this._onError)
      tasks.push(cb => {
        this.dht.destroy(cb)
      })
    }

    if (this.lsd) {
      this.lsd.removeListener('warning', this._onWarning)
      this.lsd.removeListener('error', this._onError)
      this.lsd.removeListener('peer', this._onLSDPeer)
      tasks.push(cb => {
        this.lsd.destroy(cb)
      })
    }

    run_parallel(tasks, cb)

    // cleanup
    this.dht = null
    this.tracker = null
    this.lsd = null
    this._announce = null
  }

  _createTracker () {
    const opts = Object.assign({}, this._trackerOpts, {
      infoHash: this.infoHash,
      announce: this._announce,
      peerId: this.peerId,
      port: this._port,
      userAgent: this._userAgent
    })

    const tracker = new client(opts)
    tracker.on('warning', this._onWarning)
    tracker.on('error', this._onError)
    tracker.on('peer', this._onTrackerPeer)
    tracker.on('update', this._onTrackerAnnounce)
    tracker.setInterval(this._intervalMs)
    tracker.start()
    return tracker
  }

  _dhtAnnounce () {
    if (this._dhtAnnouncing) return
    torrent_discovery_debug('dht announce')

    this._dhtAnnouncing = true
    clearTimeout(this._dhtTimeout)

    this.dht.announce(this.infoHash, this._port, err => {
      this._dhtAnnouncing = false
      torrent_discovery_debug('dht announce complete')

      if (err) this.emit('warning', err)
      this.emit('dhtAnnounce')

      if (!this.destroyed) {
        this._dhtTimeout = setTimeout(() => {
          this._dhtAnnounce()
        }, this._intervalMs + Math.floor(Math.random() * this._intervalMs / 5))
        if (this._dhtTimeout.unref) this._dhtTimeout.unref()
      }
    })
  }

  _createLSD () {
    const opts = Object.assign({}, {
      infoHash: this.infoHash,
      peerId: this.peerId,
      port: this._port
    })

    const lsd = new bittorrent_lsd_ignored_(opts)
    lsd.on('warning', this._onWarning)
    lsd.on('error', this._onError)
    lsd.on('peer', this._onLSDPeer)
    lsd.start()
    return lsd
  }
}

/* harmony default export */ const torrent_discovery = (Discovery);

;// ./node_modules/filename-reserved-regex/index.js
/* eslint-disable no-control-regex */

function filenameReservedRegex() {
	return /[<>:"/\\|?*\u0000-\u001F]/g;
}

function windowsReservedNameRegex() {
	return /^(con|prn|aux|nul|com\d|lpt\d)$/i;
}

;// ./node_modules/fsa-chunk-store/createWritable.js
const INVALID = ['seeking position failed.', 'InvalidStateError']
const GONE = ['A requested file or directory could not be found at the time an operation was processed.', 'NotFoundError']
const SYNTAX = m => [`Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. ${m}`, 'SyntaxError']

class _FileSystemWritableFileStream extends WritableStream {
  constructor (writer) {
    super(writer)
    // Stupid Safari hack to extend native classes
    // https://bugs.webkit.org/show_bug.cgi?id=226201
    Object.setPrototypeOf(this, FileSystemWritableFileStream.prototype)

    /** @private */
    this._closed = false
  }

  async close () {
    this._closed = true
    const w = this.getWriter()
    const p = w.close()
    w.releaseLock()
    return p
    // return super.close ? super.close() : this.getWriter().close()
  }

  /** @param {number} position */
  seek (position) {
    return this.write({ type: 'seek', position })
  }

  /** @param {number} size */
  truncate (size) {
    return this.write({ type: 'truncate', size })
  }

  // The write(data) method steps are:
  write (data) {
    if (this._closed) {
      return Promise.reject(new TypeError('Cannot write to a CLOSED writable stream'))
    }

    // 1. Let writer be the result of getting a writer for this.
    const writer = this.getWriter()

    // 2. Let result be the result of writing a chunk to writer given data.
    const result = writer.write(data)

    // 3. Release writer.
    writer.releaseLock()

    // 4. Return result.
    return result
  }
}

Object.defineProperty(_FileSystemWritableFileStream.prototype, Symbol.toStringTag, {
  value: 'FileSystemWritableFileStream',
  writable: false,
  enumerable: false,
  configurable: true
})

Object.defineProperties(_FileSystemWritableFileStream.prototype, {
  close: { enumerable: true },
  seek: { enumerable: true },
  truncate: { enumerable: true },
  write: { enumerable: true }
})

// Safari safari doesn't support writable streams yet.
if (
  globalThis.FileSystemFileHandle &&
  !globalThis.FileSystemFileHandle.prototype.createWritable &&
  !globalThis.FileSystemWritableFileStream
) {
  globalThis.FileSystemWritableFileStream = _FileSystemWritableFileStream
}

// Safari doesn't support async createWritable streams yet.
if (
  globalThis.FileSystemFileHandle &&
  !globalThis.FileSystemFileHandle.prototype.createWritable
) {
  const wm = new WeakMap()

  let workerUrl

  // Worker code that should be inlined (can't use any external functions)
  const code = () => {
    let fileHandle, handle

    onmessage = async evt => {
      const port = evt.ports[0]
      const cmd = evt.data
      switch (cmd.type) {
        case 'open': {
          const file = cmd.name

          let dir = await navigator.storage.getDirectory()

          for (const folder of cmd.path) {
            dir = await dir.getDirectoryHandle(folder)
          }

          fileHandle = await dir.getFileHandle(file)
          // @ts-ignore
          handle = await fileHandle.createSyncAccessHandle()
          break
        }
        case 'write':
          handle.write(cmd.data, { at: cmd.position })
          handle.flush()
          break
        case 'truncate':
          handle.truncate(cmd.size)
          break
        case 'abort':
        case 'close':
          handle.close()
          break
      }

      port.postMessage(0)
    }
  }

  globalThis.FileSystemFileHandle.prototype.createWritable = async function (options) {
    // Safari only support writing data in a worker with sync access handle.
    if (!workerUrl) {
      const stringCode = `(${code.toString()})()`
      const blob = new Blob([stringCode], {
        type: 'text/javascript'
      })
      workerUrl = URL.createObjectURL(blob)
    }
    const worker = new Worker(workerUrl, { type: 'module' })

    let position = 0
    const textEncoder = new TextEncoder()
    let size = await this.getFile().then(file => file.size)

    const send = message => new Promise((resolve, reject) => {
      const mc = new MessageChannel()
      mc.port1.onmessage = evt => {
        if (evt.data instanceof Error) reject(evt.data)
        else resolve(evt.data)
        mc.port1.close()
        mc.port2.close()
        mc.port1.onmessage = null
      }
      worker.postMessage(message, [mc.port2])
    })

    // Safari also don't support transferable file system handles.
    // So we need to pass the path to the worker. This is a bit hacky and ugly.
    const root = await navigator.storage.getDirectory()
    const parent = await wm.get(this)
    const path = await root.resolve(parent)

    // Should likely never happen, but just in case...
    if (path === null) throw new DOMException(...GONE)

    await send({ type: 'open', path, name: this.name })

    if (options?.keepExistingData === false) {
      await send({ type: 'truncate', size: 0 })
      size = 0
    }

    return new _FileSystemWritableFileStream({
      async write (chunk) {
        const isPlainObject = chunk?.constructor === Object

        if (isPlainObject) {
          chunk = { ...chunk }
        } else {
          chunk = { type: 'write', data: chunk, position }
        }

        if (chunk.type === 'write') {
          if (!('data' in chunk)) {
            await send({ type: 'close' })
            throw new DOMException(...SYNTAX('write requires a data argument'))
          }

          chunk.position ??= position

          if (typeof chunk.data === 'string') {
            chunk.data = textEncoder.encode(chunk.data)
          } else if (chunk.data instanceof ArrayBuffer) {
            chunk.data = new Uint8Array(chunk.data)
          } else if (!(chunk.data instanceof Uint8Array) && ArrayBuffer.isView(chunk.data)) {
            chunk.data = new Uint8Array(chunk.data.buffer, chunk.data.byteOffset, chunk.data.byteLength)
          } else if (!(chunk.data instanceof Uint8Array)) {
            const ab = await new Response(chunk.data).arrayBuffer()
            chunk.data = new Uint8Array(ab)
          }

          if (Number.isInteger(chunk.position) && chunk.position >= 0) {
            position = chunk.position
          }
          position += chunk.data.byteLength
          size += chunk.data.byteLength
        } else if (chunk.type === 'seek') {
          if (Number.isInteger(chunk.position) && chunk.position >= 0) {
            if (size < chunk.position) {
              throw new DOMException(...INVALID)
            }
            position = chunk.position
            return // Don't need to enqueue seek...
          } else {
            await send({ type: 'close' })
            throw new DOMException(...SYNTAX('seek requires a position argument'))
          }
        } else if (chunk.type === 'truncate') {
          if (Number.isInteger(chunk.size) && chunk.size >= 0) {
            size = chunk.size
            if (position > size) { position = size }
          } else {
            await send({ type: 'close' })
            throw new DOMException(...SYNTAX('truncate requires a size argument'))
          }
        }

        await send(chunk)
      },
      async close () {
        await send({ type: 'close' })
        worker.terminate()
      },
      async abort (reason) {
        await send({ type: 'abort', reason })
        worker.terminate()
      }
    })
  }

  const orig = FileSystemDirectoryHandle.prototype.getFileHandle
  FileSystemDirectoryHandle.prototype.getFileHandle = async function (...args) {
    const handle = await orig.call(this, ...args)
    wm.set(handle, this)
    return handle
  }
}

;// ./node_modules/fsa-chunk-store/index.js



const RESERVED_FILENAME_REGEX = filenameReservedRegex()

// this can be bad when multiple instances of this app are running
if (globalThis.navigator?.storage?.getDirectory) {
  navigator.storage.getDirectory().then(storageDir => {
    storageDir.removeEntry('chunks', { recursive: true }).catch(() => {})
  })
}

const fsa_chunk_store_noop = (_, __) => {}
const err = (cb = fsa_chunk_store_noop, err) => queueMicrotask(() => cb(new Error(err)))
class FSAChunkStore {
  name = ''

  chunks = [] // individual chunks, required for reads :/
  chunkMap = [] // full files
  directoryMap = {}
  files

  rootDirPromise
  storageDirPromise
  chunksDirPromise

  closing = false
  closed = false

  /**
   * @param {number} chunkLength
   * @param {{ name?: string, rootDir?: Promise<FileSystemDirectoryHandle>, length?: number, files?: {path: string, length: number, offset?: number, handle?: Promise<FileSystemFileHandle>, blob?: Promise<Blob>, stream?: Promise<FileSystemWritableFileStream> }[] }} [opts]
   */
  constructor (chunkLength, opts = {}) {
    this.chunkLength = Number(chunkLength)

    if (!this.chunkLength) {
      throw new Error('First argument must be a chunk length')
    }

    if (!globalThis.navigator?.storage?.getDirectory) {
      throw new Error('FSA API is not supported')
    }

    this.closed = false

    this.name = opts.name || crypto.randomUUID()

    this.rootDirPromise = opts.rootDir || navigator.storage.getDirectory()
    this.storageDirPromise = (async () => {
      const rootDir = await this.rootDirPromise
      return rootDir.getDirectoryHandle(this.name, { create: true })
    })()
    // if there are no files the chunks are the storage
    this.chunksDirPromise = this.storageDirPromise

    if (opts.files && opts.rootDir) {
      // if files exist, use throwaway, wipeable folder for chunks which are a cache
      this.chunksDirPromise = this._getChunksDirHandle()
      this.files = opts.files.map((file, i, files) => {
        if (file.path == null) throw new Error('File is missing `path` property')
        if (file.length == null) throw new Error('File is missing `length` property')
        if (file.offset == null) {
          if (i === 0) {
            file.offset = 0
          } else {
            const prevFile = files[i - 1]
            file.offset = prevFile.offset + prevFile.length
          }
        }

        // file handles
        if (file.handle == null) file.handle = this._createFileHandle({ path: file.path })
        file.blob = this._createBlobReference(file.handle)

        // file chunkMap
        const fileStart = file.offset
        const fileEnd = file.offset + file.length

        const firstChunk = Math.floor(fileStart / this.chunkLength)
        const lastChunk = Math.floor((fileEnd - 1) / this.chunkLength)

        for (let i = firstChunk; i <= lastChunk; ++i) {
          const chunkStart = i * this.chunkLength
          const chunkEnd = chunkStart + this.chunkLength

          const from = (fileStart < chunkStart) ? 0 : fileStart - chunkStart
          const to = (fileEnd > chunkEnd) ? this.chunkLength : fileEnd - chunkStart
          const offset = (fileStart > chunkStart) ? 0 : chunkStart - fileStart

          if (!this.chunkMap[i]) this.chunkMap[i] = []

          this.chunkMap[i].push({ from, to, offset, file })
        }

        return file
      })

      // close streams is page is frozen/unloaded, they will re-open if the user returns via BFC
      window.addEventListener('pagehide', () => this.cleanup())

      this.length = this.files.reduce((sum, file) => sum + file.length, 0)
      if (opts.length != null && opts.length !== this.length) {
        throw new Error('total `files` length is not equal to explicit `length` option')
      }
    } else {
      this.length = Number(opts.length) || Infinity
    }

    if (this.length !== Infinity) {
      this.lastChunkLength = this.length % this.chunkLength || this.chunkLength
      this.lastChunkIndex = Math.ceil(this.length / this.chunkLength) - 1
    }
  }

  async _getChunkHandle (index) {
    let chunk = this.chunks[index]
    if (!chunk) {
      const storageDir = await this.chunksDirPromise
      this.chunks[index] = chunk = await storageDir.getFileHandle(index, { create: true })
    }
    return chunk
  }

  /**
   * @param {{path: string}} opts
   */
  async _createFileHandle (opts) {
    const fileName = opts.path.slice(opts.path.lastIndexOf('/') + 1)
    return (await this._getDirectoryHandle(opts)).getFileHandle(fileName.replace(RESERVED_FILENAME_REGEX, ''), { create: true })
  }

  async _createBlobReference (handle) {
    return (await handle).getFile()
  }

  /**
   * recursive, equiv of cd and mkdirp
   * @param {{path: string}} opts
   * @returns {Promise<FileSystemDirectoryHandle>}
   */
  async _getDirectoryHandle (opts) {
    const lastIndex = opts.path.lastIndexOf('/')
    if (lastIndex === -1 || lastIndex === 0) return this.storageDirPromise
    const path = opts.path = opts.path.slice(0, lastIndex)
    if (!this.directoryMap[path]) {
      this.directoryMap[path] = (async () => {
        const parent = await this._getDirectoryHandle(opts)
        return parent.getDirectoryHandle(path.slice(path.lastIndexOf('/') + 1), { create: true })
      })()
    }
    return this.directoryMap[path]
  }

  async _getChunksDirHandle () {
    const storageDir = await navigator.storage.getDirectory()
    const chunksDir = await storageDir.getDirectoryHandle('chunks', { create: true })
    return chunksDir.getDirectoryHandle(this.name, { create: true })
  }

  async put (index, buf, cb = fsa_chunk_store_noop) {
    try {
      await this._put(index, buf)
      cb(null)
      return null
    } catch (e) {
      queueMicrotask(() => cb(e))
      return e
    }
  }

  /**
   * @param {Promise<FileSystemFileHandle>} handle
   */
  async getStreamForHandle (handle) {
    return (await handle).createWritable({ keepExistingData: true })
  }

  // wrapped in prep for callback drop
  async _put (index, buf) {
    if (this.closed) throw new Error('Storage is closed')

    const isLastChunk = index === this.lastChunkIndex
    if (isLastChunk && buf.length !== this.lastChunkLength) throw new Error(`Last chunk length must be ${this.lastChunkLength}`)
    if (!isLastChunk && buf.length !== this.chunkLength) throw new Error(`Chunk length must be ${this.chunkLength}`)

    const chunkWrite = (async () => {
      const chunk = await this._getChunkHandle(index)
      const stream = await chunk.createWritable({ keepExistingData: false })
      await stream.write(buf)
      await stream.close()
    })()

    if (!this.files) return chunkWrite

    const targets = this.chunkMap[index]
    if (!targets) throw new Error('No files matching the request range')
    const promises = targets.map(async ({ file, offset, from, to }) => {
      if (!file.stream) {
        file.stream = this.getStreamForHandle(file.handle)
      }
      await (await file.stream).write({ type: 'write', position: offset, data: buf.slice(from, to) })
    })
    promises.push(chunkWrite)
    await Promise.all(promises)
  }

  async get (index, opts, cb = fsa_chunk_store_noop) {
    if (opts == null) opts = {}
    try {
      const data = await this._get(index, opts)
      cb(null, data)
      return data
    } catch (e) {
      cb(e)
      return e
    }
  }

  // wrapped in prep for callback drop
  async _get (index, opts) {
    if (typeof opts === 'function') return this.get(index, undefined, opts)
    if (this.closed) throw new Error('Storage is closed')

    const isLastChunk = index === this.lastChunkIndex
    const chunkLength = isLastChunk ? /** @type {number} */(this.lastChunkLength) : this.chunkLength

    const rangeFrom = opts.offset || 0
    const rangeTo = opts.length ? rangeFrom + opts.length : chunkLength
    const len = opts.length || chunkLength - rangeFrom

    if (rangeFrom < 0 || rangeFrom < 0 || rangeTo > chunkLength) throw new Error('Invalid offset and/or length')

    if (rangeFrom === rangeTo) return new Uint8Array(0)

    if (!this.files || this.chunks[index]) {
      const chunk = await this._getChunkHandle(index)
      let file = await chunk.getFile()
      if (rangeFrom !== 0 || len !== chunkLength) {
        file = file.slice(rangeFrom, len + rangeFrom)
      }
      const buf = await file.arrayBuffer()

      if (buf.byteLength === 0) throw new Error(`Index ${index} does not exist`)
      return new Uint8Array(buf)
    }

    // if chunk was GC'ed
    let targets = this.chunkMap[index]
    if (!targets) throw new Error('No files matching the request range')
    if (opts) {
      targets = targets.filter(({ from, to }) => to > rangeFrom && from < rangeTo)
      if (targets.length === 0) throw new Error('No files matching the request range')
    }

    const promises = targets.map(async ({ from, to, offset, file }) => {
      if (opts) {
        if (to > rangeTo) to = rangeTo
        if (from < rangeFrom) {
          offset += (rangeFrom - from)
          from = rangeFrom
        }
      }
      const blob = await file.blob
      return blob.slice(offset, offset + to - from)
    })
    const values = await Promise.all(promises)
    const buf = values.length === 1 ? await values[0].arrayBuffer() : await new Blob(values).arrayBuffer()
    if (buf.byteLength === 0) throw new Error(`Index ${index} does not exist`)
    return new Uint8Array(buf)
  }

  async close (cb = fsa_chunk_store_noop) {
    if (this.closing) return err(cb, 'Storage is closed')

    this.closing = true
    this.chunkMap = undefined
    this.directoryMap = undefined
    if (this.files) await this.cleanup()
    this.closed = true
    queueMicrotask(() => cb(null))
  }

  async cleanup () {
    if (this.closed || !this.files) return
    const streams = []
    for (const file of this.files) {
      if (file.stream) {
        streams.push(file.stream.then(stream => stream.close()))
        file.stream = undefined
      }
    }
    const clearChunks = (async () => {
      const storageDir = await this.chunksDirPromise
      this.chunks = []
      // .remove() doesnt exist on firefox or safari
      for await (const key of storageDir.keys()) {
        await storageDir.removeEntry(key, { recursive: true })
      }
      this.chunksDirPromise = this._getChunksDirHandle()
      await this.chunksDirPromise
    })()
    await Promise.all(streams)
    for (const file of this.files) {
      file.blob = this._createBlobReference(file.handle)
    }
    await clearChunks
  }

  async destroy (cb = fsa_chunk_store_noop) {
    this.close(async (err) => {
      if (err) return cb(err)
      try {
        const rootDir = await this.rootDirPromise
        // .remove() doesnt exist on firefox or safari
        await rootDir.removeEntry(this.name, { recursive: true })
      } catch (err) {
        return cb(err)
      }
      cb(null)
    })
  }
}

// EXTERNAL MODULE: ./node_modules/immediate-chunk-store/index.js
var immediate_chunk_store = __webpack_require__(3714);
// EXTERNAL MODULE: ./node_modules/unordered-array-remove/index.js
var unordered_array_remove = __webpack_require__(1314);
;// ./node_modules/lt_donthave/index.js
/*! lt_donthave. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */




const lt_donthave_debug = src_browser('lt_donthave')

/* harmony default export */ const lt_donthave = (() => {
  class ltDontHave extends events.EventEmitter {
    constructor (wire) {
      super()

      this._peerSupports = false
      this._wire = wire
    }

    onExtendedHandshake () {
      this._peerSupports = true
    }

    onMessage (buf) {
      let index
      try {
        const view = new DataView(buf.buffer)
        index = view.getUint32(0)
      } catch (err) {
        // drop invalid messages
        return
      }

      if (!this._wire.peerPieces.get(index)) return
      lt_donthave_debug('got donthave %d', index)
      this._wire.peerPieces.set(index, false)

      this.emit('donthave', index)
      this._failRequests(index)
    }

    donthave (index) {
      if (!this._peerSupports) return

      lt_donthave_debug('donthave %d', index)
      const buf = new Uint8Array(4)
      const view = new DataView(buf.buffer)
      view.setUint32(0, index)

      this._wire.extended('lt_donthave', buf)
    }

    _failRequests (index) {
      const requests = this._wire.requests
      for (let i = 0; i < requests.length; i++) {
        const req = requests[i]
        if (req.piece === index) {
          unordered_array_remove(requests, i)
          i -= 1 // Check the new value at the same slot
          this._wire._callback(req, new Error('peer sent donthave'), null)
        }
      }
    }
  }

  // Name of the bittorrent-protocol extension
  ltDontHave.prototype.name = 'lt_donthave'

  return ltDontHave
});

// EXTERNAL MODULE: ./node_modules/memory-chunk-store/index.js
var memory_chunk_store = __webpack_require__(4862);
// EXTERNAL MODULE: ./node_modules/run-parallel-limit/index.js
var run_parallel_limit = __webpack_require__(5372);
;// ./node_modules/torrent-piece/index.js
/*! torrent-piece. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */


const BLOCK_LENGTH = 1 << 14

class Piece {
  constructor (length) {
    this.length = length
    this.missing = length
    this.sources = null

    this._chunks = Math.ceil(length / BLOCK_LENGTH)
    this._remainder = (length % BLOCK_LENGTH) || BLOCK_LENGTH
    this._buffered = 0
    this._buffer = null
    this._cancellations = null
    this._reservations = 0
    this._flushed = false
  }

  chunkLength (i) {
    return i === this._chunks - 1 ? this._remainder : BLOCK_LENGTH
  }

  chunkLengthRemaining (i) {
    return this.length - (i * BLOCK_LENGTH)
  }

  chunkOffset (i) {
    return i * BLOCK_LENGTH
  }

  reserve () {
    if (!this.init()) return -1
    if (this._cancellations.length) return this._cancellations.pop()
    if (this._reservations < this._chunks) return this._reservations++
    return -1
  }

  reserveRemaining () {
    if (!this.init()) return -1
    if (this._cancellations.length || this._reservations < this._chunks) {
      let min = this._reservations
      while (this._cancellations.length) {
        min = Math.min(min, this._cancellations.pop())
      }
      this._reservations = this._chunks
      return min
    }
    return -1
  }

  cancel (i) {
    if (!this.init()) return
    this._cancellations.push(i)
  }

  cancelRemaining (i) {
    if (!this.init()) return
    this._reservations = i
  }

  get (i) {
    if (!this.init()) return null
    return this._buffer[i]
  }

  set (i, data, source) {
    if (!this.init()) return false
    const len = data.length
    const blocks = Math.ceil(len / BLOCK_LENGTH)
    for (let j = 0; j < blocks; j++) {
      if (!this._buffer[i + j]) {
        const offset = j * BLOCK_LENGTH
        const splitData = data.subarray(offset, offset + BLOCK_LENGTH)
        this._buffered++
        this._buffer[i + j] = splitData
        this.missing -= splitData.length
        if (!this.sources.includes(source)) {
          this.sources.push(source)
        }
      }
    }
    return this._buffered === this._chunks
  }

  flush () {
    if (!this._buffer || this._chunks !== this._buffered) return null
    const buffer = (0,browser/* concat */.xW)(this._buffer, this.length)
    this._buffer = null
    this._cancellations = null
    this.sources = null
    this._flushed = true
    return buffer
  }

  init () {
    if (this._flushed) return false
    if (this._buffer) return true
    this._buffer = new Array(this._chunks)
    this._cancellations = []
    this.sources = []
    return true
  }
}

Piece.BLOCK_LENGTH = BLOCK_LENGTH

// EXTERNAL MODULE: ./node_modules/random-iterate/index.js
var random_iterate = __webpack_require__(7373);
;// ./node_modules/ut_metadata/index.js
/*! ut_metadata. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */






const ut_metadata_debug = src_browser('ut_metadata')

const MAX_METADATA_SIZE = 1E7 // 10 MB
const BITFIELD_GROW = 1E3
const PIECE_LENGTH = 1 << 14 // 16 KiB

/* harmony default export */ const ut_metadata = (metadata => {
  class utMetadata extends events.EventEmitter {
    constructor (wire) {
      super()

      this._wire = wire

      this._fetching = false
      this._metadataComplete = false
      this._metadataSize = null
      // how many reject messages to tolerate before quitting
      this._remainingRejects = null

      // The largest torrent file that I know of is ~1-2MB, which is ~100
      // pieces. Therefore, cap the bitfield to 10x that (1000 pieces) so a
      // malicious peer can't make it grow to fill all memory.
      this._bitfield = new esm/* default */.A(0, { grow: BITFIELD_GROW })

      if (ArrayBuffer.isView(metadata)) {
        this.setMetadata(metadata)
      }
    }

    onHandshake (infoHash, peerId, extensions) {
      this._infoHash = infoHash
    }

    onExtendedHandshake (handshake) {
      if (!handshake.m || !handshake.m.ut_metadata) {
        return this.emit('warning', new Error('Peer does not support ut_metadata'))
      }
      if (!handshake.metadata_size) {
        return this.emit('warning', new Error('Peer does not have metadata'))
      }
      if (typeof handshake.metadata_size !== 'number' ||
          MAX_METADATA_SIZE < handshake.metadata_size ||
          handshake.metadata_size <= 0) {
        return this.emit('warning', new Error('Peer gave invalid metadata size'))
      }

      this._metadataSize = handshake.metadata_size
      this._numPieces = Math.ceil(this._metadataSize / PIECE_LENGTH)
      this._remainingRejects = this._numPieces * 2

      this._requestPieces()
    }

    onMessage (buf) {
      let dict
      let trailer
      try {
        const str = (0,browser/* arr2text */.dU)(buf)
        const trailerIndex = str.indexOf('ee') + 2
        dict = bencode/* default */.A.decode(str.substring(0, trailerIndex))
        trailer = buf.slice(trailerIndex)
      } catch (err) {
        // drop invalid messages
        return
      }

      switch (dict.msg_type) {
        case 0:
          // ut_metadata request (from peer)
          // example: { 'msg_type': 0, 'piece': 0 }
          this._onRequest(dict.piece)
          break
        case 1:
          // ut_metadata data (in response to our request)
          // example: { 'msg_type': 1, 'piece': 0, 'total_size': 3425 }
          this._onData(dict.piece, trailer, dict.total_size)
          break
        case 2:
          // ut_metadata reject (peer doesn't have piece we requested)
          // { 'msg_type': 2, 'piece': 0 }
          this._onReject(dict.piece)
          break
      }
    }

    /**
     * Ask the peer to send metadata.
     * @public
     */
    fetch () {
      if (this._metadataComplete) {
        return
      }
      this._fetching = true
      if (this._metadataSize) {
        this._requestPieces()
      }
    }

    /**
     * Stop asking the peer to send metadata.
     * @public
     */
    cancel () {
      this._fetching = false
    }

    async setMetadata (metadata) {
      if (this._metadataComplete) return true
      ut_metadata_debug('set metadata')

      // if full torrent dictionary was passed in, pull out just `info` key
      try {
        const info = bencode/* default */.A.decode(metadata).info
        if (info) {
          metadata = bencode/* default */.A.encode(info)
        }
      } catch (err) {}

      // check hash
      if (this._infoHash && this._infoHash !== await (0,browser/* hash */.tW)(metadata, 'hex')) {
        return false
      }

      this.cancel()

      this.metadata = metadata
      this._metadataComplete = true
      this._metadataSize = this.metadata.length
      this._wire.extendedHandshake.metadata_size = this._metadataSize

      this.emit('metadata', bencode/* default */.A.encode({
        info: bencode/* default */.A.decode(this.metadata)
      }))

      return true
    }

    _send (dict, trailer) {
      let buf = bencode/* default */.A.encode(dict)
      if (ArrayBuffer.isView(trailer)) {
        buf = (0,browser/* concat */.xW)([buf, trailer])
      }
      this._wire.extended('ut_metadata', buf)
    }

    _request (piece) {
      this._send({ msg_type: 0, piece })
    }

    _data (piece, buf, totalSize) {
      const msg = { msg_type: 1, piece }
      if (typeof totalSize === 'number') {
        msg.total_size = totalSize
      }
      this._send(msg, buf)
    }

    _reject (piece) {
      this._send({ msg_type: 2, piece })
    }

    _onRequest (piece) {
      if (!this._metadataComplete) {
        this._reject(piece)
        return
      }
      const start = piece * PIECE_LENGTH
      let end = start + PIECE_LENGTH
      if (end > this._metadataSize) {
        end = this._metadataSize
      }
      const buf = this.metadata.slice(start, end)
      this._data(piece, buf, this._metadataSize)
    }

    _onData (piece, buf, totalSize) {
      if (buf.length > PIECE_LENGTH || !this._fetching) {
        return
      }
      this.metadata.set(buf, piece * PIECE_LENGTH)
      this._bitfield.set(piece)
      this._checkDone()
    }

    _onReject (piece) {
      if (this._remainingRejects > 0 && this._fetching) {
        // If we haven't been rejected too much,
        // then try to request the piece again
        this._request(piece)
        this._remainingRejects -= 1
      } else {
        this.emit('warning', new Error('Peer sent "reject" too much'))
      }
    }

    _requestPieces () {
      if (!this._fetching) return
      this.metadata = new Uint8Array(this._metadataSize)
      for (let piece = 0; piece < this._numPieces; piece++) {
        this._request(piece)
      }
    }

    async _checkDone () {
      let done = true
      for (let piece = 0; piece < this._numPieces; piece++) {
        if (!this._bitfield.get(piece)) {
          done = false
          break
        }
      }
      if (!done) return

      // attempt to set metadata -- may fail sha1 check
      const success = await this.setMetadata(this.metadata)

      if (!success) {
        this._failedMetadata()
      }
    }

    _failedMetadata () {
      // reset bitfield & try again
      this._bitfield = new esm/* default */.A(0, { grow: BITFIELD_GROW })
      this._remainingRejects -= this._numPieces
      if (this._remainingRejects > 0) {
        this._requestPieces()
      } else {
        this.emit('warning', new Error('Peer sent invalid metadata'))
      }
    }
  }

  // Name of the bittorrent-protocol extension
  utMetadata.prototype.name = 'ut_metadata'

  return utMetadata
});

// EXTERNAL MODULE: ut_pex (ignored)
var ut_pex_ignored_ = __webpack_require__(8878);
// EXTERNAL MODULE: ./node_modules/mime/lite.js
var mime_lite = __webpack_require__(1133);
;// ./lib/file-iterator.js



const file_iterator_debug = src_browser('webtorrent:file-iterator')

/**
 * Async iterator of a torrent file
 *
 * @param {File} file
 * @param {Object} opts
 * @param {number} opts.start iterator slice of file, starting from this byte (inclusive)
 * @param {number} opts.end iterator slice of file, ending with this byte (inclusive)
 * @implements {AsyncIterator<Uint8Array>}
 */
class FileIterator extends events {
  constructor (file, { start, end }) {
    super()

    this._torrent = file._torrent

    this._pieceLength = file._torrent.pieceLength

    this._startPiece = (start + file.offset) / this._pieceLength | 0
    this._endPiece = (end + file.offset) / this._pieceLength | 0

    this._piece = this._startPiece
    this._offset = (start + file.offset) - (this._startPiece * this._pieceLength)

    this._missing = end - start + 1
    this._criticalLength = Math.min((1024 * 1024 / this._pieceLength) | 0, 2)

    this._torrent._select(this._startPiece, this._endPiece, 1, null, true)
    this.destroyed = false
  }

  [Symbol.asyncIterator] () {
    return this
  }

  next () {
    return new Promise((resolve, reject) => {
      if (this._missing === 0 || this.destroyed) {
        resolve({ done: true })
        return this.destroy()
      }
      const pump = (index, opts) => {
        if (!this._torrent.bitfield.get(index)) {
          const listener = i => {
            if (i === index || this.destroyed) {
              this._torrent.removeListener('verified', listener)
              if (i === index) {
                pump(index, opts)
              } else {
                resolve({ done: true })
              }
            }
          }

          this._torrent.on('verified', listener)
          return this._torrent.critical(index, index + this._criticalLength)
        }

        if (this.destroyed) return resolve({ done: true })

        this._torrent.store.get(index, opts, (err, buffer) => {
          if (this.destroyed) return resolve({ done: true }) // prevent hanging
          file_iterator_debug('read %s and yielding (length %s) (err %s)', index, buffer?.length, err?.message)

          if (err) {
            this.destroy(undefined, err)
            return resolve({ done: true })
          }

          // prevent re-wrapping outside of promise
          resolve({ value: buffer, done: false })
        })
      }

      const length = Math.min(this._missing, this._pieceLength - this._offset)

      pump(this._piece++, { length, offset: this._offset })
      this._missing -= length
      this._offset = 0
    })
  }

  /**
   * @returns {Promise<IteratorResult<Uint8Array>>}
   */
  async return () {
    this.destroy()
    return { done: true, value: undefined }
  }

  /**
   * @param {Error} err
   * @returns {Promise<IteratorResult<Uint8Array>>}
   */
  async throw (err) {
    throw err
  }

  destroy (cb = _ => {}, err) {
    if (this.destroyed) return
    this.destroyed = true
    if (!this._torrent.destroyed) {
      this._torrent._deselect(this._startPiece, this._endPiece, true)
    }
    this.emit('return')
    cb(err)
  }
}

;// ./lib/file.js






class file_File extends events {
  constructor (torrent, file) {
    super()

    this._torrent = torrent
    this._destroyed = false
    this._fileStreams = new Set()
    this._iterators = new Set()

    this.name = file.name
    this.path = file.path
    this.length = file.length
    this.size = file.length
    this.type = mime_lite.getType(this.name) || 'application/octet-stream'
    this.offset = file.offset

    this.done = false

    const start = file.offset
    const end = start + file.length - 1

    this._startPiece = start / this._torrent.pieceLength | 0
    this._endPiece = end / this._torrent.pieceLength | 0

    if (this.length === 0) {
      this.done = true
      this.emit('done')
    }

    this._client = torrent.client
  }

  get downloaded () {
    if (this._destroyed || !this._torrent.bitfield) return 0

    const { pieces, bitfield, pieceLength, lastPieceLength } = this._torrent
    const { _startPiece: start, _endPiece: end } = this

    const getPieceLength = (pieceIndex) => (
      pieceIndex === pieces.length - 1 ? lastPieceLength : pieceLength
    )

    const getPieceDownloaded = (pieceIndex) => {
      const len = pieceIndex === pieces.length - 1 ? lastPieceLength : pieceLength
      if (bitfield.get(pieceIndex)) {
        // verified data
        return len
      } else {
        // "in progress" data
        return len - pieces[pieceIndex].missing
      }
    }

    let downloaded = 0
    for (let index = start; index <= end; index += 1) {
      const pieceDownloaded = getPieceDownloaded(index)
      downloaded += pieceDownloaded

      if (index === start) {
        // First piece may have an offset, e.g. irrelevant bytes from the end of
        // the previous file
        const irrelevantFirstPieceBytes = this.offset % pieceLength
        downloaded -= Math.min(irrelevantFirstPieceBytes, pieceDownloaded)
      }

      if (index === end) {
        // Last piece may have an offset, e.g. irrelevant bytes from the start
        // of the next file
        const irrelevantLastPieceBytes = getPieceLength(end) - (this.offset + this.length) % pieceLength
        downloaded -= Math.min(irrelevantLastPieceBytes, pieceDownloaded)
      }
    }

    return downloaded
  }

  get progress () {
    return this.length ? this.downloaded / this.length : 0
  }

  select (priority) {
    if (this.length === 0) return
    this._torrent.select(this._startPiece, this._endPiece, priority)
  }

  deselect () {
    if (this.length === 0) return
    this._torrent.deselect(this._startPiece, this._endPiece)
  }

  [Symbol.asyncIterator] (opts = {}) {
    if (this.length === 0 || this._destroyed) return (async function * empty () {})()

    const { start = 0 } = opts ?? {}
    const end = (opts?.end && opts.end < this.length)
      ? opts.end
      : this.length - 1

    if (this.done) {
      return chunkStoreRead(this._torrent.store, { offset: start + this.offset, length: end - start + 1 })
    }

    const iterator = new FileIterator(this, { start, end })
    this._iterators.add(iterator)
    iterator.once('return', () => {
      this._iterators.delete(iterator)
    })

    return iterator
  }

  createReadStream (opts) {
    if (this._destroyed) throw new Error('File is destroyed')
    const iterator = this[Symbol.asyncIterator](opts)
    const fileStream = streamx.Readable.from(iterator)

    this._fileStreams.add(fileStream)
    fileStream.once('close', () => {
      this._fileStreams.delete(fileStream)
    })

    return fileStream
  }

  async arrayBuffer (opts = {}) {
    if (this._destroyed) throw new Error('File is destroyed')
    const { start = 0 } = opts
    const end = (opts?.end && opts.end < this.length)
      ? opts.end
      : this.length - 1

    const data = new Uint8Array(end - start + 1)
    let offset = 0
    for await (const chunk of this[Symbol.asyncIterator]({ start, end })) {
      data.set(chunk, offset)
      offset += chunk.length
    }
    return data.buffer
  }

  async blob (opts) {
    if (this._destroyed) throw new Error('File is destroyed')
    return new Blob([await this.arrayBuffer(opts)], { type: this.type })
  }

  stream (opts) {
    if (this._destroyed) throw new Error('File is destroyed')
    let iterator
    return new ReadableStream({
      start: () => {
        iterator = this[Symbol.asyncIterator](opts)
      },
      async pull (controller) {
        const { value, done } = await iterator.next()
        if (done) {
          controller.close()
        } else {
          controller.enqueue(value)
        }
      },
      cancel () {
        iterator.return()
      }
    })
  }

  get streamURL () {
    if (!this._client._server) throw new Error('No server created')
    return `${this._client._server.pathname}/${this._torrent.infoHash}/${this.path}`
  }

  streamTo (elem) {
    elem.src = this.streamURL
    return elem
  }

  includes (piece) {
    return this._startPiece <= piece && this._endPiece >= piece
  }

  _destroy () {
    this._destroyed = true
    this._torrent = null

    for (const fileStream of this._fileStreams) {
      fileStream.destroy()
    }
    this._fileStreams.clear()
    for (const iterator of this._iterators) {
      iterator.destroy()
    }
    this._iterators.clear()
  }
}

// EXTERNAL MODULE: ./lib/peer.js
var lib_peer = __webpack_require__(5658);
;// ./lib/rarity-map.js
/**
 * Mapping of torrent pieces to their respective availability in the torrent swarm. Used
 * by the torrent manager for implementing the rarest piece first selection strategy.
 */
class RarityMap {
  constructor (torrent) {
    this._torrent = torrent
    this._numPieces = torrent.pieces.length
    this._pieces = new Array(this._numPieces)

    this._onWire = wire => {
      this.recalculate()
      this._initWire(wire)
    }
    this._onWireHave = index => {
      this._pieces[index] += 1
    }
    this._onWireBitfield = () => {
      this.recalculate()
    }

    this._torrent.wires.forEach(wire => {
      this._initWire(wire)
    })
    this._torrent.on('wire', this._onWire)
    this.recalculate()
  }

  /**
   * Get the index of the rarest piece. Optionally, pass a filter function to exclude
   * certain pieces (for instance, those that we already have).
   *
   * @param {function} pieceFilterFunc
   * @return {number} index of rarest piece, or -1
   */
  getRarestPiece (pieceFilterFunc) {
    let candidates = []
    let min = Infinity

    for (let i = 0; i < this._numPieces; ++i) {
      if (pieceFilterFunc && !pieceFilterFunc(i)) continue

      const availability = this._pieces[i]
      if (availability === min) {
        candidates.push(i)
      } else if (availability < min) {
        candidates = [i]
        min = availability
      }
    }

    if (candidates.length) {
      // if there are multiple pieces with the same availability, choose one randomly
      return candidates[Math.random() * candidates.length | 0]
    } else {
      return -1
    }
  }

  destroy () {
    this._torrent.removeListener('wire', this._onWire)
    this._torrent.wires.forEach(wire => {
      this._cleanupWireEvents(wire)
    })
    this._torrent = null
    this._pieces = null

    this._onWire = null
    this._onWireHave = null
    this._onWireBitfield = null
  }

  _initWire (wire) {
    wire._onClose = () => {
      this._cleanupWireEvents(wire)
      for (let i = 0; i < this._numPieces; ++i) {
        this._pieces[i] -= wire.peerPieces.get(i)
      }
    }

    wire.on('have', this._onWireHave)
    wire.on('bitfield', this._onWireBitfield)
    wire.once('close', wire._onClose)
  }

  /**
   * Recalculates piece availability across all peers in the torrent.
   */
  recalculate () {
    this._pieces.fill(0)

    for (const wire of this._torrent.wires) {
      for (let i = 0; i < this._numPieces; ++i) {
        this._pieces[i] += wire.peerPieces.get(i)
      }
    }
  }

  _cleanupWireEvents (wire) {
    wire.removeListener('have', this._onWireHave)
    wire.removeListener('bitfield', this._onWireBitfield)
    if (wire._onClose) wire.removeListener('close', wire._onClose)
    wire._onClose = null
  }
}

// EXTERNAL MODULE: ./utp.cjs (ignored)
var utp_ignored_ = __webpack_require__(4343);
// EXTERNAL MODULE: ./node_modules/bittorrent-protocol/index.js
var bittorrent_protocol = __webpack_require__(6458);
// EXTERNAL MODULE: ./version.cjs
var version = __webpack_require__(6819);
;// ./lib/webconn.js










const webconn_debug = src_browser('webtorrent:webconn')

const SOCKET_TIMEOUT = 60000
const RETRY_DELAY = 10000

/**
 * Converts requests for torrent blocks into http range requests.
 * @param {string} url web seed url
 * @param {Object} torrent
 */
class WebConn extends bittorrent_protocol/* default */.A {
  constructor (url, torrent) {
    super()

    this.url = url
    this.connId = url // Unique id to deduplicate web seeds
    this._torrent = torrent

    this._init(url)
  }

  _init (url) {
    this.setKeepAlive(true)

    this.use(lt_donthave())

    this.once('handshake', async (infoHash, peerId) => {
      const hex = await (0,browser/* hash */.tW)(url, 'hex') // Used as the peerId for this fake remote peer
      if (this.destroyed) return
      this.handshake(infoHash, hex)

      const numPieces = this._torrent.pieces.length
      const bitfield = new esm/* default */.A(numPieces)
      for (let i = 0; i <= numPieces; i++) {
        bitfield.set(i, true)
      }
      this.bitfield(bitfield)
    })

    this.once('interested', () => {
      webconn_debug('interested')
      this.unchoke()
    })

    this.on('uninterested', () => { webconn_debug('uninterested') })
    this.on('choke', () => { webconn_debug('choke') })
    this.on('unchoke', () => { webconn_debug('unchoke') })
    this.on('bitfield', () => { webconn_debug('bitfield') })
    this.lt_donthave.on('donthave', () => { webconn_debug('donthave') })

    this.on('request', (pieceIndex, offset, length, callback) => {
      webconn_debug('request pieceIndex=%d offset=%d length=%d', pieceIndex, offset, length)
      this.httpRequest(pieceIndex, offset, length, (err, data) => {
        if (err) {
          // Cancel all in progress requests for this piece
          this.lt_donthave.donthave(pieceIndex)

          // Wait a little while before saying the webseed has the failed piece again
          const retryTimeout = setTimeout(() => {
            if (this.destroyed) return

            this.have(pieceIndex)
          }, RETRY_DELAY)
          if (retryTimeout.unref) retryTimeout.unref()
        }

        callback(err, data)
      })
    })
  }

  async httpRequest (pieceIndex, offset, length, cb) {
    cb = once(cb)
    const pieceOffset = pieceIndex * this._torrent.pieceLength
    const rangeStart = pieceOffset + offset /* offset within whole torrent */
    const rangeEnd = rangeStart + length - 1

    // Web seed URL format:
    // For single-file torrents, make HTTP range requests directly to the web seed URL
    // For multi-file torrents, add the torrent folder and file name to the URL
    const files = this._torrent.files
    let requests
    if (files.length <= 1) {
      requests = [{
        url: this.url,
        start: rangeStart,
        end: rangeEnd
      }]
    } else {
      const requestedFiles = files.filter(file => file.offset <= rangeEnd && (file.offset + file.length) > rangeStart)
      if (requestedFiles.length < 1) {
        return cb(new Error('Could not find file corresponding to web seed range request'))
      }

      requests = requestedFiles.map(requestedFile => {
        const fileEnd = requestedFile.offset + requestedFile.length - 1
        const url = this.url +
          (this.url[this.url.length - 1] === '/' ? '' : '/') +
          requestedFile.path.replace(this._torrent.path, '')
        return {
          url,
          fileOffsetInRange: Math.max(requestedFile.offset - rangeStart, 0),
          start: Math.max(rangeStart - requestedFile.offset, 0),
          end: Math.min(fileEnd, rangeEnd - requestedFile.offset)
        }
      })
    }
    let chunks
    try {
      chunks = await Promise.all(requests.map(async ({ start, end, url }) => {
        webconn_debug(
          'Requesting url=%s pieceIndex=%d offset=%d length=%d start=%d end=%d',
          url, pieceIndex, offset, length, start, end
        )
        const res = await cross_fetch_ponyfill_browser(url, {
          cache: 'no-store',
          method: 'GET',
          headers: {
            'Cache-Control': 'no-store',
            'user-agent': `WebTorrent/${version} (https://webtorrent.io)`,
            range: `bytes=${start}-${end}`
          },
          signal: AbortSignal.timeout(SOCKET_TIMEOUT)
        })
        if (!res.ok) throw new Error(`Unexpected HTTP status code ${res.status}`)
        const data = new Uint8Array(await res.arrayBuffer())

        webconn_debug('Got data of length %d', data.length)

        return data
      }))
    } catch (e) {
      return cb(e)
    }

    cb(null, (0,browser/* concat */.xW)(chunks))
  }

  destroy () {
    super.destroy()
    this._torrent = null
  }
}

;// ./lib/selections.js
/**
 * @typedef {Object} MinimalSelectionItem
 * @property {number} from
 * @property {number} to
 */

/** A selection of pieces to download.
 * @typedef {MinimalSelectionItem & {
 *  offset: number,
 *  priority?: number,
 *  notify?: function
 *  remove?: function,
 *  isStreamSelection?: boolean
 * }} SelectionItem
 */

/**
 * @typedef {MinimalSelectionItem & {notify: function}} NotificationItem
 */

class Selections {
  /** @type {Array<SelectionItem>} */
  _items = []

  /**
   * @param {MinimalSelectionItem & {isStreamSelection?: boolean}} item Interval to be removed from the selection
   */
  remove (item) {
    for (let i = 0; i < this._items.length; i++) {
      const existing = this._items[i]
      // we only remove stream selections when the `isStreamSelection` flag match, cast to boolean using !
      if (!existing.isStreamSelection !== !item.isStreamSelection) continue

      if (existing.isStreamSelection) {
        // If both are stream selections and they match, then we remove the first matching item, then we break the loop
        if (existing.from === item.from && existing.to === item.to) {
          this._items.splice(i, 1)
          // for stream selections, we only remove one item at a time
          // ergo we break the loop after removing the first matching item
          // stream selections are non-unique, so this is in a way a count
          break
        }
      } else {
        if (isLowerIntersecting(item, existing)) {
          existing.to = Math.max(item.from - 1, 0)
        } else if (isUpperIntersecting(item, existing)) {
          existing.from = item.to + 1
        } else if (isInsideExisting(item, existing)) {
          const replacingItems = []
          const existingStart = { ...existing, to: Math.max(item.from - 1, 0) }
          if (existingStart.to - existingStart.from >= 0 && item.from !== 0) replacingItems.push(existingStart)
          const existingEnd = { ...existing, from: item.to + 1 }
          if (existingEnd.to - existingEnd.from >= 0) replacingItems.push(existingEnd)
          this._items.splice(i, 1, ...replacingItems)
          i = i - 1 + replacingItems.length // decrement i to offset splice
        } else if (isCoveringExisting(item, existing)) {
          this._items.splice(i, 1)
          i--
        }
      }
    }
  }

  /**
   * Merges the priority and notify functions of two selection items.
   * @param {SelectionItem} newItem
   * @param {SelectionItem} existing
   */
  _mergePriorityAndNotify (newItem, existing) {
    if ((existing.priority ?? 0) > (newItem.priority ?? 0)) {
      newItem.priority = existing.priority
    }

    if (newItem.notify && existing.notify) {
      const oldNotify = newItem.notify
      newItem.notify = () => {
        oldNotify()
        existing.notify?.()
      }
    } else {
      newItem.notify = existing.notify || newItem.notify
    }
  }

  concatenate (newItem) {
    for (let i = 0; i < this._items.length; i++) {
      const existing = this._items[i]

      if (!existing.isStreamSelection) {
        if (isLowerIntersecting(newItem, existing)) {
          newItem.from = existing.from
        } else if (isUpperIntersecting(newItem, existing)) {
          newItem.to = existing.to
        } else if (isInsideExisting(newItem, existing)) {
          newItem.from = existing.from
          newItem.to = existing.to
        } else if (isCoveringExisting(newItem, existing)) {
          continue
        } else {
          continue
        }
        this._mergePriorityAndNotify(newItem, existing)
      }
    }

    this.remove(newItem)
  }

  /**
   * @param {SelectionItem & NotificationItem} newItem
   */
  insert (newItem) {
    if (newItem.from > newItem.to) {
      throw new Error('Invalid interval')
    }
    if (!newItem.isStreamSelection) this.concatenate(newItem)
    this._items.push(newItem)
  }

  /** @param {(a: SelectionItem, b: SelectionItem) => number} sortFn */
  sort (sortFn = (a, b) => a.from - b.from) {
    this._items.sort(sortFn)
  }

  get length () {
    return this._items.length
  }

  /**  @param {number} index */
  get (index) {
    return this._items[index]
  }

  swap (i, j) {
    const temp = this._items[i]
    this._items[i] = this._items[j]
    this._items[j] = temp
  }

  clear () {
    this._items.length = 0
  }

  /** @returns {Generator<SelectionItem & {remove: function}>} */
  * [Symbol.iterator] () {
    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i]

      item.remove = () => {
        this._items.splice(i, 1)
        i--
      }
      yield item
      delete item.remove
    }
  }
}

/**
 * Examples:
 * existing: 1-10 | 1-10
 * new_item: 8-12 | 10-15
 * @param {MinimalSelectionItem} newItem
 * @param {MinimalSelectionItem} existing
 * @returns {boolean} returns true if the new item's lower end is intersecting with the existing item
 */
function isLowerIntersecting (newItem, existing) {
  return (newItem.from <= existing.to + 1) && (newItem.from > existing.from) && (newItem.to > existing.to)
}

/**
 * Examples:
 * existing: 20-25 | 20-25
 * new_item: 15-22 | 15-20
 * @param {MinimalSelectionItem} newItem
 * @param {MinimalSelectionItem} existing
 * @returns {boolean} returns true if the new item's upper end is intersecting with the existing item
 */
function isUpperIntersecting (newItem, existing) {
  return (newItem.to >= existing.from - 1) && (newItem.to < existing.to) && (newItem.from < existing.from)
}

/**
 * Examples:
 * existing: 10-20 | 10-20 | 10-20
 * new_item: 12-15 | 20-20 | 15-20
 * @param {MinimalSelectionItem} newItem
 * @param {MinimalSelectionItem} existing
 * @returns {boolean} returns true if the new item is completely inside the existing item
 */
function isInsideExisting (newItem, existing) {
  const existingIntervalSize = existing.to - existing.from
  const newItemIntervalSize = newItem.to - newItem.from
  return newItem.from >= existing.from && newItem.to <= existing.to && (newItemIntervalSize < existingIntervalSize)
}

/**
 * Examples:
 * existing: 10-20 | 10-20 | 10-20
 * new_item: 10-21 | 09-20 | 10-20
 * @param {MinimalSelectionItem} newItem
 * @param {MinimalSelectionItem} existing
 * @returns {boolean} returns true if the new item is covering the existing item
 */
function isCoveringExisting (newItem, existing) {
  return newItem.from <= existing.from && newItem.to >= existing.to
}

const isIntersecting = (newItem, existing) => () =>
  isLowerIntersecting(newItem, existing) ||
    isUpperIntersecting(newItem, existing) ||
    isInsideExisting(newItem, existing) ||
    isCoveringExisting(newItem, existing)

;// ./lib/torrent.js
/* provided dependency */ var torrent_process = __webpack_require__(717);


 // browser exclude
 // browser exclude








 // browser: `fsa-chunk-store`














 // browser exclude




 // browser exclude





// The following JSDoc comments are global types that can be used across the project

/**
 * This callback is called with an optional error, if the error is a falsy value the operation was executed successfully
 * @callback callbackWithError
 * @param {Error=} error
 */

/**
 * @typedef TorrentOpts
 * @type {object}
 * @property {Array<string>=} announce - Torrent trackers to use (added to list in .torrent or magnet uri)
 * @property {Array<string>=} urlList - Array of web seeds
 * @property {string=} path - Folder to download files to (default=`/tmp/webtorrent/`)
 * @property {boolean=} addUID - (Node.js only) If true, the torrent will be stored in it's infoHash folder to prevent file name collisions (default=false)
 * @property {FileSystemDirectoryHandle=} rootDir - *(browser only)* if supported by the browser, allows the user to specify a custom directory to stores the files in, retaining the torrent's folder and file structure
 * @property {boolean=} skipVerify - If true, client will skip verification of pieces for existing store and assume it's correct
 * @property {Uint8Array|ArrayLike<number>=} bitfield -  Preloaded numerical array/buffer to use to know what pieces are already downloaded (any type accepted by UInt8Array constructor is valid)
 * @property {FSChunkStore|MemoryChunkStore|Function=} store - Custom chunk store
 * @property {FSChunkStore|MemoryChunkStore|Function=} preloadedStore -  Custom, pre-loaded chunk store
 * @property {number=} storeCacheSlots - Number of chunk store entries (torrent pieces) to cache in memory [default=20]; 0 to disable caching
 * @property {boolean=} destroyStoreOnDestroy - If truthy, client will delete the torrent's chunk store (e.g. files on disk) when the torrent is destroyed
 * @property {object=} storeOpts - Custom options passed to the store
 * @property {boolean=} alwaysChokeSeeders - If true, client will automatically choke seeders if it's seeding. (default=true)
 * @property {function(): object=} getAnnounceOpts - Custom callback to allow sending extra parameters to the tracker
 * @property {boolean=} private - If true, client will not share the hash with the DHT nor with PEX (default is the privacy of the parsed torrent)
 * @property {'rarest'|'sequential'=} strategy - Piece selection strategy, `rarest` or `sequential`(defaut=`sequential`)
 * @property {number=} maxWebConns - Max number of simultaneous connections per web seed [default=4]
 * @property {number|false=} uploads - [default=10]
 * @property {number=} noPeersIntervalTime - The amount of time (in seconds) to wait between each check of the `noPeers` event (default=30)
 * @property {boolean=} deselect - If true, create the torrent with no pieces selected (default=false)
 * @property {boolean=} paused - If true, create the torrent in a paused state (default=false)
 * @property {Array<number>=} fileModtimes - An array containing a UNIX timestamp indicating the last change for each file of the torrent
 */

// End of JSDoc global declarations

const torrent_debug = src_browser('webtorrent:torrent')
const MAX_BLOCK_LENGTH = 128 * 1024
const PIECE_TIMEOUT = 30_000
const CHOKE_TIMEOUT = 5_000
const SPEED_THRESHOLD = 3 * Piece.BLOCK_LENGTH

const PIPELINE_MIN_DURATION = 0.5
const PIPELINE_MAX_DURATION = 1

const RECHOKE_INTERVAL = 10_000 // 10 seconds
const RECHOKE_OPTIMISTIC_DURATION = 2 // 30 seconds

const DEFAULT_NO_PEERS_INTERVAL = 30_000 // 30 seconds

// IndexedDB chunk stores used in the browser benefit from high concurrency
const FILESYSTEM_CONCURRENCY = torrent_process.browser ? cpus_browser().length : 2

const RECONNECT_WAIT = [1_000, 5_000, 15_000]

const USER_AGENT = `WebTorrent/${version} (https://webtorrent.io)`

// if nodejs or browser that supports FSA
const SUPPORTS_FSA = globalThis.navigator?.storage?.getDirectory && globalThis.FileSystemFileHandle?.prototype?.createWritable
const FALLBACK_STORE = !torrent_process.browser || SUPPORTS_FSA
  ? FSAChunkStore // Node or browser with FSA
  : memory_chunk_store

let TMP
try {
  TMP = join(fs_ignored_0.statSync('/tmp') && '/tmp', 'webtorrent')
} catch (err) {
  TMP = join(typeof os_ignored_.tmpdir === 'function' ? os_ignored_.tmpdir() : '/', 'webtorrent')
}

const IDLE_CALLBACK = typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function' && window.requestIdleCallback

class Torrent extends events {
  /**
   * Start downloading a new torrent.
   * @param {string|ArrayBufferView|Object} torrentId
   * @param {import('../index.js').default} client
   * @param {TorrentOpts} opts
   */
  constructor (torrentId, client, opts) {
    super()

    this._debugId = 'unknown infohash'
    this.client = client

    this.announce = opts.announce
    this.urlList = opts.urlList

    this.path = opts.path || TMP
    this.addUID = opts.addUID || false
    this.rootDir = opts.rootDir || null
    this.skipVerify = !!opts.skipVerify
    this._startupBitfield = opts.bitfield
    this._store = opts.store || FALLBACK_STORE
    this._preloadedStore = opts.preloadedStore || null
    this._storeCacheSlots = opts.storeCacheSlots !== undefined ? opts.storeCacheSlots : 20
    this._destroyStoreOnDestroy = opts.destroyStoreOnDestroy || false
    this.store = null
    this.storeOpts = opts.storeOpts
    this.alwaysChokeSeeders = opts.alwaysChokeSeeders ?? true

    this._getAnnounceOpts = opts.getAnnounceOpts

    // if defined, `opts.private` overrides default privacy of torrent
    if (typeof opts.private === 'boolean') this.private = opts.private

    this.strategy = opts.strategy || 'sequential'

    this.maxWebConns = opts.maxWebConns || 4

    this._rechokeNumSlots = (opts.uploads === false || opts.uploads === 0)
      ? 0
      : (+opts.uploads || 10)
    this._rechokeOptimisticWire = null
    this._rechokeOptimisticTime = 0
    this._rechokeIntervalId = null
    this._noPeersIntervalId = null
    this._noPeersIntervalTime = opts.noPeersIntervalTime ? opts.noPeersIntervalTime * 1000 : DEFAULT_NO_PEERS_INTERVAL
    this._startAsDeselected = opts.deselect || false

    this.ready = false
    this.destroyed = false
    this.paused = opts.paused || false
    this.done = false

    this.torrentUrl = null

    this.metadata = null
    /**
     * Files of the torrent
     * @type {File[]}
     */
    this.files = []

    /**
     * Pieces that need to be downloaded, indexed by piece index
     * @type {Array<Piece|null>}
     */
    this.pieces = []

    this._amInterested = false
    this._selections = new Selections()
    this._critical = []
    /**
     * open wires (added *after* handshake)
     * @type {import('bittorrent-protocol').default[]}
     */
    this.wires = []

    this._queue = [] // queue of outgoing tcp peers to connect to
    /**
     * connected peers (addr/peerId -> Peer)
     * @type {Map<string, Peer>}
     */
    this._peers = new Map()
    this._peersLength = 0 // number of elements in `this._peers` (cache, for perf)

    // stats
    this.received = 0
    this.uploaded = 0
    this._downloadSpeed = throughput()
    this._uploadSpeed = throughput()

    // for cleanup
    this._servers = []
    this._xsRequests = []

    // TODO: remove this and expose a hook instead
    // optimization: don't recheck every file if it hasn't changed
    this._fileModtimes = opts.fileModtimes

    if (torrentId !== null) this._onTorrentId(torrentId)

    this._debug('new torrent')
  }

  get timeRemaining () {
    if (this.done) return 0
    if (this.downloadSpeed === 0) return Infinity
    return ((this.length - this.downloaded) / this.downloadSpeed) * 1000
  }

  get downloaded () {
    if (!this.bitfield) return 0
    let downloaded = 0
    for (let index = 0, len = this.pieces.length; index < len; ++index) {
      if (this.bitfield.get(index)) { // verified data
        downloaded += (index === len - 1) ? this.lastPieceLength : this.pieceLength
      } else { // "in progress" data
        const piece = this.pieces[index]
        downloaded += (piece.length - piece.missing)
      }
    }
    return downloaded
  }

  // TODO: re-enable this. The number of missing pieces. Used to implement 'end game' mode.
  // Object.defineProperty(Storage.prototype, 'numMissing', {
  //   get: function () {
  //     var self = this
  //     var numMissing = self.pieces.length
  //     for (var index = 0, len = self.pieces.length; index < len; index++) {
  //       numMissing -= self.bitfield.get(index)
  //     }
  //     return numMissing
  //   }
  // })

  get downloadSpeed () { return this._downloadSpeed() }

  get uploadSpeed () { return this._uploadSpeed() }

  get progress () { return this.length ? this.downloaded / this.length : 0 }

  get ratio () { return this.uploaded / (this.received || this.length) }

  get numPeers () { return this.wires.length }

  get torrentFileBlob () {
    if (!this.torrentFile) return null
    return new Blob([this.torrentFile], { type: 'application/x-bittorrent' })
  }

  get _numQueued () {
    return this._queue.length + (this._peersLength - this._numConns)
  }

  _numConns = 0

  /**
   * Parse a torrent from its magnet/torrent file/remote url and kickstart downloading it
   * @param {string|ArrayBufferView|Object} torrentId
   * @returns {Promise<void>}
   * @private
   */
  async _onTorrentId (torrentId) {
    if (this.destroyed) return

    let parsedTorrent
    try { parsedTorrent = await parse_torrent(torrentId) } catch (err) {}
    if (parsedTorrent) {
      // Attempt to set infoHash property synchronously
      this.infoHash = parsedTorrent.infoHash
      this._debugId = (0,browser/* arr2hex */.V5)(parsedTorrent.infoHash).substring(0, 7)
      queue_microtask(() => {
        if (this.destroyed) return
        this._onParsedTorrent(parsedTorrent)
      })
    } 
    
    else {
      // If torrentId failed to parse, it could be in a form that requires an async
      // operation, i.e. http/https link, filesystem path, or Blob.
      parseTorrentRemote(torrentId, (err, parsedTorrent) => {
        if (this.destroyed) return
        if (err) return this._destroy(err)
        if (torrentId.startsWith("http:" || 0 || 0))
        {
          //if torrentid is a url string, save a reference to it
          this.torrentUrl = torrentId
        }
        this._onParsedTorrent(parsedTorrent)
      })
    }
  }

  _onParsedTorrent (parsedTorrent) {
    if (this.destroyed) return

    this._processParsedTorrent(parsedTorrent)

    if (!this.infoHash) {
      return this._destroy(new Error('Malformed torrent data: No info hash'))
    }

    this._rechokeIntervalId = setInterval(() => {
      this._rechoke()
    }, RECHOKE_INTERVAL)
    if (this._rechokeIntervalId.unref) this._rechokeIntervalId.unref()

    // Private 'infoHash' event allows client.add to check for duplicate torrents and
    // destroy them before the normal 'infoHash' event is emitted. Prevents user
    // applications from needing to deal with duplicate 'infoHash' events.
    this.emit('_infoHash', this.infoHash)
    if (this.destroyed) return

    this.emit('infoHash', this.infoHash)
    if (this.destroyed) return // user might destroy torrent in event handler

    if (this.client.listening) {
      this._onListening()
    } else {
      this.client.once('listening', () => {
        this._onListening()
      })
    }
  }

  _processParsedTorrent (parsedTorrent) {
    this._debugId = (0,browser/* arr2hex */.V5)(parsedTorrent.infoHash).substring(0, 7)

    if (typeof this.private !== 'undefined') {
      // `private` option overrides default, only if it's defined
      parsedTorrent.private = this.private
    }

    if (Array.isArray(this.announce)) {
      // Allow specifying trackers via `opts` parameter
      parsedTorrent.announce = parsedTorrent.announce.concat(this.announce)
    }

    if (this.client.tracker && Array.isArray(this.client.tracker.announce) && !parsedTorrent.private) {
      // If the client has a default tracker, add it to the announce list if torrent is not private
      parsedTorrent.announce = parsedTorrent.announce.concat(this.client.tracker.announce)
    }

    if (this.client.tracker && globalThis.WEBTORRENT_ANNOUNCE && !parsedTorrent.private) {
      // So `webtorrent-hybrid` can force specific trackers to be used
      parsedTorrent.announce = parsedTorrent.announce.concat(globalThis.WEBTORRENT_ANNOUNCE)
    }

    if (this.urlList) {
      // Allow specifying web seeds via `opts` parameter
      parsedTorrent.urlList = parsedTorrent.urlList.concat(this.urlList)
    }

    // remove duplicates by converting to Set and back
    parsedTorrent.announce = Array.from(new Set(parsedTorrent.announce))
    parsedTorrent.urlList = Array.from(new Set(parsedTorrent.urlList))

    Object.assign(this, parsedTorrent)

    this.magnetURI = toMagnetURI(parsedTorrent)
    this.torrentFile = encodeTorrentFile(parsedTorrent)
  }

  _onListening () {
    if (this.destroyed) return

    if (this.info) {
      // if full metadata was included in initial torrent id, use it immediately. Otherwise,
      // wait for torrent-discovery to find peers and ut_metadata to get the metadata.
      this._onMetadata(this)
    } else {
      if (this.xs) this._getMetadataFromServer()
      this._startDiscovery()
    }
  }

  _startDiscovery () {
    if (this.discovery || this.destroyed) return

    let trackerOpts = this.client.tracker
    if (trackerOpts) {
      trackerOpts = Object.assign({}, this.client.tracker, {
        getAnnounceOpts: () => {
          if (this.destroyed) return

          const opts = {
            uploaded: this.uploaded,
            downloaded: this.downloaded,
            left: Math.max(this.length - this.downloaded, 0)
          }
          if (this.client.tracker.getAnnounceOpts) {
            Object.assign(opts, this.client.tracker.getAnnounceOpts())
          }
          if (this._getAnnounceOpts) {
            // TODO: consider deprecating this, as it's redundant with the former case
            Object.assign(opts, this._getAnnounceOpts())
          }
          return opts
        }
      })
    }

    // add BEP09 peer-address
    if (this.peerAddresses) {
      this.peerAddresses.forEach(peer => this.addPeer(peer, lib_peer/* default */.A.SOURCE_MANUAL))
    }

    // begin discovering peers via DHT and trackers
    this.discovery = new torrent_discovery({
      infoHash: this.infoHash,
      announce: this.announce,
      peerId: this.client.peerId,
      dht: !this.private && this.client.dht,
      tracker: trackerOpts,
      port: this.client.torrentPort,
      userAgent: USER_AGENT,
      lsd: this.client.lsd
    })

    this.discovery.on('error', (err) => {
      this._destroy(err)
    })

    this.discovery.on('peer', (peer, source) => {
      this._debug('peer %s discovered via %s', peer, source)
      // Don't create new outgoing connections when torrent is done and seedOutgoingConnections is false.
      if (!this.client.seedOutgoingConnections && this.done) {
        this._debug('discovery ignoring peer %s: torrent is done and seedOutgoingConnections is false', peer)
        return
      }
      this.addPeer(peer, source)
    })

    this.discovery.on('trackerAnnounce', () => {
      this.emit('trackerAnnounce')
    })

    this.discovery.on('dhtAnnounce', () => {
      this.emit('dhtAnnounce')
    })

    this.discovery.on('warning', (err) => {
      this.emit('warning', err)
    })

    this._noPeersIntervalId = setInterval(() => {
      if (this.destroyed) return

      const counters = {
        [lib_peer/* default */.A.SOURCE_TRACKER]: {
          enabled: !!this.client.tracker,
          numPeers: 0
        },
        [lib_peer/* default */.A.SOURCE_DHT]: {
          enabled: !!this.client.dht,
          numPeers: 0
        },
        [lib_peer/* default */.A.SOURCE_LSD]: {
          enabled: !!this.client.lsd,
          numPeers: 0
        },
        [lib_peer/* default */.A.SOURCE_UT_PEX]: {
          enabled: (this.client.utPex && typeof ut_pex_ignored_ === 'function'),
          numPeers: 0
        }
      }
      for (const peer of this._peers.values()) {
        const counter = counters[peer.source]
        if (typeof counter !== 'undefined') counter.numPeers++
      }
      for (const source of Object.keys(counters)) {
        const counter = counters[source]
        if (counter.enabled && counter.numPeers === 0) this.emit('noPeers', source)
      }
    }, this._noPeersIntervalTime)
    if (this._noPeersIntervalId.unref) this._noPeersIntervalId.unref()
  }

  _getMetadataFromServer () {
    // to allow function hoisting
    const self = this

    const urls = Array.isArray(this.xs) ? this.xs : [this.xs]

    self._xsRequestsController = new AbortController()

    const signal = self._xsRequestsController.signal

    const tasks = urls.map(url => cb => {
      getMetadataFromURL(url, cb)
    })
    run_parallel(tasks)

    async function getMetadataFromURL (url, cb) {
      if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
        self.emit('warning', new Error(`skipping non-http xs param: ${url}`))
        return cb(null)
      }

      const opts = {
        method: 'GET',
        headers: {
          'user-agent': USER_AGENT
        },
        signal
      }
      let res
      try {
        res = await cross_fetch_ponyfill_browser(url, opts)
      } catch (err) {
        self.emit('warning', new Error(`http error from xs param: ${url}`))
        return cb(null)
      }

      if (self.destroyed) return cb(null)
      if (self.metadata) return cb(null)

      if (res.status !== 200) {
        self.emit('warning', new Error(`non-200 status code ${res.status} from xs param: ${url}`))
        return cb(null)
      }
      let torrent
      try {
        torrent = new Uint8Array(await res.arrayBuffer())
      } catch (e) {
        self.emit('warning', e)
        return cb(null)
      }

      let parsedTorrent
      try {
        parsedTorrent = await parse_torrent(torrent)
      } catch (err) {}

      if (!parsedTorrent) {
        self.emit('warning', new Error(`got invalid torrent file from xs param: ${url}`))
        return cb(null)
      }

      if (parsedTorrent.infoHash !== self.infoHash) {
        self.emit('warning', new Error(`got torrent file with incorrect info hash from xs param: ${url}`))
        return cb(null)
      }
      self._onMetadata(parsedTorrent)
      cb(null)
    }
  }

  /**
   * Called when the full torrent metadata is received.
   */
  async _onMetadata (metadata) {
    if (this.metadata || this.destroyed) return
    this._debug('got metadata')

    this._xsRequestsController?.abort()
    this._xsRequestsController = null

    let parsedTorrent
    if (metadata && metadata.infoHash) {
      // `metadata` is a parsed torrent (from parse-torrent module)
      parsedTorrent = metadata
    } else {
      try {
        parsedTorrent = await parse_torrent(metadata)
      } catch (err) {
        return this._destroy(err)
      }
    }

    this._processParsedTorrent(parsedTorrent)
    this.metadata = this.torrentFile

    // add web seed urls (BEP19)
    if (this.client.enableWebSeeds) {
      this.urlList.forEach(url => {
        this.addWebSeed(url)
      })
    }

    this._rarityMap = new RarityMap(this)

    this.files = this.files.map(file => new file_File(this, file))

    let rawStore = this._preloadedStore
    if (!rawStore) {
      rawStore = new this._store(this.pieceLength, {
        ...this.storeOpts,
        torrent: this,
        path: this.path,
        files: this.files,
        length: this.length,
        name: this.name + ' - ' + this.infoHash.slice(0, 8),
        addUID: this.addUID,
        rootDir: this.rootDir,
        max: this._storeCacheSlots
      })
    }

    // don't use the cache if the store is already in memory
    if (this._storeCacheSlots > 0 && !(rawStore instanceof memory_chunk_store)) {
      rawStore = new cache_chunk_store(rawStore, {
        max: this._storeCacheSlots
      })
    }

    this.store = new immediate_chunk_store(
      rawStore
    )

    // Select only specified files (BEP53) http://www.bittorrent.org/beps/bep_0053.html
    if (this.so && !this._startAsDeselected) {
      this.files.forEach((v, i) => {
        if (this.so.includes(i)) {
          this.files[i].select()
        }
      })
    } else {
      // start off selecting the entire torrent with low priority
      if (this.pieces.length !== 0 && !this._startAsDeselected) {
        this.select(0, this.pieces.length - 1)
      }
    }

    this._hashes = this.pieces
    // A startup bitfield can be used only when all the conditions are right:
    // - It exists
    // - It's the correct size ( rounded to the first byte )
    // - It will not be rewritten by _markAllVerified
    this._hasStartupBitfield = this._startupBitfield && this._startupBitfield.length === Math.ceil(this.pieces.length / 8) && !this.skipVerify

    this.bitfield = new esm/* default */.A(this._hasStartupBitfield ? new Uint8Array(this._startupBitfield) : this.pieces.length)
    this._reservations = this._hasStartupBitfield
      ? this.pieces.map((_, index) => this.bitfield.get(index) ? null : [])
      : this.pieces.map(() => [])

    this.pieces = this.pieces.map((hash, i) => {
      if (this._hasStartupBitfield && this.bitfield.get(i)) {
        return null
      }
      const pieceLength = (i === this.pieces.length - 1)
        ? this.lastPieceLength
        : this.pieceLength
      return new Piece(pieceLength)
    })

    // Emit 'metadata' before 'ready' and 'done'
    this.emit('metadata')

    // User might destroy torrent in response to 'metadata' event
    if (this.destroyed) return

    if (this.skipVerify) {
      // Skip verifying exisitng data and just assume it's correct
      this._markAllVerified()
      this._onStore()
    } else {
      const onPiecesVerified = (err) => {
        if (err) return this._destroy(err)
        this._debug('done verifying')
        this._onStore()
      }

      this._debug('verifying existing torrent data')
      if (this._fileModtimes && this._store === FSAChunkStore) {
        // don't verify if the files haven't been modified since we last checked
        this.getFileModtimes((err, fileModtimes) => {
          if (err) return this._destroy(err)

          const unchanged = this.files.map((_, index) => fileModtimes[index] === this._fileModtimes[index]).every(x => x)

          if (unchanged) {
            this._markAllVerified()
            this._onStore()
          } else {
            this._verifyPieces(onPiecesVerified)
          }
        })
      } else {
        this._verifyPieces(onPiecesVerified)
      }
    }
  }

  /*
   * TODO: remove this
   * Gets the last modified time of every file on disk for this torrent.
   * Only valid in Node, not in the browser.
   */
  getFileModtimes (cb) {
    const ret = []
    run_parallel_limit(this.files.map((file, index) => cb => {
      const filePath = this.addUID ? join(this.name + ' - ' + this.infoHash.slice(0, 8)) : join(this.path, file.path)
      fs_ignored_0.stat(filePath, (err, stat) => {
        if (err && err.code !== 'ENOENT') return cb(err)
        ret[index] = stat && stat.mtime.getTime()
        cb(null)
      })
    }), FILESYSTEM_CONCURRENCY, err => {
      this._debug('done getting file modtimes')
      cb(err, ret)
    })
  }

  /**
   * Callback called after a piece is verified
   * @callback verifyPieceCallback
   * @param {Error=} error
   * @param {boolean=} isValid
   */
  /**
   * Verify a single piece using hashing
   * @param index
   * @param {verifyPieceCallback} cb
   * @private
   */
  _verifyPiece (index, cb) {
    if (this.destroyed) return cb(new Error('torrent is destroyed'))

    const getOpts = {}
    // Specify length for the last piece in case it is zero-padded
    if (index === this.pieces.length - 1) {
      getOpts.length = this.lastPieceLength
    }
    this.store.get(index, getOpts, async (err, buf) => {
      if (this.destroyed) return cb(new Error('torrent is destroyed'))

      if (err) return queue_microtask(() => cb(null, false)) // ignore error

      const hex = await (0,browser/* hash */.tW)(buf, 'hex')
      if (this.destroyed) return cb(new Error('torrent is destroyed'))

      cb(null, hex === this._hashes[index])
    })
  }

  /**
   * Verify pieces using bitfield, in case of in-congruences it will re-verify the file using hashing
   * @param {callbackWithError} cb
   * @private
   */
  _verifyPiecesUsingBitfield (cb) {
    const piecesToCheck = new Set()
    const piecesToFilesMap = new Map()
    // First step, optimistically mark what is verified and what is not by blindly trusting the bitfield
    // and construct a list of pieces to verify ( max 1 piece for each file, in some edge cases that piece could overlap )
    for (const file of this.files) {
      let checkFile = 2
      let pieceToCheckForThisFile = null
      for (let i = file._startPiece; i <= file._endPiece; ++i) {
        if (this.bitfield.get(i)) {
          if (checkFile) {
            pieceToCheckForThisFile = i
            checkFile--
          }
          if (!piecesToFilesMap.has(i)) {
            piecesToFilesMap.set(i, [])
          }
          piecesToFilesMap.get(i).push(file)
        }
      }
      if (pieceToCheckForThisFile !== null) {
        piecesToCheck.add(pieceToCheckForThisFile)
      }
    }
    // Second step, for each piece that needs to be verified we verify it using hashing
    this._verifyPiecesUsingHash([...piecesToCheck], (err) => {
      if (err) {
        return cb(err)
      }
      const filesToCheck = new Set()
      for (const piece of piecesToCheck) {
        if (!this.bitfield.get(piece)) {
          const filesOnPiece = piecesToFilesMap.get(piece)
          for (const file of filesOnPiece) {
            filesToCheck.add(file)
          }
        }
      }
      // Third step, if we need to recheck files we are going to fully recheck them
      if (filesToCheck.size) {
        const piecesToRecheck = []
        for (const file of filesToCheck) {
          for (let i = file._startPiece; i <= file._endPiece; ++i) {
            if (piecesToRecheck.indexOf(i) === -1) {
              piecesToRecheck.push(i)
            }
          }
        }
        return this._verifyPiecesUsingHash(piecesToRecheck, cb)
      }
      cb(null)
    })
  }

  /**
   * Verifies the pieces of the torrent using hashing ( it can be very slow )
   * @param {Array<number>} pieces
   * @param {callbackWithError} cb
   * @private
   */
  _verifyPiecesUsingHash (pieces, cb) {
    run_parallel_limit(pieces.map((piece, index) => cb => {
      const target = Number.isInteger(piece) ? piece : index
      this._verifyPiece(target, (err, isVerified) => {
        if (err) return cb(err)
        if (isVerified) {
          this._debug('piece verified %s', target)
          this._markVerified(target)
        } else {
          this._markUnverified(target)
          this._debug('piece invalid %s', target)
        }
        cb(null)
      })
    }), FILESYSTEM_CONCURRENCY, cb)
  }

  /**
   * Verifies the pieces of the torrent, if a startup bitfield is provided it will be used for verification
   * @param {callbackWithError} cb
   * @private
   */
  _verifyPieces (cb) {
    if (this._hasStartupBitfield) {
      return this._verifyPiecesUsingBitfield(cb)
    }
    this._verifyPiecesUsingHash(this.pieces, cb)
  }

  /**
   * Verify the hashes of all pieces in the store and update the bitfield for any new valid
   * pieces. Useful if data has been added to the store outside WebTorrent, e.g. if another
   * process puts a valid file in the right place. Once the scan is complete,
   * `callback(null)` will be called (if provided), unless the torrent was destroyed during
   * the scan, in which case `callback` will be called with an error.
   * @param  {callbackWithError=} cb
   */
  rescanFiles (cb) {
    if (this.destroyed) throw new Error('torrent is destroyed')
    if (!cb) cb = torrent_noop

    this._verifyPiecesUsingHash(this.pieces, (err) => {
      if (err) {
        this._destroy(err)
        return cb(err)
      }

      this._checkDone()
      cb(null)
    })
  }

  /**
   * Mark the entire torrent as verified ( i.e. fully downloaded )
   * @private
   */
  _markAllVerified () {
    for (let index = 0; index < this.pieces.length; index++) {
      this._markVerified(index)
    }
  }

  /**
   * Mark one piece as verified
   * @param {number} index
   * @private
   */
  _markVerified (index) {
    this.pieces[index] = null
    this._reservations[index] = null
    this.bitfield.set(index, true)
    this.emit('verified', index)
  }

  /**
   * Mark one piece as unverified
   * @param {number} index
   * @private
   */
  _markUnverified (index) {
    const len = (index === this.pieces.length - 1)
      ? this.lastPieceLength
      : this.pieceLength
    this.pieces[index] = new Piece(len)
    this.bitfield.set(index, false)
    if (!this._startAsDeselected) this.select(index, index)
    for (const file of this.files) {
      if (file.done && file.includes(index)) file.done = false
    }
  }

  _hasAllPieces () {
    for (let index = 0; index < this.pieces.length; index++) {
      if (!this.bitfield.get(index)) return false
    }
    return true
  }

  _hasNoPieces () {
    return !this._hasMorePieces(0)
  }

  _hasMorePieces (threshold) {
    let count = 0
    for (let index = 0; index < this.pieces.length; index++) {
      if (this.bitfield.get(index)) {
        count += 1
        if (count > threshold) return true
      }
    }
    return false
  }

  /**
   * Called when the metadata, listening server, and underlying chunk store is initialized.
   */
  _onStore () {
    if (this.destroyed) return
    this._debug('on store')

    // Start discovery before emitting 'ready'
    this._startDiscovery()

    this.ready = true
    this.emit('ready')

    // Files may start out done if the file was already in the store
    this._checkDone()

    // In case any selections were made before torrent was ready
    this._updateSelections()

    // Start requesting pieces after we have initially verified them
    this.wires.forEach(wire => {
      // If we didn't have the metadata at the time ut_metadata was initialized for this
      // wire, we still want to make it available to the peer in case they request it.
      if (wire.ut_metadata) wire.ut_metadata.setMetadata(this.metadata)

      this._onWireWithMetadata(wire)
    })
  }

  destroy (opts, cb) {
    if (typeof opts === 'function') return this.destroy(null, opts)

    this._destroy(null, opts, cb)
  }

  _destroy (err, opts, cb) {
    if (typeof opts === 'function') return this._destroy(err, null, opts)
    if (this.destroyed) return
    this.destroyed = true
    this._debug('destroy')

    this.client._remove(this)

    this._selections.clear()

    clearInterval(this._rechokeIntervalId)

    clearInterval(this._noPeersIntervalId)

    this._xsRequestsController?.abort()

    if (this._rarityMap) {
      this._rarityMap.destroy()
    }

    for (const id of this._peers.keys()) {
      this.removePeer(id)
    }

    for (const file of this.files) {
      if (file instanceof file_File) file._destroy()
    }

    const tasks = this._servers.map(server => cb => {
      server.destroy(cb)
    })

    if (this.discovery) {
      tasks.push(cb => {
        this.discovery.destroy(cb)
      })
    }

    if (this.store) {
      let destroyStore = this._destroyStoreOnDestroy
      if (opts && opts.destroyStore !== undefined) {
        destroyStore = opts.destroyStore
      }
      tasks.push(cb => {
        if (destroyStore) {
          this.store.destroy(cb)
        } else {
          this.store.close(cb)
        }
      })
    }

    run_parallel(tasks, cb)

    if (err) {
      // Torrent errors are emitted at `torrent.on('error')`. If there are no 'error'
      // event handlers on the torrent instance, then the error will be emitted at
      // `client.on('error')`. This prevents throwing an uncaught exception
      // (unhandled 'error' event), but it makes it impossible to distinguish client
      // errors versus torrent errors. Torrent errors are not fatal, and the client
      // is still usable afterwards. Therefore, always listen for errors in both
      // places (`client.on('error')` and `torrent.on('error')`).
      if (this.listenerCount('error') === 0) {
        this.client.emit('error', err)
      } else {
        this.emit('error', err)
      }
    }

    this.emit('close')

    this.client = null
    this.files = []
    this.discovery = null
    this.store = null
    this._rarityMap = null
    this._peers.clear()
    this._peers = null
    this._servers = null
    this._xsRequests = null
    this._queue = null
  }

  addPeer (peer, source) {
    if (this.destroyed) throw new Error('torrent is destroyed')
    if (!this.infoHash) throw new Error('addPeer() must not be called before the `infoHash` event')

    let host

    if (typeof peer === 'string') {
      let parts
      try {
        parts = addrToIPPort(peer)
      } catch (e) {
        this._debug('ignoring peer: invalid %s', peer)
        this.emit('invalidPeer', peer)
        return false
      }
      host = parts[0]
    } else if (typeof peer.remoteAddress === 'string') {
      host = peer.remoteAddress
    }

    if (this.client.blocked && host && this.client.blocked.contains(host)) {
      this._debug('ignoring peer: blocked %s', peer)
      if (typeof peer !== 'string') peer.destroy()
      this.emit('blockedPeer', peer)
      return false
    }

    // if the utp connection fails to connect, then it is replaced with a tcp connection to the same ip:port

    const type = (this.client.utp && this._isIPv4(host)) ? 'utp' : 'tcp'
    const wasAdded = !!this._addPeer(peer, type, source)

    if (wasAdded) {
      this.emit('peer', peer)
    } else {
      this.emit('invalidPeer', peer)
    }
    return wasAdded
  }

  _addPeer (peer, type, source) {
    if (this.destroyed) {
      if (typeof peer !== 'string') peer.destroy()
      return null
    }
    if (typeof peer === 'string' && !this._validAddr(peer)) {
      this._debug('ignoring peer: invalid %s', peer)
      return null
    }

    const id = (peer && peer.id) || peer
    if (this._peers.has(id)) {
      this._debug('ignoring peer: duplicate (%s)', id)
      if (typeof peer !== 'string') peer.destroy()
      return null
    }

    if (this.paused) {
      this._debug('ignoring peer: torrent is paused')
      if (typeof peer !== 'string') peer.destroy()
      return null
    }

    this._debug('add peer %s', id)

    let newPeer
    if (typeof peer === 'string') {
      // `peer` is an addr ("ip:port" string)
      newPeer = type === 'utp'
        ? lib_peer/* default */.A.createUTPOutgoingPeer(peer, this, this.client.throttleGroups, source)
        : lib_peer/* default */.A.createTCPOutgoingPeer(peer, this, this.client.throttleGroups, source)
    } else {
      // `peer` is a WebRTC connection (simple-peer)
      newPeer = lib_peer/* default */.A.createWebRTCPeer(peer, this, this.client.throttleGroups, source)
    }

    this._registerPeer(newPeer)

    if (typeof peer === 'string') {
      // `peer` is an addr ("ip:port" string)
      this._queue.push(newPeer)
      this._drain()
    }

    return newPeer
  }

  addWebSeed (urlOrConn) {
    if (this.destroyed) throw new Error('torrent is destroyed')

    let id
    let conn
    if (typeof urlOrConn === 'string') {
      id = urlOrConn

      if (!/^https?:\/\/.+/.test(id)) {
        this.emit('warning', new Error(`ignoring invalid web seed: ${id}`))
        this.emit('invalidPeer', id)
        return
      }

      if (this._peers.has(id)) {
        this.emit('warning', new Error(`ignoring duplicate web seed: ${id}`))
        this.emit('invalidPeer', id)
        return
      }

      conn = new WebConn(id, this)
    } else if (urlOrConn && typeof urlOrConn.connId === 'string') {
      conn = urlOrConn
      id = conn.connId

      if (this._peers.has(id)) {
        this.emit('warning', new Error(`ignoring duplicate web seed: ${id}`))
        this.emit('invalidPeer', id)
        return
      }
    } else {
      this.emit('warning', new Error('addWebSeed must be passed a string or connection object with id property'))
      return
    }

    this._debug('add web seed %s', id)

    const newPeer = lib_peer/* default */.A.createWebSeedPeer(conn, id, this, this.client.throttleGroups)

    this._registerPeer(newPeer)

    this.emit('peer', id)
  }

  /**
   * Called whenever a new incoming TCP peer connects to this torrent swarm. Called with a
   * peer that has already sent a handshake.
   */
  _addIncomingPeer (peer) {
    if (this.destroyed) return peer.destroy(new Error('torrent is destroyed'))
    if (this.paused) return peer.destroy(new Error('torrent is paused'))

    this._debug('add incoming peer %s', peer.id)

    this._registerPeer(peer)
  }

  /**
   * @param {Peer} newPeer
   */
  _registerPeer (newPeer) {
    newPeer.on('download', downloaded => {
      if (this.destroyed) return
      this.received += downloaded
      this._downloadSpeed(downloaded)
      this.client._downloadSpeed(downloaded)
      this.emit('download', downloaded)
      if (this.destroyed) return
      this.client.emit('download', downloaded)
    })

    newPeer.on('upload', uploaded => {
      if (this.destroyed) return
      this.uploaded += uploaded
      this._uploadSpeed(uploaded)
      this.client._uploadSpeed(uploaded)
      this.emit('upload', uploaded)
      if (this.destroyed) return
      this.client.emit('upload', uploaded)
    })

    if (newPeer.connected) {
      this._numConns += 1
    } else {
      newPeer.once('connect', () => {
        if (this.destroyed) return
        this._numConns += 1
      })
    }
    newPeer.once('disconnect', () => {
      this._numConns -= 1
    })

    this._peers.set(newPeer.id, newPeer)
    this._peersLength += 1
  }

  removePeer (peer) {
    const id = peer?.id || peer
    if (peer && !peer.id) peer = this._peers?.get(id)

    if (!peer) return
    peer.destroy()

    if (this.destroyed) return

    this._debug('removePeer %s', id)

    this._peers.delete(id)
    this._peersLength -= 1

    // If torrent swarm was at capacity before, try to open a new connection now
    this._drain()
  }

  _select (start = 0, end = this.pieces.length - 1, priority, notify, isStreamSelection = false) {
    if (this.destroyed) throw new Error('torrent is destroyed')

    if (start < 0 || end < start || this.pieces.length <= end) {
      throw new Error(`invalid selection ${start} : ${end}`)
    }
    priority = Number(priority) || 0

    this._debug('select %s-%s (priority %s)', start, end, priority)

    this._selections.insert({
      from: start,
      to: end,
      offset: 0,
      priority,
      notify,
      isStreamSelection
    })

    this._selections.sort((a, b) => b.priority - a.priority)

    this._updateSelections()
  }

  select (start, end, priority, notify) {
    this._select(start, end, priority, notify, false)
  }

  _deselect (from, to, isStreamSelection = false) {
    if (this.destroyed) throw new Error('torrent is destroyed')

    this._debug('deselect %s-%s', from, to)

    this._selections.remove({ from, to, isStreamSelection })

    this._updateSelections()
  }

  deselect (start, end) {
    this._deselect(start, end, false)
  }

  critical (start, end) {
    if (this.destroyed) throw new Error('torrent is destroyed')

    this._debug('critical %s-%s', start, end)

    for (let i = start; i <= end; ++i) {
      this._critical[i] = true
    }

    this._updateSelections()
  }

  _onWire (wire, addr) {
    this._debug('got wire %s (%s)', wire._debugId, addr || 'Unknown')

    this.wires.push(wire)

    if (addr) {
      // Sometimes RTCPeerConnection.getStats() doesn't return an ip:port for peers
      const parts = addrToIPPort(addr)
      wire.remoteAddress = parts[0]
      wire.remotePort = parts[1]
    }

    // When peer sends PORT message, add that DHT node to routing table
    if (this.client.dht && this.client.dht.listening) {
      wire.on('port', port => {
        if (this.destroyed || this.client.dht.destroyed) {
          return
        }
        if (!wire.remoteAddress) {
          return this._debug('ignoring PORT from peer with no address')
        }
        if (port === 0 || port > 65536) {
          return this._debug('ignoring invalid PORT from peer')
        }

        this._debug('port: %s (from %s)', port, addr)
        this.client.dht.addNode({ host: wire.remoteAddress, port })
      })
    }

    wire.on('timeout', () => {
      this._debug('wire timeout (%s)', addr)
      // TODO: this might be destroying wires too eagerly
      wire.destroy()
    })

    // Timeout for piece requests to this peer
    if (wire.type !== 'webSeed') { // webseeds always send 'unhave' on http timeout
      wire.setTimeout(PIECE_TIMEOUT, true)
    }

    // Send KEEP-ALIVE (every 60s) so peers will not disconnect the wire
    wire.setKeepAlive(true)

    // use ut_metadata extension
    wire.use(ut_metadata(this.metadata))

    wire.ut_metadata.on('warning', err => {
      this._debug('ut_metadata warning: %s', err.message)
    })

    if (!this.metadata) {
      wire.ut_metadata.on('metadata', metadata => {
        this._debug('got metadata via ut_metadata')
        this._onMetadata(metadata)
      })
      wire.ut_metadata.fetch()
    }

    // use ut_pex extension if the torrent is not flagged as private
    if (this.client.utPex && typeof ut_pex_ignored_ === 'function' && !this.private) {
      wire.use(ut_pex_ignored_())

      wire.ut_pex.on('peer', peer => {
        // Only add potential new peers when torrent is done and seedOutgoingConnections is false.
        if (!this.client.seedOutgoingConnections && this.done) {
          this._debug('ut_pex ignoring peer %s: torrent is done and seedOutgoingConnections is false', peer)
          return
        }
        this._debug('ut_pex: got peer: %s (from %s)', peer, addr)
        this.addPeer(peer, lib_peer/* default */.A.SOURCE_UT_PEX)
      })

      wire.ut_pex.on('dropped', peer => {
        // the remote peer believes a given peer has been dropped from the torrent swarm.
        // if we're not currently connected to it, then remove it from the queue.
        const peerObj = this._peers.get(peer)
        if (peerObj && !peerObj.connected) {
          this._debug('ut_pex: dropped peer: %s (from %s)', peer, addr)
          this.removePeer(peer)
        }
      })

      wire.once('close', () => {
        // Stop sending updates to remote peer
        wire.ut_pex.reset()
      })
    }

    wire.use(lt_donthave())

    // Hook to allow user-defined `bittorrent-protocol` extensions
    // More info: https://github.com/webtorrent/bittorrent-protocol#extension-api
    this.emit('wire', wire, addr)

    if (this.ready) {
      queue_microtask(() => {
        // This allows wire.handshake() to be called (by Peer.onHandshake) before any
        // messages get sent on the wire
        this._onWireWithMetadata(wire)
      })
    }
  }

  /**
   * @param {import('bittorrent-protocol').default} wire
   */
  _onWireWithMetadata (wire) {
    let timeoutId = null

    const onChokeTimeout = () => {
      if (this.destroyed || wire.destroyed) return

      if (this._numQueued > 2 * (this._numConns - this.numPeers) &&
        wire.amInterested) {
        wire.destroy()
      } else {
        timeoutId = setTimeout(onChokeTimeout, CHOKE_TIMEOUT)
        if (timeoutId.unref) timeoutId.unref()
      }
    }

    let i
    const updateSeedStatus = () => {
      // bittorrent-protocol will set use fake bitfield if it gets a have-all message, which means its a seeder
      if (wire.peerPieces.buffer.length && !!wire.peerPieces.setAll) {
        if (wire.peerPieces.buffer.length !== this.bitfield.buffer.length) return
        for (i = 0; i < this.pieces.length; ++i) {
          if (!wire.peerPieces.get(i)) return
        }
      }
      wire.isSeeder = true
      if (this.alwaysChokeSeeders) wire.choke() // always choke seeders
    }

    wire.on('bitfield', () => {
      updateSeedStatus()
      this._update()
      this._updateWireInterest(wire)
    })

    wire.on('have', () => {
      updateSeedStatus()
      this._update()
      this._updateWireInterest(wire)
    })

    wire.lt_donthave.on('donthave', () => {
      updateSeedStatus()
      this._update()
      this._updateWireInterest(wire)
    })

    // fast extension (BEP6)
    wire.on('have-all', () => {
      wire.isSeeder = true
      if (this.alwaysChokeSeeders) wire.choke() // always choke seeders
      this._update()
      this._updateWireInterest(wire)
    })

    // fast extension (BEP6)
    wire.on('have-none', () => {
      wire.isSeeder = false
      this._update()
      this._updateWireInterest(wire)
    })

    // fast extension (BEP6)
    wire.on('allowed-fast', (index) => {
      this._update()
    })

    wire.once('interested', () => {
      wire.unchoke()
    })

    wire.once('close', () => {
      clearTimeout(timeoutId)
    })

    wire.on('choke', () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(onChokeTimeout, CHOKE_TIMEOUT)
      if (timeoutId.unref) timeoutId.unref()
    })

    wire.on('unchoke', () => {
      clearTimeout(timeoutId)
      this._update()
    })

    wire.on('request', (index, offset, length, cb) => {
      if (length > MAX_BLOCK_LENGTH) {
        // Per spec, disconnect from peers that request >128KB
        return wire.destroy()
      }
      if (this.pieces[index]) return
      this.store.get(index, { offset, length }, cb)
    })

    // always send bitfield or equivalent fast extension message (required)
    if (wire.hasFast && this._hasAllPieces()) wire.haveAll()
    else if (wire.hasFast && this._hasNoPieces()) wire.haveNone()
    else wire.bitfield(this.bitfield)

    // initialize interest in case bitfield message was already received before above handler was registered
    this._updateWireInterest(wire)

    // Send PORT message to peers that support DHT
    if (wire.peerExtensions.dht && this.client.dht && this.client.dht.listening) {
      wire.port(this.client.dht.address().port)
    }

    if (wire.type !== 'webSeed') { // do not choke on webseeds
      timeoutId = setTimeout(onChokeTimeout, CHOKE_TIMEOUT)
      if (timeoutId.unref) timeoutId.unref()
    }

    wire.isSeeder = false
    updateSeedStatus()
  }

  /**
   * Called on selection changes.
   */
  _updateSelections () {
    if (!this.ready || this.destroyed) return

    queue_microtask(() => {
      this._gcSelections()
    })
    this._updateInterest()
    this._update()
  }

  /**
   * Garbage collect selections with respect to the store's current state.
   */
  _gcSelections () {
    for (const s of this._selections) {
      const oldOffset = s.offset

      // check for newly downloaded pieces in selection
      while (this.bitfield.get(s.from + s.offset) && s.from + s.offset < s.to) {
        s.offset += 1
      }

      if (oldOffset !== s.offset) s.notify?.()
      if (s.to !== s.from + s.offset) continue
      if (!this.bitfield.get(s.from + s.offset)) continue

      s.remove() // remove fully downloaded selection
      s.notify?.()
      this._updateInterest()
    }

    if (!this._selections.length) this.emit('idle')
  }

  /**
   * Update interested status for all peers.
   */
  _updateInterest () {
    const prev = this._amInterested
    this._amInterested = !!this._selections.length

    this.wires.forEach(wire => this._updateWireInterest(wire))

    if (prev === this._amInterested) return
    if (this._amInterested) this.emit('interested')
    else this.emit('uninterested')
  }

  _updateWireInterest (wire) {
    let interested = false
    for (let index = 0; index < this.pieces.length; ++index) {
      if (this.pieces[index] && wire.peerPieces.get(index)) {
        interested = true
        break
      }
    }

    if (interested) wire.interested()
    else wire.uninterested()
  }

  /**
   * Heartbeat to update all peers and their requests.
   */
  _update () {
    if (IDLE_CALLBACK) {
      IDLE_CALLBACK(() => this._updateWireWrapper(), { timeout: 250 })
    } else {
      this._updateWireWrapper()
    }
  }

  _updateWireWrapper () {
    if (this.destroyed) return
    // update wires in random order for better request distribution
    const ite = random_iterate(this.wires)
    let wire
    while ((wire = ite())) {
      this._updateWire(wire)
    }
  }

  /**
   * Attempts to update a peer's requests
   * @param {import('bittorrent-protocol').default} wire
   */
  _updateWire (wire) {
    if (wire.destroyed) return false
    // to allow function hoisting
    const self = this

    const minOutstandingRequests = getBlockPipelineLength(wire, PIPELINE_MIN_DURATION)
    if (wire.requests.length >= minOutstandingRequests) return
    const maxOutstandingRequests = getBlockPipelineLength(wire, PIPELINE_MAX_DURATION)

    if (wire.peerChoking) {
      if (wire.hasFast && wire.peerAllowedFastSet.length > 0 &&
        !this._hasMorePieces(wire.peerAllowedFastSet.length - 1)) {
        requestAllowedFastSet()
      }
      return
    }

    if (!wire.downloaded) return validateWire()

    trySelectWire(false) || trySelectWire(true)

    function requestAllowedFastSet () {
      if (wire.requests.length >= maxOutstandingRequests) return false

      for (const piece of wire.peerAllowedFastSet) {
        if (wire.peerPieces.get(piece) && !self.bitfield.get(piece)) {
          while (self._request(wire, piece, false) &&
            wire.requests.length < maxOutstandingRequests) {
            // body intentionally empty
            // request all non-reserved blocks in this piece
          }
        }

        if (wire.requests.length < maxOutstandingRequests) continue

        return true
      }

      return false
    }

    function genPieceFilterFunc (start, end, tried, rank) {
      return i => i >= start && i <= end && !(i in tried) && wire.peerPieces.get(i) && (!rank || rank(i))
    }

    // TODO: Do we need both validateWire and trySelectWire?
    function validateWire () {
      if (wire.requests.length) return

      let i = self._selections.length
      while (i--) {
        const next = self._selections.get(i)
        let piece
        if (self.strategy === 'rarest') {
          const start = next.from + next.offset
          const end = next.to
          const len = end - start + 1
          const tried = {}
          let tries = 0
          const filter = genPieceFilterFunc(start, end, tried)

          while (tries < len) {
            piece = self._rarityMap.getRarestPiece(filter)
            if (piece < 0) break
            if (self._request(wire, piece, false)) return
            tried[piece] = true
            tries += 1
          }
        } else {
          for (piece = next.to; piece >= next.from + next.offset; --piece) {
            if (!wire.peerPieces.get(piece)) continue
            if (self._request(wire, piece, false)) return
          }
        }
      }

      // TODO: wire failed to validate as useful; should we close it?
      // probably not, since 'have' and 'bitfield' messages might be coming
    }

    function speedRanker () {
      const speed = wire.downloadSpeed() || 1
      if (speed > SPEED_THRESHOLD) return () => true

      const secs = Math.max(1, wire.requests.length) * Piece.BLOCK_LENGTH / speed
      let tries = 10
      let ptr = 0

      return index => {
        if (!tries || self.bitfield.get(index)) return true

        let missing = self.pieces[index].missing

        for (; ptr < self.wires.length; ptr++) {
          const otherWire = self.wires[ptr]
          const otherSpeed = otherWire.downloadSpeed()

          if (otherSpeed < SPEED_THRESHOLD) continue
          if (otherSpeed <= speed) continue
          if (!otherWire.peerPieces.get(index)) continue
          if ((missing -= otherSpeed * secs) > 0) continue

          tries--
          return false
        }

        return true
      }
    }

    function shufflePriority (i) {
      let last = i
      for (let j = i; j < self._selections.length && self._selections.get(j).priority; j++) {
        last = j
      }
      self._selections.swap(i, last)
    }

    function trySelectWire (hotswap) {
      if (wire.requests.length >= maxOutstandingRequests) return true
      const rank = speedRanker()

      for (let i = 0; i < self._selections.length; i++) {
        const next = self._selections.get(i)

        let piece
        if (self.strategy === 'rarest') {
          const start = next.from + next.offset
          const end = next.to
          const len = end - start + 1
          const tried = {}
          let tries = 0
          const filter = genPieceFilterFunc(start, end, tried, rank)

          while (tries < len) {
            piece = self._rarityMap.getRarestPiece(filter)
            if (piece < 0) break

            while (self._request(wire, piece, self._critical[piece] || hotswap) &&
              wire.requests.length < maxOutstandingRequests) {
              // body intentionally empty
              // request all non-reserved blocks in this piece
            }

            if (wire.requests.length < maxOutstandingRequests) {
              tried[piece] = true
              tries++
              continue
            }

            if (next.priority) shufflePriority(i)
            return true
          }
        } else {
          for (piece = next.from + next.offset; piece <= next.to; piece++) {
            if (!wire.peerPieces.get(piece) || !rank(piece)) continue

            while (self._request(wire, piece, self._critical[piece] || hotswap) &&
              wire.requests.length < maxOutstandingRequests) {
              // body intentionally empty
              // request all non-reserved blocks in piece
            }

            if (wire.requests.length < maxOutstandingRequests) continue

            if (next.priority) shufflePriority(i)
            return true
          }
        }
      }

      return false
    }
  }

  /**
   * Called periodically to update the choked status of all peers, handling optimistic
   * unchoking as described in BEP3.
   */
  _rechoke () {
    if (!this.ready) return

    // wires in increasing order of quality (pop() gives next best peer)
    const wireStack =
      this.wires
        .map(wire => ({ wire, random: Math.random() })) // insert a random seed for randomizing the sort
        .sort((objA, objB) => {
          const wireA = objA.wire
          const wireB = objB.wire

          // prefer peers that send us data faster
          if (wireA.downloadSpeed() !== wireB.downloadSpeed()) {
            return wireA.downloadSpeed() - wireB.downloadSpeed()
          }

          // then prefer peers that can download data from us faster
          if (wireA.uploadSpeed() !== wireB.uploadSpeed()) {
            return wireA.uploadSpeed() - wireB.uploadSpeed()
          }

          // then prefer already unchoked peers (to minimize fibrillation)
          if (wireA.amChoking !== wireB.amChoking) {
            return wireA.amChoking ? -1 : 1 // choking < unchoked
          }

          // otherwise random order
          return objA.random - objB.random
        })
        .map(obj => obj.wire) // return array of wires (remove random seed)

    if (this._rechokeOptimisticTime <= 0) {
      // clear old optimistic peer, so it can be rechoked normally and then replaced
      this._rechokeOptimisticWire = null
    } else {
      this._rechokeOptimisticTime -= 1
    }

    let numInterestedUnchoked = 0
    // leave one rechoke slot open for optimistic unchoking
    while (wireStack.length > 0 && numInterestedUnchoked < this._rechokeNumSlots - 1) {
      const wire = wireStack.pop() // next best quality peer

      if (wire.isSeeder || wire === this._rechokeOptimisticWire) {
        continue
      }

      wire.unchoke()

      // only stop unchoking once we fill the slots with interested peers that will actually download
      if (wire.peerInterested) {
        numInterestedUnchoked++
      }
    }

    // fill optimistic unchoke slot if empty
    if (this._rechokeOptimisticWire === null && this._rechokeNumSlots > 0) {
      // don't optimistically unchoke uninterested peers
      const remaining = wireStack.filter(wire => wire.peerInterested)

      if (remaining.length > 0) {
        // select random remaining (not yet unchoked) peer
        const newOptimisticPeer = remaining[randomInt(remaining.length)]

        newOptimisticPeer.unchoke()

        this._rechokeOptimisticWire = newOptimisticPeer

        this._rechokeOptimisticTime = RECHOKE_OPTIMISTIC_DURATION
      }
    }

    // choke the rest
    wireStack
      .filter(wire => wire !== this._rechokeOptimisticWire) // except the optimistically unchoked peer
      .forEach(wire => wire.choke())
  }

  /**
   * Attempts to cancel a slow block request from another wire such that the
   * given wire may effectively swap out the request for one of its own.
   */
  _hotswap (wire, index) {
    const speed = wire.downloadSpeed()
    if (speed < Piece.BLOCK_LENGTH) return false
    if (!this._reservations[index]) return false

    const r = this._reservations[index]
    if (!r) {
      return false
    }

    let minSpeed = Infinity
    let minWire

    let i
    for (i = 0; i < r.length; i++) {
      const otherWire = r[i]
      if (!otherWire || otherWire === wire) continue

      const otherSpeed = otherWire.downloadSpeed()
      if (otherSpeed >= SPEED_THRESHOLD) continue
      if (2 * otherSpeed > speed || otherSpeed > minSpeed) continue

      minWire = otherWire
      minSpeed = otherSpeed
    }

    if (!minWire) return false

    for (i = 0; i < r.length; i++) {
      if (r[i] === minWire) r[i] = null
    }

    for (i = 0; i < minWire.requests.length; i++) {
      const req = minWire.requests[i]
      if (req.piece !== index) continue

      this.pieces[index].cancel((req.offset / Piece.BLOCK_LENGTH) | 0)
    }

    this.emit('hotswap', minWire, wire, index)
    return true
  }

  /**
   * Attempts to request a block from the given wire.
   */
  _request (wire, index, hotswap) {
    const self = this
    const numRequests = wire.requests.length
    const isWebSeed = wire.type === 'webSeed'

    if (self.bitfield.get(index)) return false

    const maxOutstandingRequests = isWebSeed
      ? Math.min(
        getPiecePipelineLength(wire, PIPELINE_MAX_DURATION, self.pieceLength),
        self.maxWebConns
      )
      : getBlockPipelineLength(wire, PIPELINE_MAX_DURATION)

    if (numRequests >= maxOutstandingRequests) return false
    // var endGame = (wire.requests.length === 0 && self.store.numMissing < 30)

    const piece = self.pieces[index]
    let reservation = isWebSeed ? piece.reserveRemaining() : piece.reserve()

    if (reservation === -1 && hotswap && self._hotswap(wire, index)) {
      reservation = isWebSeed ? piece.reserveRemaining() : piece.reserve()
    }
    if (reservation === -1) return false

    let r = self._reservations[index]
    if (!r) r = self._reservations[index] = []
    let i = r.indexOf(null)
    if (i === -1) i = r.length
    r[i] = wire

    const chunkOffset = piece.chunkOffset(reservation)
    const chunkLength = isWebSeed ? piece.chunkLengthRemaining(reservation) : piece.chunkLength(reservation)

    wire.request(index, chunkOffset, chunkLength, async function onChunk (err, chunk) {
      if (self.destroyed) return

      // TODO: what is this for?
      if (!self.ready) return self.once('ready', () => { onChunk(err, chunk) })

      if (r[i] === wire) r[i] = null

      if (piece !== self.pieces[index]) return onUpdateTick()

      if (err) {
        self._debug(
          'error getting piece %s (offset: %s length: %s) from %s: %s',
          index, chunkOffset, chunkLength, `${wire.remoteAddress}:${wire.remotePort}`,
          err.message
        )
        isWebSeed ? piece.cancelRemaining(reservation) : piece.cancel(reservation)
        onUpdateTick()
        return
      }

      self._debug(
        'got piece %s (offset: %s length: %s) from %s',
        index, chunkOffset, chunkLength, `${wire.remoteAddress}:${wire.remotePort}`
      )

      if (!piece.set(reservation, chunk, wire)) return onUpdateTick()

      const buf = piece.flush()

      // TODO: might need to set self.pieces[index] = null here since sha1 is async

      const hex = await (0,browser/* hash */.tW)(buf, 'hex')
      if (self.destroyed) return

      if (hex === self._hashes[index]) {
        self._debug('piece verified %s', index)

        self.store.put(index, buf, err => {
          if (err) {
            self._destroy(err)
            return
          } else {
            self.pieces[index] = null
            self._markVerified(index)
            self.wires.forEach(wire => {
              wire.have(index)
            })
          }
          self._checkDone()
          onUpdateTick()
        })
      } else {
        self.pieces[index] = new Piece(piece.length)
        self.emit('warning', new Error(`Piece ${index} failed verification`))
        onUpdateTick()
      }
    })

    function onUpdateTick () {
      queue_microtask(() => { self._update() })
    }

    return true
  }

  _checkDone () {
    if (this.destroyed) return

    // are any new files done?
    this.files.forEach(file => {
      if (file.done) return
      for (let i = file._startPiece; i <= file._endPiece; ++i) {
        if (!this.bitfield.get(i)) return
      }
      file.done = true
      file.emit('done')
      this._debug(`file done: ${file.name}`)
    })

    // is the torrent done? (if everything is downloaded)
    const done = this.files.every(file => file.done)

    if (!this.done && done) {
      this.done = true
      this._debug(`torrent done: ${this.infoHash}`)
      this.emit('done')
      // We also check `this.destroyed` since `torrent.destroy()` could have been
      // called in the `torrent.on('done')` handler.
      if (!this.destroyed) this.discovery.complete()
    } else if (this.done && !done) {
      this.done = false
      // this isn't according to spec, once a torrent is done it's done, but we allow devs
      // to unmark pieces, so to re-download them we need to re-announce to
      // trackers that "hey we need peers". This means triggering complete multiple times
      // thats bad, but can't do much about it.
      this.discovery.tracker?.start()
    }
    this._gcSelections()

    return done
  }

  async load (streams, cb) {
    if (this.destroyed) throw new Error('torrent is destroyed')
    if (!this.ready) return this.once('ready', () => { this.load(streams, cb) })

    if (!Array.isArray(streams)) streams = [streams]
    if (!cb) cb = torrent_noop

    try {
      await chunkStoreWrite(this.store, join_async_iterator(streams), { chunkLength: this.pieceLength })
      this._markAllVerified()
      this._checkDone()
      cb(null)
    } catch (err) {
      cb(err)
      return err
    }
  }

  pause () {
    if (this.destroyed) return
    this._debug('pause')
    this.paused = true
  }

  resume () {
    if (this.destroyed) return
    this._debug('resume')
    this.paused = false
    this._drain()
  }

  _debug (...args) {
    args[0] = `[${this.client._debugId}] [${this._debugId}] ${args[0]}`
    torrent_debug(...args)
  }

  /**
   * Pop a peer off the FIFO queue and connect to it. When _drain() gets called,
   * the queue will usually have only one peer in it, except when there are too
   * many peers (over `this.maxConns`) in which case they will just sit in the
   * queue until another connection closes.
   */
  _drain () {
    this._debug('_drain numConns %s maxConns %s _peersLength %s', this._numConns, this.client.maxConns, this._peersLength)
    if (typeof net_ignored_.connect !== 'function' || this.destroyed || this.paused ||
        this._numConns >= this.client.maxConns) {
      return
    }
    this._debug('drain (%s queued, %s/%s peers)', this._numQueued, this.numPeers, this.client.maxConns)

    const peer = this._queue.shift()
    if (!peer) return // queue could be empty

    this._debug('%s connect attempt to %s', peer.type, peer.addr)

    const parts = addrToIPPort(peer.addr)
    const opts = {
      host: parts[0],
      port: parts[1]
    }

    if (this.client.utp && peer.type === lib_peer/* default */.A.TYPE_UTP_OUTGOING) {
      peer.conn = utp_ignored_.connect(opts.port, opts.host)
    } else {
      peer.conn = net_ignored_.connect(opts)
    }

    const conn = peer.conn

    conn.once('connect', () => { if (!this.destroyed) peer.onConnect() })
    conn.once('error', err => { peer.destroy(err) })
    peer.startConnectTimeout()

    // When connection closes, attempt reconnect after timeout (with exponential backoff)
    conn.on('close', () => {
      if (this.destroyed) return

      if (peer.retries >= RECONNECT_WAIT.length) {
        if (this.client.utp) {
          const newPeer = this._addPeer(peer.addr, 'tcp', peer.source)
          if (newPeer) newPeer.retries = 0
        } else {
          this._debug(
            'conn %s closed: will not re-add (max %s attempts)',
            peer.addr, RECONNECT_WAIT.length
          )
        }
        return
      }

      const ms = RECONNECT_WAIT[peer.retries]
      this._debug(
        'conn %s closed: will re-add to queue in %sms (attempt %s)',
        peer.addr, ms, peer.retries + 1
      )

      const reconnectTimeout = setTimeout(() => {
        if (this.destroyed) return
        const host = addrToIPPort(peer.addr)[0]
        const type = (this.client.utp && this._isIPv4(host)) ? 'utp' : 'tcp'
        const newPeer = this._addPeer(peer.addr, type, peer.source)
        if (newPeer) newPeer.retries = peer.retries + 1
      }, ms)
      if (reconnectTimeout.unref) reconnectTimeout.unref()
    })
  }

  /**
   * Returns `true` if string is valid IPv4/6 address.
   * @param {string} addr
   * @return {boolean}
   */
  _validAddr (addr) {
    let parts
    try {
      parts = addrToIPPort(addr)
    } catch (e) {
      return false
    }
    const host = parts[0]
    const port = parts[1]
    return port > 0 && port < 65535 &&
      !(host === '127.0.0.1' && port === this.client.torrentPort)
  }

  /**
   * Return `true` if string is a valid IPv4 address.
   * @param {string} addr
   * @return {boolean}
   */
  _isIPv4 (addr) {
    const IPv4Pattern = /^((?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])[.]){3}(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/
    return IPv4Pattern.test(addr)
  }
}

function getBlockPipelineLength (wire, duration) {
  let length = 2 + Math.ceil(duration * wire.downloadSpeed() / Piece.BLOCK_LENGTH)

  // Honor reqq (maximum number of outstanding request messages) if specified by peer
  if (wire.peerExtendedHandshake) {
    const reqq = wire.peerExtendedHandshake.reqq
    if (typeof reqq === 'number' && reqq > 0) {
      length = Math.min(length, reqq)
    }
  }

  return length
}

function getPiecePipelineLength (wire, duration, pieceLength) {
  return 1 + Math.ceil(duration * wire.downloadSpeed() / pieceLength)
}

/**
 * Returns a random integer in [0,high)
 */
function randomInt (high) {
  return Math.random() * high | 0
}

function torrent_noop () {}

// EXTERNAL MODULE: http (ignored)
var http_ignored_ = __webpack_require__(4043);
// EXTERNAL MODULE: ./node_modules/escape-html/index.js
var escape_html = __webpack_require__(580);
// EXTERNAL MODULE: ./node_modules/pump/index.js
var pump = __webpack_require__(815);
// EXTERNAL MODULE: ./node_modules/range-parser/index.js
var range_parser = __webpack_require__(2878);
;// ./lib/server.js







const keepAliveTime = 20000

class ServerBase {
  constructor (client, opts = {}) {
    this.client = client
    if (!opts.origin) opts.origin = '*' // allow all origins by default
    this.opts = opts
    this.pendingReady = new Set()
  }

  static serveIndexPage (res, torrents, pathname) {
    const listHtml = torrents
      .map(torrent => (
      `<li>
        <a href="${escape_html(pathname)}/${torrent.infoHash}">
          ${escape_html(torrent.name)}
        </a>
        (${escape_html(torrent.length)} bytes)
      </li>`
      ))
      .join('<br>')

    res.status = 200
    res.headers['Content-Type'] = 'text/html'
    res.body = getPageHTML(
      'WebTorrent',
      `<h1>WebTorrent</h1>
       <ol>${listHtml}</ol>`
    )

    return res
  }

  isOriginAllowed (req) {
    // When `origin` option is `false`, deny all cross-origin requests
    if (this.opts.origin === false) return false

    // The user allowed all origins
    if (this.opts.origin === '*') return true

    // Allow requests where the 'Origin' header matches the `opts.origin` setting
    return req.headers.origin === this.opts.origin
  }

  static serveMethodNotAllowed (res) {
    res.status = 405
    res.headers['Content-Type'] = 'text/html'

    res.body = getPageHTML(
      '405 - Method Not Allowed',
      '<h1>405 - Method Not Allowed</h1>'
    )

    return res
  }

  static serve404Page (res) {
    res.status = 404
    res.headers['Content-Type'] = 'text/html'

    res.body = getPageHTML(
      '404 - Not Found',
      '<h1>404 - Not Found</h1>'
    )
    return res
  }

  static serveTorrentPage (torrent, res, pathname) {
    const listHtml = torrent.files
      .map(file => (
      `<li>
        <a href="${escape_html(pathname)}/${torrent.infoHash}/${escape_html(file.path)}">
          ${escape_html(file.path)}
        </a>
        (${escape_html(file.length)} bytes)
      </li>`
      ))
      .join('<br>')

    res.status = 200
    res.headers['Content-Type'] = 'text/html'

    res.body = getPageHTML(
      `${escape_html(torrent.name)} - WebTorrent`,
      `<h1>${escape_html(torrent.name)}</h1>
      <ol>${listHtml}</ol>`
    )

    return res
  }

  static serveOptionsRequest (req, res) {
    res.status = 204 // no content
    res.headers['Access-Control-Max-Age'] = '600'
    res.headers['Access-Control-Allow-Methods'] = 'GET,HEAD'

    if (req.headers['access-control-request-headers']) {
      res.headers['Access-Control-Allow-Headers'] = req.headers['access-control-request-headers']
    }
    return res
  }

  static serveFile (file, req, res) {
    res.status = 200

    // Disable caching as data is local anyways
    res.headers.Expires = '0'
    res.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
    // Support range-requests
    res.headers['Accept-Ranges'] = 'bytes'
    res.headers['Content-Type'] = file.type
    // Support DLNA streaming
    res.headers['transferMode.dlna.org'] = 'Streaming'
    res.headers['contentFeatures.dlna.org'] = 'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000'

    // Force the browser to download the file if if it's opened in a new tab
    // Set name of file (for "Save Page As..." dialog)
    if (req.destination === 'document') {
      res.headers['Content-Type'] = 'application/octet-stream'
      res.headers['Content-Disposition'] = `attachment; filename*=UTF-8''${encodeRFC5987(file.name)}`
      res.body = 'DOWNLOAD'
    } else {
      res.headers['Content-Disposition'] = `inline; filename*=UTF-8''${encodeRFC5987(file.name)}`
    }

    // `rangeParser` returns an array of ranges, or an error code (number) if
    // there was an error parsing the range.
    let range = range_parser(file.length, req.headers.range || '')

    if (Array.isArray(range)) {
      res.status = 206 // indicates that range-request was understood

      // no support for multi-range request, just use the first range
      range = range[0]

      res.headers['Content-Range'] = `bytes ${range.start}-${range.end}/${file.length}`

      res.headers['Content-Length'] = range.end - range.start + 1
    } else {
      res.statusCode = 200
      range = null
      res.headers['Content-Length'] = file.length
    }

    if (req.method === 'GET') {
      const iterator = file[Symbol.asyncIterator](range)
      let transform = null
      file.emit('iterator', { iterator, req, file }, target => {
        transform = target
      })

      const stream = streamx.Readable.from(transform || iterator)
      let pipe = null
      file.emit('stream', { stream, req, file }, target => {
        pipe = pump(stream, target)
      })

      res.body = pipe || stream
    } else {
      res.body = false
    }
    return res
  }

  async onRequest (req, cb) {
    let pathname = new URL(req.url, 'http://example.com').pathname
    pathname = pathname.slice(pathname.indexOf(this.pathname) + this.pathname.length + 1)

    const res = {
      headers: {
        // Prevent browser mime-type sniffing
        'X-Content-Type-Options': 'nosniff',
        // Defense-in-depth: Set a strict Content Security Policy to mitigate XSS
        'Content-Security-Policy': "base-uri 'none'; frame-ancestors 'none'; form-action 'none';"
      }
    }

    // Allow cross-origin requests (CORS)
    if (this.isOriginAllowed(req)) {
      res.headers['Access-Control-Allow-Origin'] = this.opts.origin === '*' ? '*' : req.headers.origin
    }

    if (pathname === 'favicon.ico') {
      return cb(ServerBase.serve404Page(res))
    }

    // Allow CORS requests to specify arbitrary headers, e.g. 'Range',
    // by responding to the OPTIONS preflight request with the specified
    // origin and requested headers.
    if (req.method === 'OPTIONS') {
      if (this.isOriginAllowed(req)) return cb(ServerBase.serveOptionsRequest(req, res))
      else return cb(ServerBase.serveMethodNotAllowed(res))
    }

    const onReady = async () => {
      this.pendingReady.delete(onReady)
      const res = await handleRequest()
      cb(res)
    }

    const handleRequest = async () => {
      if (pathname === '') {
        return ServerBase.serveIndexPage(res, this.client.torrents, this.pathname)
      }

      let [infoHash, ...filePath] = pathname.split('/')
      filePath = decodeURI(filePath.join('/'))

      const torrent = await this.client.get(infoHash)
      if (!infoHash || !torrent) {
        return ServerBase.serve404Page(res)
      }

      if (!filePath) {
        return ServerBase.serveTorrentPage(torrent, res, this.pathname)
      }

      const file = torrent.files.find(file => file.path.replace(/\\/g, '/') === filePath)
      if (!file) {
        return ServerBase.serve404Page(res)
      }
      return ServerBase.serveFile(file, req, res)
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      if (this.client.ready) {
        const res = await handleRequest()
        return cb(res)
      } else {
        this.pendingReady.add(onReady)
        this.client.once('ready', onReady)
        return
      }
    }

    return cb(ServerBase.serveMethodNotAllowed(res))
  }

  close (cb = () => {}) {
    this.closed = true
    this.pendingReady.forEach(onReady => {
      this.client.removeListener('ready', onReady)
    })
    this.pendingReady.clear()
    queue_microtask(cb)
  }

  destroy (cb = () => {}) {
    // Only call `server.close` if user has not called it already
    if (this.closed) queue_microtask(cb)
    else this.close(cb)
    this.client = null
  }
}

class NodeServer extends ServerBase {
  constructor (client, opts) {
    super(client, opts)

    this.server = http_ignored_.createServer()
    this._listen = this.server.listen
    this.server.listen = this.listen.bind(this)
    this._close = this.server.close
    this.server.close = this.close.bind(this)

    this.sockets = new Set()
    this.closed = false
    this.pathname = opts?.pathname || '/webtorrent'
  }

  wrapRequest (req, res) {
    // If a 'hostname' string is specified, deny requests with a 'Host'
    // header that does not match the origin of the torrent server to prevent
    // DNS rebinding attacks.
    if (this.opts.hostname && req.headers.host !== `${this.opts.hostname}:${this.server.address().port}`) {
      return req.destroy()
    }

    if (!new URL(req.url, 'http://example.com').pathname.startsWith(this.pathname)) {
      return req.destroy()
    }

    this.onRequest(req, ({ status, headers, body }) => {
      res.writeHead(status, headers)

      if (!!body?._readableState || !!body?._writableState) { // this is probably a bad way of checking? idk
        pump(body, res)
      } else {
        res.end(body)
      }
    })
  }

  onConnection (socket) {
    socket.setTimeout(36000000)
    this.sockets.add(socket)
    socket.once('close', () => {
      this.sockets.delete(socket)
    })
  }

  address () {
    return this.server.address()
  }

  listen (...args) {
    this.closed = false
    this.server.on('connection', this.onConnection.bind(this))
    this.server.on('request', this.wrapRequest.bind(this))
    return this._listen.apply(this.server, args)
  }

  close (cb = () => {}) {
    this.server.removeAllListeners('connection')
    this.server.removeAllListeners('request')
    this.server.removeAllListeners('listening')
    super.close()
    this._close.call(this.server, cb)
  }

  destroy (cb) {
    this.sockets.forEach(socket => {
      socket.destroy()
    })
    super.destroy(cb)
  }
}

class BrowserServer extends ServerBase {
  constructor (client, opts) {
    super(client, opts)

    this.registration = opts.controller
    this.workerKeepAliveInterval = null
    this.workerPortCount = 0

    const scope = new URL(opts.controller.scope)
    this.pathname = scope.pathname + 'webtorrent'
    this._address = {
      port: scope.port,
      family: 'IPv4', // might be a bad idea?
      address: scope.hostname
    }

    this.boundHandler = this.wrapRequest.bind(this)
    navigator.serviceWorker.addEventListener('message', this.boundHandler)
    // test if browser supports cancelling sw Readable Streams
    fetch(`${this.pathname}/cancel/`).then(res => {
      res.body.cancel()
    })
  }

  wrapRequest (event) {
    const req = event.data

    if (!req?.type === 'webtorrent' || !req.url) return null

    const [port] = event.ports
    this.onRequest(req, ({ status, headers, body }) => {
      const asyncIterator = body[Symbol.asyncIterator]?.()

      const cleanup = () => {
        port.onmessage = null
        if (body?.destroy) body.destroy()
        this.workerPortCount--
        if (!this.workerPortCount) {
          clearInterval(this.workerKeepAliveInterval)
          this.workerKeepAliveInterval = null
        }
      }

      port.onmessage = async msg => {
        if (msg.data) {
          let chunk
          try {
            chunk = (await asyncIterator.next()).value
          } catch (e) {
            // chunk is yet to be downloaded or it somehow failed, should this be logged?
          }
          port.postMessage(chunk)
          if (!chunk) cleanup()
          if (!this.workerKeepAliveInterval) {
            this.workerKeepAliveInterval = setInterval(() => fetch(`${this.pathname}/keepalive/`), keepAliveTime)
          }
        } else {
          cleanup()
        }
      }
      this.workerPortCount++
      port.postMessage({
        status,
        headers,
        body: asyncIterator ? 'STREAM' : body
      })
    })
  }

  // for compatibility with node version
  listen (_, cb) {
    cb()
  }

  address () {
    return this._address
  }

  close (cb) {
    navigator.serviceWorker.removeEventListener('message', this.boundHandler)
    super.close(cb)
  }

  destroy (cb) {
    super.destroy(cb)
  }
}

// NOTE: Arguments must already be HTML-escaped
function getPageHTML (title, pageHtml) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body>
        ${pageHtml}
      </body>
    </html>
  `
}

// From https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
function encodeRFC5987 (str) {
  return encodeURIComponent(str)
    // Note that although RFC3986 reserves "!", RFC5987 does not,
    // so we do not need to escape it
    .replace(/['()]/g, escape) // i.e., %27 %28 %29
    .replace(/\*/g, '%2A')
    // The following are not required for percent-encoding per RFC5987,
    // so we can allow for a little better readability over the wire: |`^
    .replace(/%(?:7C|60|5E)/g, unescape)
}



;// ./index.js
/*! webtorrent. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */




 // browser exclude
 // browser exclude







 // browser exclude
 // browser exclude





const index_debug = src_browser('webtorrent')

/**
 * Version number in Azureus-style. Generated from major and minor semver version.
 * For example:
 *   '0.16.1' -> '0016'
 *   '1.2.5' -> '0102'
 */
const VERSION_STR = version.replace(/\d*./g, v => `0${v % 100}`.slice(-2))
  .slice(0, 4)

/**
 * Version prefix string (used in peer ID). WebTorrent uses the Azureus-style
 * encoding: '-', two characters for client id ('WW'), four ascii digits for version
 * number, '-', followed by random numbers.
 * For example:
 *   '-WW0102-'...
 */
const VERSION_PREFIX = `-WW${VERSION_STR}-`

/**
 * WebTorrent Client
 * @param {Object=} opts
 */
class WebTorrent extends events {
  constructor (opts = {}) {
    super()

    if (typeof opts.peerId === 'string') {
      this.peerId = opts.peerId
    } else if (ArrayBuffer.isView(opts.peerId)) {
      this.peerId = (0,browser/* arr2hex */.V5)(opts.peerId)
    } else {
      this.peerId = (0,browser/* arr2hex */.V5)((0,browser/* text2arr */.L0)(VERSION_PREFIX + (0,browser/* arr2base */.NJ)((0,browser/* randomBytes */.po)(9))))
    }
    this.peerIdBuffer = (0,browser/* hex2arr */.fk)(this.peerId)

    if (typeof opts.nodeId === 'string') {
      this.nodeId = opts.nodeId
    } else if (ArrayBuffer.isView(opts.nodeId)) {
      this.nodeId = (0,browser/* arr2hex */.V5)(opts.nodeId)
    } else {
      this.nodeId = (0,browser/* arr2hex */.V5)((0,browser/* randomBytes */.po)(20))
    }
    this.nodeIdBuffer = (0,browser/* hex2arr */.fk)(this.nodeId)

    this._debugId = this.peerId.substring(0, 7)

    this.destroyed = false
    this.listening = false
    this.torrentPort = opts.torrentPort || 0
    this.dhtPort = opts.dhtPort || 0
    this.tracker = opts.tracker !== undefined ? opts.tracker : {}
    this.lsd = opts.lsd !== false
    this.utPex = opts.utPex !== false
    this.natUpnp = opts.natUpnp ?? true
    this.natPmp = opts.natPmp ?? true
    this.torrents = []
    this.maxConns = Number(opts.maxConns) || 55
    this.utp = WebTorrent.UTP_SUPPORT && opts.utp !== false
    this.seedOutgoingConnections = opts.seedOutgoingConnections ?? true

    this._downloadLimit = Math.max((typeof opts.downloadLimit === 'number') ? opts.downloadLimit : -1, -1)
    this._uploadLimit = Math.max((typeof opts.uploadLimit === 'number') ? opts.uploadLimit : -1, -1)

    if ((this.natUpnp || this.natPmp) && typeof nat_api_ignored_ === 'function') {
      this.natTraversal = new nat_api_ignored_({
        enableUPNP: this.natUpnp,
        enablePMP: this.natPmp,
        upnpPermanentFallback: opts.natUpnp === 'permanent'
      })
    }

    if (opts.secure === true) {
      Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 5658)).then(({ enableSecure }) => enableSecure())
    }

    this._debug(
      'new webtorrent (peerId %s, nodeId %s, port %s)',
      this.peerId, this.nodeId, this.torrentPort
    )

    this.throttleGroups = {
      down: new speed_limiter.ThrottleGroup({ rate: Math.max(this._downloadLimit, 0), enabled: this._downloadLimit >= 0 }),
      up: new speed_limiter.ThrottleGroup({ rate: Math.max(this._uploadLimit, 0), enabled: this._uploadLimit >= 0 })
    }

    if (this.tracker) {
      if (typeof this.tracker !== 'object') this.tracker = {}
      if (globalThis.WRTC && !this.tracker.wrtc) this.tracker.wrtc = globalThis.WRTC
    }

    if (typeof conn_pool_ignored_ === 'function') {
      this._connPool = new conn_pool_ignored_(this)
    } else {
      queue_microtask(() => {
        this._onListening()
      })
    }

    // stats
    this._downloadSpeed = throughput()
    this._uploadSpeed = throughput()

    if (opts.dht !== false && typeof bittorrent_dht_ignored_.Client === 'function' /* browser exclude */) {
      // use a single DHT instance for all torrents, so the routing table can be reused
      this.dht = new bittorrent_dht_ignored_.Client(Object.assign({}, { nodeId: this.nodeId }, opts.dht))

      this.dht.once('error', err => {
        this._destroy(err)
      })

      this.dht.once('listening', () => {
        const address = this.dht.address()
        if (address) {
          this.dhtPort = address.port
          if (this.natTraversal) {
            this.natTraversal.map({
              publicPort: this.dhtPort,
              privatePort: this.dhtPort,
              protocol: 'udp',
              description: 'WebTorrent DHT'
            }).catch(err => {
              index_debug('error mapping DHT port via UPnP/PMP: %o', err)
            })
          }
        }
      })

      // Ignore warning when there are > 10 torrents in the client
      this.dht.setMaxListeners(0)

      this.dht.listen(this.dhtPort)
    } else {
      this.dht = false
    }

    // Enable or disable BEP19 (Web Seeds). Enabled by default:
    this.enableWebSeeds = opts.webSeeds !== false

    const ready = () => {
      if (this.destroyed) return
      this.ready = true
      this.emit('ready')
    }

    if (typeof load_ip_set_ignored_ === 'function' && opts.blocklist != null) {
      load_ip_set_ignored_(opts.blocklist, {
        headers: {
          'user-agent': `WebTorrent/${version} (https://webtorrent.io)`
        }
      }, (err, ipSet) => {
        if (err) return console.error(`Failed to load blocklist: ${err.message}`)
        this.blocked = ipSet
        ready()
      })
    } else {
      queue_microtask(ready)
    }
  }

  /**
   * Creates an http server to serve the contents of this torrent,
   * dynamically fetching the needed torrent pieces to satisfy http requests.
   * Range requests are supported.
   *
   * @param {{controller: ServiceWorkerRegistration}} options
   * @param {'browser' | 'node'} [force]
   * @return {BrowserServer | NodeServer}
   */
  createServer (options, force) {
    if (this.destroyed) throw new Error('torrent is destroyed')
    if (this._server) throw new Error('server already created')
    if ((typeof window === 'undefined' || force === 'node') && force !== 'browser') {
      // node implementation
      this._server = new NodeServer(this, options)
      return this._server
    } else {
      // browser implementation
      if (!(options?.controller instanceof ServiceWorkerRegistration)) throw new Error('Invalid worker registration')
      if (options.controller.active?.state !== 'activated' && options.controller.active?.state !== 'activating') throw new Error('Worker isn\'t activated')
      this._server = new BrowserServer(this, options)
      return this._server
    }
  }

  get downloadSpeed () { return this._downloadSpeed() }

  get uploadSpeed () { return this._uploadSpeed() }

  get progress () {
    const torrents = this.torrents.filter(torrent => torrent.progress !== 1)
    const downloaded = torrents.reduce((total, torrent) => total + torrent.downloaded, 0)
    const length = torrents.reduce((total, torrent) => total + (torrent.length || 0), 0) || 1
    return downloaded / length
  }

  get ratio () {
    const uploaded = this.torrents.reduce((total, torrent) => total + torrent.uploaded, 0)
    const received = this.torrents.reduce((total, torrent) => total + torrent.received, 0) || 1
    return uploaded / received
  }

  /**
   * Returns the torrent with the given `torrentId`. Convenience method. Easier than
   * searching through the `client.torrents` array. Returns `null` if no matching torrent
   * found.
   *
   * @param  {string|Buffer|Object|Torrent} torrentId
   * @return {Promise<Torrent|null>}
   */
  async get (torrentId) {
    if (torrentId instanceof Torrent) {
      if (this.torrents.includes(torrentId)) return torrentId
    } 
    else {
      const torrents = this.torrents

      for (const torrent of torrents) {
        if (torrent.torrentUrl === torrentId) return torrent
      }
      
      //this is just to add it if it doesn't already exist (why?)
      let parsed
      try { parsed = await parse_torrent(torrentId) } catch (err) {}
      if (!parsed) return null
      if (!parsed.infoHash) throw new Error('Invalid torrent identifier')

      for (const torrent of torrents) {
        if (torrent.infoHash === parsed.infoHash) return torrent
      }
    }
    return null
  }

  /**
   * Start downloading a new torrent. Aliased as `client.download`.
   * @param {string|Buffer|Object} torrentId
   * @param {import('./lib/torrent.js').TorrentOpts | function(torrent: Torrent): void=} opts torrent-specific options
   * @param {function(torrent: Torrent): void=} ontorrent called when the torrent is ready (has metadata)
   */
  add (torrentId, opts = {}, ontorrent = () => {}) {
    if (this.destroyed) throw new Error('client is destroyed')
    if (typeof opts === 'function') [opts, ontorrent] = [{}, opts]

    const onInfoHash = () => {
      if (this.destroyed) return
      for (const t of this.torrents) {
        if (t.infoHash === torrent.infoHash && t !== torrent) {
          torrent._destroy(new Error(`Cannot add duplicate torrent ${torrent.infoHash}`))
          ontorrent(t)
          return
        }
      }
    }

    const onReady = () => {
      if (this.destroyed) return
      ontorrent(torrent)
      this.emit('torrent', torrent)
    }

    function onClose () {
      torrent.removeListener('_infoHash', onInfoHash)
      torrent.removeListener('ready', onReady)
      torrent.removeListener('close', onClose)
    }

    this._debug('add')
    opts = opts ? Object.assign({}, opts) : {}

    const torrent = new Torrent(torrentId, this, opts)
    this.torrents.push(torrent)

    torrent.once('_infoHash', onInfoHash)
    torrent.once('ready', onReady)
    torrent.once('close', onClose)

    this.emit('add', torrent)
    return torrent
  }

  /**
   * Start seeding a new file/folder.
   * @param  {string|File|FileList|Buffer|Array.<string|File|Buffer>} input
   * @param  {Object=} opts
   * @param  {function=} onseed called when torrent is seeding
   */
  seed (input, opts, onseed) {
    if (this.destroyed) throw new Error('client is destroyed')
    if (typeof opts === 'function') [opts, onseed] = [{}, opts]

    this._debug('seed')
    opts = opts ? Object.assign({}, opts) : {}

    // no need to verify the hashes we create
    opts.skipVerify = true

    const isFilePath = typeof input === 'string'

    // When seeding from fs path, initialize store from that path to avoid a copy
    if (isFilePath) opts.path = dirname(input)
    if (!opts.createdBy) opts.createdBy = `WebTorrent/${VERSION_STR}`

    const onTorrent = torrent => {
      const tasks = [
        cb => {
          // when a filesystem path is specified or the store is preloaded, files are already in the FS store
          if (isFilePath || opts.preloadedStore) return cb()
          torrent.load(streams, cb)
        }
      ]
      if (this.dht) {
        tasks.push(cb => {
          torrent.once('dhtAnnounce', cb)
        })
      }
      run_parallel(tasks, err => {
        if (this.destroyed) return
        if (err) return torrent._destroy(err)
        _onseed(torrent)
      })
    }

    const _onseed = torrent => {
      this._debug('on seed')
      if (typeof onseed === 'function') onseed(torrent)
      torrent.emit('seed')
      this.emit('seed', torrent)
    }

    const torrent = this.add(null, opts, onTorrent)
    let streams

    if (index_isFileList(input)) input = Array.from(input)
    else if (!Array.isArray(input)) input = [input]

    run_parallel(input.map(item => async cb => {
      if (!opts.preloadedStore && index_isReadable(item)) {
        const chunks = []
        try {
          for await (const chunk of item) {
            chunks.push(chunk)
          }
        } catch (err) {
          return cb(err)
        }
        const buf = (0,browser/* concat */.xW)(chunks)
        buf.name = item.name
        cb(null, buf)
      } else {
        cb(null, item)
      }
    }), (err, input) => {
      if (this.destroyed) return
      if (err) return torrent._destroy(err)

      parseInput(input, opts, (err, files) => {
        if (this.destroyed) return
        if (err) return torrent._destroy(err)

        streams = files.map(file => file.getStream)

        create_torrent(input, opts, async (err, torrentBuf) => {
          if (this.destroyed) return
          if (err) return torrent._destroy(err)

          const existingTorrent = await this.get(torrentBuf)
          if (existingTorrent) {
            console.warn('A torrent with the same id is already being seeded')
            torrent._destroy()
            if (typeof onseed === 'function') onseed(existingTorrent)
          } else {
            torrent._onTorrentId(torrentBuf)
          }
        })
      })
    })

    return torrent
  }

  /**
   * Remove a torrent from the client.
   * @param  {string|Buffer|Torrent}   torrentId
   * @param  {function} cb
   */
  async remove (torrentId, opts, cb) {
    if (typeof opts === 'function') return this.remove(torrentId, null, opts)

    this._debug('remove')
    const torrent = await this.get(torrentId)
    if (!torrent) throw new Error(`No torrent with id ${torrentId}`)
    this._remove(torrent, opts, cb)
  }

  _remove (torrent, opts, cb) {
    if (!torrent) return
    if (typeof opts === 'function') return this._remove(torrent, null, opts)
    const index = this.torrents.indexOf(torrent)
    if (index === -1) return
    this.torrents.splice(index, 1)
    torrent.destroy(opts, cb)
    if (this.dht) {
      this.dht._tables.remove(torrent.infoHash)
    }
    this.emit('remove', torrent)
  }

  address () {
    if (!this.listening) return null
    return this._connPool
      ? this._connPool.tcpServer.address()
      : { address: '0.0.0.0', family: 'IPv4', port: 0 }
  }

  /**
   * Set global download throttle rate.
   * @param  {Number} rate (must be bigger or equal than zero, or -1 to disable throttling)
   */
  throttleDownload (rate) {
    rate = Number(rate)
    if (isNaN(rate) || !isFinite(rate) || (rate < 0 && rate !== -1)) return false
    this._downloadLimit = Math.round(rate)
    if (this._downloadLimit === -1) return this.throttleGroups.down.setEnabled(false)
    this.throttleGroups.down.setEnabled(true)
    this.throttleGroups.down.setRate(this._downloadLimit)
  }

  /**
   * Set global upload throttle rate
   * @param  {Number} rate (must be bigger or equal than zero, or -1 to disable throttling)
   */
  throttleUpload (rate) {
    rate = Number(rate)
    if (isNaN(rate) || !isFinite(rate) || (rate < 0 && rate !== -1)) return false
    this._uploadLimit = Math.round(rate)
    if (this._uploadLimit === -1) return this.throttleGroups.up.setEnabled(false)
    this.throttleGroups.up.setEnabled(true)
    this.throttleGroups.up.setRate(this._uploadLimit)
  }

  /**
   * Destroy the client, including all torrents and connections to peers.
   * @param  {function} cb
   */
  destroy (cb) {
    if (this.destroyed) throw new Error('client already destroyed')
    this._destroy(null, cb)
  }

  _destroy (err, cb) {
    this._debug('client destroy')
    this.destroyed = true

    const tasks = this.torrents.map(torrent => cb => {
      torrent.destroy(cb)
    })

    if (this._connPool) {
      tasks.push(cb => {
        this._connPool.destroy(cb)
      })
    }

    if (this.dht) {
      tasks.push(cb => {
        this.dht.destroy(cb)
      })
    }

    if (this._server) {
      tasks.push(cb => {
        this._server.destroy(cb)
      })
    }

    if (this.natTraversal) {
      tasks.push(cb => {
        this.natTraversal.destroy()
          .then(() => cb())
      })
    }

    run_parallel(tasks, cb)

    if (err) this.emit('error', err)

    this.torrents = []
    this._connPool = null
    this.dht = null

    this.throttleGroups.down.destroy()
    this.throttleGroups.up.destroy()
  }

  _onListening () {
    this._debug('listening')
    this.listening = true

    if (this._connPool) {
      // Sometimes server.address() returns `null` in Docker.
      const address = this._connPool.tcpServer.address()
      if (address) {
        this.torrentPort = address.port
        if (this.natTraversal) {
          this.natTraversal.map({
            publicPort: this.torrentPort,
            privatePort: this.torrentPort,
            protocol: this.utp ? null : 'tcp',
            description: 'WebTorrent Torrent'
          }).catch(err => {
            index_debug('error mapping WebTorrent port via UPnP/PMP: %o', err)
          })
        }
      }
    }

    this.emit('listening')
  }

  _debug () {
    const args = [].slice.call(arguments)
    args[0] = `[${this._debugId}] ${args[0]}`
    index_debug(...args)
  }

  async _getByHash (infoHashHash) {
    for (const torrent of this.torrents) {
      if (!torrent.infoHashHash) {
        torrent.infoHashHash = await (0,browser/* hash */.tW)((0,browser/* hex2arr */.fk)('72657132' /* 'req2' */ + torrent.infoHash), 'hex')
      }
      if (infoHashHash === torrent.infoHashHash) {
        return torrent
      }
    }

    return null
  }
}

WebTorrent.WEBRTC_SUPPORT = lite.WEBRTC_SUPPORT
WebTorrent.UTP_SUPPORT = conn_pool_ignored_.UTP_SUPPORT
WebTorrent.VERSION = version

/**
 * Check if `obj` is a node Readable stream
 * @param  {*} obj
 * @return {boolean}
 */
function index_isReadable (obj) {
  return typeof obj === 'object' && obj != null && typeof obj.pipe === 'function'
}

/**
 * Check if `obj` is a W3C `FileList` object
 * @param  {*} obj
 * @return {boolean}
 */
function index_isFileList (obj) {
  return typeof FileList !== 'undefined' && obj instanceof FileList
}

export { WebTorrent as default };
