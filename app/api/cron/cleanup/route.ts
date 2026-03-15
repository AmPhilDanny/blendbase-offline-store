import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  // Optional security: Check for a secret key from Vercel Cron
  // to ensure only Vercel can trigger this endpoint
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET && 
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Clean up cart items older than 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const deleted = await prisma.cartItem.deleteMany({
      where: {
        createdAt: {
          lt: yesterday,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleted.count} old cart items.`,
    });
  } catch (error) {
    console.error('Cron cleanup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
