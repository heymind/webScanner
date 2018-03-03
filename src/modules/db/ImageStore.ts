import DBStore from './DBStore'
export interface IImage {
    id?:number,
    image: Blob,
    url: string
}
export class Image implements IImage {
    id
    constructor(public image: Blob) { }
    get url() {
        return URL.createObjectURL(this.image)
    }
}
export class ImageStore extends DBStore<Blob> {
    storeName = 'images'
    get(key) {
        return this._get(key).then(data => new Image(data))
    }
    async put(value?: Image, key?: any) {
        return this._put(value ? value.image : null, key)
    }
}