import Link from "next/link";
import { FileQuestion, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Search className="mr-2 h-4 w-4" />
            Contact Me
          </Link>
        </div>

        <div className="text-sm text-muted-foreground pt-4 border-t">
          <p>Try these pages:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Link href="/#about" className="text-primary hover:underline">About</Link>
            <span>•</span>
            <Link href="/#projects" className="text-primary hover:underline">Projects</Link>
            <span>•</span>
            <Link href="/#skills" className="text-primary hover:underline">Skills</Link>
            <span>•</span>
            <Link href="/#contact" className="text-primary hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}