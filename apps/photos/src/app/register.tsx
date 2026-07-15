import Albania2023 from './entries/2023albania';
import LakeComo2018 from './entries/2018lakecomo';
import Turkey2016 from './entries/2016turkey';
import Tokyo2016 from './entries/2016tokyo';
import MountFuji2016 from './entries/2016mountfuji';
import FushimiInari2023 from './entries/2023fushimiInari';

import { register } from './data';

// register the routes
register(Albania2023.url, Albania2023, [Turkey2016, LakeComo2018, Tokyo2016]);
register(Turkey2016.url, Turkey2016, [Albania2023, LakeComo2018, Tokyo2016]);
register(LakeComo2018.url, LakeComo2018, [Albania2023, Turkey2016, Tokyo2016]);
register(Tokyo2016.url, Tokyo2016, [
  MountFuji2016,
  Albania2023,
  FushimiInari2023,
]);
register(MountFuji2016.url, MountFuji2016, [
  Tokyo2016,
  Albania2023,
  FushimiInari2023,
]);
register(FushimiInari2023.url, FushimiInari2023, [
  Tokyo2016,
  MountFuji2016,
  LakeComo2018,
]);
