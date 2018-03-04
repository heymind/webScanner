import DBStore from './DBStore'
export interface IImage {
    id?:number,
    image: Blob
}

export class ImageStore extends DBStore<IImage> {
    storeName = 'images'
}

export class Image implements IImage {
    public static store = new ImageStore()
    private constructor(public id:number,public image:Blob){}
    async replaceImage(imageData:Blob){
        this.image = imageData
        await Image.store.put(this)
    }
    async destory(id){
        await Image.store.delete(id)
    }
    get url() {
        return URL.createObjectURL(this.image)
    }
    static async get(id){
        const data = await Image.store.get(id)
        return new Image(data.id,data.image)

    }
    static async create(imageData:Blob){
        const imageId = await Image.store.put({image:imageData})
        return new Image(imageId,imageData)
    }
}