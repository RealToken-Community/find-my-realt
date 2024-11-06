import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout } from 'antd';

import "./globals.css";
import ConfigProvider from '@/app/components/configProvider';

const work_sans = Work_Sans({ weight: ['300', '400', '600', '800'], subsets: ['latin'] });

export const metadata: Metadata = {
    title: "Find My Realt Property",
    description: "Find your dream property with ease"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${work_sans.className} text-[1.3rem] max-w-full`}>
                <AntdRegistry>
                    <ConfigProvider>
                        <Layout className="h-screen max-h-screen overflow-y-hidden">
                            {children}
                        </Layout>
                    </ConfigProvider>
                </AntdRegistry>
            </body>
        </html>
    );
}
