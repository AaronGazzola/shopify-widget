import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  const sampleData = [
    {
      sku_code: "ABC123",
      product_name: "Premium Wireless Headphones",
      renders: [
        {
          image_url:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
          alt_text: "Premium Wireless Headphones lifestyle shot 1",
        },
        {
          image_url:
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
          alt_text: "Premium Wireless Headphones lifestyle shot 2",
        },
      ],
    },
    {
      sku_code: "DEF456",
      product_name: "Smart Fitness Watch",
      renders: [
        {
          image_url:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
          alt_text: "Smart Fitness Watch lifestyle shot 1",
        },
        {
          image_url:
            "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=500&fit=crop",
          alt_text: "Smart Fitness Watch lifestyle shot 2",
        },
      ],
    },
    {
      sku_code: "JKL012",
      product_name: "Minimalist Laptop Bag",
      renders: [
        {
          image_url:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
          alt_text: "Minimalist Laptop Bag lifestyle shot 1",
        },
        {
          image_url:
            "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&h=500&fit=crop",
          alt_text: "Minimalist Laptop Bag lifestyle shot 2",
        },
      ],
    },
  ];

  for (const product of sampleData) {
    const sku = await prisma.sku.create({
      data: {
        sku_code: product.sku_code,
        product_name: product.product_name,
      },
    });

    for (const render of product.renders) {
      await prisma.render.create({
        data: {
          sku_id: sku.id,
          image_url: render.image_url,
          alt_text: render.alt_text,
          is_active: true,
        },
      });
    }

    console.log(
      `✓ Created SKU: ${product.sku_code} with ${product.renders.length} renders`
    );
  }

  const mockSessionId = "sample-session-123";

  const allSkus = await prisma.sku.findMany();

  for (const sku of allSkus) {
    await prisma.event.createMany({
      data: [
        { sku_id: sku.id, event_type: "view", session_id: mockSessionId },
        { sku_id: sku.id, event_type: "view", session_id: "session-456" },
        { sku_id: sku.id, event_type: "like", session_id: mockSessionId },
      ],
    });

    await prisma.like.create({
      data: {
        sku_id: sku.id,
        session_id: mockSessionId,
      },
    });
  }

  console.log("✓ Created sample events and likes");
  console.log("Database seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
