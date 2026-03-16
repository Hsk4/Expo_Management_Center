import {
  Bell,
  CalendarDays,
  Check,
  FileText as FileTextIcon,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Users,
  Warehouse,
  X,
} from "lucide-react";

import type { ComponentType } from "react";

const icon = (Comp: ComponentType<{ size?: number; strokeWidth?: number }>, size = 17, strokeWidth = 1.8) => (
  <Comp size={size} strokeWidth={strokeWidth} />
);

export const Icon = {
  Dashboard: () => icon(LayoutDashboard),
  Expos: () => icon(Warehouse),
  Applications: () => icon(FileTextIcon),
  Settings: () => icon(Settings),
  Menu: () => icon(Menu, 20),
  Bell: () => icon(Bell),
  Search: () => icon(Search, 15, 2),
  Users: () => icon(Users),
  TrendUp: () => icon(TrendingUp, 13, 2.5),
  Check: () => icon(Check, 13, 2.5),
  X: () => icon(X, 13, 2.5),
  Calendar: () => icon(CalendarDays, 13, 2),
  Plus: () => icon(Plus, 17, 2),
  FileText: () => icon(FileTextIcon),
};

