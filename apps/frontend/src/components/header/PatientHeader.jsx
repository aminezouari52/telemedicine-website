"use client";

// HOOKS
import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// FUNCTIONS
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { logout } from "@/reducers/userReducer";
import { getPatientConsultations } from "@/services/consultationService";
import { findJoinableConsultation } from "@/utils/consultationJoinable";

// COMPONENTS
import Logo from "@/components/Logo";

// STYLE
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ASSETS
import {
  MessageSquareMore,
  LogOut,
  Sparkles,
  Menu,
  X,
  ClipboardList,
  Stethoscope,
  LayoutDashboard,
  Calendar,
  // FileText,
  UserCircle,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/calendar", label: "Calendar", icon: Calendar },
  {
    href: "/patient/consultations",
    label: "Consultations",
    icon: ClipboardList,
  },
  { href: "/patient/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/patient/AI", label: "AI Consultation", icon: Sparkles },
  // { href: "/patient/medical-records", label: "Medical Records", icon: FileText },
  { href: "/patient/profile", label: "Profile", icon: UserCircle },
  { href: "/patient/settings", label: "Settings", icon: Settings },
];

export const PatientHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const toast = useToast();
  const user = useSelector((state) => state.userReducer.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: consultation } = useQuery({
    queryKey: ["consultation", "joinable", user?._id],
    queryFn: async () => {
      const consultationsData = (await getPatientConsultations(user?._id)).data;
      return findJoinableConsultation(consultationsData) || null;
    },
    enabled: !!user?._id,
    refetchInterval: !!user?._id ? 30_000 : false,
  });

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      dispatch(logout(null));
      queryClient.removeQueries();
      router.push("/auth/login");
    } catch (err) {
      console.log(err);
      toast("Logout failed!", "error");
    }
  };

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const navigate = useCallback(
    (href) => {
      router.push(href);
      closeMobile();
    },
    [router, closeMobile],
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">
        <Logo />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static column on desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 max-w-[80vw] flex-col bg-white shadow-xl transition-transform duration-300",
          "md:static md:z-auto md:w-64 md:max-w-none md:translate-x-0 md:border-r md:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden focus-visible:ring-primary-500"
            aria-label="Close menu"
            onClick={closeMobile}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-500"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="space-y-2 border-t px-3 py-4">
          {user && !!consultation && (
            <Button
              size="sm"
              className="w-full"
              onClick={() => navigate(`/consultation/${consultation?._id}`)}
            >
              <MessageSquareMore className="mr-2 h-4 w-4" />
              Join
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full justify-center text-red-500 hover:bg-red-50 hover:text-red-600 focus-visible:ring-red-300"
            onClick={logoutHandler}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
};

export default PatientHeader;
