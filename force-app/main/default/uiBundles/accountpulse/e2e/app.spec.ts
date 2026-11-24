import { test, expect } from '@playwright/test';

test.describe('account-pulse', () => {
	test('shows the Account Pulse heading', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { name: 'Account Pulse' })).toBeVisible();
	});
});
