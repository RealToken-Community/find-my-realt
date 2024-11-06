"use client";

import { ConfigProvider, theme } from "antd";

export default function wrapper({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
            }}
        >
            {children}
        </ConfigProvider>
    );
}
