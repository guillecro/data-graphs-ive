import Vue from 'vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

// import ECharts modules manually to reduce bundle size
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  GaugeChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  VisualMapComponent

])

// register globally (or you can do it locally)
Vue.component('VueGauge', ECharts)
