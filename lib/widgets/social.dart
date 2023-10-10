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
            key: Key("linked-in"),
            child: SocialIcon(key: Key("linked-in"), asset: 'linkedin-white.png', size: 32),
            link: 'https://www.linkedin.com/in/warren-amphlett-5bb9b6170/',
          ),
          Link(
            key: Key("github"),
            child: SocialIcon(key: Key("github"), asset: 'github-white.png', size: 32),
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
  SocialIcon({required Key key, required this.size, required this.asset})
      : super(key: key);

  _SocialIconState createState() => _SocialIconState();
}

class _SocialIconState extends State<SocialIcon>
    with SingleTickerProviderStateMixin {

  late final AnimationController controller = AnimationController(
      duration: const Duration(milliseconds: 500), vsync: this);
  late final Animation<double> curve = CurvedAnimation(parent: controller, curve: Curves.elasticOut);
  late final Animation<double> animation = Tween<double>(begin: 0, end: 1.5).animate(curve)
    ..addListener(() {
      setState(() {});
    });

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.symmetric(horizontal: 10),
        child: MouseRegion(
            cursor: SystemMouseCursors.click,
            onEnter: (PointerEvent event) {
              controller.forward();
            },
            onExit: (PointerEvent event) {
              controller.reverse();
            },
            child: Stack(children: <Widget>[
              Transform.scale(
                scale: animation.value,
                child: Container(
                  height: widget.size,
                  width: widget.size,
                  decoration: BoxDecoration(
                      color: BrandColors.primary, shape: BoxShape.circle),
                ),
              ),
              Container(
                height: widget.size,
                width: widget.size,
                child: Image.asset('assets/social/' + widget.asset,
                    width: widget.size, height: widget.size),
              )
            ])));
  }
}
