/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
        "lh3.googleusercontent.com",
        "mernbnb-images-bucket.s3.eu-west-1.amazonaws.com",
        "images.unsplash.com",
        "plus.unsplash.com"
    ]
}
};

module.exports = nextConfig;