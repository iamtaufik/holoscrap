import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  return NextResponse.json({
    message: 'Welcome to Hololive API',
    how_to_use: {
      get_all_talents: {
        method: 'GET',
        endpoint: '/api/talents',
      },
      get_single_talent: {
        method: 'GET',
        endpoint: '/api/talents/kobo-kanaeru',
      },
    },
  });
};
