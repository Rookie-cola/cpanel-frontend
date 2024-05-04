<template>
  <div class="dashboard-editor-container">

    <panel-group :cpu_info="cpu_info" :cpu_percent="cpu_percent" :mem_info="mem_info" :disk_info="disk_info" :io_info="io_info" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <p style="display: flex;align-items: center;justify-content: center">磁盘I/O</p>
      <line-chart-i-o :chart-data="lineChartData.disk_io" />
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <p style="display: flex;align-items: center;justify-content: center">网络I/O</p>
      <line-chart-i-o :chart-data="lineChartData.net_io" />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChartIO from './components/LineChartIO.vue'
import { fetchSystemInfo } from '@/api/system_info'

const lineChartData = {
  disk_io: {
    input: [100, 120, 161, 134, 105, 160, 165],
    output: [120, 82, 91, 154, 162, 140, 145]
  },
  net_io: {
    input: [200, 192, 120, 144, 160, 130, 140],
    output: [180, 160, 151, 106, 145, 150, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChartIO
  },
  data() {
    return {
      lineChartData: lineChartData,
      cpu_info: {
        core_num: 0,
        cpu_num: 0,
        model_name: '',
        processor_num: 0
      },
      cpu_percent: 0,
      mem_info: {
        Active: 0,
        Buffers: 0,
        Cached: 0,
        MemAvailable: 0,
        MemFree: 0,
        MemTotal: 0,
        SwapCached: 0,
        Used: 0
      },
      disk_info: {
        Total: 0,
        Used: 0
      },
      io_info: {
        io_recv: 0,
        io_sent: 0,
        net_io_recv: 0,
        net_io_sent: 0
      }
    }
  },
  created() {
    this.getData()
    this.interval = setInterval(() => {
      this.getData()
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    getData() {
      fetchSystemInfo().then(response => {
        this.cpu_info = response.cpu_info
        this.cpu_percent = response.cpu_percent
        this.mem_info = response.mem_info
        this.disk_info = response.disk_info
        this.io_info = response.io_info
        // append new data to lineChartData, and delete the first one
        this.lineChartData.disk_io.input.push(response.io_info.io_recv)
        this.lineChartData.disk_io.input.shift()

        this.lineChartData.disk_io.output.push(response.io_info.io_sent)
        this.lineChartData.disk_io.output.shift()

        this.lineChartData.net_io.input.push(response.io_info.net_io_recv)
        this.lineChartData.net_io.input.shift()

        this.lineChartData.net_io.output.push(response.io_info.net_io_sent)
        this.lineChartData.net_io.output.shift()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
