import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Channeldialogue from "./channeldialogue";
import { useUser } from "@/lib/AuthContext";

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ className, collapsed, isOpen, setIsOpen }: SidebarProps) => {
  const { user } = useUser();

  const [isdialogeopen, setisdialogeopen] = useState(false);
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  const isCollapsed = className?.includes("collapsed");

  return (
    <>
      {/* <button
        className="p-2 m-2 text-gray-900 dark:text-gray-100 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Menu"
      >

        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button> */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 h-screen w-1/2 bg-white dark:bg-black dark:text-white border-r p-2 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "md:w-20" : "md:w-64"} md:translate-x-0 ${className}`}
      >
        <button
          className="md:hidden absolute top-2 right-4 text-2xl"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
        <nav className="space-y-1">
          <Link href="/">
            <Button
              variant="ghost"
              className={`w-full justify-start text-gray-900 dark:text-gray-100 ${
                isCollapsed ? "justify-start" : "justify-start"
              }`}
            >
              <Home className="w-5 h-5 mr-3" />
              {!isCollapsed && <span className="ml-3">Home</span>}
            </Button>
          </Link>
          <Link href="/explore">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-900 dark:text-gray-100"
            >
              <Compass className="w-5 h-5 mr-3" />
              {!isCollapsed && <span className="ml-3">Explore</span>}
            </Button>
          </Link>
          <Link href="/subscriptions">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-900 dark:text-gray-100"
            >
              <PlaySquare className="w-5 h-5 mr-3" />
              {!isCollapsed && <span className="ml-3">Subscriptions</span>}
            </Button>
          </Link>

          {user && (
            <>
              <div className="border-t pt-2 mt-2">
                <Link href="/history">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-gray-900 dark:text-gray-100 ${
                      isCollapsed ? "justify-start" : "justify-start"
                    }`}
                  >
                    <History className="w-5 h-5 mr-3" />
                    {!isCollapsed && <span className="ml-3">History</span>}
                  </Button>
                </Link>
                <Link href="/liked">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900 dark:text-gray-100"
                  >
                    <ThumbsUp className="w-5 h-5 mr-3" />
                    {!isCollapsed && <span className="ml-3">Liked videos</span>}
                  </Button>
                </Link>
                <Link href="/watch-later">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900 dark:text-gray-100"
                  >
                    <Clock className="w-5 h-5 mr-3" />
                    {!isCollapsed && <span className="ml-3">Watch later</span>}
                  </Button>
                </Link>
                {user?.channelname ? (
                  <Link href={`/channel/${user._id}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-900 dark:text-gray-100"
                    >
                      <User className="w-5 h-5 mr-3" />
                      {!isCollapsed && (
                        <span className="ml-3">Your channel</span>
                      )}
                    </Button>
                  </Link>
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
              </div>
            </>
          )}
        </nav>
        <Channeldialogue
          isopen={isdialogeopen}
          onclose={() => setisdialogeopen(false)}
          mode="create"
        />
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
// import {
//   Home,
//   Compass,
//   PlaySquare,
//   Clock,
//   ThumbsUp,
//   History,
//   User,
// } from "lucide-react";
// import Link from "next/link";
// import React, { useState } from "react";
// import { Button } from "./ui/button";
// import Channeldialogue from "./channeldialogue";
// import { useUser } from "@/lib/AuthContext";

// interface SidebarProps {
//   className?: string;
// }

// const Sidebar = ({ className }: SidebarProps) => {
//   const { user } = useUser();

//   const [isdialogeopen, setisdialogeopen] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <>
//       <button
//         className="p-2 m-2 text-gray-900 dark:text-gray-100 md:hidden"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//         aria-label="Toggle Menu"
//       >
//         {/* Use any icon here */}
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
//           />
//         </svg>
//       </button>
//       <aside
//         className={`w-64 bg-white dark:bg-black dark:text-white border-r min-h-screen p-2 ${className}`}
//       >
//         <nav className="space-y-1">
//           <Link href="/">
//             <Button
//               variant="ghost"
//               className="w-full justify-start text-gray-900 dark:text-gray-100"
//             >
//               <Home className="w-5 h-5 mr-3" />
//               Home
//             </Button>
//           </Link>
//           <Link href="/explore">
//             <Button
//               variant="ghost"
//               className="w-full justify-start text-gray-900 dark:text-gray-100"
//             >
//               <Compass className="w-5 h-5 mr-3" />
//               Explore
//             </Button>
//           </Link>
//           <Link href="/subscriptions">
//             <Button
//               variant="ghost"
//               className="w-full justify-start text-gray-900 dark:text-gray-100"
//             >
//               <PlaySquare className="w-5 h-5 mr-3" />
//               Subscriptions
//             </Button>
//           </Link>

//           {user && (
//             <>
//               <div className="border-t pt-2 mt-2">
//                 <Link href="/history">
//                   <Button
//                     variant="ghost"
//                     className="w-full justify-start text-gray-900 dark:text-gray-100"
//                   >
//                     <History className="w-5 h-5 mr-3" />
//                     History
//                   </Button>
//                 </Link>
//                 <Link href="/liked">
//                   <Button
//                     variant="ghost"
//                     className="w-full justify-start text-gray-900 dark:text-gray-100"
//                   >
//                     <ThumbsUp className="w-5 h-5 mr-3" />
//                     Liked videos
//                   </Button>
//                 </Link>
//                 <Link href="/watch-later">
//                   <Button
//                     variant="ghost"
//                     className="w-full justify-start text-gray-900 dark:text-gray-100"
//                   >
//                     <Clock className="w-5 h-5 mr-3" />
//                     Watch later
//                   </Button>
//                 </Link>
//                 {user?.channelname ? (
//                   <Link href={`/channel/${user.id}`}>
//                     <Button
//                       variant="ghost"
//                       className="w-full justify-start text-gray-900 dark:text-gray-100"
//                     >
//                       <User className="w-5 h-5 mr-3" />
//                       Your channel
//                     </Button>
//                   </Link>
//                 ) : (
//                   <div className="px-2 py-1.5">
//                     <Button
//                       variant="secondary"
//                       size="sm"
//                       className="w-full"
//                       onClick={() => setisdialogeopen(true)}
//                     >
//                       Create Channel
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </nav>
//         <Channeldialogue
//           isopen={isdialogeopen}
//           onclose={() => setisdialogeopen(false)}
//           mode="create"
//         />
//       </aside>
//     </>
//   );
// };

// export default Sidebar;
