import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Drawer, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import { getActivityList, outLogin } from '@/services/ant-design-pro/api';
import {FormModal} from '../../components/Form/index'
import moment from 'moment';

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [modelType, setModelType] = useState<string>('add');
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false
    },
    {
      title: '活动缩略图',
      dataIndex: 'icon',
      search: false,
      render: (_: any, record: any) => {
        return <img src={record.icon} alt="" width={100}/>
      },
    },
    {
      title: '活动种类',
      dataIndex: 'bottle',
      width: 150,
      search: true,
      render: (_: any, record: any) => {
        switch (record.bottle) {
          case 1:
            return '瓶'
          case 2:
            return '罐'
        }
      },
    },
    {
      title: '活动内容(富文本)',
      dataIndex: 'content',
      search: false
    },
    {
      title: '活动内容(纯文本)',
      dataIndex: 'contenttext',
      search: false,
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'begintime',
      search: false,
      width: 100,
      render: (_: any, record: any) => {
        return moment(record.begintime*1000).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: '提交时间',
      dataIndex: 'endtime',
      search: false,
      width: 100,
      render: (_: any, record: any) => {
        return moment(record.endtime*1000).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width:200,
      render: (_: any, record: any) => [
        <a
          key="edit"
          onClick={() => {
            handleModalOpen(true);
            setModelType('edit')
            setCurrentRow(record);
          }}
        >
          修改
        </a>
      ],
    },
  ];

  function change(params: any) {
    console.log('params',params);
    switch (params?.bottle) {
      case '瓶':
        return 1;
      case '罐':
        return 2;
      default:
        return 0;
    }
  }
  
  return (
    <PageContainer>
      <FormModal
        title={modelType == 'add' ? '新增活动' : '修改活动'}
        visible={createModalOpen}
        row={currentRow}
        closeDialog={() => handleModalOpen(false)}
        ></FormModal>
      <ProTable
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={async (params) => {
          const response = await getActivityList({ ...params, bottle: change(params) || 0})
          return {
            data: response?.activitys,
            success: true,
          }
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
