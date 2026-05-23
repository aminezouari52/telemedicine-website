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
  Home,
  ClipboardList,
  Stethoscope,
  LayoutDashboard,
  Calendar,
  // FileText,
  UserCircle,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/patient/home", label: "Home", icon: Home },
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
      <div className="sticky top-0 z-20 flex justify-between bg-white px-4 py-6 md:hidden">
        <Logo className="md:block hidden" />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "pt-2.5 z-40 flex w-64 flex-col bg-white transition-transform duration-300",
          "fixed inset-y-0 left-0",
          "shadow-[2px_0_8px_0_rgba(0,0,0,0.06)]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Logo />
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
              onClick={() => navigate(`/${consultation?._id}`)}
            >
              <MessageSquareMore className="mr-2 h-4 w-4" />
              Join
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full justify-center text-red-500 hover:bg-red-50 hover:text-red-600"
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
