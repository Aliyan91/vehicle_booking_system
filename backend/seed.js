import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.booking.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.admin.deleteMany({});

  // Create admin
  const hashedPassword = await bcrypt.hash("password123", 10);
  const admin = await prisma.admin.create({
    data: {
      name: "Administrator",
      email: "admin@example.com",
      password: hashedPassword,
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create customers
  const customers = await prisma.customer.createMany({
    data: [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "+911234567890",
        address: "123 Main St, Mumbai",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+919876543210",
        address: "456 Park Ave, Delhi",
      },
      {
        name: "Akash Kumar",
        email: "akash@example.com",
        phone: "+919999888777",
        address: "789 Sector 12, Bangalore",
      },
    ],
  });
  console.log("✅ Created", customers.count, "customers");

  // Create vehicles
  const vehicles = await prisma.vehicle.createMany({
    data: [
      {
        make: "Toyota",
        model: "Corolla",
        year: 2022,
        licensePlate: "MH01AB1234",
        dailyRate: 2500,
        isAvailable: true,
      },
      {
        make: "Hyundai",
        model: "Creta",
        year: 2023,
        licensePlate: "DL04CD5678",
        dailyRate: 2800,
        isAvailable: true,
      },
      {
        make: "Maruti",
        model: "Swift",
        year: 2021,
        licensePlate: "KA03EF9012",
        dailyRate: 2000,
        isAvailable: true,
      },
    ],
  });
  console.log("✅ Created", vehicles.count, "vehicles");

  // Get created records
  const customerList = await prisma.customer.findMany();
  const vehicleList = await prisma.vehicle.findMany();

  // Create bookings
  const booking1 = await prisma.booking.create({
    data: {
      customerId: customerList[0].id,
      vehicleId: vehicleList[0].id,
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      totalAmount: 4 * 2500,
      status: "confirmed",
    },
  });

  await prisma.vehicle.update({
    where: { id: vehicleList[0].id },
    data: { isAvailable: false },
  });

  const booking2 = await prisma.booking.create({
    data: {
      customerId: customerList[1].id,
      vehicleId: vehicleList[1].id,
      startDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
      totalAmount: 1 * 2800,
      status: "pending",
    },
  });

  await prisma.vehicle.update({
    where: { id: vehicleList[1].id },
    data: { isAvailable: false },
  });

  console.log("✅ Created 2 bookings");

  console.log("\n✨ Seed completed successfully!");
  console.log("📧 Admin login: admin@example.com");
  console.log("🔐 Password: password123\n");

  await prisma.$disconnect();
}

main()
  .then(async () => {
    console.log("✓ Seeding successful");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("✗ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });