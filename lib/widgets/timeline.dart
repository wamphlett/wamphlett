import 'package:flutter/material.dart';

class TimelineYear extends StatelessWidget {
  final int year;
  final String tag;

  TimelineYear({required this.year, this.tag = ""});

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        // constraints: BoxConstraints(maxWidth: 80),
        // color: Colors.red,
        // mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(this.year.toString(), style: TextStyle(
            fontSize: 64,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          )),

          TimelineEntryTag(tag),

          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0),
              shape: BoxShape.circle,
              border: Border.all(
                color: Colors.white.withOpacity(0.5),
                width: 8,
              )
            ),
          ),

          TimelineLine.withoutTopRadius(),
        ]
      ),
    );
  }
}

class TimelineLine extends StatelessWidget {
  final bool includeTopRadius;
  final double height;
  final EdgeInsets margin;
  TimelineLine({this.includeTopRadius = true, this.height = 40, this.margin = EdgeInsets.zero});

  TimelineLine.withoutTopRadius() : this(includeTopRadius: false);

  @override
  Widget build(BuildContext context) {
    var radius = BorderRadius.only(
      topLeft: Radius.circular(this.includeTopRadius ? 4 : 0),
      topRight: Radius.circular(this.includeTopRadius ? 4 : 0),
      bottomLeft: Radius.circular(4),
      bottomRight: Radius.circular(4),
    );
    return Container(
      decoration: BoxDecoration(
        borderRadius: radius,
        color: Colors.white.withOpacity(0.5),
      ),
      margin: this.margin,
      height: this.height,
      width: 4,
    );
  }
}

class TimelineEnd extends StatelessWidget {
  TimelineEnd();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TimelineLine(height: 40, margin: EdgeInsets.only(bottom: 8, top: 15)),
        TimelineLine(height: 16, margin: EdgeInsets.only(bottom: 8)),
        TimelineLine(height: 8, margin: EdgeInsets.only(bottom: 8)),
        TimelineLine(height: 4),
      ],
    );
  }
}

class TimelineHolidayTitle extends StatelessWidget {
  final String title;
  final String tag;
  TimelineHolidayTitle(this.title, {this.tag = ""});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(bottom: 20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Stack(
            children: [
              Container(
                transform: Matrix4.translationValues(-25.0, 5.0, 0.0),
                child: Image.asset("assets/icons/location.png", height: 32),
              ),
              Text(this.title.toUpperCase(), style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w900,
                color: Colors.white,
              )),
            ],
          ),
          TimelineEntryTag(this.tag),
        ],
      )
    );
  }
}

class TimelineEntryTag extends StatelessWidget {
  final String tag;
  TimelineEntryTag(this.tag);

  @override
  Widget build(BuildContext context) {
    if (tag == "") {
      return Container();
    }

    return Text(tag, style: TextStyle(
      fontSize: 18,
      color: Colors.white.withOpacity(.8),
      fontWeight: FontWeight.w100,
    ));
  }
}
