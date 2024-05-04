<template>
  <div class="app-container">
    <div class="upload-container" style="align-items: flex-end;display: flex;justify-content: right;height: 100%; gap: 10px; margin-bottom: 10px;">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreateWebsite"
      >

        创建网站
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      type="selection"
      :data="list.filter(data => !search || data.domain.toLowerCase().includes(search.toLowerCase()) || data.listen_port.toLowerCase().includes(search.toLowerCase()))"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="站点" align="center" width="600px" prop="domain">
        <template slot-scope="{row}">
          <svg-icon icon-class="website" />
          <span class="website" @click="handleJumpWebsite(row)">
            {{ row.domain }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="端口" width="400px" align="center" prop="listen_port">
        <template slot-scope="{row}">
          <el-tag>{{ row.listen_port }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="文件路径" align="center" prop="root_dir">
        <template slot-scope="{row}">
          <span class="website_dir" @click="handleJumpToPath(row.root_dir)">{{ row.root_dir }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200px">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="medium"
            placeholder="输入关键字搜索"
          />
        </template>
        <template slot-scope="{row,$index}">
          <el-button size="medium" type="danger" @click="handleDelete(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogPvVisible" title="确认删除">
      <span>
        是否确认删除该网站？
      </span>
<!--      <p style="font-weight: bold; color: red">{{ this.currentRowIndex.row.name }}</p>-->
      <el-input v-model="deleteInput" type="text" placeholder="请输入'确认删除'来确认删除该网站" style="margin-top: 10px" @keydown.enter.native="deleteConfirm" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteConfirm">{{ $t('table.confirm') }}</el-button>
        <el-button @click="dialogPvVisible = false">{{ $t('table.cancel') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="创建网站" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 500px; margin: 0 auto;"
      >
        <el-form-item label-width="100px" :label="('域名')">
          <el-input v-model="temp.domain" />
        </el-form-item>
        <el-form-item label-width="100px"  :label="('绑定端口')">
          <el-input v-model="temp.listen_port" />
        </el-form-item>
        <el-form-item label-width="100px" :label="('网站文件路径')">
          <el-input v-model="temp.root_dir" />
        </el-form-item>
        <el-form-item label-width="150px" :label="('是否创建动态网站')">
          <el-radio-group v-model="temp.option">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
import { fetchWebsiteList, websiteCreate, websiteDelete } from '@/api/website_manage'
import waves from '@/directive/waves'
import Cookies from 'js-cookie'
import router from '@/router'
export default {
  name: 'WebsiteManageTable',
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
      data: [],
      deleteInput: '',
      currentPath: '/var/www/',
      delete_site: '',
      tableKey: 0,
      list: [],
      total: 0,
      currentRowIndex: { row: {}, index: -1 },
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      search: '',
      showReviewer: false,
      temp: {
        domain: '',
        listen_port: '',
        root_dir: '',
        option: 0
      },
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
    handleJumpWebsite(row) {
      window.open(`http://${row.domain}:${row.listen_port}`, '_blank')
    },
    handleJumpToPath(path) {
      Cookies.set('currentPath', path)
      router.push({ name: 'FileManageTable', query: { refresh: true }})
    },
    getList() {
      this.listLoading = true
      fetchWebsiteList().then(response => {
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
    handleDelete(row, index) {
      this.delete_site = row.root_dir.replace('/var/www/', '')
      this.dialogPvVisible = true
    },
    saveData() {
      // turn portData to formData
      const formData = new FormData()
      if (this.temp.domain === '' || this.temp.listen_port === undefined || this.temp.root_dir === null) {
        this.$notify({
          title: '失败',
          message: '域名、端口、文件路径不能为空',
          type: 'error',
          duration: 2000
        })
        return
      }
      formData.append('domain', this.temp.domain)
      formData.append('listen_port', this.temp.listen_port)
      formData.append('root_dir', this.temp.root_dir)
      formData.append('is_create_dynamic_website', this.temp.option)
      websiteCreate(formData).then((response) => {
        this.dialogFormVisible = false
        if (response.code === 201) {
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
        this.dialogFormVisible = false
        this.listLoading = false
        this.getList()
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '创建失败',
          type: 'error',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        domain: '',
        listen_port: '',
        root_dir: '',
        option: 1
      }
    },
    handleCreateWebsite() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteConfirm() {
      if (this.deleteInput === '确认删除') {
        websiteDelete(this.delete_site).then(() => {
          this.getList()
          this.dialogPvVisible = false
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.deleteInput = ''
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        })
      } else {
        this.$notify({
          title: '失败',
          message: '请输入正确的删除确认信息',
          type: 'error',
          duration: 2000
        })
      }
    }
  }
}
</script>
<style scoped>
.website {
  font-size: 18px;
  cursor: pointer;
  color: #0a76a4;
  :hover {
    color: #409eff;
    text-underline: #0a76a4;
    text-decoration: underline;
  }
}
.website_dir {
  font-size: 18px;
  cursor: pointer;
  color: #0a76a4;
  text-decoration: none;
  :hover {
    color: #409eff;
    text-underline: #0a76a4;
    text-decoration: underline;
  }
}
</style>
