import { NextRequest } from "next/server";
import { FileController } from "../../../controllers/file.controller";

const fileController = new FileController();

export async function GET(request: NextRequest) {
  return fileController.listFiles(request);
}

export async function POST(request: NextRequest) {
  return fileController.download(request);
}

export async function DELETE(request: NextRequest) {
  return fileController.deleteFile(request);
}