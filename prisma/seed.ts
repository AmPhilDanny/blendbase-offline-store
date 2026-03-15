import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = [
    {
      name: 'Essential White Tee',
      slug: 'essential-white-tee',
      description: 'The cornerstone of any wardrobe. Our Essential White Tee is crafted from 100% premium cotton for a soft, breathable fit that lasts.',
      price: 3500, // $35.00
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'
    },
    {
      name: 'Midnight Black Hoodie',
      slug: 'midnight-black-hoodie',
      description: 'Heavyweight comfort for the modern explorer. Featuring a minimalist design and a plush inner lining.',
      price: 8500, // $85.00
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop'
    },
    {
      name: 'Sage Green Oversized Sweatshirt',
      slug: 'sage-oversized-sweat',
      description: 'Relaxed fit with a premium feel. The sage green hue adds a subtle pop of color to your daily aesthetic.',
      price: 6500, // $65.00
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop'
    },
    {
      name: 'Slate Grey Joggers',
      slug: 'slate-grey-joggers',
      description: 'From gym to street, these joggers offer superior flexibility and a tailored silhouette.',
      price: 5500, // $55.00
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1580487212103-2b63d914d33a?q=80&w=1000&auto=format&fit=crop'
    }
  ]

  console.log('Start seeding...')
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
    console.log(`Created product with id: ${product.id}`)
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
