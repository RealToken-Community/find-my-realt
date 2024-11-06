import { readFileSync } from 'fs';
import React from 'react';
import type { Metadata } from 'next';
import { Layout } from 'antd';
import Content from '@/app/content';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Find My Realt Property',
        description: 'Find your dream property with ease'
    }
};

export default async function Home() {
    const datas = JSON.parse(readFileSync('tokens.json', 'utf-8'));

    if (!datas) {
        return <div>No data</div>;
    }

    return (
        <Layout className="flex-row">
            <Content datas={datas} />
        </Layout>
    );
};