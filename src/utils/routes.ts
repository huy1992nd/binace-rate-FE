export enum Routes {
  PRICES = '/prices',
  ABOUT = '/about',
  USER = '/user',
  MANAGE_USERS = '/manage-users'
}

export const PUBLIC_ROUTES = [Routes.PRICES, Routes.ABOUT];
export const PROTECTED_ROUTES = [Routes.USER, Routes.MANAGE_USERS]; 