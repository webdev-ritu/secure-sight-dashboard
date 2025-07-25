import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const incident = await prisma.incident.update({
      where: { id: parseInt(resolvedParams.id) },
      data: { resolved: true },
      include: { camera: true },
    });
    return NextResponse.json(incident);
  } catch {
    return NextResponse.json(
      { error: 'Failed to resolve incident' },
      { status: 500 }
    );
  }
}