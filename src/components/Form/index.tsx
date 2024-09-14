import { ProForm, ProFormRadio, ProFormText, ProFormDigit,ProFormDateTimeRangePicker, ProFormUploadDragger, ProFormSelect } from '@ant-design/pro-components';
import { Col, Row, Space, message, Modal, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { addActivity, editActivity } from '@/services/ant-design-pro/api';
const moment = require('moment');
type LayoutType = Parameters<typeof ProForm>[0]['layout'];
const LAYOUT_TYPE_HORIZONTAL = 'horizontal';

export function PriceInput() {
  return (
    <Space size={0} style={{display: 'flex',alignItems: 'flex-start',height: 'auto'}}>
      <Form.Item noStyle name={['price', 'number']}>
        <ProFormDigit min={1} style={{ width: 100 }} rules={[{ required: true, message: '这是必填项' }]}/>
      </Form.Item>
      <Form.Item noStyle name={['bottle', 'number']}>
        <Select style={{ width: 80, marginLeft: 3 }} rules={[{ required: true, message: '这是必填项' }]}>
          <Select.Option value="1">瓶</Select.Option>
          <Select.Option value="2">罐</Select.Option>
        </Select>
      </Form.Item>
    </Space>
  );
}

export const FormModal: React.FC = (props: any) => {
  let { visible, closeDialog,title,row } = props
  const [formLayoutType, setFormLayoutType] = useState<LayoutType>(
    LAYOUT_TYPE_HORIZONTAL,
  );
  async function submit(values: any) {
      try {
        let params = {
          displayorder: 0,
          begintime: moment(values.datetimeRange[0]).valueOf()/1000,
          endtime: moment(values.datetimeRange[1]).valueOf()/1000,
          bottle: values.bottle.number,
          content: values.content,
          contenttext: values.contenttext,
          icon: values.dragger[0]['originFileObj'],
          buyn: values.buyn,
          given: values.given
        }
        let {flag} = await addActivity(params)
        flag ? message.success('提交成功') : message.error('提交失败 请重试')
        closeDialog()
      } catch (error) {
        message.error('提交失败 请重试');
      }
  }

  const formItemLayout = {labelCol: { span: 6 }}
  return (
    <Modal
      title={title}
      open={visible}
      footer={null}
      maskClosable={false}
      onOk={closeDialog}
      onCancel={closeDialog}
    >
      <ProForm
        initialValues={row}
        {...formItemLayout}
        layout={formLayoutType}
        autoFocusFirstInput
        submitter={{
          render: (props, doms) => {
            return (
              <Row>
                <Col span={12} offset={7}>
                  <Space>{doms}</Space>
                </Col>
              </Row>
            )
          },
        }}
        onFinish={async (values: any) => {
          await submit(values)
        }}
      >

        <ProForm.Item label="活动数量&种类">
          <PriceInput></PriceInput>
        </ProForm.Item>
        <ProFormDateTimeRangePicker
          name="datetimeRange"
          label="活动时间"
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProFormText width="md" name="contenttext" label="文本" placeholder="请输入文本" rules={[{ required: true, message: '这是必填项' }]}/>
        <ProFormText width="md" name="content" label="富文本" placeholder="请输入文本" rules={[{ required: true, message: '这是必填项' }]}/>
        <ProFormUploadDragger max={1} label="活动缩略图" name="dragger" rules={[{ required: true, message: '这是必填项' }]}/>
        <ProFormDigit name="buyn" label="购买数量" min={1} style={{ width: 100 }} placeholder="请输入购买数量" rules={[{ required: true, message: '这是必填项' }]}/>
        <ProFormDigit name="given" label="赠送数量"  min={1} style={{ width: 100 }} placeholder="请输入赠送数量" rules={[{ required: true, message: '这是必填项' }]}/>
      </ProForm>
    </Modal>
  );
};