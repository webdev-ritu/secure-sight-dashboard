import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  const incidentId = parseInt(params.id, 10);
  if (isNaN(incidentId)) {
    return NextResponse.json(
      { error: 'Invalid incident ID' },
      { status: 400 }
    );
  }
  try {
    const incident = await prisma.incident.update({
      where: { id: incidentId },
      data: { resolved: true },
      include: { camera: true },
    });
    return NextResponse.json(incident);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to resolve incident' },
      { status: 500 }
    );
  }
}