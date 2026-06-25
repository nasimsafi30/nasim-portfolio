import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const aboutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  longBio: z.string().optional(),
  dob: z.string().optional(),
  placeOfBirth: z.string().optional(),
  gender: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  github: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  avatar: z.string().url("Invalid URL").optional().or(z.literal("")),
  resume: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  field: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
  grade: z.string().optional(),
  location: z.string().optional(),
  order: z.number().default(0),
});

export const experienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  type: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(10, "Description must be at least 10 characters"),
  technologies: z.array(z.string()).optional(),
  order: z.number().default(0),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().min(1, "Category is required"),
  level: z.number().min(0).max(100),
  icon: z.string().optional(),
  color: z.string().optional(),
  order: z.number().default(0),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().min(1, "Description is required"),
  githubUsername: z.string().min(1, "GitHub username is required"),
  githubToken: z.string().optional(),
  emailNotifications: z.boolean(),
  autoSyncProjects: z.boolean(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type AboutFormData = z.infer<typeof aboutSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;