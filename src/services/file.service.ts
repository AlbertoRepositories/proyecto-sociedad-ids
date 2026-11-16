import { r2Repository } from '../repositories/r2.repository';
import { FileObject } from '../models/FileObject';
import { DeleteObjectCommandOutput } from '@aws-sdk/client-s3';

export class FileService {
    /**
     * Genera una URL firmada para que el cliente pueda subir un archivo directamente a R2
     * Esto es más eficiente que pasar el Buffer por nuestro servidor.
     */
    async getUploadUrl(key: string, contentType: string): Promise<string> {
        return await r2Repository.getSignedUrlForUpload(key, contentType);
    }

    /**
     * Genera una URL firmada para descargar un archivo de forma segura.
     */
    async getDownloadUrl(key: string): Promise<string> {
        return await r2Repository.getSignedUrlForDownload(key);
    }

    /**
     * Lista todos los archivos en un prefijo determinado (ej: "uploads/users/")
     */
    async listFiles(prefix: string = ''): Promise<FileObject[]> {
        return await r2Repository.listFiles(prefix);
    }

    /**
     * Elimina un archivo del bucket.
     */
    async deleteFile(key: string): Promise<DeleteObjectCommandOutput> {
        return await r2Repository.deleteFile(key);
    }

}