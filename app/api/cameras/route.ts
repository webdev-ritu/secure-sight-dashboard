import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const cameras = await prisma.camera.findMany({
      include: {
        incidents: true
      }
    })
    return Response.json(cameras)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}