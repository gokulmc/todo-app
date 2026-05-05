import { NextResponse } from 'next/server';
import { taskQueries } from '@/lib/db';

export async function GET() {
  const tasks = taskQueries.getAll();
  return NextResponse.json(tasks);
}

export async function POST(request) {
  const { text } = await request.json();
  if (!text?.trim()) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }
  const result = taskQueries.insert(text.trim());
  return NextResponse.json({ id: result.lastInsertRowid, text: text.trim(), done: 0 }, { status: 201 });
}

export async function DELETE() {
  taskQueries.clearDone();
  return NextResponse.json({ ok: true });
}
