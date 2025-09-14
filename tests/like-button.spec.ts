import { test, expect } from '@playwright/test';

test.describe('Like Button Functionality', () => {
  test('should increment like count when clicking like button in demo widget', async ({ page }) => {
    // Navigate to dashboard and get initial like count for ABC123 (first product)
    await page.goto('/');

    // Wait for analytics to load
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // Get the initial like count for ABC123 (first row)
    const firstRowLikesCell = page.locator('table tbody tr:first-child td:nth-child(4)');
    await expect(firstRowLikesCell).toBeVisible();
    const initialLikesText = await firstRowLikesCell.textContent();
    const initialLikes = parseInt(initialLikesText || '0');

    console.log(`Initial likes for ABC123: ${initialLikes}`);

    // Navigate to demo page
    await page.goto('/demo');

    // Wait for the widget script to load
    await page.waitForFunction(() => window.LifestyleWidget);

    // Wait for the first widget to load and display lifestyle images
    const firstWidget = page.locator('[data-sku="ABC123"]');
    await expect(firstWidget).toBeVisible();

    // Wait for widget content to load (should show lifestyle images)
    await page.waitForSelector('[data-sku="ABC123"] .lifestyle-widget-grid .lifestyle-widget-item', { timeout: 10000 });

    // Find and click the first like button in the first widget (ABC123)
    const firstLikeButton = firstWidget.locator('.lifestyle-widget-like').first();
    await expect(firstLikeButton).toBeVisible();

    // Click the like button
    await firstLikeButton.click();

    // Wait a moment for the API call to complete
    await page.waitForTimeout(2000);

    // Navigate back to dashboard
    await page.goto('/');

    // Wait for analytics to reload
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // Get the updated like count for ABC123 (first row)
    const updatedLikesText = await firstRowLikesCell.textContent();
    const updatedLikes = parseInt(updatedLikesText || '0');

    console.log(`Updated likes for ABC123: ${updatedLikes}`);

    // Verify that the like count has incremented by 1
    expect(updatedLikes).toBe(initialLikes + 1);
  });

  test('should toggle like button visual state when clicked', async ({ page }) => {
    await page.goto('/demo');

    // Wait for the widget script to load
    await page.waitForFunction(() => window.LifestyleWidget);

    // Wait for the first widget to load
    const firstWidget = page.locator('[data-sku="ABC123"]');
    await page.waitForSelector('[data-sku="ABC123"] .lifestyle-widget-grid .lifestyle-widget-item', { timeout: 10000 });

    // Get the first like button
    const firstLikeButton = firstWidget.locator('.lifestyle-widget-like').first();
    const heartIcon = firstLikeButton.locator('.lifestyle-widget-heart');

    // Get initial state
    const initialClass = await heartIcon.getAttribute('class');
    console.log(`Initial heart class: ${initialClass}`);

    // Click the like button
    await firstLikeButton.click();

    // Wait for the visual state to update
    await page.waitForTimeout(1000);

    // Get updated state
    const updatedClass = await heartIcon.getAttribute('class');
    console.log(`Updated heart class: ${updatedClass}`);

    // Verify the class has changed (should toggle between 'filled' and 'outline')
    expect(initialClass).not.toBe(updatedClass);
    expect(updatedClass).toContain('lifestyle-widget-heart');
  });
});