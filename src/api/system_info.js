import request from '@/utils/request'

export function fetchSystemInfo(query) {
  return request({
    url: '/api/v1/system/info',
    method: 'get',
    params: query
  })
}
