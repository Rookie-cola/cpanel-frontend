<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex; align-items: center; justify-content: flex-end">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加规则
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-set-up"
        @click="handleSwitchType"
      >
        切换端口/IP规则
      </el-button>
    </div>

    <el-table
      v-if="pageType === 'port'"
      :key="tableKey"
      :data="list.filter(data => !search || data.port.toLowerCase().includes(search.toLowerCase()))"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="序号"
        prop="id"
        sortable
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.rule_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="协议" align="center" width="150px" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag size="medium">{{ row.protocol }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="端口" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="策略" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.is_allowed ? 'success' : 'danger'">
            {{ row.is_allowed ? '允许' : '禁止' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description ? row.description : '无描述' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="medium"
            placeholder="输入端口搜索"
          />
        </template>
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status !== 'deleted'" size="medium" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="pageType === 'ip'"
      :key="tableKey"
      :data="list.filter(data => !search || data.ip.toLowerCase().includes(search.toLowerCase()))"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="序号"
        prop="id"
        sortable
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.rule_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="协议" align="center" width="150px" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.protocol }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="指定IP" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="策略" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.is_allowed ? 'success' : 'danger'">
            {{ row.is_allowed ? '允许' : '禁止' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description ? row.description : '无描述' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="medium"
            placeholder="输入IP地址搜索"
          />
        </template>
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status!='deleted'" size="medium" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

<!--    <pagination-->
<!--      v-show="total>0"-->
<!--      :total="total"-->
<!--      :page.sync="listQuery.page"-->
<!--      :limit.sync="listQuery.limit"-->
<!--      @pagination="getList"-->
<!--    />-->

    <el-dialog title="添加规则" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="(this.pageType === 'port' ? '端口' : 'IP')" prop="port">
          <el-input v-if="this.pageType === 'port'" v-model="temp.port" />
          <el-input v-if="this.pageType === 'ip'" v-model="temp.ip" />
        </el-form-item>

        <el-form-item :label="('协议')">
          <el-select v-model="temp.protocol" class="filter-item" placeholder="Please select">
            <el-option v-for="item in protocolOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="('操作')">
          <el-radio-group v-model="temp.option">
            <el-radio label="1">允许</el-radio>
            <el-radio label="0">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="('描述')">
          <el-input
            v-model="temp.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述信息"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="saveData">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUfwPort, fetchUfwIp, ufwIpAdd, ufwPortAdd, ufwPortDelete, ufwIpDelete } from '@/api/ufw_manage'
import waves from '@/directive/waves' // waves directive
import radio from 'element-ui/packages/radio'
import item from '@/layout/components/Sidebar/Item.vue'

const calendarTypeOptions = []

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'UfwManageTable',
  // components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      pageType: 'port',
      tableKey: 0,
      list: null,
      total: 0,
      search: '',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      protocolOptions: ['tcp', 'udp'],
      showReviewer: false,
      temp: {
        port: '',
        ip: '',
        protocol: 'tcp',
        option: '1',
        description: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
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
  computed: {
    item() {
      return item
    },
    radio() {
      return radio
    }
  },
  created() {
    this.getList()
  },
  methods: {
    saveData() {
      // turn portData to formData
      const formData = new FormData()
      if (this.pageType === 'port') {
        if (this.temp.port === '' || this.temp.port === undefined || this.temp.port === null) {
          this.$notify({
            title: '失败',
            message: '端口不能为空',
            type: 'error',
            duration: 2000
          })
          return
        } else if (!Number.isInteger(Number(this.temp.port)) || this.temp.port < 1 || this.temp.port > 65535) {
          console.log(!Number.isInteger(this.temp.port))
          this.$notify({
            title: '失败',
            message: '端口范围为1-65535',
            type: 'error',
            duration: 2000
          })
          return
        }
        formData.append('port', this.temp.port)
      } else {
        if (this.temp.ip === '' || this.temp.ip === undefined || this.temp.ip === null) {
          this.$notify({
            title: '失败',
            message: 'IP不能为空',
            type: 'error',
            duration: 2000
          })
          return
        }
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        if (!ipRegex.test(this.temp.ip)) {
          this.$notify({
            title: '失败',
            message: '请输入有效的 IPv4 地址',
            type: 'error',
            duration: 2000
          })
          return
        }
        formData.append('ip', this.temp.ip)
      }
      if (this.temp.protocol === '' || this.temp.protocol === undefined || this.temp.protocol === null) {
        this.$notify({
          title: '失败',
          message: '协议不能为空',
          type: 'error',
          duration: 2000
        })
        return
      }

      if (this.temp.option === '' || this.temp.option === undefined || this.temp.option === null) {
        this.$notify({
          title: '失败',
          message: '操作不能为空',
          type: 'error',
          duration: 2000
        })
        return
      }
      if (this.temp.description === '' || this.temp.description === undefined || this.temp.description === null) {
        this.$notify({
          title: '失败',
          message: '描述不能为空',
          type: 'error',
          duration: 2000
        })
        return
      }
      formData.append('protocol', this.temp.protocol)
      formData.append('is_allowed', this.temp.option)
      formData.append('description', this.temp.description)
      if (this.pageType === 'port') {
        ufwPortAdd(formData).then((response) => {
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '创建失败',
            type: 'error',
            duration: 2000
          })
        })
      } else {
        ufwIpAdd(formData).then((response) => {
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '创建失败',
            type: 'error',
            duration: 2000
          })
        })
      }
    },
    getList() {
      this.listLoading = true
      if (this.pageType === 'port') {
        fetchUfwPort(this.listQuery).then(response => {
          if (response.status === false) {
            this.list = []
            this.total = 0
          } else {
            this.list = response
            this.total = response.length
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      } else {
        fetchUfwIp(this.listQuery).then(response => {
          if (response.status === false) {
            this.list = []
            this.total = 0
          } else {
            this.list = response
            this.total = response.length
          }
          console.log(this.list)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      }
    },
    resetTemp() {
      this.temp = {
        description: '',
        port: '',
        protocol: 'tcp'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSwitchType() {
      if (this.pageType === 'port') {
        this.pageType = 'ip'
        this.getList()
      } else {
        this.pageType = 'port'
        this.getList()
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      if (this.pageType === 'port') {
        ufwPortDelete(row.rule_id)
      } else {
        ufwIpDelete(row.rule_id)
      }
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
