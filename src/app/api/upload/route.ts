import { getUserData } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    console.log("📤 API de upload iniciada");
    const token = await getUserData(request);

    if (!token.sub) {
      console.error("❌ User ID não encontrado");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 403 }
      );
    }

    console.log("👤 Usuário autenticado:", token.sub);
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    console.log("📁 Arquivos recebidos:", files.length);

    if (!files || files.length === 0) {
      console.error("❌ Nenhum arquivo fornecido");
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (const file of files) {
      console.log("🖼️ Processando arquivo:", file.name, file.type, file.size);
      
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        console.log("⚠️ Arquivo não é imagem, pulando:", file.name);
        continue; // Pula arquivos que não são imagens
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.log("⚠️ Arquivo muito grande, pulando:", file.name);
        continue; // Pula arquivos muito grandes
      }

      // Gerar UUID para o nome do arquivo
      const fileId = uuidv4();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${fileId}.${fileExtension}`;

      console.log("🆔 ID gerado:", fileId);
      console.log("📄 Nome do arquivo:", fileName);

      // Criar diretório se não existir
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      // Salvar arquivo
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      console.log("💾 Arquivo salvo em:", filePath);

      uploadedImages.push({
        id: fileId,
        url: `/uploads/${fileName}`,
        originalName: file.name,
        size: file.size,
        type: file.type,
      });

      console.log("✅ Imagem processada:", uploadedImages[uploadedImages.length - 1]);
    }

    console.log("🎉 Upload concluído. Total de imagens:", uploadedImages.length);
    return NextResponse.json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    console.error("❌ Erro no upload:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
} 