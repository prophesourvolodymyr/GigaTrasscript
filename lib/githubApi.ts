/**
 * GitHub API client for fetching repository information
 */

export interface GitHubRepoData {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  url: string;
}

/**
 * Fetch repository data from GitHub API
 * @param owner - Repository owner (username or organization)
 * @param repo - Repository name
 * @returns Repository data including star count
 */
export async function getRepoData(owner: string, repo: string): Promise<GitHubRepoData> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        // Add GitHub token if available (optional, increases rate limit)
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: {
        // Cache for 5 minutes
        revalidate: 300,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Repository not found');
      }
      if (response.status === 403) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      name: data.name,
      fullName: data.full_name,
      description: data.description || '',
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      watchers: data.watchers_count || 0,
      openIssues: data.open_issues_count || 0,
      url: data.html_url,
    };
  } catch (error: any) {
    console.error('[GitHubAPI] Error fetching repo data:', error.message);
    throw error;
  }
}

/**
 * Format star count for display (e.g., 1.2k, 3.5k)
 */
export function formatStarCount(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`;
  }
  return stars.toString();
}
