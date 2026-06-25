import { db } from "./index";
import {
  users,
  about,
  education,
  experience,
  skills,
  certifications,
  projects,
  blogPosts,
  testimonials,
  contact,
  newsletterSubscribers,
  socialLinks,
  siteSettings,
  resumes,
} from "./schema";
import bcrypt from "bcryptjs";

export async function seed() {
  console.log("Starting database seed...\n");

  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length > 0) {
    console.log("Database already seeded. Skipping...\n");
    return;
  }

  try {
    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const adminId = crypto.randomUUID();

    await db.insert(users).values({
      id: adminId,
      name: "Mohammad Nasim Safi",
      email: "admin@nasimsafi.com",
      password: hashedPassword,
      role: "admin",
      emailVerified: new Date(),
      bio: "Full Stack Developer & IT/Networking Engineer",
      github: "https://github.com/nasimsafi30",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("   Admin user created");

    console.log("Inserting about information...");
    await db.insert(about).values({
      name: "Mohammad Nasim Safi",
      title: "Full Stack Developer & IT/Networking Engineer",
      bio: "Passionate technologist bridging the gap between network infrastructure and modern software development.",
      longBio: "I am a versatile technology professional with a unique blend of IT networking expertise and full-stack development skills.",
      dob: "1997-04-29",
      placeOfBirth: "Nangarhar, Afghanistan",
      gender: "Male",
      email: "nasimsafi30@gmail.com",
      phone: "+93 700 000 000",
      location: "Nangarhar, Afghanistan",
      github: "https://github.com/nasimsafi30",
      linkedin: "https://linkedin.com/in/nasimsafi",
      twitter: "https://twitter.com/nasimsafi",
      website: "https://nasimsafi.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("   About information inserted");

    console.log("Inserting education records...");
    const educationData = [
      { degree: "Bachelor of Science in Computer Science", institution: "Khurasan University", field: "Computer Science", startDate: "2017", endDate: "2021", description: "Comprehensive study of computer science fundamentals.", location: "Nangarhar, Afghanistan", order: 1 },
      { degree: "High School Diploma", institution: "Muhammadi Sahibzada High School", field: "Science", startDate: "2013", endDate: "2015", description: "Completed secondary education.", location: "Nangarhar, Afghanistan", order: 2 },
    ];

    for (const edu of educationData) {
      await db.insert(education).values({ ...edu, createdAt: new Date(), updatedAt: new Date() });
    }
    console.log("   Education records inserted");

    console.log("Inserting work experience...");
    const experienceData = [
      { title: "Full Stack Developer", company: "Freelance / Contract", location: "Remote", type: "Full-time" as const, startDate: "2024", endDate: "Present", current: true, description: "Building modern web applications using Next.js, React, TypeScript, and PostgreSQL.", technologies: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL"], order: 1 },
      { title: "IT & Network Engineer", company: "Various Organizations", location: "Nangarhar, Afghanistan", type: "Full-time" as const, startDate: "2022", endDate: "2024", current: false, description: "Managed enterprise network infrastructure.", technologies: ["Cisco", "MikroTik", "Windows Server", "Linux"], order: 2 },
    ];

    for (const exp of experienceData) {
      await db.insert(experience).values({ ...exp, createdAt: new Date(), updatedAt: new Date() });
    }
    console.log("   Work experience inserted");

    console.log("Inserting skills...");
    const skillsData = [
      { name: "React.js", category: "Frontend", level: 95, color: "blue", order: 1 },
      { name: "Next.js", category: "Frontend", level: 90, color: "blue", order: 2 },
      { name: "TypeScript", category: "Frontend", level: 88, color: "blue", order: 3 },
      { name: "Tailwind CSS", category: "Frontend", level: 95, color: "blue", order: 4 },
      { name: "Node.js", category: "Backend", level: 90, color: "green", order: 5 },
      { name: "PostgreSQL", category: "Backend", level: 85, color: "blue", order: 6 },
      { name: "Docker", category: "DevOps", level: 80, color: "blue", order: 7 },
      { name: "Git & GitHub", category: "DevOps", level: 95, color: "orange", order: 8 },
      { name: "Cisco", category: "Networking", level: 85, color: "blue", order: 9 },
      { name: "MikroTik", category: "Networking", level: 88, color: "orange", order: 10 },
      { name: "Network Security", category: "Networking", level: 82, color: "red", order: 11 },
    ];

    for (const skill of skillsData) {
      await db.insert(skills).values({ ...skill, createdAt: new Date(), updatedAt: new Date() });
    }
    console.log("   Skills inserted");

    console.log("Inserting certifications...");
    const certData = [
      { title: "Cisco Certified Network Associate (CCNA)", issuer: "Cisco Systems", date: "2023-03-15", category: "Networking", skills: ["Cisco", "Routing", "Switching"], order: 1 },
      { title: "MikroTik Certified Network Associate (MTCNA)", issuer: "MikroTik", date: "2022-08-20", category: "Networking", skills: ["MikroTik", "Wireless", "Routing"], order: 2 },
    ];

    for (const cert of certData) {
      await db.insert(certifications).values({ ...cert, createdAt: new Date(), updatedAt: new Date() });
    }
    console.log("   Certifications inserted");

    console.log("Inserting sample projects...");
    const projectData = [
      { title: "Portfolio Website", description: "Modern portfolio website with liquid glass design.", technologies: ["Next.js", "TypeScript", "Drizzle ORM", "Neon DB"], githubUrl: "https://github.com/nasimsafi30/portfolio", liveUrl: "https://nasimsafi.com", featured: true, stars: 12, forks: 3, language: "TypeScript", topics: ["portfolio", "nextjs"], order: 1 },
    ];

    for (const proj of projectData) {
      await db.insert(projects).values({ ...proj, githubData: {}, createdAt: new Date(), updatedAt: new Date() });
    }
    console.log("   Sample projects inserted");

    console.log("Inserting blog posts...");
    const blogData = [
      { title: "Getting Started with Next.js 14", slug: "getting-started-with-nextjs-14", excerpt: "Learn how to build modern web applications.", content: "<h2>Introduction</h2><p>Next.js 14 brings exciting new features.</p>", category: "Web Development", tags: ["Next.js", "React"], readTime: 8, published: true, featured: true, views: 245, likes: 42, authorId: adminId, publishedAt: new Date("2024-03-15") },
    ];

    for (const post of blogData) {
      await db.insert(blogPosts).values({ ...post, createdAt: new Date(), updatedAt: new Date() });
    }
    console.log("   Blog posts inserted");

    console.log("Inserting testimonials...");
    const testimonialData = [
      { name: "Ahmad Khan", position: "Project Manager", company: "TechNova Solutions", content: "Nasim is an exceptional developer.", rating: 5, featured: true, order: 1 },
      { name: "Sara Ahmadi", position: "CEO", company: "Digital Innovations Ltd", content: "Working with Nasim was a great experience.", rating: 5, featured: true, order: 2 },
    ];

    for (const testimonial of testimonialData) {
      await db.insert(testimonials).values({ ...testimonial, createdAt: new Date(), updatedAt: new Date() });
    }
    console.log("   Testimonials inserted");

    console.log("Inserting newsletter subscribers...");
    await db.insert(newsletterSubscribers).values({ email: "subscriber1@example.com", name: "John Doe", active: true, source: "website", subscribedAt: new Date() });
    console.log("   Newsletter subscribers inserted");

    console.log("Inserting social links...");
    const socialData = [
      { platform: "GitHub", url: "https://github.com/nasimsafi30", icon: "github", username: "nasimsafi30", order: 1, active: true, showInHeader: true, showInFooter: true },
      { platform: "LinkedIn", url: "https://linkedin.com/in/nasimsafi", icon: "linkedin", username: "nasimsafi", order: 2, active: true, showInHeader: true, showInFooter: true },
    ];

    for (const social of socialData) {
      await db.insert(socialLinks).values({ ...social, createdAt: new Date(), updatedAt: new Date() });
    }
    console.log("   Social links inserted");

    console.log("Inserting site settings...");
    await db.insert(siteSettings).values({
      siteName: "Mohammad Nasim Safi - Portfolio",
      siteDescription: "Full Stack Developer & IT/Networking Engineer",
      siteUrl: "https://nasimsafi.com",
      emailNotifications: true,
      autoSyncProjects: true,
      maintenanceMode: false,
      footerText: "© 2024 Mohammad Nasim Safi. All rights reserved.",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("   Site settings inserted");

    console.log("Inserting resume record...");
    await db.insert(resumes).values({
      title: "Mohammad Nasim Safi - Full Stack Developer Resume",
      fileUrl: "https://example.com/resume.pdf",
      version: "1.0",
      isActive: true,
      language: "English",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("   Resume record inserted");

    console.log("\nDatabase seeded successfully!\n");
    console.log("Default Admin: admin@nasimsafi.com / admin123\n");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => { console.log("Seed complete"); process.exit(0); })
  .catch((error) => { console.error("Seed failed:", error); process.exit(1); });