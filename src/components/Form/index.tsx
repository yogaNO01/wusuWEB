import { addActivity, editActivity, getActiveDetail } from '@/services/ant-design-pro/api';
import type { ActionType } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
  ProTable
} from '@ant-design/pro-components';
import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { Col, Form, message, Modal, Row, Space, Button } from 'antd';
import ReactQuill from 'react-quill';
const moment = require('moment');
export const FormModal: React.FC = (props: any) => {
  let { visible, closeDialog, title, row } = props;
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  let icon: any = [{
    uid: '-1',
    name: 'image1.png',
    status: 'done',
    thumbUrl: row.icon,
  }]
  const [fileList, setFileList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [qillValue, setQillValue] = useState('');
  const [type, setType] = useState('Modal');
  const formItemInit = () => {
    if (title === '修改活动') {
      setQillValue(row?.content)
      setFileList([...icon])
      form.setFieldsValue({ ...row, datetimeRange: [row.begintime * 1000, row.endtime * 1000] });
    } else if (title === '新增活动') {
      form.resetFields()
      setQillValue('')
    }
  }
  useEffect(() => {
    setType('Modal')
    if (row?.icon) {
      setFileList([...icon])
    }
    if (title === '修改活动') {
      setQillValue(row?.content)
      form.setFieldsValue({ ...row, datetimeRange: [row.begintime * 1000, row.endtime * 1000] });
    } else if (title === '新增活动') {
      formItemInit()
      setQillValue('')
    } else if (title != '') {
      console.log('弹窗初始化', title);
      setType('table')
      requestTableData({})
    }
  }, [visible, row])



  async function submit(values: any) {
    try {
      let { datetimeRange, bottle, content, contenttext, icon, buyn, given } = values;
      let params = {
        displayorder: 0,
        begintime: moment(datetimeRange[0]).valueOf() / 1000,
        endtime: moment(datetimeRange[1]).valueOf() / 1000,
        bottle: bottle,
        content: content,
        contenttext: contenttext,
        icon: icon[0]['originFileObj'],
        buyn: buyn,
        given: given
      };
      let flag;
      if (title === '修改活动') {
        flag = await editActivity({ ...params, id: row.id })
      } else {
        flag = await addActivity(params)
      }
      if (!flag) {
        message.error('提交失败 请重试');
        return
      }
      message.success('提交成功');
      closeDialog();
      formItemInit();
    } catch (error) {
      console.log('提交失败 请重试', error);
      message.error('提交失败 请重试');
    }
  }

  function onRemove(e: any) {
    console.log('删除了', e);
  }

  function onChange(e: any) {
    console.log('更新了', e);
    setFileList(e.fileList)
  }

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      ['bold', 'italic'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean'], // 清除格式按钮
    ],
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
  };

  const formats = ['header', 'font', 'size', 'bold', 'italic', 'color', 'background', 'align'];

  function handleChange(params: any) {
    setQillValue(params)
    console.log('修改后的富文本内容', params);
  }

  const columns = [
    {
      title: '序号',
      search: false,
      width: 100,
      render: (_: any, record: any, index: number) => {
        return index + 1
      },
    },
    {
      title: '门店名称',
      dataIndex: 'shopname',
      width: 150,
      search: true,
    },
    {
      title: '参与人openid',
      dataIndex: 'unionid',
      width: 200,
      search: false,
    },
    {
      title: '参与时间',
      dataIndex: 'dateRange',
      width: 200,
      hideInTable: true,
      valueType: 'dateRange',
      search: {
        transform: (value: any) => ({
          begintime: dayjs(value[0]).valueOf()/1000,
          endtime: dayjs(value[1]).valueOf()/1000
        }),
      },
    },
    {
      title: '参与时间',
      dataIndex: 'time',
      valueType: 'dateTime',
      width: 150,
      search: true,
      hideInSearch: true,
      render: (_: any, record: any) => {
        return dayjs(record.time * 1000).format('YYYY-MM-DD HH:mm:ss')
      },
    },
  ];

  async function requestTableData(params: any) {
    let res = await getActiveDetail({ ...params, activityid: row, page: params.current || 1 });
    console.log('====================================');
    console.log('activitys', res);
    console.log('====================================');
    setTableData(res.activitys)
  }

  return (
    <Modal width={'50vw'} height={'500px'} title={title} open={visible} footer={null} maskClosable={false} onCancel={closeDialog}>
      {type == "Modal" ? <ProForm
        form={form}
        layout={{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }}
        autoFocusFirstInput={false}
        submitter={{
          render: (props, doms) => {
            console.log('{props}', props);
            return (
              <Row justify="center">
                <Col span={6}>
                  <Space onClick={formItemInit}>{doms[0]}</Space>
                </Col>
                <Col span={6}>
                  <Space>{doms[1]}</Space>
                </Col>
              </Row>
            );
          },
        }}
        onFinish={async (values: any) => {
          console.log('onFinish', values);
          await submit(values);
        }}
      >
        <ProFormDateTimeRangePicker
          name="datetimeRange"
          // initialValue={[dayjs(row.begintime * 1000).format('YYYY-MM-DD HH:mm:ss'), dayjs(row.endtime * 1000).format('YYYY-MM-DD HH:mm:ss')]}
          label="活动时间"
          size="sm"
          rules={[{ required: true, message: '请输入活动时间' }]}
        />
        <ProFormText
          width="md"
          name="contenttext"
          label="文本"
          placeholder="请输入活动内容"
          rules={[{ required: true, message: '活动内容未填写' }]}
        />
        <Form.Item
          name="content"
          label="富文本"
          valuePropName="checked"
          rules={[{ required: true, message: '富文本未填写' }]}
        >
          <ReactQuill style={{ display: 'inline-block' }} modules={modules} formats={formats} value={qillValue} onChange={handleChange} />
        </Form.Item>
        <ProFormUploadButton
          max={1}
          label="缩略图"
          name="icon"
          fileList={fileList}
          onRemove={onRemove}
          onChange={onChange}
          rules={[{ required: true, message: '缩略图未上传' }]}
        />
        <ProFormDigit
          name="buyn"
          label="购买数量"
          min={1}
          style={{ width: 100 }}
          placeholder="请输入购买数量"
          rules={[{ required: true, message: '未设置购买数量' }]}
        />
        <ProFormDigit
          name="given"
          label="赠送数量"
          min={1}
          style={{ width: 100 }}
          placeholder="请输入赠送数量"
          rules={[{ required: true, message: '未设置赠送数量' }]}
        />
        <ProFormSelect
          name="bottle"
          label="活动类型"
          request={async () => [
            { label: '瓶', value: 1 },
            { label: '罐', value: 2 },
          ]}
          placeholder="请选择活动类型"
          rules={[{ required: true, message: '请选择活动类型!' }]}
        />
      </ProForm> :
        <ProTable
          actionRef={actionRef}
          rowKey="key"
          search={{
            labelWidth: 'auto',
          }}
          request={async (params) => {
            await requestTableData(params)
          }}
          dataSource={tableData}
          columns={columns}
        />
      }
    </Modal>
  );
};
