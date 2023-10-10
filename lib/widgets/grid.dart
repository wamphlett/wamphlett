import 'package:flutter/material.dart';

class LimitedPage extends StatelessWidget {
  final List<Widget> children;

  LimitedPage({required Key key, required this.children}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color.fromARGB(255, 12, 12, 12),
      child: Row(
        // constraints: BoxConstraints(maxWidth: 80),
        // color: Colors.red,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Flexible(
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: 1600),
              child: Padding(
                padding: EdgeInsets.only(left: 30, right: 30),
                child: Column(
                  children: this.children,
                ),
              ),
            ),
          )
        ]
      ),
    );
  }
}

class ImageGrid extends StatelessWidget {
  final List<Widget> children;

  ImageGrid({required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Wrap(
        children: this.children,
      ),
    );
  }
}

class ImageGridColumn extends StatelessWidget {
  final List<Widget> children;
  final double width;
  ImageGridColumn({required this.children, required this.width});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        return Container(
          width: constraints.maxWidth * this.width,
          child: Wrap(
            children: this.children,
          ),
        );
      }
    );
  }
}

// class TestImage extends StatelessWidget {
//   final double ratio;
//   final String url;
//   TestImage({required this.ratio, required this.url});

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       //width: MediaQuery.of(context).size.width,
//       child: Padding(
//         padding: EdgeInsets.all(5),
//         child: AspectRatio(
//           aspectRatio: this.ratio,
//           child: Container(
//             color: Colors.white.withOpacity(0.05),
//             child: ClipRRect(
//               borderRadius: BorderRadius.circular(6),
//               // child: Image.network(this.imagePath, fit: BoxFit.cover),
//               child: FadeInImage.assetNetwork(
//                 placeholder: "images/transparent.png", 
//                 image: this.url,
//                 fit: BoxFit.cover,
//                 height: double.infinity,
//                 width: double.infinity,
//                 alignment: Alignment.center,
//               ),
//             )
//           ),
//         ),
//       ),
//     );
//   }
// }
class TestImage extends StatefulWidget {
  final double ratio;
  final String url;
  final String tag;
  final String title;
  TestImage({required this.ratio, required this.url, this.title = "", this.tag = ""});

  _TestImageState createState() => _TestImageState();
}

class _TestImageState extends State<TestImage> with SingleTickerProviderStateMixin  {
  late AnimationController _controller;
  late Animation _imageScaleAnimation;
  late Animation _descriptionBackgroundAnimation;
  late Animation _descriptionTextTransformAnimation;
  late Animation _descriptionTagTransformAnimation;
  late Animation _descriptionTextOpacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this, // the SingleTickerProviderStateMixin
      duration: Duration(milliseconds: 800),
    );

    _imageScaleAnimation = Tween<double>(begin: 1, end: 1.05).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    ));
    _descriptionBackgroundAnimation = Tween<double>(begin: 0, end: .75).animate(_controller);
    
    _descriptionTagTransformAnimation = TweenSequence(
      <TweenSequenceItem<double>>[
        TweenSequenceItem<double>(
          tween: Tween<double>(begin: -50, end: 0), 
          weight: 90,
        ),
        TweenSequenceItem<double>(
          tween: Tween<double>(begin: 0, end: 0), 
          weight: 10,
        ),
      ]
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    ));
  
    _descriptionTextTransformAnimation = TweenSequence(
      <TweenSequenceItem<double>>[
        TweenSequenceItem<double>(
          tween: Tween<double>(begin: 0, end: 0), 
          weight: 20,
        ),
        TweenSequenceItem<double>(
          tween: Tween<double>(begin: -50, end: 0), 
          weight: 80,
        ),
      ]
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    ));
    
    
    _descriptionTextOpacityAnimation = TweenSequence(
      <TweenSequenceItem<double>>[
        TweenSequenceItem<double>(
          tween: Tween<double>(begin: 0, end: 0), 
          weight: 30,
        ),
        TweenSequenceItem<double>(
          tween: Tween<double>(begin: 0, end: 1), 
          weight: 70,
        ),
      ]
    ).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller, 
      builder: (BuildContext context, Widget? child) {
        return Container(
          child: Padding(
            padding: EdgeInsets.all(5),
            child: InkWell(
              onTap: () {},
              onHover: (hovered) {
                if (hovered) {
                  _controller.forward();
                } else {
                  _controller.reverse();
                }
              },
              child: AspectRatio(
                aspectRatio: widget.ratio,
                child: Container(
                  color: Colors.white.withOpacity(0.05),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    // child: Image.network(this.imagePath, fit: BoxFit.cover),

                    child: Stack(
                      children: [

                        // The image
                        Transform.scale(
                          scale: _imageScaleAnimation.value,
                          child: FadeInImage.assetNetwork(
                            placeholder: "images/transparent.png", 
                            image: widget.url,
                            fit: BoxFit.cover,
                            height: double.infinity,
                            width: double.infinity,
                            alignment: Alignment.center,
                          ),
                        ),

                        // The description
                        Positioned(
                          left: 0,
                          bottom: 0,
                          right: 0,
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.bottomCenter,
                                end: Alignment.topCenter,
                                colors: [
                                  Colors.black.withOpacity(_descriptionBackgroundAnimation.value),
                                  Colors.black.withOpacity(0),
                                ],
                              )
                            ),
                            child: Padding(
                              padding: EdgeInsets.only(top: 80, bottom: 20, left: 30, right: 30),
                              child: Opacity(
                                opacity: _descriptionTextOpacityAnimation.value,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Transform.translate(
                                      offset: Offset(_descriptionTextTransformAnimation.value, 0),
                                      child: Text(widget.title.toUpperCase(), style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 22,
                                        fontWeight: FontWeight.w900,
                                      )),
                                    ),
                                    widget.tag != "" ? Transform.translate(
                                      offset: Offset(_descriptionTagTransformAnimation.value, 0),
                                      child: Text(widget.tag, style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 20,
                                        fontWeight: FontWeight.w100,
                                      )),
                                    ) : Container(),
                                  ],
                                ),
                              )
                            ),
                          ),
                        ),

                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      }
    );
  }
}