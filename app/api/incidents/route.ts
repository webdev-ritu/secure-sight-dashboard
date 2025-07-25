import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const resolved = searchParams.get('resolved')

    const incidents = await prisma.incident.findMany({
      where: {
        resolved: resolved ? resolved === 'true' : undefined,
      },
      include: {
        camera: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    })

    return Response.json(incidents)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}