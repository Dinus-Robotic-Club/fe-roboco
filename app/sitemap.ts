import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://dnroboco.dinusrobotic.org',
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: 'https://dnroboco.dinusrobotic.org/register',
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		// Tambah route lain di sini
	];
}
