import { NextRequest, NextResponse } from 'next/server';
import { getRepoData } from '@/lib/githubApi';

/**
 * GET /api/github?owner=prophesourvolodymyr&repo=GigaTrasscript
 * Fetch GitHub repository data including star count
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner') || 'prophesourvolodymyr';
    const repo = searchParams.get('repo') || 'GigaTrasscript';

    const repoData = await getRepoData(owner, repo);

    return NextResponse.json(
      {
        success: true,
        data: repoData,
      },
      {
        status: 200,
        headers: {
          // Cache for 5 minutes
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: any) {
    console.error('[GitHub API] Error:', error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch repository data',
      },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
}
