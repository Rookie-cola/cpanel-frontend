<template>
  <div class="app-container">
    <div class="upload-container" style="align-items: flex-end;display: flex;justify-content: right;height: 100%; gap: 10px; margin-bottom: 10px;">
      <el-button type="primary" icon="el-icon-s-home" size="medium" @click="handleReturnHome" />
      <el-button type="primary" icon="el-icon-back" size="medium" @click="handleReturnLastPath" />
      <el-input v-model="currentPath" placeholder="当前路径" style="width: 100%" @keydown.enter.native="handleJumpToPath" />
      <el-button type="primary" icon="el-icon-s-promotion" size="medium" @click="handleJumpToPath" />
      <el-button type="primary" icon="el-icon-refresh" size="medium" @click="handleRefresh" />
      <el-upload
        class="upload-demo"
        :action="upLoadUrl()"
        :before-upload="beforeUpload"
        :on-success="fileUploadSuccess"
        :file-list="fileList"
        :show-file-list="false"
      >
        <el-button icon="el-icon-upload" size="medium" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      type="selection"
      :data="list.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="名称" align="center" sortable prop="name">
        <template slot-scope="{row}">
          <svg-icon v-if="row.file_type === 'dir'" icon-class="dir" />
          <svg-icon v-else icon-class="file" />
          <span :class="{ 'path-name': row.file_type === 'dir' }" style="font-size: 16px;cursor: pointer;" @click="handlePathClick(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="250px" align="center" sortable prop="mode_oct">
        <template slot-scope="{row}">
          <p style="margin: 0">{{ row.mode }}</p>
          <p style="margin: 0">{{ row.mode_oct }}</p>
        </template>
      </el-table-column>
      <el-table-column label="用户" width="150px" align="center" sortable prop="owner">
        <template slot-scope="{row}">
          <span style="font-size: 16px">{{ row.owner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="300px" align="center" sortable prop="created_time">
        <template slot-scope="{row}">
          <span>{{ row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="300px" align="center" sortable prop="modified_time">
        <template slot-scope="{row}">
          <span>{{ row.modified_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="300px">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="medium"
            placeholder="输入关键字搜索"
          />
        </template>
        <template slot-scope="{row,$index}">
          <el-button v-if="row.file_type !== 'dir'" size="medium" type="primary" @click="handleDownload(row)">
            下载
          </el-button>
          <el-button v-if="row.file_type === 'zip'" size="medium" type="success" @click="handleUnzip(row)">
            解压
          </el-button>
          <el-button size="medium" type="danger" @click="handleDelete(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog :visible.sync="dialogPvVisible" title="确认删除">
      <span>
        是否确认删除该文件？
      </span>
      <p style="font-weight: bold; color: red">{{ this.currentRowIndex.row.name }}</p>
      <el-input v-model="deleteInput" type="text" placeholder="请输入'确认删除'来确认删除该文件" style="margin-top: 10px" @keydown.enter.native="deleteConfirm" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteConfirm">{{ $t('table.confirm') }}</el-button>
        <el-button @click="dialogPvVisible = false">{{ $t('table.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDirList, fileDelete, unzipFile } from '@/api/flie_manage'
import waves from '@/directive/waves'
import { getToken } from '@/utils/auth'
import Cookies from 'js-cookie'
import Pagination from '@/components/Pagination/index.vue'
export default {
  name: 'FileManageTable',
  components: { Pagination },
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
    }
  },
  data() {
    return {
      data: [],
      deleteInput: '',
      currentPath: '/',
      uploadUrl: '/',
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
  watch: {
    currentPath() {
      Cookies.set('currentPath', this.currentPath)
    }
  },
  activated() {
    this.currentPath = Cookies.get('currentPath') || '/'
    this.getList()
  },
  created() {
    this.currentPath = Cookies.get('currentPath') || '/'
    this.getList()
  },
  methods: {
    getToken,
    getList() {
      this.listLoading = true
      fetchDirList(this.currentPath).then(response => {
        this.list = response.data
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
    deleteConfirm() {
      if (this.deleteInput === '确认删除') {
        fileDelete(this.currentPath + this.currentRowIndex.row.name).then(() => {
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
    },
    fileUploadSuccess() {
      this.$notify.success({
        title: '成功',
        message: '上传成功',
        type: 'success',
        duration: 2000
      })
      this.getList()
    },
    handleDelete(row, index) {
      this.currentRowIndex = { row: row, index: index }
      this.dialogPvVisible = true
    },
    upLoadUrl() {
      return process.env.VUE_APP_BASE_API + 'api/v1/file/file_handler?path=' + this.currentPath + '&token=' + getToken()
    },
    handleDownload(row) {
      window.open(process.env.VUE_APP_BASE_API + 'api/v1/file/file_handler?path=' + this.currentPath + row.name + '&token=' + getToken())
    },
    handleUnzip(row) {
      unzipFile(this.currentPath + '/' + row.name).then(() => {
        this.$notify({
          title: '成功',
          message: '解压成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '解压失败',
          type: 'error',
          duration: 2000
        })
      })
    },
    handleReturnHome() {
      if (this.currentPath === '/') {
        this.$message.error('已经在根目录了')
        this.getList()
      }
      this.currentPath = '/'
      this.getList()
    },
    handleReturnLastPath() {
      if (this.currentPath === '/') {
        this.$message.error('已经在根目录了')
      }
      const paths = this.currentPath.split('/')
      paths.pop()
      paths.pop()
      this.currentPath = paths.join('/') + '/'
      this.getList()
    },
    handleJumpToPath() {
      if (this.currentPath.startsWith('/')) {
        this.getList()
      } else {
        this.$message.error('请输入正确的路径')
      }
    },
    handleRefresh() {
      this.getList()
    },
    handlePathClick(row) {
      if (row.file_type === 'dir') {
        if (!this.currentPath.endsWith('/')) {
          this.currentPath = this.currentPath + '/' + row.name + '/'
        } else {
          this.currentPath = this.currentPath + row.name + '/'
        }
        this.getList()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style scoped>
.path-name:hover {
  color: #409eff;
  text-underline: #0a76a4;
  text-decoration: underline;
}
</style>
