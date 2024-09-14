/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import { history as router } from 'umi';
import _ from 'lodash';
import { delCookie } from '../utils/tokenStorage'
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '不被允许的请求方式',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  console.log(error, 'umiRequestError')

  const { response } = error;

  // 无权限跳转到登录页面
  if (response.status === 401 || response.status === 403) {
    router.push('/user/login');
    localStorage.clear()
    delCookie()
    return response;
  }
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.warning({
      message: `请求错误 ${status} `,
      description: `${errorText}
      ${url} `,
      placement: 'bottomRight',
    });
  } else if (!response) {
    notification.warning({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
      placement: 'bottomRight',
    });
  }
  return response;
};

// /**
//  * 配置request请求时的默认参数
//  */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie\
  timeout: 50000, //配置接口超时
});
request.interceptors.response.use(async (response, options) => {
  // console.log(response.url, '请求url');
  if (response.url.includes('logout')) {
    return response
  }
  const data = await response.clone().json();
  // console.log(data, 'responseData');

  if (data.status === 200) {
    return response
  }
  if (data.status === 401) {
    localStorage.clear()
    delCookie()
    router.replace({
      pathname: '/user/login',
    });
  }
  let info = data?.data
  // console.log(Reflect.has(data, 'data') && Reflect.has(info, 'code') && info?.code !== 0, '接口返回的code判断是否抛出异常还是正常显示');

  if (Reflect.has(data, 'data') && Reflect.has(info, 'code') && info?.code !== 0) {
    // 界面报错处理
    message.error(`${info?.msg}`);
    return info;
  } else {
    return response;
  }
});
export default request;
