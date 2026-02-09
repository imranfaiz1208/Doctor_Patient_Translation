import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, LogIn } from 'lucide-react';

export function ProfileAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 border-2 border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 transition-colors flex items-center justify-center overflow-hidden"
        aria-label="Profile menu"
      >
        <User className="w-5 h-5 text-black dark:text-white" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b border-black/10 dark:border-white/10">
            <p className="text-sm font-medium text-black dark:text-white">Guest User</p>
            <p className="text-xs text-black/60 dark:text-white/60 mt-1">guest@meditranslate.app</p>
          </div>
          
          <ul className="py-2">
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            </li>
            <li className="border-t border-black/10 dark:border-white/10 mt-2 pt-2">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
