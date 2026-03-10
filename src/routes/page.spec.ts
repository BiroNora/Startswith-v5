import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1', async () => {
		render(Page);

		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
	});
});



/* import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
// NINCS vitest/browser import!
import Page from './+page.svelte';

describe('Alap renderelés', () => {
  it('megjelenik a címsor', () => {
    render(Page);
    const heading = screen.getByRole('heading');
    expect(heading).toBeTruthy();
  });
}); */
