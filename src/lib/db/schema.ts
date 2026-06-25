import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";

// ============================================================
// Enums
// ============================================================

export const userRoleEnum = pgEnum("user_role", ["admin", "user", "editor"]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Remote",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "archived",
  "in-progress",
  "completed",
]);

// ============================================================
// Users & Authentication
// ============================================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: userRoleEnum("role").default("user"),
  bio: text("bio"),
  website: text("website"),
  github: text("github"),
  twitter: text("twitter"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// About / Personal Information
// ============================================================

export const about = pgTable("about", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  longBio: text("long_bio"),
  dob: text("dob"),
  placeOfBirth: text("place_of_birth"),
  gender: text("gender"),
  avatar: text("avatar"),
  resume: text("resume"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  github: text("github"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  website: text("website"),
  stackoverflow: text("stackoverflow"),
  medium: text("medium"),
  devto: text("devto"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Education
// ============================================================

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  field: text("field"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  description: text("description"),
  grade: text("grade"),
  location: text("location"),
  activities: text("activities"),
  url: text("url"),
  logo: text("logo"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Work Experience
// ============================================================

export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  type: employmentTypeEnum("type").default("Full-time"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  current: boolean("current").default(false),
  description: text("description"),
  achievements: text("achievements"),
  technologies: text("technologies").array(),
  companyUrl: text("company_url"),
  companyLogo: text("company_logo"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Skills
// ============================================================

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  level: integer("level").default(0),
  icon: text("icon"),
  color: text("color"),
  description: text("description"),
  yearsOfExperience: integer("years_of_experience"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Certifications
// ============================================================

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  date: text("date").notNull(),
  expiryDate: text("expiry_date"),
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  image: text("image"),
  category: text("category").notNull(),
  skills: text("skills").array(),
  description: text("description"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Projects (GitHub Synced + Manual)
// ============================================================

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  longDescription: text("long_description"),
  technologies: text("technologies").array(),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  image: text("image"),
  featured: boolean("featured").default(false),
  stars: integer("stars").default(0),
  forks: integer("forks").default(0),
  watchers: integer("watchers").default(0),
  language: text("language"),
  topics: text("topics").array(),
  status: projectStatusEnum("status").default("active"),
  githubData: jsonb("github_data"),
  demoVideo: text("demo_video"),
  documentation: text("documentation"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Blog Posts
// ============================================================

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  category: text("category").notNull(),
  tags: text("tags").array(),
  readTime: integer("read_time").default(5),
  published: boolean("published").default(false),
  featured: boolean("featured").default(false),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  publishedAt: timestamp("published_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Testimonials
// ============================================================

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position"),
  company: text("company"),
  content: text("content").notNull(),
  avatar: text("avatar"),
  rating: integer("rating").default(5),
  featured: boolean("featured").default(false),
  relationship: text("relationship"),
  projectUrl: text("project_url"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Contact Messages
// ============================================================

export const contact = pgTable("contact", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  replied: boolean("replied").default(false),
  starred: boolean("starred").default(false),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  replyContent: text("reply_content"),
  repliedAt: timestamp("replied_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Newsletter Subscribers
// ============================================================

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  active: boolean("active").default(true),
  source: text("source").default("website"),
  confirmationToken: text("confirmation_token"),
  confirmedAt: timestamp("confirmed_at", { mode: "date" }),
  subscribedAt: timestamp("subscribed_at", { mode: "date" }).defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at", { mode: "date" }),
});

// ============================================================
// Analytics - Page Views
// ============================================================

export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  page: text("page").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  country: text("country"),
  city: text("city"),
  device: text("device"),
  browser: text("browser"),
  os: text("os"),
  sessionId: text("session_id"),
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow(),
});

// ============================================================
// Analytics - Daily Summary
// ============================================================

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  page: text("page").notNull(),
  views: integer("views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  avgTimeOnPage: integer("avg_time_on_page").default(0),
  bounceRate: integer("bounce_rate").default(0),
  date: date("date").defaultNow(),
});

// ============================================================
// Social Links
// ============================================================

export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  username: text("username"),
  color: text("color"),
  order: integer("order").default(0),
  active: boolean("active").default(true),
  showInHeader: boolean("show_in_header").default(true),
  showInFooter: boolean("show_in_footer").default(true),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Site Settings
// ============================================================

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default("My Portfolio"),
  siteDescription: text("site_description"),
  siteUrl: text("site_url"),
  googleAnalyticsId: text("google_analytics_id"),
  facebookPixelId: text("facebook_pixel_id"),
  emailNotifications: boolean("email_notifications").default(true),
  autoSyncProjects: boolean("auto_sync_projects").default(true),
  maintenanceMode: boolean("maintenance_mode").default(false),
  customCss: text("custom_css"),
  customJs: text("custom_js"),
  footerText: text("footer_text"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Media Library
// ============================================================

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  width: integer("width"),
  height: integer("height"),
  folder: text("folder").default("general"),
  uploadedBy: text("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Resumes / CV Versions
// ============================================================

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  fileUrl: text("file_url").notNull(),
  version: text("version"),
  isActive: boolean("is_active").default(false),
  language: text("language").default("English"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// ============================================================
// Type Exports
// ============================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type About = typeof about.$inferSelect;
export type NewAbout = typeof about.$inferInsert;

export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;

export type Experience = typeof experience.$inferSelect;
export type NewExperience = typeof experience.$inferInsert;

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export type Certification = typeof certifications.$inferSelect;
export type NewCertification = typeof certifications.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export type ContactMessage = typeof contact.$inferSelect;
export type NewContactMessage = typeof contact.$inferInsert;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

export type PageView = typeof pageViews.$inferSelect;
export type NewPageView = typeof pageViews.$inferInsert;

export type Analytic = typeof analytics.$inferSelect;
export type NewAnalytic = typeof analytics.$inferInsert;

export type SocialLink = typeof socialLinks.$inferSelect;
export type NewSocialLink = typeof socialLinks.$inferInsert;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;

export type MediaItem = typeof media.$inferSelect;
export type NewMediaItem = typeof media.$inferInsert;

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;

// ============================================================
// Table Relations Map
// ============================================================

export const tables = {
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
  pageViews,
  analytics,
  socialLinks,
  siteSettings,
  media,
  resumes,
} as const;

export default tables;