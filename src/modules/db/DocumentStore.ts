import DBStore from './DBStore'
import {IImage,Image} from './ImageStore'
export interface IDocumentModel {
    id?:number
    title:string,
    tags:Array<string>,
    updatedTime:string,
    createdTime:string,
    coverImageId?:number,
    pageIdList:Array<{source:number,result:number}>
}
export interface IDocument {
    id?:number
    title:string,
    tags?:Array<string>,
    updatedTime?:string,
    createdTime?:string,
    coverImage?:IImage,
    pages?:Array<{source:IImage,result:IImage}>
}

export class DocumentStore extends DBStore<IDocumentModel> {
    storeName = 'documents'
}

export class Document implements IDocument,IDocumentModel {
    public static store = new DocumentStore()
    public id:number
    public title:string
    public tags:Array<string> = []
    public updatedTime = (new Date()).toISOString()
    public createdTime = (new Date()).toISOString()
    public coverImage:IImage
    public pages:Array<{source:IImage,result:IImage}> = []
    public coverImageId:number
    public pageIdList:Array<{source:number,result:number}> = []

    toDocumentModel():IDocumentModel {
        return {
            id:this.id,
            title:this.title,
            tags:this.tags,
            updatedTime:this.updatedTime,
            createdTime:this.createdTime,
            coverImageId:this.coverImageId,
            pageIdList:this.pageIdList
        }
    }
    async save(){
        await Document.store.put(this.toDocumentModel())
        return this
    }
    async replaceCoverImage(image:Image){
        this.coverImageId = image.id
        return await this.save()
    }
    async insertPage(where:number,{source,result}:{source:IImage,result:IImage}){
        this.pageIdList.splice(where,0,{source:source.id,result:result.id})
        this.pages.splice(where,0,{source,result})
        return await this.save()
    }
    async removePage(where:number){
        await Image.store.delete(this.pageIdList[where].source)
        await Image.store.delete(this.pageIdList[where].result)
        this.pageIdList.splice(where,1)
        this.pages.splice(where,1)
        return await this.save()
    }
    static async create(data:IDocument){
        let document = new Document()
        Object.assign(document,data)
        if(document.coverImage) document.coverImageId = document.coverImage.id
        document.pageIdList = document.pages.map(({source,result})=>({source:source.id,result:result.id}))
        return await document.save()
    }
    static async get(id){
        const data = await Document.store.get(id)
        let document = new Document()
        Object.assign(document,data)
        document.pages = await Promise.all(document.pageIdList
            .map(({source,result})=>
                Promise.all([Image.get(source),Image.get(result)])
                .then(([source,result])=>({source,result}))
            ))
        if(document.coverImageId) document.coverImage = await Image.get(document.coverImageId)
        return document
    }
}