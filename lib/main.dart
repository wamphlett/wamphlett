import 'package:flutter/material.dart';
import 'package:wamphlett/widgets/grid.dart';
import 'package:wamphlett/widgets/timeline.dart';
import 'pages/home.dart';

void main() => runApp(Wamphlett());

class Wamphlett extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Warren Amphlett',
      theme: ThemeData(
        fontFamily: 'Heebo',
      ),
      home: Scaffold(
        body: ListView(
          //cacheExtent: 999999,
          children: [
            Container(
              height: MediaQuery.of(context).size.height,
              child: HomePage(),
            ),

            LimitedPage(
              key: Key("top"), 
              children: [

                TimelineYear(year: 2023),
                TimelineHolidayTitle("Tokyo & Osaka", tag: "coming up later this year... finally!"),

                TimelineLine(),

                TimelineHolidayTitle("Albania"),
                ImageGrid(
                  children: [

                    ImageGridColumn(
                      width: 1,
                      children: [
                        TestImage(
                          url: library("albania/lifes-better-by-the-sea.jpg"), 
                          ratio: 16/9, 
                          title: "Lifes better by the sea",
                          tag: "A day on Ksamil beach"
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/2,
                      children: [
                        TestImage(
                          url: library("albania/why-travel-by-road.jpg"), 
                          ratio: 16/9,
                          title: "Why travel by road when you can go by sea",
                          tag: "our very own personal boat charter to Ksamil"
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/2,
                      children: [
                        TestImage(
                          url: library("albania/love-albania.jpg"), 
                          ratio: 16/9,
                          title: "Albania <3"
                        )
                      ]),

                    ImageGridColumn(
                      width: 5/12, 
                      children: [
                        TestImage(
                          url: library("albania/lets-fly.jpg"), 
                          ratio: 16/9,
                          title: "Lets fly",
                          tag: "looking at Sarande from above"
                        ),
                        TestImage(
                          url: library("albania/priorities.jpg"), 
                          ratio: 16/9,
                          title: "Priorities",
                          tag: "does it get much better than this?"
                        )
                      ]),
                    ImageGridColumn(
                      width: 7/12,
                      children: [
                        TestImage(
                          url: library("albania/paradise.jpg"), 
                          ratio: 16/13,
                          title: "Paradise",
                          tag: "Ksmail from above, I should have never left",
                        ),
                      ]),
                    
                    ImageGridColumn(
                      width: 1/3,
                      children: [
                        TestImage(
                          url: library("albania/sarande-silver.jpg"), 
                          ratio: 3/4,
                          title: "Sarande",
                        ),
                      ]),
                    
                    ImageGridColumn(
                      width: 1/3,
                      children: [
                        TestImage(
                          url: library("albania/not-a-care-in-the-world.jpg"), 
                          ratio: 3/4,
                          title: "Not a care in the world",
                          tag: "as it should be on holiday",
                        ),
                      ]),
                    
                    ImageGridColumn(
                      width: 1/3,
                      children: [
                        TestImage(
                          url: library("albania/a-crystal-sea.jpg"), 
                          ratio: 3/4,
                          title: "A crystal sea",
                          tag: "Gjipe beach, im sure he can swim really",
                        ),
                      ]),
                    
                    ImageGridColumn(
                      width: 4/10,
                      children: [
                        TestImage(
                          url: library("albania/sarande-at-night.jpg"), 
                          ratio: 16/13.6,
                          title: "Sarande at night",
                          tag: "",
                        ),
                      ]),
                    
                    ImageGridColumn(
                      width: 6/10,
                      children: [
                        TestImage(
                          url: library("albania/what-an-enterance.jpg"), 
                          ratio: 16/9,
                          title: "What an enterance",
                          tag: "The Resurrection of Christ Orthodox Cathedral"
                        ),
                      ]),
                    
                    ImageGridColumn(
                      width: 6/10,
                      children: [
                        TestImage(
                          url: library("albania/gjirokaster-fortress.jpg"), 
                          ratio: 21/9,
                          title: "Gjirokastër Fortress",
                          tag: "sits in the middle of a medieval Greek town from the Byzantine Empire"
                        ),
                        TestImage(
                          url: library("albania/castle-of-porto-palermo.jpg"), 
                          ratio: 21/9,
                          title: "Castle of Porto Palermo",
                          tag: ""
                        ),
                        
                      ]),
                    
                    ImageGridColumn(
                      width: 4/10,
                      children: [
                        TestImage(
                          url: library("albania/a-long-way-down.jpg"), 
                          ratio: 3/3.95,
                          title: "A long way down",
                          tag: "The road to Gjipe beach is long but so worth the walk"
                        ), 
                      ]),

                    ImageGridColumn(
                      width: 1,
                      children: [
                        TestImage(
                          url: library("albania/just-me-and-the-sea.jpg"), 
                          ratio: 24/9, 
                          title: "Just me and the sea",
                          tag: "not only is the sea at Gjipe beach crystal clear, warm, and nearly still. I don't have to share with anyone."
                        )
                      ]),
                      

                  ],
                ),

                TimelineYear(year: 2022),
                TimelineHolidayTitle("Rome to Sicily", tag: "travelled from Rome, through Naples to Catania and Palermo"),

                TimelineYear(year: 2021),
                TimelineHolidayTitle("Chisinau"),


                // TimelineYear(year: 2016),
                // TimelineHolidayTitle("Tokyo"),

                // ImageGrid(
                //   children: [

                //     ImageGridColumn(children: [TestImage(url: "/images/albania23/1.jpg", ratio: 16/9)], width: 1),
                //     ImageGridColumn(width: 2/3, children: [
                //       ImageGridColumn(
                //         width: 2/3,
                //         children: [
                //           TestImage(url: "/images/albania23/1.jpg", ratio: 16/9), 
                //           TestImage(url: "/images/albania23/1.jpg", ratio: 16/9)
                //         ]), 
                //       ImageGridColumn(
                //         width: 1/3,
                //         children: [
                //           TestImage(url: "/images/albania23/1.jpg", ratio: 16/9), 
                //           TestImage(url: "/images/albania23/1.jpg", ratio: 16/9), 
                //           TestImage(url: "/images/albania23/1.jpg", ratio: 16/9)
                //         ])
                //     ]),
                //     ImageGridColumn(children: [TestImage(url: "/images/albania23/2.jpg", ratio: 3/4), TestImage(url: "/images/albania23/1.jpg", ratio: 16/9)], width: 1/3),

                //   ],
                // ),

                TimelineYear(year: 2019),
                TimelineHolidayTitle("Lake Como", tag: "back again for a second trip"),

                TimelineYear(year: 2018),
                
                TimelineHolidayTitle("Warsaw"),
                TimelineLine(),

                TimelineHolidayTitle("Lake Como", tag: "one of my favourite places, I will live there for a summer one day"),
                ImageGrid(
                  children: [

                    ImageGridColumn(
                      width: 1,
                      children: [
                        TestImage(
                          url: library("2018/lakecomo/how-can-anywhere-look-this-good.jpg"),
                          ratio: 16/9,
                          title: "How can anywhere look this good",
                          tag: "",
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/4,
                      children: [
                        TestImage(
                          url: library("2018/lakecomo/the-morning-view.jpg"),
                          ratio: 4/3,
                          title: "The morning view",
                          tag: "",
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/4,
                      children: [
                        TestImage(
                          url: library("2018/lakecomo/holiday-is-thirsty-work.jpg"),
                          ratio: 4/3,
                          title: "Holiday is thirsty work",
                          tag: "A fountain on Isola Comacina",
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/4,
                      children: [
                        TestImage(
                          url: library("2018/lakecomo/a-church-on-the-water.jpg"),
                          ratio: 4/3,
                          title: "A church on the water",
                          tag: "Chiesa di San Giacomo",
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/4,
                      children: [
                        TestImage(
                          url: library("2018/lakecomo/cheeeese.jpg"),
                          ratio: 4/3,
                          title: "Cheeeese!",
                          tag: "",
                        )
                      ]),

                  ],
                ),

                TimelineYear(year: 2017),
                TimelineHolidayTitle("Austin"),
                TimelineLine(),
                TimelineHolidayTitle("New York"),

                TimelineYear(year: 2016, /*tag: "a busy year for travelling"*/),
                TimelineHolidayTitle("Tokyo"),
                ImageGrid(
                  children: [

                    ImageGridColumn(
                      width: 1,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/the-hardest-and-the-best-thing-ive-ever-done.jpg"),
                          ratio: 21/9,
                          title: "The hardest and the best thing I've ever done",
                          tag: "Mount Fuji was both mentally and physically challenging but the reward cannot be described"
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/2,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/konnichiwa-hansome.jpg"),
                          ratio: 16/9,
                          title: "Konnichiwa hansome",
                          tag: "jet lag and a few drinks will make anyone look good"
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/2,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/the-way-down-is-definitely-easier.jpg"),
                          ratio: 16/9,
                          title: "The way down is definitely easier",
                          tag: "easier. not easy."
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/3,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/all-the-sake.jpg"),
                          ratio: 6/3.9,
                          title: "all the sake",
                          tag: "sake barrels at the Meiji Jingu temple"
                        ),
                        TestImage(
                          url: library("2016/tokyo/first-authentic-sushi.jpg"),
                          ratio: 6/3.9,
                          title: "first authentic sushi",
                          tag: "watch out for the wasabi"
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/3,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/so-small.jpg"),
                          ratio: 6/3.9,
                          title: "So small",
                          tag: "the skytree turns Tokyo into a model city"
                        ),
                        TestImage(
                          url: library("2016/tokyo/now-this-is-an-aquarium.jpg"),
                          ratio: 6/3.9,
                          title: "now this is an aquarium",
                          tag: "Takashi Amano is am amazing artist"
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/3,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/really-is-a-skytree.jpg"),
                          ratio: 3/4,
                          title: "Really is a Sky Tree",
                          tag: "a picture cannot convey how big this really is"
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/2,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/traffic-jam.jpg"),
                          ratio: 16/9,
                          title: "Traffic jam",
                          tag: "it gets busy on top of the world"
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/2,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/delirium.jpg"),
                          ratio: 16/9,
                          title: "Delirium",
                          tag: "no sleep and a lack of oxygen will do that to a man"
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/a-nerds-heaven.jpg"),
                          ratio: 21/9,
                          title: "A nerds heaven",
                          tag: "I could spend days in Akihabara and not get bored"
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/4,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/settling-into-the-hostel.jpg"),
                          ratio: 4/3,
                          title: "Settling in to the hostel",
                          tag: ""
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/4,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/new-friends.jpg"),
                          ratio: 4/3,
                          title: "New friends",
                        )
                      ]),

                    ImageGridColumn(
                      width: 1/4,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/pokemon-center.jpg"),
                          ratio: 4/3,
                          title: "Pokemon center",
                          tag: "got to catch them all!"
                        )
                      ]),

                    ImageGridColumn(
                      width: 1/4,
                      children: [
                        TestImage(
                          url: library("2016/tokyo/ready.jpg"),
                          ratio: 4/3,
                          title: "Ready?",
                          tag: "start of the Fuji climb"
                        )
                      ]),

                  ],
                ),

                TimelineLine(),
                TimelineHolidayTitle("Antalya"),
                ImageGrid(
                  children: [

                    ImageGridColumn(
                      width: 1,
                      children: [
                        TestImage(
                          url: library("2016/turkey/near-perfection.jpg"),
                          ratio: 21/9,
                          title: "Near perfection?",
                          tag: "this sea was so inviting",
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/2,
                      children: [
                        TestImage(
                          url: library("2016/turkey/look-the-sea.jpg"),
                          ratio: 16/9,
                          title: "look, the sea!",
                          tag: "his first beach holiday",
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/2,
                      children: [
                        TestImage(
                          url: library("2016/turkey/up-up-and-away.jpg"),
                          ratio: 16/9,
                          title: "Up up and away",
                          tag: "Parasailing with my brother",
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/4,
                      children: [
                        TestImage(
                          url: library("2016/turkey/boat-trip.jpg"),
                          ratio: 4/3,
                          title: "Boat trip",
                          tag: "",
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/4,
                      children: [
                        TestImage(
                          url: library("2016/turkey/uncle-time.jpg"),
                          ratio: 4/3,
                          title: "Uncle time",
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/4,
                      children: [
                        TestImage(
                          url: library("2016/turkey/splash.jpg"),
                          ratio: 4/3,
                          title: "Splash!"
                        )
                      ]),
                    
                    ImageGridColumn(
                      width: 1/4,
                      children: [
                        TestImage(
                          url: library("2016/turkey/the-sea-bar.jpg"),
                          ratio: 4/3,
                          title: "The sea bar"
                        )
                      ]),

                  ],
                ),

                TimelineLine(),
                TimelineHolidayTitle("Xabia"),

                TimelineEnd(),

                Padding(
                  padding: EdgeInsets.symmetric(vertical: 40),
                  child: Text("other, less important life things...", style: TextStyle(
                    fontSize: 16,
                    color: Colors.white,
                    fontWeight: FontWeight.w100,
                  )),
                ),
              ]
            ),

          ],
        )
      ),
      debugShowCheckedModeBanner: false,
    );
  }
}

String library(String path) => "https://library.wamphlett.net/photos/website/" + path;