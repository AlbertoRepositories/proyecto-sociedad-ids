import { NextRequest, NextResponse } from 'next/server';
import { FileService } from '../services/file.service';

export class FileController {
    private fileService: FileService;

    constructor() {
        this.fileService = new FileService();
    }

    /**
     * POST /api/upload
     * Genera una URL para que el frontend suba el archivo.
     */
    public async upload(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json().catch(() => null);
            const fileName = body?.fileName;
            const fileType = body?.fileType;

            if (!fileName || !fileType) {
                return NextResponse.json({ message: 'FileName and FileType are required' }, { status: 400 });
            }

            const url = await this.fileService.getUploadUrl(fileName, fileType);
            return NextResponse.json({ url });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return NextResponse.json({ message: 'Error generating upload URL', error: message }, { status: 500 });
        }
    }

    /**
     * POST /api/files
     * Genera una URL para descargar un archivo existente.
     */
    public async download(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json().catch(() => null);
            const key = body?.key;

            if (!key) {
                return NextResponse.json({ message: 'Key is required' }, { status: 400 });
            }

            const url = await this.fileService.getDownloadUrl(key);
            return NextResponse.json({ url });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return NextResponse.json({ message: 'Error generating download URL', error: message }, { status: 500 });
        }
    }

    /**
     * GET /api/files
     * Lista los archivos disponibles.
     */
    public async listFiles(req: NextRequest): Promise<NextResponse> {
        try {
            const searchParams = req.nextUrl.searchParams;
            const prefix = searchParams.get('prefix') || '';
            const files = await this.fileService.listFiles(prefix);
            return NextResponse.json(files);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return NextResponse.json({ message: 'Error listing files', error: message }, { status: 500 });
        }
    }

    /**
     * DELETE /api/files
     * Elimina un archivo.
     */
    public async deleteFile(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json().catch(() => null);
            const key = body?.key;

            if (!key) {
                return NextResponse.json({ message: 'Key is required' }, { status: 400 });
            }

            await this.fileService.deleteFile(key);
            return NextResponse.json({ message: 'File deleted successfully' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return NextResponse.json({ message: 'Error deleting file', error: message }, { status: 500 });
        }
    }
}