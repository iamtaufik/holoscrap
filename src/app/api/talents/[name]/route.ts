import axios from 'axios';
import cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
import { useFetch } from '@/libs/useFetch';

export const GET = async (req: NextRequest, context: { params: { name: string } }) => {
  const name = context.params.name;
  try {
    const scheduleApi = await (await fetch('https://schedule.hololive.tv/api/list', { next: { revalidate: 10 } })).json();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const response = await useFetch(`${process.env.BASE_URL}/talents/${name}/`);
    const html = response as string;
    const $ = cheerio.load(html);
    const romanji = $('#container > main > article > div.talent_top > div.container > div.right_box > div > h1')
      .text()
      .trim()
      .replace(/([^A-Z\s\+\[\]])+/gi, '');

    const native = $('#container > main > article > div.talent_top > div.container > div.right_box > div > h1 > span').text().trim();
    const slogan = $('#container > main > article > div.talent_top > div.container > div.right_box > div > p.catch').text().trim();

    const description = $('#container > main > article > div.talent_top > div.container > div.right_box > div > p.txt')
      .text()
      .trim()
      .replace(/([\n])+/gi, ' ');

    const imageList = $('#talent_figure > figure > img');
    const images = imageList
      .map(function (index, element) {
        return { image: $(element).attr('src') };
      })
      .get();

    const videoProfile =
      $('#container > main > article > div.talent_top > div.container > div.right_box > div > p.txt > video').attr('src') ||
      $('#container > main > article > div.talent_top > div.container > div.right_box > div > p.txt > img').attr('src');

    const socialMediaList = $('#container > main > article > div.talent_top > div.container > div.right_box > div > ul > li');
    const socialMedias = socialMediaList
      .map((index, element) => {
        return $(element).find('> a').attr('href');
      })
      .get();

    const scheduleListPerDate: any[] = scheduleApi.dateGroupList;
    const currentDate = new Date().getDate();
    const cuurentDateSchedule: any = scheduleListPerDate.find((list: any) => {
      const listDate = new Date(list.datetime).getDate();
      return listDate === currentDate;
    });

    const schedules = cuurentDateSchedule.videoList.filter((schedules: any) => {
      const scheduleName = schedules.name as string;

      return romanji.match(scheduleName) || native.match(scheduleName);
    });

    return NextResponse.json({
      name: { romanji, native },
      slogan: slogan || null,
      description,
      images,
      videoProfile: videoProfile || null,
      socialMedia: [{ youtube: socialMedias[0] }, { twitter: socialMedias[1] }],
      schedules: schedules,
      isSucces: true,
    });
  } catch (error: any) {
    return NextResponse.json({ msg: error.message, isSucces: false }, { status: 500 });
  }
};
