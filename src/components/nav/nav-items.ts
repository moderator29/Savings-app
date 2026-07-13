import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bell,
  Gift,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  ListOrdered,
  Lock,
  Percent,
  PiggyBank,
  Settings,
  Target,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Primary items shown in the desktop sidebar
export const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Savings Goals", href: "/goals", icon: Target },
  { label: "Savings", href: "/savings", icon: PiggyBank },
  { label: "Locked Savings", href: "/locked-savings", icon: Lock },
  { label: "APY Earnings", href: "/apy-earnings", icon: Percent },
  { label: "Investments", href: "/investments", icon: LineChart },
  { label: "Deposit", href: "/deposit", icon: ArrowDownToLine },
  { label: "Withdraw", href: "/withdraw", icon: ArrowUpFromLine },
  { label: "Transactions", href: "/transactions", icon: ListOrdered },
  { label: "Rewards", href: "/rewards", icon: Gift },
  { label: "Referrals", href: "/referrals", icon: Users },
];

// Secondary items (bottom of sidebar + inside the More drawer)
export const secondaryNav: NavItem[] = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Support", href: "/support", icon: LifeBuoy },
  { label: "Settings", href: "/settings", icon: Settings },
];

// Mobile bottom navigation (4 tabs + More)
export const mobileNav: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Savings", href: "/savings", icon: PiggyBank },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Activity", href: "/transactions", icon: ListOrdered },
];
