import { getUserData } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { getLoggerContext } from "@/lib/logger";

const MAX_FILE_SIZE = 5 * 1024 * 1024; //5MB

export async function POST(request: NextRequest) {
  const log = getLoggerContext(request);

  try {
    log.debug("upload route called");
    const token = await getUserData(request);

    if (!token.sub) {
      log.warn("User ID not found");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 403 }
      );
    }

    log.debug(token, "User authenticated");
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    log.debug(files.length, "Files received");

    if (!files || files.length === 0) {
      log.warn("No files provided");
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedImages = [];

    for (const file of files) {
      log.debug(file, "Processing file");

      if (!file.type.startsWith("image/")) {
        log.warn(file, "File is not an image, skipping:");
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        log.warn(file, "File is too large, skipping");
        continue;
      }

      const fileId = uuidv4();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${fileId}.${fileExtension}`;

      log.debug(`Generated file ID: ${fileId}`);
      log.debug(`Generated file name: ${fileName}`);

      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      log.debug(`File saved at: ${filePath}`);

      uploadedImages.push({
        id: fileId,
        url: `/uploads/${fileName}`,
        originalName: file.name,
        size: file.size,
        type: file.type,
      });

      log.debug(uploadedImages[uploadedImages.length - 1], "Image uploaded");
    }

    log.debug(uploadedImages.length, "Uploaded images count");
    return NextResponse.json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    log.error(error, "Error in upload route");
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
