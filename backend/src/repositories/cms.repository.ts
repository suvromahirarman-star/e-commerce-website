import { dbQuery, memoryStore, getIsPgConnected } from '../database/index.js';

export class CmsRepository {
  async getHomepageContent() {
    if (getIsPgConnected()) {
      const rows = await dbQuery(`SELECT * FROM homepage_content WHERE id = 'default'`);
      if (rows.length > 0) {
        return {
          hero: typeof rows[0].hero === 'string' ? JSON.parse(rows[0].hero) : rows[0].hero,
          announcement: typeof rows[0].announcement === 'string' ? JSON.parse(rows[0].announcement) : rows[0].announcement,
          promotionalBanner: typeof rows[0].promotional_banner === 'string' ? JSON.parse(rows[0].promotional_banner) : rows[0].promotional_banner,
        };
      }
    }
    return memoryStore.cmsContent;
  }

  async updateHomepageContent(newContent: any) {
    const current = await this.getHomepageContent();
    const merged = {
      hero: { ...(current.hero || {}), ...(newContent.hero || {}) },
      announcement: { ...(current.announcement || {}), ...(newContent.announcement || {}) },
      promotionalBanner: { ...(current.promotionalBanner || {}), ...(newContent.promotionalBanner || {}) },
    };

    if (getIsPgConnected()) {
      await dbQuery(
        `INSERT INTO homepage_content (id, hero, announcement, promotional_banner, updated_at)
         VALUES ('default', $1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE SET
           hero = EXCLUDED.hero,
           announcement = EXCLUDED.announcement,
           promotional_banner = EXCLUDED.promotional_banner,
           updated_at = CURRENT_TIMESTAMP`,
        [JSON.stringify(merged.hero), JSON.stringify(merged.announcement), JSON.stringify(merged.promotionalBanner)]
      );
    } else {
      memoryStore.cmsContent = merged;
    }
    return merged;
  }

  async getStoreSettings() {
    if (getIsPgConnected()) {
      const rows = await dbQuery(`SELECT * FROM store_settings WHERE id = 'default'`);
      if (rows.length > 0) {
        return typeof rows[0].settings === 'string' ? JSON.parse(rows[0].settings) : rows[0].settings;
      }
    }
    return memoryStore.storeSettings;
  }

  async updateStoreSettings(newSettings: any) {
    const current = await this.getStoreSettings();
    const merged = { ...current, ...newSettings };

    if (getIsPgConnected()) {
      await dbQuery(
        `INSERT INTO store_settings (id, settings, updated_at)
         VALUES ('default', $1, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE SET
           settings = EXCLUDED.settings,
           updated_at = CURRENT_TIMESTAMP`,
        [JSON.stringify(merged)]
      );
    } else {
      memoryStore.storeSettings = merged;
    }
    return merged;
  }
}

export const cmsRepository = new CmsRepository();
