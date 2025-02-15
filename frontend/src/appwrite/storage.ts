import { Client, Storage, ID, Databases, Query } from "appwrite"
import conf from "@/conf/conf"

export class StorageService {
  private client = new Client()
  private storage: Storage
  private databases: Databases

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)

    this.storage = new Storage(this.client)
    this.databases = new Databases(this.client)
  }

  async uploadImage(file: File) {
    try {
      const response = await this.storage.createFile(conf.appwriteBucketId, ID.unique(), file)
      return response
    } catch (error) {
      console.error("Appwrite service :: uploadImage :: error", error)
      throw error
    }
  }

  async deleteImage(fileId: string) {
    try {
      await this.storage.deleteFile(conf.appwriteBucketId, fileId)
      return true
    } catch (error) {
      console.error("Appwrite service :: deleteImage :: error", error)
      return false
    }
  }

  getFilePreview(fileId: string) {
    return this.storage.getFilePreview(conf.appwriteBucketId, fileId)
  }

  async saveDrawingMetadata({
    userId,
    fileId,
    title,
    description,
  }: {
    userId: string
    fileId: string
    title: string
    description: string
  }) {
    try {
      const response = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteDrawingsCollectionId,
        ID.unique(),
        {
          userId,
          drawingImage: fileId,
          title,
          description,
        },
      )
      return response
    } catch (error) {
      console.error("Appwrite service :: saveDrawingMetadata :: error", error)
      throw error
    }
  }

  async getUserSavedImages(userId: string): Promise<{
    $id: string;
    title: string;
    description: string;
    drawingImage: string;
  }[]> {
    try {
      const response = await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteDrawingsCollectionId, [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
      ])
      
      return response.documents.map(doc => ({
        $id: doc.$id,
        title: doc.title,
        description: doc.description,
        drawingImage: doc.drawingImage,
      }))
    } catch (error) {
      console.error("Appwrite service :: getUserSavedImages :: error", error)
      throw error
    }
  }
}

const storageService = new StorageService()
export default storageService
