# Warren Amphlett
Personal website built using Flutter for web.

# Why Flutter?
I've been playing with Flutter for a while and I was really interested to see how their new web support was coming along. This site only needed to be very simple so seemed like the perfect oppertunity to test it out. 

## Development
At present, Flutter must be on the `master` branch in order to use the web compiler.

```
flutter channel master
flutter upgrade
flutter config --enable-web
```

Once this has been done, you can run the app

```
flutter run -d chrome
```

For more information, see [the official documentation](https://flutter.dev/docs/get-started/web)