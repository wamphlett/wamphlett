import 'package:flutter/material.dart';
import 'pages/home.dart';

void main() => runApp(Wamphlett());

class Wamphlett extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Warren Amphlett',
      theme: ThemeData(
        fontFamily: 'Heebo',
      ),
      home: Scaffold(
        body: HomePage(),
      ),
      debugShowCheckedModeBanner: false,
    );
  }
}
