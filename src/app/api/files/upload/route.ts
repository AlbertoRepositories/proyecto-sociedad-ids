import { NextRequest } from "next/server";
import { FileController } from "../../../../controllers/file.controller";

const fileController = new FileController();

export async function POST(request: NextRequest) {
  return fileController.upload(request);
}