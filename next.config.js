/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        //把服务端的数据类型转换为客户端可使用的服务类型
        swcPlugins: [
            ['next-superjson-plugin', {}]
        ]
    },
    /**
     * 这个配置项用来配置Next.js中的图片处理功能。
     * 在这个配置项中，定义了三个图片域名，
     * 分别是
     * `res.cloudinary.com`、
     * `avatars.githubusercontent.com`
     * `lh3.googleusercontent.com`。
     * 这些域名可以在Next.js中使用，以便在应用程序中加载这些域名下的图片
     */
    images: {
        domains: [
            'res.cloudinary.com',
            'avatars.githubusercontent.com',
            'lh3.googleusercontent.com'
        ]
    }
};

module.exports = nextConfig;
