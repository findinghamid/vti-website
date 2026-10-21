import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SETTINGS, SettingService } from "../src/server/services/setting.service";

describe("Milestone 3: CMS-Lite & Platform Configuration", () => {
  it("should have comprehensive default settings", () => {
    assert.equal(DEFAULT_SETTINGS.BRAND_NAME, "VTI Marketplace LMS");
    assert.equal(DEFAULT_SETTINGS.ENABLE_CART, true);
    assert.equal(DEFAULT_SETTINGS.ENABLE_WISHLIST, true);
    assert.equal(DEFAULT_SETTINGS.ENABLE_COMMUNITY, true);
    assert.equal(DEFAULT_SETTINGS.ENABLE_GAMIFICATION, true);
    assert.equal(DEFAULT_SETTINGS.ENABLE_SUBSCRIPTIONS, false);
  });

  it("should return default value when reading setting from fallback", async () => {
    const brandName = await SettingService.getSetting("BRAND_NAME");
    assert.equal(brandName, "VTI Marketplace LMS");

    const custom = await SettingService.getSetting("CUSTOM_KEY", "fallback-value");
    assert.equal(custom, "fallback-value");
  });

  it("should retrieve public settings map with all core feature flags", async () => {
    const publicSettings = await SettingService.getPublicSettings();
    assert.equal(typeof publicSettings, "object");
    assert.equal(publicSettings.BRAND_NAME, "VTI Marketplace LMS");
    assert.equal(publicSettings.ENABLE_CART, true);
  });
});
