'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { InputNumber, Slider, Select, Flex, Radio, DatePicker, Layout, Table } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { Fragment } from 'react';
import dayjs from 'dayjs';

import type { APIRealToken } from "@/app/types/token";

const { Sider } = Layout;

interface ITableFilter {
    rentStartDate?: string;
    productTypes?: string[];
    annualYieldValue?: number;
    hasTenants?: boolean;
    cities?: string[];
    propertyTypes?: string[];
    constructionYear?: string;
}

export default function Main({ datas }: {
    datas: {
        tokens: APIRealToken[],
        cities: { city: string, length: number }[],
        realTokenPropertyTypes: { key: string, value: string }[],
        productTypes: string[]
    }
}) {
    const searchParams = useSearchParams();
    const filtersUrl = Object.fromEntries(searchParams.entries());

    const [collapsed, setCollapsed] = useState(false);
    const [filters, setFilters] = useState<ITableFilter>({
        rentStartDate: undefined,
        productTypes: undefined,
        hasTenants: undefined,
        annualYieldValue: undefined,
        cities: undefined,
        propertyTypes: undefined,
        constructionYear: undefined
    });

    const handleFilterChange = (newFilters: ITableFilter) => {
        setFilters(newFilters);
    };

    const filteredDatas = datas.tokens.filter((data) => {
        if ((filters.productTypes?.length ?? 0) > 0 && !filters.productTypes?.includes(data.productType)) {
            return false;
        }

        if (filters.hasTenants !== undefined && !!data.hasTenants != filters.hasTenants) {
            return false;
        }

        if (filters.annualYieldValue && data.annualPercentageYield < +filters.annualYieldValue) {
            return false;
        }

        if ((filters.cities?.length ?? 0) > 0 && !filters.cities?.includes(data.fullName.split(", ")[1].trim())) {
            return false;
        }

        if (filters.propertyTypes?.length && !filters.propertyTypes?.includes(data.propertyType?.toString())) {
            return false;
        }

        if (filters.constructionYear && data.constructionYear < +filters.constructionYear) {
            return false;
        }

        return true
    });

    const columns = [
        {
            title: 'Annual % Yield',
            dataIndex: 'annualPercentageYield',
            key: 'annualPercentageYield',
            width: 150,
            render: (text: string) => `${parseFloat(text).toFixed(2)}%`,
            sorter: (a: APIRealToken, b: APIRealToken) => a.annualPercentageYield - b.annualPercentageYield,
            defaultSortOrder: 'descend' as const,
            fixed: 'left' as 'left' | 'right' | undefined
        },
        {
            title: 'Rent Start Date',
            dataIndex: 'rentStartDate',
            key: 'rentStartDate',
            width: 150,
            render: (text: string, record: APIRealToken) => new Date(record.rentStartDate?.date).toLocaleDateString(),
            sorter: (a: APIRealToken, b: APIRealToken) => new Date(a.rentStartDate?.date).getTime() - new Date(b.rentStartDate?.date).getTime()
        },
        {
            title: 'Image',
            key: 'image',
            width: 150,
            render: (text: string, record: APIRealToken) => (
                <Image
                    src={record.imageLink[0]}
                    alt={record.fullName}
                    width={150}
                    height={100}
                    loading="lazy"
                    priority={false}
                />
            )
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 200,
            sorter: (a: APIRealToken, b: APIRealToken) => a.shortName.localeCompare(b.shortName),
        },
        {
            title: 'Has Tenants',
            dataIndex: 'hasTenants',
            key: 'hasTenants',
            width: 120,
            render: (text: boolean) => text ? 'Yes' : 'No',
            sorter: (a: APIRealToken, b: APIRealToken) => a.hasTenants === b.hasTenants ? 0 : a.hasTenants ? 1 : -1
        },
        {
            title: 'Property Type',
            dataIndex: 'propertyTypeName',
            key: 'propertyTypeName',
            width: 150,
            sorter: (a: APIRealToken, b: APIRealToken) => a.propertyType - b.propertyType
        },
        {
            title: 'Construction Year',
            dataIndex: 'constructionYear',
            key: 'constructionYear',
            width: 160,
            sorter: (a: APIRealToken, b: APIRealToken) => a.constructionYear - b.constructionYear
        },
        {
            title: 'Product Type',
            dataIndex: 'productType',
            key: 'productType',
            width: 150,
            sorter: (a: APIRealToken, b: APIRealToken) => a.productType.localeCompare(b.productType)
        },
        {
            title: 'Token Price',
            dataIndex: 'tokenPrice',
            key: 'tokenPrice',
            width: 150,
            render: (text: string) => `$${text}`,
            sorter: (a: APIRealToken, b: APIRealToken) => a.tokenPrice - b.tokenPrice
        },
        {
            title: 'Total Tokens',
            dataIndex: 'totalTokens',
            key: 'totalTokens',
            width: 150,
            sorter: (a: APIRealToken, b: APIRealToken) => a.totalTokens - b.totalTokens
        },
        {
            title: 'Total Investment',
            dataIndex: 'totalInvestment',
            key: 'totalInvestment',
            width: 180,
            render: (text: string) => `$${text}`,
            sorter: (a: APIRealToken, b: APIRealToken) => a.totalInvestment - b.totalInvestment
        },
        {
            title: 'Net Rent Year',
            dataIndex: 'netRentYear',
            key: 'netRentYear',
            width: 150,
            render: (text: string) => `$${text}`,
            sorter: (a: APIRealToken, b: APIRealToken) => a.netRentYear - b.netRentYear
        },
        {
            title: 'Gross Rent Year',
            dataIndex: 'grossRentYear',
            key: 'grossRentYear',
            width: 180,
            render: (text: string) => `$${text}`,
            sorter: (a: APIRealToken, b: APIRealToken) => a.grossRentYear - b.grossRentYear
        },
        {
            title: 'Square Feet',
            dataIndex: 'squareFeet',
            key: 'squareFeet',
            width: 130,
            sorter: (a: APIRealToken, b: APIRealToken) => (a.squareFeet || 0) - (b.squareFeet || 0)
        },
        {
            title: 'Bedrooms/Bathrooms',
            dataIndex: 'bedroomBath',
            key: 'bedroomBath',
            width: 180,
        },
        {
            title: 'Neighborhood',
            dataIndex: 'neighborhood',
            key: 'neighborhood',
            width: 200,
        },
    ];

    useEffect(() => {
        setFilters({
            ...filters,
            ...(filtersUrl.rentStartDate ? { rentStartDate: filtersUrl.rentStartDate } : {}),
            ...(filtersUrl.productTypes ? { productTypes: filtersUrl.productTypes.split(',') } : {}),
            ...(filtersUrl.annualYieldValue ? { annualYieldValue: +filtersUrl.annualYieldValue } : {}),
            ...(filtersUrl.hasTenants ? { hasTenants: filtersUrl.hasTenants === 'true' } : {}),
            ...(filtersUrl.cities ? { cities: filtersUrl.cities.split(',') } : {}),
            ...(filtersUrl.propertyTypes ? { propertyTypes: filtersUrl.propertyTypes.split(',') } : {}),
            ...(filtersUrl.constructionYear ? { constructionYear: filtersUrl.constructionYear } : {})
        });
    }, []);

    return (
        <Fragment>
            <Sider
                collapsed={collapsed}
                width={350}
                breakpoint="lg"
                onBreakpoint={(broken) => setCollapsed(broken)}
                collapsedWidth="0"
                onCollapse={(collapsed) => setCollapsed(collapsed)}
            >
                <div className="flex flex-col px-6 mt-4 !overflow-y-scroll">
                    <h1 className='text-3xl font-black py-6'>Find your Property.</h1>
                    <Flex
                        vertical
                        gap={20}
                    >
                        <div className='flex flex-col gap-3'>
                            <span className="text-lg font-medium">Product Types</span>
                            <Select
                                mode="multiple"
                                placeholder="Select product types"
                                style={{ width: '100%' }}
                                options={datas.productTypes.map((type, index) => ({ label: type, value: type, key: index }))}
                                allowClear
                                value={filters.productTypes}
                                onChange={(value) => handleFilterChange({ ...filters, productTypes: value })}
                            />
                        </div>
                        <div className='flex flex-col gap-3'>
                            <span className="text-lg font-medium">Has Tenants</span>
                            <Radio.Group
                                optionType="button"
                                value={filters.hasTenants}
                                onChange={(e) => handleFilterChange({ ...filters, hasTenants: e.target.value })}
                            >
                                <Radio value={undefined}>N/A</Radio>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </div>
                        <div className='flex flex-col gap-3'>
                            <span className="text-lg font-medium">Annual Percentage Yield</span>
                            <Flex gap={30}>
                                <div className='flex-[1_1_100%]'>
                                    <Slider
                                        min={0}
                                        max={20}
                                        value={filters.annualYieldValue}
                                        onChange={(value) => handleFilterChange({ ...filters, annualYieldValue: value })}
                                        className='w-full'
                                    />
                                </div>
                                <InputNumber
                                    min={0}
                                    max={20}
                                    value={filters.annualYieldValue}
                                    onChange={(value) => handleFilterChange({ ...filters, annualYieldValue: value || 0 })}
                                    addonAfter="%"
                                    defaultValue={0}
                                />
                            </Flex>
                        </div>
                        <div className='flex flex-col gap-3'>
                            <span className="text-lg font-medium">Cities</span>
                            <Select
                                mode="multiple"
                                placeholder="Select cities"
                                style={{ width: '100%' }}
                                options={datas.cities.map((city, index) => ({ label: `${city.city} (${city.length})`, value: city.city, key: index }))}
                                allowClear
                                value={filters.cities}
                                onChange={(value) => handleFilterChange({ ...filters, cities: value })}
                                defaultValue={[]}
                            />
                        </div>
                        <div className='flex flex-col gap-3'>
                            <span className="text-lg font-medium">Property Types</span>
                            <Select
                                mode="multiple"
                                placeholder="Select property types"
                                style={{ width: '100%' }}
                                options={datas.realTokenPropertyTypes.map((propertyType, index) => ({ label: propertyType.key, value: propertyType.value.toString(), key: index }))}
                                allowClear
                                value={filters.propertyTypes}
                                onChange={(value) => handleFilterChange({ ...filters, propertyTypes: value })}
                            />
                        </div>
                        <div className='flex flex-col gap-3'>
                            <span className="text-lg font-medium">Minimal Construction Year</span>
                            <DatePicker
                                picker="year"
                                value={filters.constructionYear ? dayjs(filters.constructionYear) : null}
                                onChange={(date) => handleFilterChange({ ...filters, constructionYear: date ? date.format("YYYY") : "" })}
                            />
                        </div>
                    </Flex>
                </div>
            </Sider >
            <Layout
                style={{
                    padding: '0 24px 24px',
                    overflowX: 'auto'
                }}
            >
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280
                    }}
                >
                    <Table
                        columns={columns}
                        dataSource={filteredDatas}
                        scroll={{
                            x: 'max-content',
                            y: 'calc(100vh - 150px)'
                        }}
                        pagination={{
                            defaultPageSize: 50,
                            position: ['topRight']
                        }}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    window.open(record.marketplaceLink);
                                }
                            };
                        }}
                        rowClassName="cursor-pointer"
                    />
                </Content>
            </Layout>
        </Fragment >
    );
}