"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid-card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "@/components/ui/social-icons";
import {
  User,
  Save,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Globe,
  Calendar,
  Heart,
  Camera,
  AlertCircle,
  Eye,
  Edit3,
  Upload,
  Trash2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const aboutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  longBio: z.string(),
  dob: z.string(),
  placeOfBirth: z.string(),
  gender: z.string(),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string(),
  location: z.string(),
  github: z.string(),
  linkedin: z.string(),
  twitter: z.string(),
  website: z.string(),
  avatar: z.string(),
  resume: z.string(),
});

type AboutForm = z.infer<typeof aboutSchema>;

const defaultFormValues: AboutForm = {
  name: "",
  title: "",
  bio: "",
  longBio: "",
  dob: "",
  placeOfBirth: "",
  gender: "",
  email: "",
  phone: "",
  location: "",
  github: "",
  linkedin: "",
  twitter: "",
  website: "",
  avatar: "",
  resume: "",
};

export default function AdminAbout() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<AboutForm>({
    resolver: zodResolver(aboutSchema),
    defaultValues: defaultFormValues,
  });

  const watchAllFields = watch();

  const fetchAbout = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/about");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success && data.data) {
        reset({
          name: data.data.name || "",
          title: data.data.title || "",
          bio: data.data.bio || "",
          longBio: data.data.longBio || "",
          dob: data.data.dob || "",
          placeOfBirth: data.data.placeOfBirth || "",
          gender: data.data.gender || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          location: data.data.location || "",
          github: data.data.github || "",
          linkedin: data.data.linkedin || "",
          twitter: data.data.twitter || "",
          website: data.data.website || "",
          avatar: data.data.avatar || "",
          resume: data.data.resume || "",
        });
        setAvatarError(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch about data";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const onSubmit = async (data: AboutForm) => {
    if (!isDirty) {
      toast.info("No changes to save");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        toast.success("About section updated successfully!");
        fetchAbout();
      } else {
        throw new Error(result.error || "Failed to update");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload JPEG, PNG, WebP, or GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/about", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setValue("avatar", result.data.avatar);
        setAvatarError(false);
        toast.success("Photo uploaded! Click Save Changes to update.");
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = () => {
    setValue("avatar", "");
    setAvatarError(true);
    toast.success("Photo removed. Save changes to update.");
  };

  const handleImageError = () => setAvatarError(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About Section
          </h1>
          <p className="text-muted-foreground mt-2">Manage your personal information</p>
        </div>
        <div className="flex gap-3">
          <Button variant="glass" onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? <><Edit3 className="h-4 w-4 mr-2" />Edit Mode</> : <><Eye className="h-4 w-4 mr-2" />Preview</>}
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={saving || !isDirty} className="group">
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!previewMode ? (
            <>
              {/* Profile Photo */}
              <LiquidCard>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-orange-400" />Profile Photo
                </h2>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* FIXED: Changed flex-shrink-0 to shrink-0 */}
                    <div className="relative shrink-0">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/30 bg-linear-to-br from-blue-500/20 to-purple-500/20">
                        {watchAllFields.avatar && !avatarError ? (
                          <img src={watchAllFields.avatar} alt="Profile" className="w-full h-full object-cover" onError={() => setAvatarError(true)} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      {watchAllFields.avatar && !avatarError && (
                        <button type="button" onClick={handleRemovePhoto} className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors" title="Remove photo" aria-label="Remove profile photo">
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <p className="text-sm font-medium mb-2">Upload New Photo</p>
                      <p className="text-xs text-muted-foreground mb-4">JPEG, PNG, WebP or GIF. Max 5MB.</p>
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${dragActive ? "border-blue-500 bg-blue-500/10" : "border-white/20 hover:border-white/40"}`}
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        aria-label="Upload profile photo"
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
                      >
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm font-medium">Click or drag & drop photo here</p>
                            <p className="text-xs text-muted-foreground">JPEG, PNG, WebP or GIF (max 5MB)</p>
                          </div>
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} className="hidden" aria-label="Select profile photo file" title="Select profile photo" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="avatar" className="block text-sm font-medium mb-2">Or enter Avatar URL manually</label>
                    <input {...register("avatar")} id="avatar" type="url" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="/profile.jpg or https://example.com/photo.jpg" title="Avatar URL" />
                  </div>
                </div>
              </LiquidCard>

              {/* Basic Information */}
              <LiquidCard>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><User className="h-5 w-5 text-blue-400" />Basic Information</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name <span className="text-red-400">*</span></label>
                      <input {...register("name")} id="name" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="Mohammad Nasim Safi" title="Full Name" />
                      {errors.name && <p className="text-red-400 text-sm mt-1"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium mb-2">Professional Title <span className="text-red-400">*</span></label>
                      <input {...register("title")} id="title" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="Full Stack Developer & IT Engineer" title="Professional Title" />
                      {errors.title && <p className="text-red-400 text-sm mt-1"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.title.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-2">Short Bio <span className="text-red-400">*</span></label>
                    <textarea {...register("bio")} id="bio" rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors resize-none" placeholder="A short introduction..." title="Short Bio" />
                    {errors.bio && <p className="text-red-400 text-sm mt-1"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.bio.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="longBio" className="block text-sm font-medium mb-2">Long Bio</label>
                    <textarea {...register("longBio")} id="longBio" rows={6} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors resize-none" placeholder="Detailed description..." title="Long Bio" />
                  </div>
                </div>
              </LiquidCard>

              {/* Personal Details */}
              <LiquidCard>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Heart className="h-5 w-5 text-pink-400" />Personal Details</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium mb-2"><Calendar className="h-4 w-4 inline mr-2" />Date of Birth</label>
                    <input {...register("dob")} id="dob" type="date" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" title="Date of Birth" />
                  </div>
                  <div>
                    <label htmlFor="placeOfBirth" className="block text-sm font-medium mb-2"><MapPin className="h-4 w-4 inline mr-2" />Place of Birth</label>
                    <input {...register("placeOfBirth")} id="placeOfBirth" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="Nangarhar, Afghanistan" title="Place of Birth" />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium mb-2">Gender</label>
                    <select {...register("gender")} id="gender" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" title="Gender">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </LiquidCard>

              {/* Contact & Social */}
              <LiquidCard>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Mail className="h-5 w-5 text-green-400" />Contact & Social</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input {...register("email")} id="email" type="email" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="your@email.com" title="Email" />
                    </div>
                    {errors.email && <p className="text-red-400 text-sm mt-1"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.email.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input {...register("phone")} id="phone" type="tel" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="+93 700 000 000" title="Phone" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input {...register("location")} id="location" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="Nangarhar, Afghanistan" title="Location" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium mb-2">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input {...register("website")} id="website" type="url" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="https://yourwebsite.com" title="Website" />
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label htmlFor="github" className="block text-sm font-medium mb-2"><GitHubIcon className="h-4 w-4 inline mr-2" />GitHub</label>
                    <input {...register("github")} id="github" type="url" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="https://github.com/username" title="GitHub URL" />
                  </div>
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium mb-2"><LinkedInIcon className="h-4 w-4 inline mr-2" />LinkedIn</label>
                    <input {...register("linkedin")} id="linkedin" type="url" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="https://linkedin.com/in/username" title="LinkedIn URL" />
                  </div>
                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium mb-2"><TwitterIcon className="h-4 w-4 inline mr-2" />Twitter</label>
                    <input {...register("twitter")} id="twitter" type="url" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="https://twitter.com/username" title="Twitter URL" />
                  </div>
                </div>
              </LiquidCard>

              {/* Resume */}
              <LiquidCard>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><FileText className="h-5 w-5 text-blue-400" />Resume</h2>
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium mb-2">Resume URL</label>
                  <input {...register("resume")} id="resume" type="url" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors" placeholder="https://example.com/resume.pdf" title="Resume URL" />
                </div>
              </LiquidCard>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <LiquidCard className="text-center p-8">
                {watchAllFields.avatar && !avatarError && (
                  <img src={watchAllFields.avatar} alt={watchAllFields.name} className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-blue-500/30 object-cover" onError={handleImageError} />
                )}
                <h1 className="text-4xl font-bold mb-2">{watchAllFields.name || "Your Name"}</h1>
                <p className="text-xl text-blue-400 mb-4">{watchAllFields.title || "Your Title"}</p>
                <p className="text-muted-foreground max-w-2xl mx-auto">{watchAllFields.bio || "Your bio"}</p>
              </LiquidCard>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <LiquidCard>
            <h3 className="font-semibold mb-4">Tips</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span>Upload a professional photo</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span>Write a compelling bio</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span>Add all social links</li>
            </ul>
          </LiquidCard>
          <LiquidCard>
            <h3 className="font-semibold mb-4">Preview</h3>
            <p className="text-sm text-muted-foreground mb-4">Click Preview to see how it looks.</p>
            <Button variant="glass" className="w-full" onClick={() => setPreviewMode(!previewMode)}>
              {previewMode ? <><Edit3 className="h-4 w-4 mr-2" />Back to Edit</> : <><Eye className="h-4 w-4 mr-2" />Preview</>}
            </Button>
          </LiquidCard>
          {isDirty && (
            <LiquidCard>
              <div className="px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-400 flex items-center gap-2"><AlertCircle className="h-4 w-4" />You have unsaved changes</p>
              </div>
            </LiquidCard>
          )}
        </div>
      </div>
    </div>
  );
}