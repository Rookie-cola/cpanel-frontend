import request from '@/utils/request'

export function fetchDirList(path) {
  return request({
    url: '/api/v1/file/file_list',
    method: 'get',
    params: { path }
  })
}

export function fileDelete(path) {
  return request({
    url: '/api/v1/file/file_handler',
    method: 'delete',
    params: { path }
  })
}

export function unzipFile(path) {
  return request({
    url: '/api/v1/file/unzip_file',
    method: 'post',
    params: { path }
  })
}
