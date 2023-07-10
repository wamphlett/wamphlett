import 'dart:async';

import 'package:flutter/material.dart';

class ShowUp extends StatefulWidget {
  final Widget child;
  final Duration delay;
  final Duration duration;
  ShowUp(
      {required Key key,
      required this.child,
      this.delay = const Duration(seconds: 0),
      this.duration = const Duration(milliseconds: 800)})
      : super(key: key);
  _ShowUpState createState() => _ShowUpState();
}

class _ShowUpState extends State<ShowUp> with SingleTickerProviderStateMixin {

  late final AnimationController controller = AnimationController(duration: widget.duration, vsync: this);
  late final Animation<Offset> slideAnimation = Tween<Offset>(begin: Offset(0, 1), end: Offset(0, 0))
      .animate(CurvedAnimation(parent: controller, curve: Curves.ease))
    ..addListener(() {
      setState(() {});
    });
  late final Animation<double> fadeAnimation = Tween<double>(begin: -1, end: 1)
      .animate(CurvedAnimation(parent: controller, curve: Curves.ease))
    ..addListener(() {
      setState(() {});
    });

  @override
  void initState() {
    super.initState();

    Future.delayed(widget.delay, () {
      controller.forward();
    });
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
      child: FadeTransition(opacity: fadeAnimation, child: widget.child),
    );
  }
}

class FadeOut extends StatefulWidget {
  final Widget child;
  final Duration after;
  final Duration duration;
  FadeOut(
      {required Key key,
      required this.child,
      this.after = const Duration(seconds: 0),
      this.duration = const Duration(milliseconds: 800)})
      : super(key: key);
  _FadeOutState createState() => _FadeOutState();
}

class _FadeOutState extends State<FadeOut> with SingleTickerProviderStateMixin {
  late final AnimationController controller = AnimationController(duration: widget.duration, vsync: this);
  late final Animation<double> fadeAnimation = Tween<double>(begin: 1, end: -1)
      .animate(CurvedAnimation(parent: controller, curve: Curves.ease))
    ..addListener(() {
      setState(() {});
    });
  late final Timer _timer = Timer(widget.after, () {
    controller.forward();
  });

  @override
  void dispose() {
    controller.dispose();
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(opacity: fadeAnimation, child: widget.child);
  }
}
