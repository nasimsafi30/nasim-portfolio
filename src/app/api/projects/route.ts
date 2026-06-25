import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

// GET - Return projects from database
export async function GET() {
  try {
    const data = await sql`SELECT * FROM projects ORDER BY stars DESC`;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: [] });
  }
}

// POST - Sync from GitHub
export async function POST() {
  try {
    const username = "nasimsafi30";
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json({ success: false, message: "No GitHub token" });
    }

    // Fetch repos from GitHub
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "Portfolio" }
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, message: "GitHub API error" });
    }

    const repos = await res.json();

    // DELETE ALL first
    await sql`DELETE FROM projects`;

    // Insert fresh
    let count = 0;
    for (const repo of repos) {
      let languages: string[] = [];
      try {
        const langRes = await fetch(repo.languages_url, {
          headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "Portfolio" }
        });
        if (langRes.ok) languages = Object.keys(await langRes.json());
      } catch (e) { }

      const topicsArr = repo.topics?.length > 0 ? `{${repo.topics.map((t: string) => `"${t}"`).join(",")}}` : "{}";
      const techArr = languages.length > 0 ? `{${languages.map((t: string) => `"${t}"`).join(",")}}` : "{}";

      await sql`
        INSERT INTO projects (title, description, technologies, github_url, live_url, image, featured, stars, forks, watchers, language, topics, github_data, "order")
        VALUES (${repo.name}, ${repo.description || ''}, ${techArr}::text[], ${repo.html_url}, ${repo.homepage || null}, ${`https://opengraph.githubassets.com/1/${username}/${repo.name}`}, ${(repo.stargazers_count || 0) > 0}, ${repo.stargazers_count || 0}, ${repo.forks_count || 0}, ${repo.watchers_count || 0}, ${repo.language || 'Unknown'}, ${topicsArr}::text[], ${JSON.stringify({ created_at: repo.created_at, updated_at: repo.updated_at, pushed_at: repo.pushed_at, size: repo.size, open_issues: repo.open_issues_count, default_branch: repo.default_branch, license: repo.license?.spdx_id || null })}::jsonb, 0)
      `;
      count++;
    }

    return NextResponse.json({ success: true, message: `Synced ${count} projects!`, count });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}