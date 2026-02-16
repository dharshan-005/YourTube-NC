import { Bell, Menu, Mic, Search, User, VideoIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Channeldialogue from "./channeldialogue";
import { useRouter } from "next/router";
import { useUser } from "@/lib/AuthContext";
import Sidebar from "./Sidebar";
import { channel } from "diagnostics_channel";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [sideCollapsed, setSideCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const { user, logout, handlegooglesignin } = useUser();
  // const [user, setUser] = useState(null);
  console.log("Current user in header:", user);

  useEffect(() => {
    if (user?.theme === "light") {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme", "dark");
    } else {
      document.body.classList.add("dark-theme");
      document.body.classList.add("dark");
      document.body.classList.remove("light-theme");
    }
  }, [user?.theme]);
  // const user: any = {
  //   id: "1",
  //   name: "John Doe",
  //   email: "john@example.com",
  //   image: "https://github.com/shadcn.png?height=32&width=32",
  // };
  const [searchQuery, setSearchQuery] = useState("");
  const [isdialogeopen, setisdialogeopen] = useState(false);
  const router = useRouter();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  const handleKeypress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e as any);
    }
  };
  return (
    <>
      <header className="flex flex-row items-center gap-4 justify-between px-4 py-2 bg-white dark:bg-black dark:text-white border-b">
        <div className="flex items-center gap-4 justify-between">
          <Button
            variant="ghost"
            size="icon"
            // onClick={() => setSideCollapsed(!sideCollapsed)}
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <Link href="/" className="flex items-center gap-1">
            <div className="bg-red-600 p-1 rounded">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <span className="text-xl font-medium hidden sm:block">
              YourTube
            </span>
            <span className="text-xs text-gray-400 ml-1 hidden sm:block">
              IN
            </span>
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 mx-4 max-w-auto sm:max-w-md"
        >
          <div className="flex">
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search"
              value={searchQuery}
              onKeyPress={handleKeypress}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`rounded-l-full border-r-0 focus-visible:ring-0 transition-width duration-300 w-0 sm:w-64
                ${isSearchOpen ? "w-64" : "w-0"}`}
              // style={{ minWidth: "2rem" }}
            />
            <Button
              type="button"
              className="rounded-r-full px-6 bg-gray-50 hover:bg-gray-100 dark:bg-black dark:text-gray-100 text-gray-600 border border-l-0 cursor-pointer"
              // onClick={() => setIsSearchOpen((prev) => !prev)}
              onClick={() => {
                setIsSearchOverlayOpen(true);
              }}
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full cursor-pointer hidden sm:block"
          >
            <Mic className="w-5 h-5" />
          </Button>
        </form>
        {isSearchOverlayOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex  justify-center z-50">
            <div className="bg-white dark:bg-black p-4 rounded w-full max-w-md mx-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(e);
                  setIsSearchOverlayOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <Input
                  type="search"
                  placeholder="Search"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="grow"
                />
                <Button type="submit">
                  <Search className="w-5 h-5" />
                </Button>
                <Button>
                  <Mic className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsSearchOverlayOpen(false)}
                >
                  Close
                </Button>
              </form>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <VideoIcon className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Bell className="w-6 h-6" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full cursor-pointer"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} />
                      <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  {user?.channelname ? (
                    <DropdownMenuItem asChild>
                      <Link href={`/channel/${user?._id}`}>Your channel</Link>
                    </DropdownMenuItem>
                  ) : (
                    <div className="px-2 py-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          if (!user?.channelname) {
                            setisdialogeopen(true);
                          }
                        }}
                      >
                        Create Channel
                      </Button>
                    </div>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/history">History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/downloads">Downloads</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/liked">Liked videos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/watch-later">Watch later</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                className="flex items-center gap-2"
                onClick={handlegooglesignin}
              >
                <User className="w-4 h-4" />
                Sign in
              </Button>
            </>
          )}{" "}
        </div>
        <Channeldialogue
          isopen={isdialogeopen}
          onclose={() => setisdialogeopen(false)}
          mode="create"
        />
      </header>
    </>
  );
};

export default Header;
