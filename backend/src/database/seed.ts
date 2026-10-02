import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';
import {
  initialCategories,
  initialProducts,
  initialCoupons,
  initialReviews,
  defaultCmsContent,
  defaultStoreSettings,
  createSuperAdminData,
} from './seedData.js';

export const runSeed = async () => {
  logger.info('🌱 Starting PostgreSQL database seed...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Seed Admin
    const admin = await createSuperAdminData();
    await client.query(
      `INSERT INTO admins (id, name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`,
      [admin.id, admin.name, admin.email, admin.password_hash, admin.role, admin.is_active]
    );
    logger.info(`✅ Admin seeded: ${admin.email}`);

    // 2. Seed Categories
    for (const cat of initialCategories) {
      await client.query(
        `INSERT INTO categories (id, name, slug, tagline, description, image, is_active, featured, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          tagline = EXCLUDED.tagline,
          image = EXCLUDED.image`,
        [
          cat.id,
          cat.name,
          cat.slug,
          cat.tagline,
          cat.tagline,
          cat.image,
          true,
          cat.featured,
          cat.displayOrder,
        ]
      );
    }
    logger.info(`✅ ${initialCategories.length} categories seeded.`);

    // 3. Seed Products
    for (const prod of initialProducts) {
      await client.query(
        `INSERT INTO products (
          id, name, slug, brand, sku, category_name, category_slug, price, original_price,
          stock_quantity, badge, description, overview, specifications, colors, sizes,
          is_featured, is_bestseller, is_new_arrival, is_flash_sale, status, rating, review_count
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
        ) ON CONFLICT (slug) DO UPDATE SET
          price = EXCLUDED.price,
          stock_quantity = EXCLUDED.stock_quantity`,
        [
          prod.id,
          prod.name,
          prod.slug,
          prod.brand,
          prod.sku,
          prod.category,
          prod.categorySlug,
          prod.price,
          prod.originalPrice,
          prod.stock,
          prod.badge,
          prod.description,
          prod.overview,
          JSON.stringify(prod.specifications),
          JSON.stringify(prod.colors),
          JSON.stringify(prod.sizes),
          prod.isFeatured,
          prod.isBestseller,
          prod.isNewArrival,
          prod.isFlashSale,
          prod.status,
          prod.rating,
          prod.reviewCount,
        ]
      );

      // Seed product images
      for (let i = 0; i < prod.images.length; i++) {
        await client.query(
          `INSERT INTO product_images (product_id, url, is_primary, display_order)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING`,
          [prod.id, prod.images[i], i === 0, i]
        );
      }
    }
    logger.info(`✅ ${initialProducts.length} products seeded.`);

    // 4. Seed Coupons
    for (const coup of initialCoupons) {
      await client.query(
        `INSERT INTO coupons (id, code, discount_type, discount_value, minimum_order, expiry_date, usage_limit, times_used, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (code) DO NOTHING`,
        [
          coup.id,
          coup.code,
          coup.type,
          coup.value,
          coup.minSpend,
          coup.expiryDate,
          coup.usageLimit,
          coup.timesUsed,
          coup.active,
        ]
      );
    }
    logger.info(`✅ ${initialCoupons.length} coupons seeded.`);

    // 5. Seed Reviews
    for (const rev of initialReviews) {
      await client.query(
        `INSERT INTO reviews (id, product_id, author, rating, title, comment, verified, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [rev.id, rev.productId, rev.author, rev.rating, rev.title, rev.comment, rev.verified, rev.status.toLowerCase()]
      );
    }
    logger.info(`✅ ${initialReviews.length} reviews seeded.`);

    // 6. Seed Homepage CMS & Store Settings
    await client.query(
      `INSERT INTO homepage_content (id, hero, announcement, promotional_banner)
       VALUES ('default', $1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [
        JSON.stringify(defaultCmsContent.hero),
        JSON.stringify(defaultCmsContent.announcement),
        JSON.stringify(defaultCmsContent.promotionalBanner),
      ]
    );

    await client.query(
      `INSERT INTO store_settings (id, settings)
       VALUES ('default', $1)
       ON CONFLICT (id) DO NOTHING`,
      [JSON.stringify(defaultStoreSettings)]
    );
    logger.info('✅ Homepage CMS & store settings seeded.');

    await client.query('COMMIT');
    logger.info('🎉 Database seeding complete!');
  } catch (err: any) {
    await client.query('ROLLBACK');
    logger.error({ err }, `❌ Seed error: ${err.message}`);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

// If run directly via tsx
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed();
}
