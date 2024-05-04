import request from '@/utils/request'

export function fetchDockerImagesList(query) {
  return request({
    url: '/api/v1/docker/images_list',
    method: 'get',
    params: query
  })
}

export function fetchDockerContainerLogs(container_id) {
  return request({
    url: '/api/v1/docker/container_logs',
    method: 'post',
    params: { container_id }
  })
}

export function fetchDockerContainersList(query) {
  return request({
    url: '/api/v1/docker/containers_list',
    method: 'get',
    params: query
  })
}

export function pullDockerImage(data) {
  return request({
    url: '/api/v1/docker/pull_images',
    method: 'post',
    timeout: 500000,
    data
  })
}

export function removeDockerImage(image_id) {
  return request({
    url: '/api/v1/docker/remove_images',
    method: 'post',
    params: { image_id }
  })
}

export function createDockerContainer(data) {
  return request({
    url: '/api/v1/docker/create_container',
    method: 'post',
    timeout: 500000,
    data
  })
}

export function startDockerContainer(container_id) {
  return request({
    url: '/api/v1/docker/start_containers',
    method: 'post',
    params: { container_id }
  })
}

export function stopDockerContainer(container_id) {
  return request({
    url: '/api/v1/docker/stop_containers',
    method: 'post',
    params: { container_id }
  })
}

export function removeDockerContainer(container_id) {
  return request({
    url: '/api/v1/docker/remove_stop_containers',
    method: 'post',
    params: { container_id }
  })
}

export function restartContainer(container_id) {
  return request({
    url: '/api/v1/docker/restart_containers',
    method: 'post',
    params: { container_id }
  })
}
