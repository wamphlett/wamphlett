import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../extensions/hover.dart';

// A widget to simulate links
class Link extends StatelessWidget {
  final Widget child;
  final String link;
  Link({required Key key, required this.child, required this.link}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      child: child.showCursorOnHover,
      onTap: () {
        launchUrl(Uri.parse(link));
      },
    );
  }
}