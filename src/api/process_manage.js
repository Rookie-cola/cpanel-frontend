import request from '@/utils/request'

export function fetchProcesses(listQuery) {
  return request({
    url: '/api/v1/process/process_manage',
    method: 'get',
    params: listQuery
  })
}

export function processKill(pid) {
  return request({
    url: '/api/v1/process/process_manage',
    method: 'delete',
    params: { pid }
  })
}
