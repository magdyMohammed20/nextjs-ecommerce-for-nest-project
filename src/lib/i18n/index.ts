"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  getServerLanguage,
  LANGUAGE_COOKIE,
  type AppLanguage,
} from "./server-language";

export { getServerLanguage, LANGUAGE_COOKIE, type AppLanguage };

import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enLanding from "./locales/en/landing.json";
import enLogin from "./locales/en/login.json";
import enRegister from "./locales/en/register.json";
import enGoogle from "./locales/en/google.json";
import enDashboard from "./locales/en/dashboard.json";
import enProfile from "./locales/en/profile.json";
import enProfileEdit from "./locales/en/profileEdit.json";
import enUsers from "./locales/en/users.json";
import enUserForm from "./locales/en/userForm.json";
import enProducts from "./locales/en/products.json";
import enProductForm from "./locales/en/productForm.json";
import enCategories from "./locales/en/categories.json";
import enCategoriesAdmin from "./locales/en/categoriesAdmin.json";
import enFaqAdmin from "./locales/en/faqAdmin.json";
import enAbout from "./locales/en/about.json";
import enFaq from "./locales/en/faq.json";
import enStorefront from "./locales/en/storefront.json";
import enUserDashboard from "./locales/en/userDashboard.json";
import enCart from "./locales/en/cart.json";
import enOrders from "./locales/en/orders.json";

import arCommon from "./locales/ar/common.json";
import arHome from "./locales/ar/home.json";
import arLanding from "./locales/ar/landing.json";
import arLogin from "./locales/ar/login.json";
import arRegister from "./locales/ar/register.json";
import arGoogle from "./locales/ar/google.json";
import arDashboard from "./locales/ar/dashboard.json";
import arProfile from "./locales/ar/profile.json";
import arProfileEdit from "./locales/ar/profileEdit.json";
import arUsers from "./locales/ar/users.json";
import arUserForm from "./locales/ar/userForm.json";
import arProducts from "./locales/ar/products.json";
import arProductForm from "./locales/ar/productForm.json";
import arCategories from "./locales/ar/categories.json";
import arCategoriesAdmin from "./locales/ar/categoriesAdmin.json";
import arFaqAdmin from "./locales/ar/faqAdmin.json";
import arAbout from "./locales/ar/about.json";
import arFaq from "./locales/ar/faq.json";
import arStorefront from "./locales/ar/storefront.json";
import arUserDashboard from "./locales/ar/userDashboard.json";
import arCart from "./locales/ar/cart.json";
import arOrders from "./locales/ar/orders.json";

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    landing: enLanding,
    login: enLogin,
    register: enRegister,
    google: enGoogle,
    dashboard: enDashboard,
    profile: enProfile,
    profileEdit: enProfileEdit,
    users: enUsers,
    userForm: enUserForm,
    products: enProducts,
    productForm: enProductForm,
    categories: enCategories,
    categoriesAdmin: enCategoriesAdmin,
    faqAdmin: enFaqAdmin,
    about: enAbout,
    faq: enFaq,
    storefront: enStorefront,
    userDashboard: enUserDashboard,
    cart: enCart,
    orders: enOrders,
  },
  ar: {
    common: arCommon,
    home: arHome,
    landing: arLanding,
    login: arLogin,
    register: arRegister,
    google: arGoogle,
    dashboard: arDashboard,
    profile: arProfile,
    profileEdit: arProfileEdit,
    users: arUsers,
    userForm: arUserForm,
    products: arProducts,
    productForm: arProductForm,
    categories: arCategories,
    categoriesAdmin: arCategoriesAdmin,
    faqAdmin: arFaqAdmin,
    about: arAbout,
    faq: arFaq,
    storefront: arStorefront,
    userDashboard: arUserDashboard,
    cart: arCart,
    orders: arOrders,
  },
} as const;

export const LANGUAGE_KEY = "app-language";

function readCookieLanguage(): AppLanguage | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)app-language=([^;]*)/);
  const value = match?.[1];
  if (value === "ar" || value === "en") return value;
  return null;
}

export function getInitialLanguage(): AppLanguage {
  if (typeof window === "undefined") return "en";
  const fromCookie = readCookieLanguage();
  if (fromCookie) return fromCookie;
  const saved = window.localStorage.getItem(LANGUAGE_KEY);
  if (saved === "ar" || saved === "en") return saved;
  return window.navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en";
}

export function applyDocumentLanguage(lang: AppLanguage) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

const initialLanguage = getInitialLanguage();

if (typeof window !== "undefined") {
  applyDocumentLanguage(initialLanguage);
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });
}

export async function setAppLanguage(lang: AppLanguage) {
  if (typeof window !== "undefined") {
    document.cookie = `${LANGUAGE_COOKIE}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    window.localStorage.setItem(LANGUAGE_KEY, lang);
    applyDocumentLanguage(lang);
  }
  await i18n.changeLanguage(lang);
}

export default i18n;
