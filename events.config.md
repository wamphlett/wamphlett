# Proposal
Need an interative editing page behind a login screen to create and manage a config file (example in events.config.json). 

##fields
```
{
    "updated_ts": 0, // unix timestamp when the file was last edited
    "events": [
        {
            "date_ts": 0, // required // timestamp which relates to a year/month/day, time doesnt matter
            "type": "travel", // required // one of "travel, work, misc"
            "sub_title": "some sub title", // optional
            "title": "some title", // required
            "tagline": "some tagline", // optional
            "image_grid": [ // optional
                {
                    "grid_type": "row", // required // one of "row, double, doubleInverted, offset, offsetInverted, triWide, triWideInverted, triSquare, triSquareInverted"
                    "images": // requires at least one [
                        {
                            "url": "https://url.com", // required
                            "title": "image title", // optional
                            "tagline": "some tagline" // optional
                        }
                    ]
                }
            ]
        }
    ]
}
```

"events": dont neccessarily need to be ordered. the consumer of the file can do that later but you should be able to drag this into order in the UI
"type": should be a dropdown
"image_grid": each object in it should be orderable
"grid_type": should be a dropdown

Notes: 
Validation should be done on the fly.
UI doesnt need to be fancy but should be clean and intuitive to use
Username and Password will be defined as ENV vars when running the app
"updated_ts" should be updated each time the file is written. If the file updated_ts is less than the existing one. An error should be thrown and the file should not be overwritten.
admin page should be at /config
Goes without saying but it should be very secure, it will be public facing