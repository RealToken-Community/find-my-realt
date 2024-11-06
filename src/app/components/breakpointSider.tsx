'use client';

import { useState } from 'react';

import Sider from 'antd/lib/layout/Sider';

export default function Main({ children }: { children: React.ReactNode }) {

    const [collapsed, setCollapsed] = useState(false);

    return (
        <Sider
            collapsed={collapsed}
            width={500}
            collapsible
            trigger={null}
            onBreakpoint={(broken) => {
                setCollapsed(broken);
            }}
            breakpoint='lg'   
        >   
            {children}
        </Sider>
    );
}