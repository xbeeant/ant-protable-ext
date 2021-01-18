# @xstudio/pro-table
`@xstudio/pro-table` 是官方 `@ant/pro-table`的简易封装，保留原有的所有特性

# 安装
```
npm install @xstudio/pro-table
```

# 使用示例


```
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@xstudio/pro-table';
import { connect } from 'dva';
import { PlusOutlined } from '@ant-design/icons';
import { message, Divider, Popconfirm } from 'antd';
import ManageForm from './components/ManageForm';
import { add, update } from './service';
import { width } from '@/utils/styles';

const { action: actionWidth, divider } = width;

const handleManage = async fields => {
    // 主键存在 更新
    if (fields.id) {
        const hide = message.loading('正在更新');
        try {
            await update({ ...fields });
            hide();
            message.success('更新成功');
            return true;
        } catch (error) {
            hide();
            message.error('更新失败请重试！');
            return false;
        }
    } else {
        const hide = message.loading('正在添加');
        try {
            await add({ ...fields });
            hide();
            message.success('添加成功');
            return true;
        } catch (error) {
            hide();
            message.error('添加失败请重试！');
            return false;
        }
    }
};

const StatisUserScore = props => {
  const {
    statisUserScore: { data },
    dispatch,
    loading,
  } = props;

  const [manageFormValues, setManageFormValues] = useState({});
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const deleteRecord = record => {
    dispatch({
      type: 'user/remove',
      payload: {
        taskId: record.taskId,
      },
      callback: response => {
        if (response.success) {
          setFilter({});
        }
      },
    });
  };

  const columns = [
    {
      title: '操作',
      width: actionWidth * 2 + divider * 2,
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setManageFormValues(record);
            setUpdateModalVisible(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm title="确认删除吗?" key="del" onConfirm={() => deleteRecord(record)}>
          <a href="#">删除</a>
        </Popconfirm>,
      ],
    },
    {
      title: '主键',
      dataIndex: 'id',
      hideInForm: false,
    },
    {
      title: '得分',
      dataIndex: 'score',
      hideInForm: false,
    },
    {
      title: '',
      dataIndex: 'createAt',
      hideInForm: false,
    },
    {
      title: '',
      dataIndex: 'updateAt',
      hideInForm: false,
    },
    {
      title: '用户ID',
      dataIndex: 'createBy',
      hideInForm: false,
    },
    {
      title: '用户ID',
      dataIndex: 'updateBy',
      hideInForm: false,
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        rowKey="id"
        loading={loading}
        data={data}
        columns={columns}
        fetch={(page, sorter, filter) => {
          dispatch({
            type: 'statisUserScore/fetch',
            payload: {
              currentPage: page.current,
              pageSize: page.pageSize,
              ...filter,
              ...sorter,
            },
            callback: res => {
              if (!res.success) {
                message.error('该用户没有浏览权限');
              }
            },
          });
        }
        toolBarRender={() => [
          <Button type="primary" onClick={() => setAddModalVisible(true)}>
            <PlusOutlined />
            新建
          </Button>,
        ]}
      />
      {addModalVisible && (
        <ManageForm onCancel={() => setAddModalVisible(false)} modalVisible={addModalVisible}>
          <ProTable
            onSubmit={async value => {
              const success = await handleManage(value);
              if (success) {
                setAddModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            rowKey="id"
            type="form"
            columns={columns}
          />
        </ManageForm>
      )}
      {updateModalVisible && (
        <ManageForm
          update
          onCancel={() => setUpdateModalVisible(false)}
          modalVisible={updateModalVisible}
        >
          <ProTable
            onSubmit={async value => {
              const success = await handleManage(value);
              if (success) {
                setUpdateModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            form={{
              initialValues: manageFormValues,
              labelCol: { span: 10 },
            }}
            rowKey="id"
            type="form"
            columns={columns}
          />
        </ManageForm>
      )}
    </PageHeaderWrapper>
  );
};

export default connect(({ statisUserScore, loading }) => ({
  statisUserScore,
  submitting: loading.effects['statisUserScore/fetch'],
}))(StatisUserScore);

```

ManageForm.js 示例
```
import React from 'react';
import { Modal } from 'antd';

const CreateForm = props => {
  const { modalVisible, onCancel, update } = props;
  return (
    <Modal
      destroyOnClose
      title={update ? '更新' : '新增'}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
```
