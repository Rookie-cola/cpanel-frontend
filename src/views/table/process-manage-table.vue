<template>
  <div class="app-container">
    <div class="filter-container" />
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list.filter(data => !search || data.proc_name.toLowerCase().includes(search.toLowerCase()))"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="进程号"
        prop="id"
        sortable
        align="center"
        width="100"
      >
        <template slot-scope="{row}">
          <span style="font-size:20px">{{ row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进程名" align="center" sortable prop="proc_name" size="medium">
        <template slot-scope="{row}">
          <span style="font-size:20px">{{ row.proc_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center" sortable prop="username">
        <template slot-scope="{row}">
          <span style="font-size:20px">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CPU使用率" width="150px" align="center" sortable prop="cpu_percent">
        <template slot-scope="{row}">
          <span style="font-size:20px">{{ row.cpu_percent }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="内存占用" width="150px" align="center" sortable prop="used_memory">
        <template slot-scope="{row}">
          <span style="font-size:20px">{{ row.used_memory }}MB</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px" align="center" sortable prop="status">
        <template slot-scope="{row}">
          <el-tag :type="row.status === 'running' ? 'success' : row.status === 'sleeping' ? 'warning' : row.status === 'idle' ? 'info' : row.status === 'zombie' ? 'danger' : row.status === 'dead' ? 'danger' : row.status === 'stopped' ? 'danger' : 'default'" size="medium">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200px">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="medium"
            placeholder="输入进程名搜索"
          />
        </template>
        <template slot-scope="{row,$index}">
          <el-button size="medium" type="danger" @click="handleKill(row,$index)">
            {{ "Kill" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchProcesses, processKill } from '@/api/process_manage'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'ProcessManageTable',
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      pid: null,
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      search: '',
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchProcesses(this.listQuery).then(response => {
        this.list = response
        this.total = response.length
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleKill(row, index) {
      processKill(row.pid).then((response) => {
        this.$notify({
          title: '成功',
          message: '杀死进程成功: ' + response.status,
          type: 'success',
          duration: 2000
        })
        this.list.forEach((item, i) => { if (item.pid === row.pid) { this.list.splice(i, 1) } })
      }).catch((err) => {
        this.$notify({
          title: '失败',
          message: '杀死进程失败: ' + err,
          type: 'error',
          duration: 2000
        })
      })
    }
  }
}
</script>
