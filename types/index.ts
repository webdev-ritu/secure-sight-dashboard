import { Camera as PrismaCamera, Incident as PrismaIncident } from '@prisma/client';

export type Camera = PrismaCamera & {
  thumbnailUrl: string;
};

export type IncidentWithCamera = PrismaIncident & {
  camera: Camera;
  thumbnailUrl: string;
};