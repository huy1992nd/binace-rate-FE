import { Routes } from "./routes";

export enum NavigationItems {
  PRICES = 'PRICES',
  ABOUT = 'ABOUT',
  USER = 'USER',
  MANAGE_USERS = 'MANAGE_USERS'
}

export interface NavigationItem {
  id: NavigationItems;
  label: string;
  icon: string;
  route: string;
  isProtected: boolean;
}

export const NAVIGATION_MENU: NavigationItem[] = [
  {
    id: NavigationItems.PRICES,
    label: 'Live Prices',
    icon: '🔥',
    route: Routes.PRICES,
    isProtected: false
  },
  {
    id: NavigationItems.MANAGE_USERS,
    label: 'Manage Users',
    icon: '👥',
    route: Routes.MANAGE_USERS,
    isProtected: true
  },
  {
    id: NavigationItems.USER,
    label: 'User Info',
    icon: '👤',
    route: Routes.USER,
    isProtected: true
  },
  {
    id: NavigationItems.ABOUT,
    label: 'Introduction',
    icon: 'ℹ️',
    route: Routes.ABOUT,
    isProtected: false
  }
]; 