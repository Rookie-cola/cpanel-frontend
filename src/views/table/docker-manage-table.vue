<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex; align-items: center; justify-content: flex-end">
      <el-button
        v-if="pageType === 'containers'"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreateContainer"
      >
        创建容器
      </el-button>
      <el-button
        v-if="pageType === 'images'"
        class="filter-item"
        size="medium"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-download"
        @click="handlePullImages"
      >
        拉取镜像
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-set-up"
        @click="handleSwitchType"
      >
        切换镜像/容器
      </el-button>
    </div>

    <el-table
      v-if="pageType === 'images'"
      :key="tableKey"
      v-loading="listLoading"
      :data="list.filter(data => !search || data.repository.toLowerCase().includes(search.toLowerCase())|| data.image_id.toLowerCase().includes(search.toLowerCase()))"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable
        align="center"
        width="200px"
      >
        <template slot-scope="{row}">
          <span>{{ row.image_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center" min-width="150px">
        <template slot-scope="{row}">
          <el-tag type="default" size="large">{{ row.repository }}:{{ row.tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="250px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="250px" align="center">
        <template slot-scope="{row}">
          <span style="font-size: 16px">{{ row.created }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="medium"
            placeholder="输入标签搜索"
          />
        </template>
        <template slot-scope="{row,$index}">
          <el-button size="medium" type="danger" @click="handleDeleteImages(row,$index)">
            删除镜像
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="pageType === 'containers'"
      :key="tableKey"
      v-loading="listLoading"
      :data="list.filter(data => !search || data.image_name.toLowerCase().includes(search.toLowerCase()) || data.container_name.toLowerCase().includes(search.toLowerCase()))"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable
        align="center"
        width="120px"
      >
        <template slot-scope="{row}">
          <span>{{ row.container_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" width="200px" min-width="150px">
        <template slot-scope="{row}">
          <span style="font-size: 16px">{{ row.container_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="镜像" align="center" width="200px" min-width="150px">
        <template slot-scope="{row}">
          <span style="font-size: 16px">{{ row.image_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status === 'running' ? 'success' : 'danger'">
            {{ row.status === 'running' ? '已启动' : '已停止' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="容器IP地址" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.container_ip ? row.container_ip : '-------------' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宿主机端口" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.host_port ? row.host_port : '-------------' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="容器端口" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.container_port ? row.container_port : '-------------' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行时长" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.running_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="medium"
            placeholder="输入名称搜索"
          />
        </template>
        <template slot-scope="{row,$index}">
          <el-button size="medium" type="success" @click="handleStart(row,$index)">
            {{ '启动' }}
          </el-button>
          <el-button size="medium" type="warning" @click="handleStop(row,$index)">
            {{ '停止' }}
          </el-button>
          <el-button size="medium" type="primary" @click="handleRestart(row,$index)">
            {{ '重启' }}
          </el-button>
          <el-button size="medium" type="danger" @click="handleDeleteContainers(row,$index)">
            {{ '删除' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="pageType === 'images' ? '拉取镜像' : '创建容器'" :visible.sync="dialogFormVisible" width="700px">
      <el-form
        v-if="pageType === 'images'"
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin:0 auto;"
      >
        <el-form-item :label="('镜像仓库')">
          <el-select v-model="temp.repo" class="filter-item" placeholder="请选择">
            <el-option v-for="item in warehouseOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="(this.pageType === 'images' ? '镜像名称' : '容器名称')" prop="images">
          <el-input v-if="this.pageType === 'images'" v-model="temp.images"/>
          <el-input v-if="this.pageType === 'containers'" v-model="temp.containers"/>
        </el-form-item>
      </el-form>
      <el-form
        v-if="pageType !== 'images'"
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin:0 auto;"
      >
        <el-form-item :label="('容器名称')">
          <el-input v-model="temp.container_name"/>
        </el-form-item>
        <el-form-item :label="('镜像名称')">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="temp.image_name"
            :fetch-suggestions="querySearch"
            placeholder="请输入镜像名称"
            @select="handleSelect">
            <i class="el-icon-close" slot="suffix" @click="handleIconClick"></i>
              <div slot-scope="{ item }" class="repository">{{ item.repository }}:{{ item.tag }}</div>
          </el-autocomplete>
        </el-form-item>
        <el-form-item :label="('端口映射')" prop="images">
          <el-input placeholder="格式：宿主机端口:容器端口" v-model="temp.port_mapping"/>
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
import {
  fetchDockerImagesList,
  pullDockerImage,
  removeDockerImage,
  createDockerContainer,
  fetchDockerContainersList,
  startDockerContainer,
  stopDockerContainer,
  removeDockerContainer,
  restartContainer,
  fetchDockerContainerLogs
} from '@/api/docker_manage'
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
  name: 'DockerManageTable',
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
      pageType: 'images',
      repositoriesAndTags: [],
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
      warehouseOptions: ['Docker Hub'],
      showReviewer: false,
      temp: {
        image_name: '',
        repo: 'Docker Hub',
        container_name: '',
        port_mapping: ''
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
  mounted() {
    fetchDockerImagesList(this.listQuery).then(response => {
      if (response.status === false) {
        this.list = []
        this.total = 0
      } else {
        this.list = response.images
        this.total = response.length
      }
      this.repositoriesAndTags = this.list.map((image) => ({
        repository: image.repository,
        tag: image.tag
      }))
    })
  },
  methods: {
    saveData() {
      // turn portData to formData
      if (this.pageType === 'images') {
        const formData = { image: this.temp.images }
        this.listLoading = true
        pullDockerImage(formData).then((response) => {
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: '拉取镜像成功',
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
            message: '拉取镜像失败',
            type: 'error',
            duration: 2000
          })
          this.dialogFormVisible = false
          this.listLoading = false
        })
      } else {
        const formData = { image_name: this.temp.image_name, container_name: this.temp.container_name, port_mapping: this.temp.port_mapping }
        this.listLoading = true
        console.log(formData)
        createDockerContainer(formData).then((response) => {
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: '创建容器成功',
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
            message: '创建容器失败',
            type: 'error',
            duration: 2000
          })
          this.dialogFormVisible = false
          this.listLoading = false
        })
      }
    },
    getList() {
      // this.listLoading = true
      if (this.pageType === 'images') {
        fetchDockerImagesList(this.listQuery).then(response => {
          if (response.status === false) {
            this.list = []
            this.total = 0
          } else {
            this.list = response.images
            this.total = response.length
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      } else {
        fetchDockerContainersList(this.listQuery).then(response => {
          if (response.status === false) {
            this.list = []
            this.total = 0
          } else {
            this.list = response.containers
            this.total = response.containers.length
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    resetTemp() {
      this.temp = {
        protocol: 'Docker Hub',
        image_name: '',
        container_name: '',
        port_mapping: ''
      }
    },
    handlePullImages() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSwitchType() {
      if (this.pageType === 'images') {
        this.pageType = 'containers'
        this.getList()
      } else {
        this.pageType = 'images'
        this.getList()
      }
    },
    handleDeleteImages(row, index) {
      this.$confirm('确认删除该镜像？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeDockerImage(row.image_id).then(response => {
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
            this.total -= 1
            this.getList()
          }
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        })
      }).catch(() => {
        this.$notify({
          title: '取消',
          message: '已取消删除',
          type: 'info',
          duration: 2000
        })
      })
    },
    handleCreateContainer() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleStart(row, index) {
      startDockerContainer(row.container_id).then(response => {
        if (response.code === 200) {
          this.$notify({
            title: '成功',
            message: '启动成功',
            type: 'success',
            duration: 2000
          })
          this.list[index].status = 'running'
          this.getList()
        }
      })
    },
    handleStop(row, index) {
      if (row.status !== 'running') {
        this.$notify({
          title: '失败',
          message: '容器未运行',
          type: 'error',
          duration: 2000
        })
        return
      }
      stopDockerContainer(row.container_id).then(response => {
        if (response.code === 200) {
          this.$notify({
            title: '成功',
            message: '停止成功',
            type: 'success',
            duration: 2000
          })
          this.list[index].status = 'exited'
          this.getList()
        }
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '停止失败',
          type: 'error',
          duration: 2000
        })
      })
    },
    handleRestart(row, index) {
      this.listLoading = true
      if (row.status !== 'running') {
        this.$notify({
          title: '失败',
          message: '容器未运行',
          type: 'error',
          duration: 2000
        })
        return
      }
      restartContainer(row.container_id).then(response => {
        if (response.code === 200) {
          this.$notify({
            title: '成功',
            message: '重启成功',
            type: 'success',
            duration: 2000
          })
          this.list[index].status = 'running'
          this.getList()
          this.listLoading = false
        }
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '重启失败',
          type: 'error',
          duration: 2000
        })
      })
    },
    handleDeleteContainers(row, index) {
      removeDockerContainer(row.container_id).then(response => {
        if (response.code === 200) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
          this.total -= 1
          this.getList()
        }
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '删除失败',
          type: 'error',
          duration: 2000
        })
      })
    },
    getLogs(row) {
      fetchDockerContainerLogs(row.container_id).then(response => {
        this.$notify({
          title: '成功',
          message: '获取日志成功',
          type: 'success',
          duration: 2000
        })
        console.log(response)
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '获取日志失败',
          type: 'error',
          duration: 2000
        })
      })
    },
    querySearch(queryString, cb) {
      // 基于输入字符串过滤建议项并调用回调函数cb
      const suggestions = this.repositoriesAndTags.filter((item) => {
        return (
          item.repository.toLowerCase().includes(queryString.toLowerCase()) ||
          item.tag.toLowerCase().includes(queryString.toLowerCase())
        )
      })

      cb(suggestions)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      this.temp.image_name = `${item.repository}:${item.tag}`
    },
    handleIconClick() {
      this.temp.image_name = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .repository {
      font-size: 16px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .tag {
      font-size: 16px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
