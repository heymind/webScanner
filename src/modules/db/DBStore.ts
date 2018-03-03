import 'easy-indexeddb'
const dbReq = indexedDB.open('webScanner', 1)
dbReq.onupgradeneeded = function () {
    const db = <IDBDatabase>this.result
    db.createObjectStore('images', { autoIncrement: true })
    db.createObjectStore('documents')
}
export default abstract class DBStore<T> {
    abstract storeName:string
    store = dbReq.then((db) => db.store(this.storeName, 'readwrite'))
    _get(key):PromiseLike<T> {
        return this.store.then((store) => store.get(key))
    }
    async _put(value?: T, key?: any) {
        const store = await this.store
        if (!key) {
            return store.add(value)
        } else {
            if (value) {
                return store.put(value, key)
            } else {
                return store.delete(key)
            }
        }
    }
}