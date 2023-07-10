import 'package:flutter/material.dart';
import 'backgrounds.dart';

// The default site page layout.
class PageLayout extends StatelessWidget {
  final Widget child;

  PageLayout({required Key key, required this.child}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        Widget page = Container(
          color: Colors.white,
          height: constraints.maxHeight,
          padding: EdgeInsets.all(MediaQuery.of(context).size.width < 800 ? 10 : 25),
          child: Container(
            child: Stack(
              children: <Widget>[
                // Background
                AnimatedBackground(),
                // Child
                child
              ],
            )
          ),
        );

        if (MediaQuery.of(context).size.width < 800) {
          page = ListView(
            children: <Widget>[
              page
            ],
          );
        }

        return page;
      },
    );
  }
}