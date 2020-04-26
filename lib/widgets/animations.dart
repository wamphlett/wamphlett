import 'dart:async';

import 'package:flutter/material.dart';

class ShowUp extends StatefulWidget {
  final Widget child;
  ShowUp({Key key, @required this.child}) : super(key : key);
  _ShowUpState createState() => _ShowUpState();
}

class _ShowUpState extends State<ShowUp> with SingleTickerProviderStateMixin {
  AnimationController controller;
  Animation<Offset> slideAnimation;
  Animation<double> fadeAnimation;

  @override
  void initState() {
    super.initState();

    controller = AnimationController(duration: const Duration(milliseconds: 800), vsync: this);
    slideAnimation = Tween<Offset>(begin: Offset(0, 1), end: Offset(0, 0)).animate(CurvedAnimation(parent: controller, curve: Curves.ease))
        ..addListener(() {
          setState(() {

          });
        });

    fadeAnimation = Tween<double>(begin: -1, end: 1).animate(CurvedAnimation(parent: controller, curve: Curves.ease))
        ..addListener(() {
          setState(() {

          });
        });
    controller.forward();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SlideTransition(
      position: slideAnimation,
      child: FadeTransition(
        opacity: fadeAnimation,
        child: widget.child
      ),
    );
  }
}

class FadeOut extends StatefulWidget {
  final Widget child;
  final Duration after;
  final Duration duration;
  FadeOut({Key key, @required this.child, this.after = const Duration(seconds: 0), this.duration = const Duration(milliseconds: 800)}) : super(key : key);
  _FadeOutState createState() => _FadeOutState();
}

class _FadeOutState extends State<FadeOut> with SingleTickerProviderStateMixin {
  Timer _timer;
  AnimationController controller;
  Animation<double> fadeAnimation;

  @override
  void initState() {
    super.initState();

    controller = AnimationController(duration: widget.duration, vsync: this);
    fadeAnimation = Tween<double>(begin: 1, end: -1).animate(CurvedAnimation(parent: controller, curve: Curves.ease))
        ..addListener(() {
          setState(() {

          });
        });
    _timer = Timer(widget.after, () {
      controller.forward();
    });
  }

  @override
  void dispose() {
    controller.dispose();
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: fadeAnimation,
      child: widget.child
    );
  }
}
