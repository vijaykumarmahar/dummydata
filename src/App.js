import React, { useState } from 'react';
import { Select, Input, Button, Table, Tag, Popover } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './App.css';

const { Option } = Select;

function App() {
  const [filter, setFilter] = useState([]);
  const [currentFilter, setCurrentFilter] = useState({ field: '', operator: '', value: '' });

  const handleFilterChange = (value) => {
    setFilter(value.map(v => {
      const [field, operator, value] = v.split(':');
      return { field, operator, value };
    }));
  };

  const addFilter = () => {
    if (currentFilter.field && currentFilter.operator && currentFilter.value) {
      setFilter([...filter, currentFilter]);
      setCurrentFilter({ field: '', operator: '', value: '' });
    }
  };

  const removeFilter = (filterToRemove) => {
    setFilter(filter.filter(f => f !== filterToRemove));
  };

  const data = [
    { name: 'Grace Harris', age: 29, date: '2023-09-01', status: 'Active' },
    { name: 'Henry Irving', age: 31, date: '2023-10-01', status: 'Inactive' },
    { name: 'Emma Thompson', age: 35, date: '2023-08-15', status: 'Active' },
    { name: 'Michael Chen', age: 27, date: '2023-11-05', status: 'Active' },
    { name: 'Sophia Rodriguez', age: 33, date: '2023-07-20', status: 'Inactive' },
    { name: 'Liam OConnor', age: 30, date: '2023-12-10', status: 'Active' },
    { name: 'Olivia Kim', age: 28, date: '2023-06-30', status: 'Active' },
    { name: 'Noah Patel', age: 32, date: '2023-09-25', status: 'Inactive' },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const filteredData = data.filter(item => {
    return filter.every(f => {
      switch (f.operator) {
        case 'equals':
          return item[f.field] === f.value;
        case 'contains':
          return item[f.field].toString().toLowerCase().includes(f.value.toLowerCase());
        case 'greaterThan':
          return item[f.field] > f.value;
        case 'lessThan':
          return item[f.field] < f.value;
        default:
          return true;
      }
    });
  });

  const filterOptions = [
    { field: 'name', operator: 'contains', label: 'Name contains' },
    { field: 'age', operator: 'equals', label: 'Age equals' },
    { field: 'age', operator: 'greaterThan', label: 'Age greater than' },
    { field: 'age', operator: 'lessThan', label: 'Age less than' },
    { field: 'date', operator: 'equals', label: 'Date equals' },
    { field: 'status', operator: 'equals', label: 'Status equals' },
  ];

  const filterContent = (
    <div>
      <Select
        style={{ width: '100%', marginBottom: '8px' }}
        placeholder="Select a filter"
        onChange={(value) => {
          const option = filterOptions.find(o => `${o.field}:${o.operator}` === value);
          if (option) {
            setCurrentFilter({ field: option.field, operator: option.operator, value: '' });
          }
        }}
      >
        {filterOptions.map((option, index) => (
          <Option key={index} value={`${option.field}:${option.operator}`}>
            {option.label}
          </Option>
        ))}
      </Select>
      {currentFilter.field && currentFilter.operator && (
        <Input
          placeholder="Enter value"
          value={currentFilter.value}
          onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })}
          style={{ marginBottom: '8px' }}
        />
      )}
      <Button type="primary" onClick={addFilter} disabled={!currentFilter.field || !currentFilter.operator || !currentFilter.value}>
        Add Filter
      </Button>
    </div>
  );

  return (
    <div className="App">
      <h1>Search Functionality</h1>
      <div className="filter-container">
        <Popover
          content={filterContent}
          title="Add Filter"
          trigger="click"
          placement="bottomLeft"
        >
          <Button icon={<FilterOutlined />} style={{ marginRight: '8px' }} />
        </Popover>
        <Select
          mode="multiple"
          style={{ width: 'calc(100% - 40px)' }}
          placeholder="Search issues..."
          value={filter.map(f => `${f.field}:${f.operator}:${f.value}`)}
          onChange={handleFilterChange}
          tagRender={({ label, closable, onClose }) => {
            const [field, operator, value] = label.split(':');
            return (
              <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                {field} {operator} {value}
              </Tag>
            );
          }}
          open={false}
          suffixIcon={null}
        >
          {filter.map((f, index) => (
            <Option key={index} value={`${f.field}:${f.operator}:${f.value}`}>
              {`${f.field} ${f.operator} ${f.value}`}
            </Option>
          ))}
        </Select>
      </div>
      <Table columns={columns} dataSource={filteredData} rowKey="name" />
    </div>
  );
}

export default App;