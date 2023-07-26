/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
        "lh3.googleusercontent.com",
        "mernbnb-images-bucket.s3.eu-west-1.amazonaws.com",
        "images.unsplash.com",
        "plus.unsplash.com",
        "buenare-images-bucket.s3.amazonaws.com",
        "buenare-images-bucket.s3.eu-west-1.amazonaws.com"
    ]
}
};

module.exports = nextConfig;