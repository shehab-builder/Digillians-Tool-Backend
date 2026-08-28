import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db.js"; // Adjust relative path if needed (e.g. "../lib/db.js")

async function main() {
  const adminUsername = process.env.INITIAL_ADMIN_USERNAME || "admin";
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@123456";
  const adminName = "System Administrator";

  console.log("🌱 Starting initial admin seeding...");

  // 1. Check if an admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (existingAdmin) {
    console.log(
      `⚠️ Admin with username "${adminUsername}" already exists. Skipping creation.`,
    );
    return;
  }

  // 2. Hash the initial password
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // 3. Create initial admin
  const admin = await prisma.admin.create({
    data: {
      name: adminName,
      username: adminUsername,
      passwordHash,
    },
  });

  console.log("✅ Initial Admin created successfully:");
  console.log({
    id: admin.id,
    name: admin.name,
    username: admin.username,
    password: adminPassword,
  });
}

main()
  .catch((e) => {
    console.error("❌ Error seeding initial admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
