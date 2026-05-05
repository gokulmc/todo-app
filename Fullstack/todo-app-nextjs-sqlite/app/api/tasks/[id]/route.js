import { NextResponse } from 'next/server';
import { taskQueries } from '@/lib/db';

export async function PUT(request, { params }) {
  const { id } = await params;
  const { done } = await request.json();
  taskQueries.toggle(Number(id), done ? 1 : 0);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  taskQueries.delete(Number(id));
  return NextResponse.json({ ok: true });
}
