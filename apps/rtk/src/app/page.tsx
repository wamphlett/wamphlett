import PrimaryLayout from '@/layouts/primary';
import Introduction from '@/components/introduction';
import Frame from '@/components/frame';
import { getBlurUrl } from './loaders';
import FrameList from '@/components/frameList';

const frames = [
		{
			"id": "6955999aa2579eaa06caf090",
			"keyword": "one",
			"primitives": [
				"floor",
				"ceiling"
			],
			"kanji": "一",
			"components": [],
			"story": "One.",
			"comment": "It doesn’t get much simpler than that.",
			"is_primitive_only": false,
			"frame_number": 1,
			"stroke_count": 1,
			"chapter": 1,
			"jlpt": "N5",
			"on_reading": [
				"イチ",
				"イツ"
			],
			"kun_reading": [
				"ひと-",
				"ひと.つ"
			]
		},
		{
			"id": "6955999aa2579eaa06caf091",
			"keyword": "two",
			"primitives": [],
			"kanji": "二",
			"components": [
				"one"
			],
			"story": "Two ones make a two.",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 2,
			"stroke_count": 2,
			"chapter": 1,
			"jlpt": "N5",
			"on_reading": [
				"ニ",
				"ジ"
			],
			"kun_reading": [
				"ふた",
				"ふた.つ",
				"ふたた.び"
			]
		},
		{
			"id": "6955999aa2579eaa06caf092",
			"keyword": "three",
			"primitives": [],
			"kanji": "三",
			"components": [
				"one",
				"two"
			],
			"story": "Two and ones make three.",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 3,
			"stroke_count": 3,
			"chapter": 1,
			"jlpt": "N5",
			"on_reading": [
				"サン",
				"ゾウ"
			],
			"kun_reading": [
				"み",
				"み.つ",
				"みっ.つ"
			]
		},
		{
			"id": "6955999aa2579eaa06caf093",
			"keyword": "four",
			"primitives": [],
			"kanji": "四",
			"components": [
				"mouth",
				"human legs"
			],
			"story": "",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 4,
			"stroke_count": 5,
			"chapter": 1,
			"jlpt": "N5",
			"on_reading": [
				"シ"
			],
			"kun_reading": [
				"よ",
				"よ.つ",
				"よっ.つ",
				"よん"
			]
		},
		{
			"id": "6955999aa2579eaa06caf094",
			"keyword": "five",
			"primitives": [],
			"kanji": "五",
			"components": [],
			"story": "",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 5,
			"stroke_count": 4,
			"chapter": 1,
			"jlpt": "N5",
			"on_reading": [
				"ゴ"
			],
			"kun_reading": [
				"いつ",
				"いつ.つ"
			]
		},
		{
			"id": "6955999aa2579eaa06caf095",
			"keyword": "six",
			"primitives": [],
			"kanji": "六",
			"components": [
				"top hat",
				"animal legs"
			],
			"story": "",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 6,
			"stroke_count": 4,
			"chapter": 1,
			"jlpt": "N5",
			"on_reading": [
				"ロク",
				"リク"
			],
			"kun_reading": [
				"む",
				"む.つ",
				"むっ.つ",
				"むい"
			]
		},
		{
			"id": "6955999aa2579eaa06caf096",
			"keyword": "seven",
			"primitives": [],
			"kanji": "七",
			"components": [
				"diced"
			],
			"story": "",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 7,
			"stroke_count": 2,
			"chapter": 1,
			"jlpt": "N5",
			"on_reading": [
				"シチ"
			],
			"kun_reading": [
				"なな",
				"なな.つ",
				"なの"
			]
		},
		{
			"id": "6955999aa2579eaa06caf097",
			"keyword": "eight",
			"primitives": [],
			"kanji": "八",
			"components": [],
			"story": "",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 8,
			"stroke_count": 2,
			"chapter": 1,
			"jlpt": "N5",
			"on_reading": [
				"ハチ"
			],
			"kun_reading": [
				"や",
				"や.つ",
				"やっ.つ",
				"よう"
			]
		},
		{
			"id": "6955999aa2579eaa06caf098",
			"keyword": "nine",
			"primitives": [
				"baseball",
				"baseball team"
			],
			"kanji": "九",
			"components": [],
			"story": "",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 9,
			"stroke_count": 2,
			"chapter": 1,
			"jlpt": "N5",
			"on_reading": [
				"キュウ",
				"ク"
			],
			"kun_reading": [
				"ここの",
				"ここの.つ"
			]
		},
		{
			"id": "6955999aa2579eaa06caf099",
			"keyword": "ten",
			"primitives": [
				"needle"
			],
			"kanji": "十",
			"components": [],
			"story": "",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 10,
			"stroke_count": 2,
			"chapter": 1,
			"jlpt": "N5",
			"on_reading": [
				"ジュウ",
				"ジッ",
				"ジュッ"
			],
			"kun_reading": [
				"とお",
				"と"
			]
		},
		{
			"id": "6955999aa2579eaa06caf09a",
			"keyword": "mouth",
			"primitives": [],
			"kanji": "口",
			"components": [],
			"story": "",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 11,
			"stroke_count": 3,
			"chapter": 1,
			"jlpt": "N4",
			"on_reading": [
				"コウ",
				"ク"
			],
			"kun_reading": [
				"くち"
			]
		},
		{
			"id": "6955999aa2579eaa06caf09b",
			"keyword": "day",
			"primitives": [
				"sun",
				"day",
				"tongue wagging in the mouth"
			],
			"kanji": "日",
			"components": [],
			"story": "",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 12,
			"stroke_count": 4,
			"chapter": 1,
			"jlpt": "N5",
			"on_reading": [
				"ニチ",
				"ジツ"
			],
			"kun_reading": [
				"ひ",
				"-び",
				"-か"
			]
		},
		{
			"id": "6955999aa2579eaa06caf09c",
			"keyword": "month",
			"primitives": [
				"moon",
				"flesh",
				"part of the body"
			],
			"kanji": "月",
			"components": [],
			"story": "",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 13,
			"stroke_count": 4,
			"chapter": 1,
			"jlpt": "N5",
			"on_reading": [
				"ゲツ",
				"ガツ"
			],
			"kun_reading": [
				"つき"
			]
		},
		{
			"id": "6955999aa2579eaa06caf09d",
			"keyword": "rice field",
			"primitives": [
				"brains"
			],
			"kanji": "田",
			"components": [],
			"story": "",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 14,
			"stroke_count": 5,
			"chapter": 1,
			"jlpt": "N4",
			"on_reading": [
				"デン"
			],
			"kun_reading": [
				"た"
			]
		},
		{
			"id": "6955999aa2579eaa06caf09e",
			"keyword": "eye",
			"primitives": [
				"eyeball"
			],
			"kanji": "目",
			"components": [],
			"story": "",
			"comment": "",
			"is_primitive_only": false,
			"frame_number": 15,
			"stroke_count": 5,
			"chapter": 1,
			"jlpt": "N4",
			"on_reading": [
				"モク",
				"ボク"
			],
			"kun_reading": [
				"め",
				"-め",
				"ま-"
			]
		}
	];


export default async function Page() {
  const headerURL =
    'https://library.wamphlett.net/photos/website/2023/albania/three-of-a-kind.jpg';
  const blurDataURL = await getBlurUrl(headerURL);
  return (
    <PrimaryLayout
      headerImageUrl={headerURL}
      headerImageBlurDataURL={blurDataURL!}
    >
      <Introduction locale='en' />
      <FrameList frames={frames} />
    </PrimaryLayout>
  );
}
