import axios from 'axios';
import cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const response = await axios.get(`${process.env.BASE_URL}/talents`);
    const html = response.data;

    const $ = cheerio.load(html);
    const parrentElement = 'ul.talent_list > li';
    const $list = $(parrentElement);
    const $parentRomanjiElements = $list.find('> a > h3');
    const $parentNativeElements = $list.find('> a > h3 > span');
    const $parentImageElements = $list.find('> a > figure > img');
    const list = $(parrentElement);

    let listTalents: { romanji: string; native: string; imageUrl: string }[] = [];
    listTalents = list
      .map(function (index, element) {
        const romanji = $(element)
          .find($parentRomanjiElements)
          .text()
          .trim()
          .replace(/([^A-Z\s\+\[\]])+/gi, '');

        const native = $(element).find($parentNativeElements).text().trim();
        const image = $(element).find($parentImageElements).attr('src')!;

        return {
          romanji,
          native,
          imageUrl: image,
        };
      })
      .get();

    return NextResponse.json({ talents: listTalents, total: listTalents.length, isSucces: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ msg: error.message, isSucces: false }, { status: 500 });
  }
};
