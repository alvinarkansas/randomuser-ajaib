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
      render: (name) => <p>{`${name.first} ${name.last}`}</p>,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Registered Date",
      dataIndex: ["registered", "date"],
      key: "date",
      render: (date) => <p>{dayjs(date).format("DD-MM-YYYY HH:mm")}</p>,
    },
  ]);

  const loadUsers = async () => {
    const { data } = await axios.get("https://randomuser.me/api", {
      params: {
        page: 1,
        pageSize: 10,
        results: 35,
      },
    });
    setUsers(data.results);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
        <div>
          <p style={{ marginBottom: 0 }}>Search</p>
          <Input.Search />
        </div>
      </div>
      <Table columns={columns} dataSource={users} />
    </div>
  );
}

export default App;
