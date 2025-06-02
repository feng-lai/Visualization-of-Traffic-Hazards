import AMapLoader from 'vue-amap';

const amap = AMapLoader({
  key: '759c9ebf3b94a438fac399a7ad66f43a',
  version: '2.0', // API版本号
  plugins: ['AMap.Marker', 'AMap.Polyline'] 
});

export default amap;