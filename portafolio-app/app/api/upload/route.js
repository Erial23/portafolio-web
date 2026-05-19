import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import crypto from 'crypto';
import { checkAuth } from '@/app/lib/auth';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.zip', '.rar', '.png', '.jpg', '.jpeg', '.mp4', '.webm', '.ogg', '.mov'];

export async function POST(request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "El archivo es demasiado grande. Máximo 20MB." }, { status: 400 });
    }

    // Validar extensión
    const originalName = file.name.toLowerCase();
    const isAllowedExt = ALLOWED_EXTENSIONS.some(ext => originalName.endsWith(ext));
    
    if (!isAllowedExt) {
      return NextResponse.json({ error: "Tipo de archivo no permitido." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Guardar en data/uploads (para persistencia en Docker/Render)
    const uploadDir = join(process.cwd(), 'data', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const ext = originalName.includes('.') ? originalName.substring(originalName.lastIndexOf('.')) : '';
    const filename = crypto.randomUUID() + ext;
    const path = join(uploadDir, filename);

    await writeFile(path, buffer);
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
