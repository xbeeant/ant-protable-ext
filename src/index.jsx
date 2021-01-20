import React, { useEffect, useRef, useState } from "react";
import ProTable from "@ant-design/pro-table";
import { Button } from "antd";

const rootKey = undefined;
const Protable = (props) => {
  const {
    columns,
    loading,
    data,
    fetch,
    type,
    reload,
    rowKey,
    rootId,
    ...rest
  } = props;

  if (type === "form") {
    return (
      <ProTable
        {...props}
        form={{
          layout: "horizontal",
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 20,
          },
          ...props.form,
        }}
      />
    );
  }

  const [sorter, setSorter] = useState("");
  const [page, setPage] = useState({ current: 1 });
  const [filter, setFilter] = useState({});
  const actionRef = useRef();
  const [size, setSize] = useState("small");
  const [timestamp, setTimestamp] = useState(0);

  useEffect(() => {
    if (rootId === rootKey) {
      setPage({ ...page, current: 1 });
    } else {
      if (fetch) {
        fetch(page, sorter, filter);
      }
    }
  }, [page, sorter, filter, reload, timestamp]);

  const reloadTable = () => {
    setTimestamp(parseInt(`${new Date().getTime() / 1000}`, 10));
  };
  let pagination = {};
  if (props.pagination !== undefined) {
    pagination = props.pagination;
  } else {
    pagination = {
      current: page.current,
      total: data.pagination.total,
      defaultCurrent: page.current,
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 10,
    };
  }
  return (
    <ProTable
      actionRef={actionRef}
      onChange={(_page, _filter, _sorter, _extra) => {
        setPage({ current: _page.current, pageSize: _page.pageSize });
        actionRef.current = _page.current;
        const sorterResult = _sorter;
        if (sorterResult.field) {
          if (sorterResult.order) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          } else {
            setSorter(`${sorterResult.field}`);
          }
        }
        setFilter({ ...filter, ..._filter });
      }}
      tableAlertRender={false}
      columns={columns}
      size={size}
      bordered
      onSizeChange={(val) => setSize(val)}
      search={{
        labelWidth: "auto",
        optionRender: ({ searchText, resetText }, { form: _form }) => (
          <>
            <Button
              type="primary"
              onClick={() => {
                actionRef.current = 1;
                setPage({ ...page, current: 1 });
                setFilter(_form.getFieldsValue());
              }}
            >
              {searchText}
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                _form.resetFields();
                setFilter({});
              }}
            >
              {resetText}
            </Button>
          </>
        ),
      }}
      form={{
        labelCol: { span: 10 },
      }}
      options={{
        fullScreen: true,
        setting: true,
        density: false,
        reload: () => {
          reloadTable();
        },
      }}
      rowKey={rowKey}
      {...rest}
      loading={loading}
      dataSource={data.list}
      pagination={pagination}
    />
  );
};

export default Protable;
