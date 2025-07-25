import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const incident = await prisma.incident.update({
      where: { id: parseInt(params.id) },
      data: { resolved: true },
      include: { camera: true },
    });
    return NextResponse.json(incident);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to resolve incident' },
      { status: 500 }
    );
  }
}