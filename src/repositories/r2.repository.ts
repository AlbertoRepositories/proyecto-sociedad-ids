// Code based on: https://github.com/diwosuwanto/cloudflare-r2-with-nextjs-upload-download-delete
import {
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { FileObject } from '../models/FileObject'
import { R2_BUCKET } from '../lib/r2_connect'
import S3 from '../lib/r2_connect'
import { Logger } from '../logger/logger'


export class r2Repository {
    static async uploadFile(file: Buffer, key: string) {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            Body: file
        })

        try {
            const response = await S3.send(command)
            return response
        } catch (error) {
            Logger.error('Error uploading file: ' + error)
            throw error
        }
    }

    static async getSignedUrlForUpload(
        key: string,
        contentType: string
    ): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            ContentType: contentType
        })

        try {
            const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 })
            return signedUrl
        } catch (error) {
            Logger.error('Error generating signed URL: ' + error)
            throw error
        }
    }

    static async getSignedUrlForDownload(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: R2_BUCKET,
            Key: key
        })

        try {
            const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 })
            return signedUrl
        } catch (error) {
            Logger.error('Error generating signed URL: ' + error)
            throw error
        }
    }

    static async listFiles(prefix: string = ''): Promise<FileObject[]> {
        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: prefix
        })

        try {
            const response = await S3.send(command)
            return response.Contents || []
        } catch (error) {
            Logger.error('Error listing files: ' + error)
            throw error
        }
    }

    static async deleteFile(key: string) {
        const command = new DeleteObjectCommand({
            Bucket: R2_BUCKET,
            Key: key
        })

        try {
            const response = await S3.send(command)
            return response
        } catch (error) {
            Logger.error('Error deleting file: ' + error)
            throw error
        }
    }
}