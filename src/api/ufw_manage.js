import request from '@/utils/request'

export function fetchUfwPort(query) {
  return request({
    url: '/api/v1/ufw/port',
    method: 'get',
    params: query
  })
}

export function ufwPortAdd(data) {
  return request({
    url: '/api/v1/ufw/port',
    method: 'post',
    data
  })
}
export function ufwPortDelete(rule_id) {
  return request({
    url: '/api/v1/ufw/port',
    method: 'delete',
    params: { rule_id }
  })
}
export function fetchUfwIp(query) {
  return request({
    url: '/api/v1/ufw/ip',
    method: 'get',
    params: query
  })
}
export function ufwIpAdd(data) {
  return request({
    url: '/api/v1/ufw/ip',
    method: 'post',
    data
  })
}
export function ufwIpDelete(rule_id) {
  return request({
    url: '/api/v1/ufw/ip',
    method: 'delete',
    params: { rule_id }
  })
}
