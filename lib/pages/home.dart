import 'package:flutter/material.dart';
import '../colors.dart';
import '../widgets/layouts.dart';
import '../widgets/social.dart';

// The main home page
class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    double textMultiplier = MediaQuery.of(context).size.width > 500
      ? MediaQuery.of(context).size.width > 800 ? 1 : 0.7
      : 0.5;

    double nameSize = 100 * textMultiplier;

    return PageLayout(
      child: Center(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 10, vertical: 100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: <Widget>[
              
              // Name
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Text("WARREN", style: TextStyle(
                    fontSize: nameSize,
                    height: 1,
                    fontWeight: FontWeight.w900
                  )),
                  RichText(
                    text: TextSpan(
                      style: TextStyle(
                        color: Colors.black,
                        height: .9
                      ),
                      children: <TextSpan>[
                        TextSpan(text: 'AMPHLETT', style: TextStyle(
                          fontSize: nameSize,
                          height: .9,
                          fontFamily: 'Heebo',
                          fontWeight: FontWeight.w900
                        )),
                        TextSpan(text: '.', style: TextStyle(
                        fontSize: nameSize,
                          height: .9,
                          fontFamily: 'Heebo',
                          fontWeight: FontWeight.w900,
                          color: BrandColors.primary
                        )),
                      ],
                    ),
                  ),
                  // Tagline
                  Text("web developer and tech addict", style: TextStyle(
                    fontSize: 40 * textMultiplier,
                    height: .8,
                    fontWeight: FontWeight.w100
                  )),
                ],
              ),

              Column(
                children: <Widget>[
                  // Skills
                  Container(
                    child: Column(
                      children: <Widget>[
                        Text("things I play with", style: TextStyle(
                          fontSize: 24 * textMultiplier,
                          fontWeight: FontWeight.w100
                        )),
                        Text("PHP LARAVEL REACT FLUTTER", style: TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 32 * textMultiplier
                        ),),
                      ],
                    ),
                  ),

                  // Social
                  SocialIcons()
                ],
              )

            ],
          ),
        )
      ),
    );
  }
}