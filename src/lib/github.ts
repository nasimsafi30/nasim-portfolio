import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || "",
});

export async function fetchGitHubProjects(username: string) {
  try {
    const response = await octokit.request("GET /users/{username}/repos", {
      username,
      sort: "updated",
      per_page: 100,
      type: "owner",
    });

    const projects = await Promise.all(
      response.data.map(async (repo: any) => {
        let languages: Record<string, number> = {};
        try {
          const langResponse = await octokit.request("GET /repos/{owner}/{repo}/languages", {
            owner: username,
            repo: repo.name || "",
          });
          languages = langResponse.data as Record<string, number>;
        } catch (e) {
          // Repo might be empty
        }

        return {
          title: repo.name || "Untitled",
          description: repo.description || "",
          githubUrl: repo.html_url || "",
          liveUrl: repo.homepage || "",
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          watchers: repo.watchers_count || 0,
          language: repo.language || "Unknown",
          topics: repo.topics || [],
          technologies: Object.keys(languages),
          featured: (repo.stargazers_count || 0) > 0,
          image: `https://opengraph.githubassets.com/1/${username}/${repo.name}`,
          githubData: {
            created_at: repo.created_at || null,
            updated_at: repo.updated_at || null,
            pushed_at: repo.pushed_at || null,
            size: repo.size || 0,
            watchers: repo.watchers_count || 0,
            open_issues: repo.open_issues_count || 0,
            default_branch: repo.default_branch || "main",
            license: repo.license?.spdx_id || null,
          },
        };
      })
    );

    return projects
      .filter((p: any) => p !== null)
      .sort((a: any, b: any) => (b.stars || 0) - (a.stars || 0));
  } catch (error: any) {
    console.error("GitHub fetch error:", error.message);
    return [];
  }
}