// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

// 乌苏登录接口
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/administrator/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


// 乌苏登录接口
export async function getActivityList(params?: { [key: string]: any }) {
  console.log('options',params);
  return request<API.Activity>('/api/activity', {
    method: 'Get',
    params,
    ...(params || {}),
  });
}
