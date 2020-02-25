import 'package:flutter/material.dart';
import 'link.dart';
import '../colors.dart';

// A group of [SocialIcon] widgets displayed in a horizonal list
class SocialIcons extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Link(
            child: SocialIcon(asset: 'linkedin.png', size: 32),
            link: 'https://www.linkedin.com/in/warren-amphlett-5bb9b6170/',
          ),
          Link(
            child: SocialIcon(asset: 'github.png', size: 32),
            link: 'https://github.com/wamphlett/',
          ),
        ],
      ),
    );
  }
}

// Single social icon
class SocialIcon extends StatefulWidget {
  final double size;
  final String asset;
  SocialIcon({Key key, @required this.size, @required this.asset}) : super(key: key);

  _SocialIconState createState() => _SocialIconState();
}

class _SocialIconState extends State<SocialIcon> with SingleTickerProviderStateMixin {
  AnimationController controller;
  Animation<double> animation;
  Animation curve;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(duration: const Duration(milliseconds: 500), vsync: this);
    curve = CurvedAnimation(parent: controller, curve: Curves.elasticOut);
    animation = Tween<double>(begin: 0, end: 1.5).animate(curve)
        ..addListener(() {
          setState(() {

          });
        });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10),
      child: Stack(
        children: <Widget>[
          MouseRegion(
            onEnter: (PointerEvent event) {
              controller.forward();
            },
            onExit: (PointerEvent event) {
              controller.reverse();
            },
            child: Transform.scale(
              scale: animation.value,
              child: Container(
                height: widget.size,
                width: widget.size,
                decoration: BoxDecoration(
                  color: BrandColors.primary,
                  shape: BoxShape.circle
                ),
              ),
            ),
          ),
          Container(
            height: widget.size,
            width: widget.size,
            child: Image.asset('assets/social/' + widget.asset, width: widget.size, height: widget.size),
          )
        ]
      )
    );
  }
}