import React, { useState } from 'react';
import styled from 'styled-components';

// Mock Data
import { data } from './makeData';

const TableContainer = styled.div`
  width: 100%;
  margin: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add box shadow */
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Add box shadow */
`;

const TableHeader = styled.th`
  background-color: #f2f2f2;
  padding: 12px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }

  &.ascending {
    background-color: #d4eaff;
  }

  &.descending {
    background-color: #ffdbd4;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-radius: 4px;
`;

const TableRow = styled.tr`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const CheckboxCell = styled.td`
  padding: 12px;
`;

const ToggleCell = styled.td`
  padding: 12px;
  cursor: pointer;
`;

const ToggleIcon = styled.span`
  display: inline-block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0.5em 0.5em 0 0.5em;
  border-color: #555 transparent transparent transparent;
  transform: ${({ open }) => (open ? 'rotate(-135deg)' : 'rotate(45deg)')};
`;

const SalaryCell = styled(TableCell)`
  position: relative;

  span {
    background-color: ${({ salary }) =>
        salary < 50000
            ? 'blue'
            : salary >= 50000 && salary < 75000
                ? 'yellow'
                : 'red'};
    color: #fff;
    border-radius: 4px;
    padding: 3px 6px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const FilterInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Example = () => {
    const [tableData, setTableData] = useState(data);
    const [openRows, setOpenRows] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [filters, setFilters] = useState({ name: '', email: '', salary: '' });

    const handleSort = (key) => {
        let direction = 'ascending';

        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        setSortConfig({ key, direction });
        applySort(key, direction);
    };

    const applySort = (key, direction) => {
        const sortedData = [...tableData].sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];

            if (direction === 'ascending') {
                return aValue.localeCompare ? aValue.localeCompare(bValue) : aValue - bValue;
            } else {
                return bValue.localeCompare ? bValue.localeCompare(aValue) : bValue - aValue;
            }
        });

        setTableData(sortedData);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
    };

    const applyFilters = () => {
        const filteredData = data.filter((row) => {
            const nameMatch = row.name.toLowerCase().includes(filters.name.toLowerCase());
            const emailMatch = row.email.toLowerCase().includes(filters.email.toLowerCase());
            const salaryMatch = row.salary.toLocaleString().includes(filters.salary);

            return nameMatch && emailMatch && salaryMatch;
        });

        setTableData(filteredData);
    };

    const handleRowAction = (action, rowData) => {
        alert(`${action} ${rowData.name}`);
    };

    const handleCheckboxChange = (rowId) => {
        // Implement your checkbox logic here
        // Update the selected rows in the state
    };

    const handleToggleRow = (rowId) => {
        setOpenRows((prevOpenRows) =>
            prevOpenRows.includes(rowId)
                ? prevOpenRows.filter((id) => id !== rowId)
                : [...prevOpenRows, rowId]
        );
    };

    return (
        <TableContainer>
            <Table>
                <thead>
                    <tr>
                        <ToggleCell></ToggleCell>
                        <CheckboxCell>
                            <input type="checkbox" />
                        </CheckboxCell>
                        <TableHeader
                            className={sortConfig.key === 'name' ? sortConfig.direction : ''}
                            onClick={() => handleSort('name')}
                        >
                            Name {renderSortIndicator('name', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'email' ? sortConfig.direction : ''}
                            onClick={() => handleSort('email')}
                        >
                            Email {renderSortIndicator('email', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'salary' ? sortConfig.direction : ''}
                            onClick={() => handleSort('salary')}
                        >
                            Salary {renderSortIndicator('salary', sortConfig)}
                        </TableHeader>
                        <TableHeader></TableHeader>
                    </tr>
                    <tr>
                        <ToggleCell></ToggleCell>
                        <CheckboxCell></CheckboxCell>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Name"
                                value={filters.name}
                                onChange={(e) => handleFilterChange('name', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Email"
                                value={filters.email}
                                onChange={(e) => handleFilterChange('email', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Salary"
                                value={filters.salary}
                                onChange={(e) => handleFilterChange('salary', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader></TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row) => (
                        <React.Fragment key={row.id}>
                            <TableRow>
                                <ToggleCell onClick={() => handleToggleRow(row.id)}>
                                    <ToggleIcon open={openRows.includes(row.id)} />
                                </ToggleCell>
                                <CheckboxCell>
                                    <input
                                        type="checkbox"
                                        onChange={() => handleCheckboxChange(row.id)}
                                    />
                                </CheckboxCell>
                                <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <SalaryCell salary={row.salary}>
                                    <span>
                                        {row.salary.toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        })}
                                    </span>
                                </SalaryCell>
                                {/* Add more cells based on your columns */}
                                <TableCell>
                                    <button onClick={() => handleRowAction('deactivate', row)}>Deactivate</button>
                                    <button onClick={() => handleRowAction('activate', row)}>Activate</button>
                                    <button onClick={() => handleRowAction('contact', row)}>Contact</button>
                                </TableCell>
                            </TableRow>
                            {openRows.includes(row.id) && (
                                <TableRow>
                                    <TableCell colSpan="6">
                                        {/* Additional row details content goes here */}
                                        <div>
                                            <p>Signature Catch Phrase: {row.signatureCatchPhrase}</p>
                                            {/* Add more details based on your columns */}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
        </TableContainer>
    );
};

const renderSortIndicator = (key, sortConfig) => {
    // Add up and down arrow indicators based on the sortConfig
    return (
        <>
            {key === sortConfig.key && sortConfig.direction === 'ascending' && '↑'}
            {key === sortConfig.key && sortConfig.direction === 'descending' && '↓'}
        </>
    );
};

export default Example;
