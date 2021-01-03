/**
 * @param {string} msg
 * @returns {never}
 */
exports.raise = function raise(msg) {
	throw new Error(msg)
}
