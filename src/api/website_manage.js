import request from '@/utils/request'

export function fetchWebsiteList(query) {
  return request({
    url: '/api/v1/website/website_list',
    method: 'get',
    params: query
  })
}

export function websiteCreate(data) {
  return request({
    url: '/api/v1/website/website_create',
    method: 'post',
    data
  })
}

export function websiteDelete(website_name) {
  return request({
    url: '/api/v1/website/website_delete',
    method: 'delete',
    params: { website_name }
  })
}

