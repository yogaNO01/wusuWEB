// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

// 乌苏退登接口
export async function outLogin(options?: { [key: string]: any }) {
  return request('/api/administrator/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

// 乌苏登录接口
export async function login(body: any, options?: { [key: string]: any }) {
  return request('/api/administrator/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


// 乌苏查看活动列表接口
export async function getActivityList(params?: { [key: string]: any }) {
  return request<API.Activity>('/api/activity', {
    method: 'GET',
    params,
    ...(params || {}),
  });
}

// 乌苏添加活动列表接口
export async function addActivity(params: any) {
  const formData = new FormData();
  _(params).forEach((value, key: any) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/activity`, {
    method: 'POST',
    data: formData,
  });
}

// 乌苏修改活动列表接口
export async function editActivity(params: any) {
  const formData = new FormData();
  _(params).forEach((value, key: any) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request('/api/activity', {
    method: 'PUT',
    data: formData,
  });
}

// 乌苏修改活动列表接口
export async function getShopList(params: any) {
  return request('/api/activity/getShopList', {
    method: 'GET',
    params,
  });
}

// 乌苏活动参与情况
export async function getActiveDetail(params: any) {
  return request('/api/activity/useractivitys', {
    method: 'GET',
    params,
  });
}

// 乌苏活动参与情况
export async function importAndExport(params: any) {
  const formData = new FormData();
  _(params).forEach((value, key: any) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request('/api/activity/importandexport', {
    method: 'POST',
    params: formData,
  });
}
