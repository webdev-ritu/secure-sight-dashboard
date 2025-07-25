import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  // Create cameras
  const camera1 = await prisma.camera.create({
    data: {
      name: 'Shop Floor A',
      location: 'Northwest corner',
      
    },
  });

  const camera2 = await prisma.camera.create({
    data: {
      name: 'Vault',
      location: 'Main hallway',
    },
  });

  const camera3 = await prisma.camera.create({
    data: {
      name: 'Entrance',
      location: 'Front door',
    },
  });

  // Create incidents
  const incidentTypes = ['Gun Threat', 'Unauthorized Access', 'Suspicious Activity'];
  
  for (let i = 0; i < 12; i++) {
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hoursAgo);
    startDate.setMinutes(startDate.getMinutes() - minutesAgo);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + Math.floor(Math.random() * 30));

    await prisma.incident.create({
      data: {
        cameraId: [camera1.id, camera2.id, camera3.id][Math.floor(Math.random() * 3)],
        type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
        tsStart: startDate,
        tsEnd: endDate,
        thumbnailUrl: `https://picsum.photos/200/150?random=${i}`,
        resolved: Math.random() > 0.7,
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });