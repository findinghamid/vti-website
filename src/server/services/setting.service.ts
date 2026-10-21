import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { logger } from "@/server/api/logger";

export const DEFAULT_SETTINGS = {
  BRAND_NAME: "VTI Marketplace LMS",
  BRAND_TAGLINE: "Udemy-Class Learning Marketplace + Enterprise LMS",
  PRIMARY_COLOR: "#4f46e5",
  ENABLE_CART: true,
  ENABLE_WISHLIST: true,
  ENABLE_COMMUNITY: true,
  ENABLE_GAMIFICATION: true,
  ENABLE_SUBSCRIPTIONS: false,
  ENABLE_INSTRUCTOR_COUPONS: true,
  HERO_TITLE: "Next-Generation Learning Marketplace & Enterprise LMS",
  HERO_SUBTITLE: "A commercially reusable, white-label educational engine built with Next.js 16+, TanStack Query, Redux Toolkit, and PostgreSQL.",
} as const;

export type SettingKey = keyof typeof DEFAULT_SETTINGS | string;

export class SettingService {
  /**
   * Get setting by key with fallback to defaults
   */
  static async getSetting<T>(key: SettingKey, fallback?: T): Promise<T> {
    try {
      const record = await prisma.siteSetting.findUnique({
        where: { key },
      });

      if (record && record.value !== null && record.value !== undefined) {
        return record.value as T;
      }

      if (key in DEFAULT_SETTINGS) {
        return DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS] as unknown as T;
      }

      return fallback as T;
    } catch (e) {
      logger.warn(`Failed to read setting "${key}", using fallback`, { error: e });
      if (key in DEFAULT_SETTINGS) {
        return DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS] as unknown as T;
      }
      return fallback as T;
    }
  }

  /**
   * Set or update setting value
   */
  static async setSetting<T>(key: SettingKey, value: T) {
    const jsonValue = value as unknown as Prisma.InputJsonValue;
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value: jsonValue },
      create: { key, value: jsonValue },
    });

    logger.info(`Setting updated: ${key}`, {
      action: "SETTING_UPDATED",
      entity: "SETTING",
      entityId: key,
    });

    return setting;
  }

  /**
   * Retrieve all public branding and feature flags
   */
  static async getPublicSettings() {
    try {
      const settings = await prisma.siteSetting.findMany();
      const mapped: Record<string, unknown> = { ...DEFAULT_SETTINGS };

      for (const s of settings) {
        mapped[s.key] = s.value;
      }

      return mapped;
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  /**
   * Update multiple settings in bulk (Admin/Super Admin only)
   */
  static async updateBulkSettings(settingsMap: Record<string, unknown>) {
    const operations = Object.entries(settingsMap).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: value as unknown as Prisma.InputJsonValue },
        create: { key, value: value as unknown as Prisma.InputJsonValue },
      })
    );

    return prisma.$transaction(operations);
  }
}
