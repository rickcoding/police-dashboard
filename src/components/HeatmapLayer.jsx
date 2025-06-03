import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  // 转换点数据为 heatmap 格式
  const heatmapPoints = points.map(([lat, lng, intensity]) => [lat, lng, intensity]);

  // 添加热力图层
  L.heatLayer(heatmapPoints, { radius: 25 }).addTo(map);

  return null; // 组件不需要渲染任何内容
};

export default HeatmapLayer;