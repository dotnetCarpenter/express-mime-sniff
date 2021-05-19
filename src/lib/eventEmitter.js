export default EventEmitter

function EventEmitter (storage) {
	return {
		/**
		 * @param {string} namespace
		 * @param {function} f
		 */
		on (namespace, f) {
			if (storage.has(namespace)) {
				storage.get(namespace).set(f)
			}
			//@ts-ignore
			else storage.set(namespace, new Map().set(f))
		},

		/**
		 * @param {string} name
		 * @param {any[]} args
		 */
		trigger (name, ...args) {
			if (!storage.has(name)) return

			for (const f of storage.get(name).keys()) {
				f(...args)
			}
		},

		/**
		 * Remove listeners
		 * If no arguments are provided, all listeners are removed
		 * @param {string} [namespace] If provided then all listeners with that name will be removed
		 * @param {function} [f] If provided then only the listener with that function will be removed
		 */
		remove (namespace, f) {
			if (!namespace) {
				storage.clear()
				return
			}
			if (f) storage.get(namespace).delete(f)
			else storage.delete(namespace)
		},

		destroy () {
			storage.clear()
			storage = null
			console.warn("destroy")
		}
	}
}
