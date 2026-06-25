"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "@/components/ui/social-icons";
import { Heart, ArrowUp, Mail, MapPin, Send, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function Footer() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setAboutData(res.data);
      })
      .catch(() => {});
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail("");
      toast.success("Subscribed!");
      setTimeout(() => setSubscribed(false), 5000);
    } catch (error) {
      toast.error("Failed to subscribe");
    } finally {
      setSubscribing(false);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const currentYear = new Date().getFullYear();
  const name = aboutData?.name || "Mohammad Nasim Safi";
  const userEmail = aboutData?.email || "nasimsafi30@gmail.com";
  const location = aboutData?.location || "Nangarhar, Afghanistan";
  const github = aboutData?.github || "https://github.com/nasimsafi30";
  const linkedin = aboutData?.linkedin || "https://linkedin.com/in/nasimsafi";
  const twitter = aboutData?.twitter || "#";

  const quickLinks = [
    { label: "About", href: "/#about" },
    { label: "Education", href: "/#education" },
    { label: "Experience", href: "/#experience" },
    { label: "Skills", href: "/#skills" },
    { label: "Projects", href: "/#projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <footer className="relative border-t border-foreground/10 bg-background/80 backdrop-blur-2xl">
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          
          {/* Brand & Contact */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                M
              </div>
              <div>
                <h3 className="text-lg font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{name}</h3>
                <p className="text-xs text-muted-foreground">Full Stack Developer & IT Engineer</p>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground mb-4">
              Building innovative digital solutions with cutting-edge technologies.
            </p>

            <div className="space-y-2 text-sm text-muted-foreground">
              <a href={`mailto:${userEmail}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="h-4 w-4 text-blue-400" />{userEmail}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-400" />{location}
              </span>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2 mt-4">
              {[
                { icon: GitHubIcon, href: github, label: "GitHub", hover: "hover:text-white hover:bg-gray-800" },
                { icon: LinkedInIcon, href: linkedin, label: "LinkedIn", hover: "hover:text-blue-400 hover:bg-blue-500/10" },
                { icon: TwitterIcon, href: twitter, label: "Twitter", hover: "hover:text-sky-400 hover:bg-sky-500/10" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className={`w-9 h-9 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center text-muted-foreground transition-all ${social.hover}`}
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest insights delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-sm transition-colors"
                  required
                  aria-label="Email for newsletter"
                />
              </div>
              <button
                type="submit"
                disabled={subscribing}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl transition-colors"
                aria-label="Subscribe"
              >
                {subscribing ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>

            {subscribed && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
              >
                <CheckCircle2 className="h-4 w-4" />Subscribed!
              </motion.div>
            )}

            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-foreground/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            &copy; {currentYear} {name}. Crafted with <Heart className="h-3 w-3 text-red-400 animate-pulse" />
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/#contact" className="hover:text-foreground transition-colors">Contact</Link>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-foreground/5 border border-foreground/10 flex items-center justify-center hover:bg-foreground/10 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}