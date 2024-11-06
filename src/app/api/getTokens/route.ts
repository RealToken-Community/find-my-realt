import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { writeFileSync } from 'fs';

import type { APIRealToken } from "@/app/types/token";
import { APIRealTokenProductType, RealTokenPropertyType } from "@/app/types/token";

const COMMUNITY_API_KEY = process.env.COMMUNITY_API_KEY;

export async function GET() {
    const response = await fetch('https://api.realt.community/v1/token', {
        headers: {
            'X-AUTH-REALT-TOKEN': COMMUNITY_API_KEY!
        },
        next: { revalidate: 86400 }
    });

    const jsonResponse = await response.json();

    const mappedResponse = jsonResponse.map((token: APIRealToken) => {
        const city = token.fullName.split(", ")[1].trim();
        const productType = APIRealTokenProductType[token.productType as unknown as keyof typeof APIRealTokenProductType];
        return {
            annualPercentageYield: token.annualPercentageYield,
            fullName: token.fullName,
            hasTenants: token.hasTenants,
            propertyTypeName: token.propertyTypeName,
            propertyType: token.propertyType,
            constructionYear: token.constructionYear,
            productType,
            tokenPrice: token.tokenPrice,
            totalTokens: token.totalTokens,
            totalInvestment: token.totalInvestment,
            netRentYear: token.netRentYear,
            grossRentYear: token.grossRentYear,
            squareFeet: token.squareFeet,
            bedroomBath: token.bedroomBath,
            neighborhood: token.neighborhood,
            rentStartDate: token.rentStartDate,
            imageLink: token.imageLink,
            city
        };
    }) as APIRealToken[];

    const cities = mappedResponse.map((data) => data.fullName.split(", ")[1].trim())
        .reduce((acc, city) => {
            if (!acc.some((o) => o.city === city)) {
                acc.push({ city, length: 1 });
                return acc;
            }

            acc.find((o) => o.city === city)!.length++;

            return acc;
        }, [] as { city: string, length: number }[])
        .sort((a, b) => b.length - a.length);

    const realTokenPropertyTypes = Object.entries(RealTokenPropertyType)
        .filter(([, value]) => !isNaN(Number(value)))
        .map(([key, value]) => ({
            key,
            value
        }));

    const productTypes = mappedResponse.reduce((acc, data) => {
        if (!acc.some((o) => o === data.productType)) {
            acc.push(data.productType);
        }

        return acc;
    }, [] as string[]);


    writeFileSync('tokens.json', JSON.stringify({
        tokens: mappedResponse,
        cities,
        realTokenPropertyTypes,
        productTypes
    }, null, 2));

    revalidatePath('/');

    return NextResponse.json({ status: 200 });
};