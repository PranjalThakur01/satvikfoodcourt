/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/satvikfoodcourt" : "";

const nextConfig = {
	reactStrictMode: true,
	output: "export",
	trailingSlash: true,
	basePath,
	images: { unoptimized: true },
	env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
export default nextConfig;
