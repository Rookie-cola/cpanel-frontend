<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <i class="el-icon-cpu card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            CPU
          </div>
          <p style="justify-content: right; display: flex; font-size: 12px; margin-bottom: 12px;">
            {{ cpu_info.model_name }}
          </p>
          <p style="justify-content: right; display: flex; font-size: 14px; margin-bottom: 12px;">
            {{ cpu_info.processor_num }} Cores 使用率 {{ cpu_percent }} %
          </p>
          <!--<count-to :start-val="0" :end-val="cpu_info.processor_num" :duration="2600" class="card-panel-num"/>-->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="memory-total" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            內存
          </div>
          <p style="font-size: 14px; margin-bottom: 12px; justify-content: center; display: flex;">
            {{ mem_info.Used }} GB / {{ mem_info.MemTotal }} GB
          </p>
          <p style="font-size: 14px; margin-bottom: 12px; justify-content: center; display: flex;">
            使用率 {{ round((mem_info.Used / mem_info.MemTotal)*100, 2) }}%
          </p>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="ul_hardware" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            硬盘
          </div>
          <p style="font-size: 14px; margin-bottom: 12px; justify-content: center; display: flex;">
            {{ disk_info.Used }} GB / {{ disk_info.Total }} GB
          </p>
          <p style="font-size: 14px; margin-bottom: 12px; justify-content: center; display: flex;">
            使用率 {{ round((disk_info.Used / disk_info.Total)*100, 2) }}%
          </p>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="stream" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description" style="width: 200px;">
          <div class="card-panel-text">
            硬盘 I/O --- 网络 I/O
          </div>
          <p style="justify-content: center; display: flex; font-size: 14px; margin-bottom: 12px;">
            写入 {{ round(io_info.io_sent / 1024 / 1024, 2) }}MB / 读取 {{ round(io_info.io_recv / 1024 / 1024, 2) }}MB</p>
          <p style="justify-content: center; display: flex; font-size: 14px; margin-bottom: 12px;">
            发送 {{ round(io_info.net_io_sent / 1024 / 1024, 2) }}MB / 接收 {{ round(io_info.net_io_recv / 1024 / 1024, 2) }}MB</p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { round } from 'echarts/src/util/number'

export default {
  components: {
  },
  props: {
    cpu_info: {
      type: Object,
      default: () => ({
        model_name: 'Intel(R) Core(TM) i7-8750H CPU @ 2.20GHz',
        processor_num: 6
      })
    },
    cpu_percent: {
      type: Number,
      default: 0
    },
    mem_info: {
      type: Object,
      default: () => ({
        Used: 16,
        MemTotal: 32
      })
    },
    disk_info: {
      type: Object,
      default: () => ({
        Used: 10,
        Total: 20
      })
    },
    io_info: {
      type: Object,
      default: () => ({
        io_recv: 10000000,
        io_sent: 20000000,
        net_io_recv: 30000000,
        net_io_sent: 40000000
      })
    }
  },
  methods: {
    round
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    display: flex;
    justify-content: space-evenly;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 7px 0 7px 0;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 16px 26px 26px 0;

      .card-panel-text {
        justify-content: center;
        display: flex;
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 20px;
        margin-top: 0;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 15px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
