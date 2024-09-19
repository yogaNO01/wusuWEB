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
import { Button, Drawer, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { getShopList } from '@/services/ant-design-pro/api';
import moment from 'moment';

const TableList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const actionRef = useRef<ActionType>();

  const columns = [
    {
      title: '序号',
      search: false,
      render: (_: any, record: any, index: number) => {
        return index+1;
      },
    },
    {
      title: '门店编号',
      dataIndex: 'shopno',
      hideInSearch: true,
    },
    {
      title: '市',
      dataIndex: 'cityname',
      hideInSearch: false,
      hideInTable: true
    },
    {
      title: '区',
      dataIndex: 'addr1',
      hideInSearch: false,
      hideInTable: true
    },
    {
      title: '所属区域',
      hideInSearch: true,
      render: (_: any, record: any) => `${record.cityname}-${record.addr1}`,
    },
    {
      title: '门店名称',
      dataIndex: 'shopname',
      hideInSearch: false,
    },
    {
      title: '经度',
      dataIndex: 'lng',
      hideInSearch: true
    },
    {
      title: '维度',
      dataIndex: 'lat',
      hideInSearch: true
    },
    {
      title: '详细地址',
      dataIndex: 'addrdetail',
      hideInSearch: true
    }
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
      <Modal title="门店数据导入" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      </Modal>
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
              setIsModalOpen(true)
            }}
          >
            <PlusOutlined />导入
          </Button>,
        ]}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
