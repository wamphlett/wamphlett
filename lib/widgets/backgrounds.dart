import 'package:flutter/material.dart';
import '../colors.dart';

// Background which flies in from the left on build
class AnimatedBackground extends StatefulWidget {
  _AnimatedBackgroundState createState() => _AnimatedBackgroundState();
}

class _AnimatedBackgroundState extends State<AnimatedBackground> {
  double _amount = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance
        .addPostFrameCallback((_) => setState(() {
          _amount = 1;
        }));
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      color: BrandColors.grey,
      width: MediaQuery.of(context).size.width * _amount,
      curve: Curves.bounceOut,
      duration: Duration(seconds: 1),
    );  
  }
}