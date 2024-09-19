import { getActivityList,getActiveDetail } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Image } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { FormModal } from '../../components/Form/index';

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [modelType, setModelType] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState({});
  const [tableData, setTableData] = useState([]);
  const [activeId, setActiveId] = useState(0);

  const columns = [
    {
      title: '序号',
      search: false,
      render: (_: any, record: any, index: number) => {
        return index+1;
      },
    },
    {
      title: '活动缩略图',
      dataIndex: 'icon',
      search: false,
      render: (_: any, record: any) => {
        return <Image src={record.icon} alt="活动缩略图" width={100} />;
      },
    },
    {
      title: '活动种类',
      dataIndex: 'bottle',
      width: 150,
      search: true,
      valueType: 'select',
      valueEnum: {
        '瓶': {
          text: '瓶',
          status: 'Default',
        },
        '罐': {
          text: '罐',
          status: 'Default',
        },
      },
      render: (_: any, record: any) => {
        switch (record.bottle) {
          case 1:
            return '瓶';
          case 2:
            return '罐';
        }
      },
    },
    // {
    //   title: '活动内容(富文本)',
    //   dataIndex: 'content',
    //   search: false
    // },
    {
      title: '活动内容(纯文本)',
      dataIndex: 'contenttext',
      search: false,
      width: 200,
    },
    {
      title: '开始时间',
      dataIndex: 'begintime',
      search: false,
      width: 200,
      render: (_: any, record: any) => {
        return moment(record.begintime * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '结束时间',
      dataIndex: 'endtime',
      search: false,
      width: 200,
      render: (_: any, record: any) => {
        return moment(record.endtime * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_: any, record: any) => [
        <a
          key="edit"
          onClick={() => {
            handleModalOpen(true);
            setModelType('修改活动');
            setCurrentRow({ ...record });
          }}
        >
          修改
        </a>,
        <a
          key="detail"
          onClick={() => {
            showDetail(record.id)
          }}
        >
          查看活动参与情况
        </a>
      ],
    },
  ];

  function showDetail(params: any) {
    handleModalOpen(true);
    setModelType('参与情况');
    setCurrentRow(params);
  }

  function change(params: any) {
    console.log('params', params);
    switch (params?.bottle) {
      case '瓶':
        return 1;
      case '罐':
        return 2;
      default:
        return 0;
    }
  }
  const getTableData = async(params={}) => {
    const response = await getActivityList({ ...params, bottle: change(params) || 0 });
    setTableData(response?.activitys)
  }
  return (
    <PageContainer>
      <FormModal
        title={modelType}
        visible={createModalOpen}
        row={currentRow}
        closeDialog={() => {
          handleModalOpen(false);
          getTableData()
        }}
      ></FormModal>
      <ProTable
        rowKey="id"
        search={{
          labelWidth: 'auto'
        }}
        dataSource={tableData}
        request={async (params) => {
          await getTableData(params)
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
              setCurrentRow({})
              setModelType('新增活动');
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
