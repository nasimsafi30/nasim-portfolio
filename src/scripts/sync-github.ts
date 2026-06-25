import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "nasimsafi30";
const sql = neon(DATABASE_URL);

async function syncProjects() {
  console.log("🔄 Syncing projects from GitHub...");

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=owner`, {
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-App"
      }
    });

    if (!response.ok) {
      console.error("GitHub API error:", response.status, response.statusText);
      process.exit(1);
    }

    const repos = await response.json();
    console.log(`📦 Found ${repos.length} repos`);

    await sql`DELETE FROM projects`;
    console.log("🗑️ Cleared old projects");

    for (const repo of repos) {
      let languages: string[] = [];
      try {
        const langRes = await fetch(repo.languages_url, {
          headers: { "Authorization": `token ${GITHUB_TOKEN}`, "Accept": "application/vnd.github.v3+json", "User-Agent": "Portfolio-App" }
        });
        if (langRes.ok) {
          const langData = await langRes.json();
          languages = Object.keys(langData);
        }
      } catch (e) { }

      const topicsArr = repo.topics?.length > 0 ? `{${repo.topics.map((t: string) => `"${t}"`).join(",")}}` : "{}";
      const techArr = languages.length > 0 ? `{${languages.map((t: string) => `"${t}"`).join(",")}}` : "{}";

      await sql`
        INSERT INTO projects (title, description, github_url, live_url, stars, forks, watchers, language, topics, technologies, featured, image, github_data, "order")
        VALUES (
          ${repo.name}, ${repo.description || ''}, ${repo.html_url}, ${repo.homepage || null},
          ${repo.stargazers_count || 0}, ${repo.forks_count || 0}, ${repo.watchers_count || 0},
          ${repo.language || 'Unknown'}, ${topicsArr}::text[], ${techArr}::text[],
          ${(repo.stargazers_count || 0) > 0},
          ${`https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`},
          ${JSON.stringify({
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        size: repo.size,
        open_issues: repo.open_issues_count,
        default_branch: repo.default_branch,
        license: repo.license?.spdx_id || null,
      })}::jsonb,
          0
        )
      `;
    }

    console.log(`✅ Synced ${repos.length} projects!`);
    const count = await sql`SELECT COUNT(*) FROM projects`;
    console.log(`📊 Total projects in database: ${count[0].count}`);
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

syncProjects();