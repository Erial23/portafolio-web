import db from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { checkAuth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const materias = db.prepare('SELECT * FROM materias').all();
    return NextResponse.json(materias);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, file_url } = await request.json();
    const statement = db.prepare('INSERT INTO materias (name, description, file_url) VALUES (?, ?, ?)');
    const result = statement.run(name, description, file_url || null);
    return NextResponse.json({ id: result.lastInsertRowid, name, description, file_url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
