import 'dart:async';

import 'package:flutter/material.dart';
import 'package:wamphlett/widgets/animations.dart';

class TextReel extends StatefulWidget {
  final List<Widget> children;
  TextReel({required Key key, required this.children}) : super(key: key);

  _TextReelState createState() => _TextReelState();
}

class _TextReelState extends State<TextReel> {
  int index = 0;
  late final Timer _timer = Timer.periodic(Duration(seconds: 3), (timer) {
    setState(() {
      if (index == widget.children.length - 1) {
        index = 0;
      } else {
        index = index + 1;
      }
    });
  });

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeOut(
      key: Key(index.toString()),
      after: Duration(milliseconds: 2600),
      duration: Duration(milliseconds: 400),
      child: ShowUp(key: Key(index.toString()), child: widget.children[index]),
    );
  }
}
