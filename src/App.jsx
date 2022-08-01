import { useEffect, useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import "antd/dist/antd.css";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [columns] = useState([
    {
      title: "Username",
      dataIndex: ["login", "username"],
      key: "username",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <>{`${name.first} ${name.last}`}</>,
      sorter: () => {},
    },
    { title: "Email", dataIndex: "email", key: "email", sorter: () => {} },
    { title: "Gender", dataIndex: "gender", key: "gender", sorter: () => {} },
    {
      title: "Registered Date",
      dataIndex: ["registered", "date"],
      key: "date",
      render: (date) => <>{dayjs(date).format("DD-MM-YYYY HH:mm")}</>,
      sorter: () => {},
    },
  ]);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    results: 10,
    keyword: null,
    sortBy: null,
    sortOrder: null,
  });
  const [loading, setLoading] = useState(false);

  const loadUsers = async ({
    page,
    pageSize,
    results,
    keyword,
    sortBy,
    sortOrder,
  }) => {
    const apiParams = { page, pageSize, results };
    if (keyword) apiParams.keyword = keyword;
    if (sortBy) apiParams.sortBy = sortBy;
    if (sortOrder) apiParams.sortOrder = sortOrder;

    setLoading(true);

    const { data } = await axios.get("https://randomuser.me/api", {
      params: apiParams,
    });
    setUsers(data.results);
    setParams({
      ...params,
      keyword,
      page: data.info.page,
    });
    setLoading(false);
  };

  const onSearch = (value) => {
    loadUsers({
      ...params,
      page: 1,
      sortBy: null,
      sortOrder: null,
      keyword: value,
    });
  };

  const onTableChange = (pagination, _, sorter) => {
    loadUsers({
      ...params,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.columnKey,
      sortOrder: sorter.order,
    });
  };

  useEffect(() => {
    loadUsers({
      page: params.page,
      pageSize: params.pageSize,
      results: params.results,
    });
  }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
        <div>
          <p style={{ marginBottom: 0 }}>Search</p>
          <Input.Search enterButton onSearch={onSearch} />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          showSizeChanger: false,
          current: params.page,
          pageSize: params.pageSize,
          total: 45,
        }}
        onChange={onTableChange}
      />
    </div>
  );
}

export default App;
