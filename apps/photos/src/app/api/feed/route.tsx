import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page');
  const tags = request.nextUrl.searchParams.get('tags');

  return Response.json(
    await callApi('/photos', {
      tags: tags ? tags : '',
      page: page ? page : '',
    }),
  );
}

type apiOptions = {
  cacheSeconds?: number;
  tags?: string;
  page?: string;
};

const callApi = async (route: string, apiOptions: apiOptions = {}) => {
  let url = process.env.PHOTOS_API_URL || 'http://localhost:3000';
  url += route;
  url += '?limit=100';
  url += apiOptions.page ? `&page=${apiOptions.page}` : '';
  url += apiOptions.tags ? `&tags=${apiOptions.tags}` : '';

  const tagList = apiOptions.tags
    ? apiOptions.tags.split(',').filter(Boolean)
    : ['everything'];

  const res = await fetch(url, {
    next: {
      // cache all requests for 30 days by default
      revalidate: apiOptions.cacheSeconds || 1000,
      tags: tagList,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data from server. path: ' + route);
  }

  return await res.json();
};
