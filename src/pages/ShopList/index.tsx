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
import { getShopList } from '@/services/ant-design-pro/api';
import moment from 'moment';

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [modelType, setModelType] = useState<string>('add');
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState();

  const columns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   search: false
    // },
    {
      title: '门店编号',
      dataIndex: 'shopno',
      search: false,
    },
    {
      title: '经度',
      dataIndex: 'lng',
      search: false,
    },
    {
      title: '维度',
      dataIndex: 'lat',
      search: false,
    },
    {
      title: '门店地址',
      dataIndex: 'addr2',
      search: false,
    },
    {
      title: '区',
      dataIndex: 'addr1',
      search: false,
    },
    {
      title: '市',
      dataIndex: 'cityname',
      search: false,
    },
    {
      title: '门店名称',
      dataIndex: 'shopname',
      search: false,
    },
    {
      title: '详细地址',
      dataIndex: 'addrdetail',
      search: false,
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
      <ProTable
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={async (params) => {
          const response = await getShopList({ ...params})
          return {
            data: response?.shops,
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
