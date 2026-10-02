import { cmsRepository } from '../repositories/cms.repository.js';

export class CmsService {
  async getHomepageContent() {
    return await cmsRepository.getHomepageContent();
  }

  async updateHomepageContent(newContent: any) {
    return await cmsRepository.updateHomepageContent(newContent);
  }

  async getStoreSettings() {
    return await cmsRepository.getStoreSettings();
  }

  async updateStoreSettings(newSettings: any) {
    return await cmsRepository.updateStoreSettings(newSettings);
  }
}

export const cmsService = new CmsService();
