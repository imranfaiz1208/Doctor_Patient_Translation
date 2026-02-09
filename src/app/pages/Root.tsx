import { Outlet } from "react-router";
import { MessageSquare } from "lucide-react";
import { HamburgerMenu } from "../components/HamburgerMenu";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { ThemeToggle } from "../components/ThemeToggle";
import { CurrentTime } from "../components/CurrentTime";
import { ThemeProvider } from "../components/ThemeProvider";

export default function Root() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black flex flex-col transition-colors">
        {/* Header - Hyper-Minimalist Navigation */}
        <header className="border-b border-black/10 dark:border-white/10 sticky top-0 z-30 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left Section: Hamburger + Theme Toggle */}
              <div className="flex items-center gap-3">
                <HamburgerMenu />
                <ThemeToggle />
              </div>
              
              {/* Center: Logo */}
              <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
                <MessageSquare className="w-6 h-6 text-black dark:text-white" />
                <h1 className="text-lg font-medium text-black dark:text-white hidden sm:block">
                  MediTranslate
                </h1>
              </div>
              
              {/* Right Section: Time + Profile */}
              <div className="flex items-center gap-4">
                <CurrentTime />
                <ProfileAvatar />
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}