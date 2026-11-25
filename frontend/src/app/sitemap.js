export default function sitemap() {
  const baseUrl = 'https://clipgenius.ai';
  const lastModified = new Date();

  return [
    { url: `${baseUrl}`, lastModified, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/features`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/docs`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
