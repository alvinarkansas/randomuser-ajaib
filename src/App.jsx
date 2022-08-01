import { useEffect, useState } from "react";
import { Table, Input, Select, Row, Col, Button, Form } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import "antd/dist/antd.css";
import "./App.css";

function App() {
  const [form] = Form.useForm();
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
    gender: null,
    sortBy: null,
    sortOrder: null,
  });
  const [loading, setLoading] = useState(false);

  const loadUsers = async ({
    page,
    pageSize,
    results,
    keyword,
    gender,
    sortBy,
    sortOrder,
  }) => {
    const apiParams = { page, pageSize, results };
    if (keyword) apiParams.keyword = keyword;
    if (gender) apiParams.gender = gender;
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
      gender,
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

  const onGenderChange = (value) => {
    loadUsers({
      ...params,
      page: 1,
      sortBy: null,
      sortOrder: null,
      gender: value,
    });
  };

  const resetFilter = () => {
    form.resetFields();
    loadUsers({
      ...params,
      page: 1,
      sortBy: null,
      sortOrder: null,
      keyword: null,
      gender: null,
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
      <Form form={form} layout="vertical">
        <Row gutter={16} align="bottom" style={{ marginBottom: 40 }}>
          <Col span={6}>
            <Form.Item label="Search" name="keyword">
              <Input.Search
                placeholder="Search here"
                enterButton
                onSearch={onSearch}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Gender" name="gender">
              <Select
                placeholder="Select gender"
                defaultValue=""
                onChange={onGenderChange}
                style={{ width: "100%" }}
              >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="male">Male</Select.Option>
                <Select.Option value="female">Female</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item>
              <Button htmlType="button" onClick={resetFilter}>
                Reset Filter
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
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
