import 'easy-indexeddb'
const dbReq = indexedDB.open('webScanner', 1)
dbReq.onupgradeneeded = function () {
    const db = <IDBDatabase>this.result
    db.createObjectStore('images', { keyPath:'id',autoIncrement: true })
    db.createObjectStore('documents')
}
export default abstract class DBStore<T extends {id?:any}> {
    public abstract storeName:string
    store = dbReq.then((db) => db.store(this.storeName, 'readwrite'))
    get(id):PromiseLike<T> {
        return this.store.then((store) => store.get(id))
    }
    async put(data:T) {
        const store = await this.store
        if (!data.id) {
            return store.add(data)
        } else {
            return store.put(data)
        }
    }

    delete(id){
        return this.store.then((store) => store.delete(id))
    }
}