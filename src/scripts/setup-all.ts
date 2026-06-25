import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const DATABASE_URL = "postgresql://neondb_owner:npg_HanIfq63SsEN@ep-odd-darkness-atflkg1q-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(DATABASE_URL);

async function setupAll() {
  console.log("🚀 Starting complete setup...\n");

  // ============================================================
  // 1. Create Tables (if not exist)
  // ============================================================
  console.log("📦 Creating tables...");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      role TEXT DEFAULT 'user',
      email_verified TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS about (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      bio TEXT NOT NULL,
      long_bio TEXT,
      dob TEXT,
      place_of_birth TEXT,
      gender TEXT,
      avatar TEXT,
      resume TEXT,
      email TEXT,
      phone TEXT,
      location TEXT,
      github TEXT,
      linkedin TEXT,
      twitter TEXT,
      website TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS education (
      id SERIAL PRIMARY KEY,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      field TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT,
      description TEXT,
      location TEXT,
      "order" INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS experience (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      type TEXT DEFAULT 'Full-time',
      start_date TEXT NOT NULL,
      end_date TEXT,
      current BOOLEAN DEFAULT false,
      description TEXT,
      technologies TEXT[],
      "order" INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      level INTEGER DEFAULT 0,
      color TEXT,
      "order" INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS certifications (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      issuer TEXT NOT NULL,
      date TEXT NOT NULL,
      expiry_date TEXT,
      credential_id TEXT,
      credential_url TEXT,
      category TEXT NOT NULL,
      skills TEXT[],
      "order" INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      technologies TEXT[],
      github_url TEXT,
      live_url TEXT,
      image TEXT,
      featured BOOLEAN DEFAULT false,
      stars INTEGER DEFAULT 0,
      forks INTEGER DEFAULT 0,
      watchers INTEGER DEFAULT 0,
      language TEXT,
      topics TEXT[],
      github_data JSONB,
      "order" INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      cover_image TEXT,
      category TEXT NOT NULL,
      tags TEXT[],
      read_time INTEGER DEFAULT 5,
      published BOOLEAN DEFAULT false,
      featured BOOLEAN DEFAULT false,
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      published_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      position TEXT,
      company TEXT,
      content TEXT NOT NULL,
      avatar TEXT,
      rating INTEGER DEFAULT 5,
      featured BOOLEAN DEFAULT false,
      "order" INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS contact (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT false,
      replied BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY,
      site_name TEXT DEFAULT 'Mohammad Nasim Safi - Portfolio',
      site_description TEXT,
      site_url TEXT,
      google_analytics_id TEXT,
      email_notifications BOOLEAN DEFAULT true,
      auto_sync_projects BOOLEAN DEFAULT true,
      maintenance_mode BOOLEAN DEFAULT false,
      custom_css TEXT,
      custom_js TEXT,
      footer_text TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  console.log("✅ Tables created\n");

  // ============================================================
  // 2. Insert Admin User
  // ============================================================
  console.log("👤 Creating admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const existingUser = await sql`SELECT id FROM users WHERE email = 'admin@nasimsafi.com' LIMIT 1`;
  if (existingUser.length === 0) {
    await sql`
      INSERT INTO users (id, name, email, password, role, email_verified, created_at, updated_at)
      VALUES (${crypto.randomUUID()}, 'Mohammad Nasim Safi', 'admin@nasimsafi.com', ${hashedPassword}, 'admin', NOW(), NOW(), NOW())
    `;
    console.log("✅ Admin user created\n");
  } else {
    console.log("⚠️ Admin user already exists\n");
  }

  // ============================================================
  // 3. Insert About
  // ============================================================
  console.log("📝 Inserting about...");
  const existingAbout = await sql`SELECT id FROM about LIMIT 1`;
  if (existingAbout.length === 0) {
    await sql`
      INSERT INTO about (name, title, bio, dob, place_of_birth, gender, email, phone, location, github, linkedin, twitter, website)
      VALUES ('Mohammad Nasim Safi', 'Full Stack Developer & IT/Networking Engineer', 'Passionate technologist bridging network infrastructure and modern software development.', '1997-04-29', 'Nangarhar, Afghanistan', 'Male', 'nasimsafi30@gmail.com', '+93 700 000 000', 'Nangarhar, Afghanistan', 'https://github.com/nasimsafi30', 'https://linkedin.com/in/nasimsafi', 'https://twitter.com/nasimsafi', 'https://nasimsafi.com')
    `;
    console.log("✅ About inserted\n");
  }

  // ============================================================
  // 4. Insert Education
  // ============================================================
  console.log("🎓 Inserting education...");
  const existingEdu = await sql`SELECT id FROM education LIMIT 1`;
  if (existingEdu.length === 0) {
    const educationData = [
      ['Bachelor of Science in Computer Science', 'Khurasan University', 'Computer Science', '2017', '2021', 'Nangarhar, Afghanistan', 1],
      ['High School Diploma', 'Muhammadi Sahibzada High School', 'Science', '2013', '2015', 'Nangarhar, Afghanistan', 2],
    ];
    for (const edu of educationData) {
      await sql`INSERT INTO education (degree, institution, field, start_date, end_date, location, "order") VALUES (${edu[0]}, ${edu[1]}, ${edu[2]}, ${edu[3]}, ${edu[4]}, ${edu[5]}, ${edu[6]})`;
    }
    console.log("✅ Education inserted\n");
  }

  // ============================================================
  // 5. Insert Experience
  // ============================================================
  console.log("💼 Inserting experience...");
  const existingExp = await sql`SELECT id FROM experience LIMIT 1`;
  if (existingExp.length === 0) {
    await sql`
      INSERT INTO experience (title, company, location, type, start_date, end_date, current, description, technologies, "order")
      VALUES 
      ('Full Stack Developer', 'Freelance / Contract', 'Remote', 'Full-time', '2024', 'Present', true, 'Building modern web applications.', '{Next.js,React,TypeScript,PostgreSQL}', 1),
      ('IT & Network Engineer', 'Various Organizations', 'Nangarhar', 'Full-time', '2022', '2024', false, 'Managed enterprise network infrastructure.', '{Cisco,MikroTik,Linux,Network Security}', 2)
    `;
    console.log("✅ Experience inserted\n");
  }

  // ============================================================
  // 6. Insert Skills
  // ============================================================
  console.log("🛠️ Inserting skills...");
  const existingSkills = await sql`SELECT id FROM skills LIMIT 1`;
  if (existingSkills.length === 0) {
    const skillsData = [
      ['React.js', 'Frontend', 95, 'blue', 1],
      ['Next.js', 'Frontend', 90, 'blue', 2],
      ['TypeScript', 'Frontend', 88, 'blue', 3],
      ['Node.js', 'Backend', 90, 'green', 4],
      ['PostgreSQL', 'Backend', 85, 'blue', 5],
      ['Docker', 'DevOps', 80, 'blue', 6],
      ['Cisco', 'Networking', 85, 'orange', 7],
      ['MikroTik', 'Networking', 88, 'orange', 8],
    ];
    for (const skill of skillsData) {
      await sql`INSERT INTO skills (name, category, level, color, "order") VALUES (${skill[0]}, ${skill[1]}, ${skill[2]}, ${skill[3]}, ${skill[4]})`;
    }
    console.log("✅ Skills inserted\n");
  }

  // ============================================================
  // 7. Insert Blog Posts
  // ============================================================
  console.log("📝 Inserting blog posts...");
  const existingBlog = await sql`SELECT id FROM blog_posts LIMIT 1`;
  if (existingBlog.length === 0) {
    await sql`
      INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, read_time, published, featured, published_at, created_at, updated_at)
      VALUES 
      ('Getting Started with Next.js 14', 'getting-started-with-nextjs-14', 'Learn how to build modern web applications with Next.js 14.', '<h2>Introduction</h2><p>Next.js 14 brings exciting new features...</p>', 'Web Development', '{Next.js,React,JavaScript}', 8, true, true, NOW(), NOW(), NOW()),
      ('Network Security Best Practices 2024', 'network-security-best-practices-2024', 'Essential network security practices for organizations.', '<h2>Why Security Matters</h2><p>In today''s digital landscape...</p>', 'Networking', '{Security,Networking,Best Practices}', 10, true, true, NOW(), NOW(), NOW()),
      ('TypeScript Tips for Better Code', 'typescript-tips-better-code', 'Improve your TypeScript code with these practical tips.', '<h2>Type Safety First</h2><p>TypeScript offers powerful features...</p>', 'Web Development', '{TypeScript,JavaScript}', 6, true, false, NOW(), NOW(), NOW())
    `;
    console.log("✅ Blog posts inserted\n");
  }

  // ============================================================
  // 8. Insert Testimonials
  // ============================================================
  console.log("💬 Inserting testimonials...");
  const existingTest = await sql`SELECT id FROM testimonials LIMIT 1`;
  if (existingTest.length === 0) {
    await sql`
      INSERT INTO testimonials (name, position, company, content, rating, featured, "order", created_at, updated_at)
      VALUES 
      ('Ahmad Khan', 'Project Manager', 'TechNova Solutions', 'Nasim is an exceptional developer with deep knowledge of both networking and software development. He delivered our project on time and exceeded expectations.', 5, true, 1, NOW(), NOW()),
      ('Sara Ahmadi', 'CEO', 'Digital Innovations Ltd', 'Working with Nasim was a great experience. His technical expertise combined with excellent communication made our project a success.', 5, true, 2, NOW(), NOW()),
      ('Omar Farooq', 'IT Director', 'AfghanNet Systems', 'Nasim''s expertise in networking helped us optimize our entire infrastructure. Highly recommended!', 5, true, 3, NOW(), NOW())
    `;
    console.log("✅ Testimonials inserted\n");
  }

  // ============================================================
  // 9. Insert Settings
  // ============================================================
  console.log("⚙️ Inserting settings...");
  const existingSettings = await sql`SELECT id FROM site_settings LIMIT 1`;
  if (existingSettings.length === 0) {
    await sql`
      INSERT INTO site_settings (site_name, site_description, email_notifications, auto_sync_projects, maintenance_mode)
      VALUES ('Mohammad Nasim Safi - Portfolio', 'Full Stack Developer & IT/Networking Engineer', true, true, false)
    `;
    console.log("✅ Settings inserted\n");
  }

  console.log("╔════════════════════════════════════════╗");
  console.log("║     🎉 Setup Complete!                 ║");
  console.log("╠════════════════════════════════════════╣");
  console.log("║  🔑 Login: admin@nasimsafi.com         ║");
  console.log("║  🔑 Password: admin123                 ║");
  console.log("╚════════════════════════════════════════╝\n");
}

setupAll()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });