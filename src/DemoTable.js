import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { CSVLink } from 'react-csv';
import Box from '@mui/material/Box';

// Example JSON data
import { data } from './makeData';

const TableContainer = styled.div`
  width: 100%;
  margin: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

const FilterInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ExportButton = styled(CSVLink)`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 10px;
`;

const TableCheckbox = styled.input`
  margin-right: 8px;
`;

const ExpandCollapseButton = styled.span`
  cursor: pointer;
  user-select: none;
`;

const Example = () => {
    const [tableData, setTableData] = useState(data);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [filters, setFilters] = useState({
        full_name: '',
        pdesc: '',
        pskill: '',
        sskill: '',
        pexp: '',
        fexp: '',
        phcharge: '',
        avail_name: '',
        del_name: '',
    });
    const [selectedRows, setSelectedRows] = useState([]);

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
            const nameMatch = row.full_name.toLowerCase().includes(filters.full_name.toLowerCase());
            const descMatch = row.pdesc.toLowerCase().includes(filters.pdesc.toLowerCase());
            const pskillMatch = row.pskill.toLowerCase().includes(filters.pskill.toLowerCase());
            const sskillMatch = row.sskill.toLowerCase().includes(filters.sskill.toLowerCase());
            const pexpMatch = row.pexp.toString().includes(filters.pexp);
            const fexpMatch = row.fexp.toString().includes(filters.fexp);
            const phchargeMatch = row.phcharge.toString().includes(filters.phcharge);
            const availMatch = row.avail_name.toLowerCase().includes(filters.avail_name.toLowerCase());
            const delMatch = row.del_name.toLowerCase().includes(filters.del_name.toLowerCase());

            return (
                nameMatch &&
                descMatch &&
                pskillMatch &&
                sskillMatch &&
                pexpMatch &&
                fexpMatch &&
                phchargeMatch &&
                availMatch &&
                delMatch
            );
        });

        setTableData(filteredData);
    };

    const csvData = tableData.map((row) => ({
        'Full Name': row.full_name,
        'Professional Description': row.pdesc,
        'Primary Skill': row.pskill,
        'Secondary Skill': row.sskill,
        'Professional Experience': row.pexp,
        'Freelancing Experience': row.fexp,
        'Per Hour Charge': row.phcharge,
        'Availability': row.avail_name,
        'Delivery Mode': row.del_name,
    }));

    const handleSelectAll = () => {
        if (selectedRows.length === tableData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(tableData.map((row) => row.id));
        }
    };

    const handleSelectRow = (userSlug) => {
        if (selectedRows.includes(userSlug)) {
            setSelectedRows(selectedRows.filter((slug) => slug !== userSlug));
        } else {
            setSelectedRows([...selectedRows, userSlug]);
        }
    };

    const isRowSelected = (userSlug) => selectedRows.includes(userSlug);

    const handleExpandCollapse = (userSlug) => {
        // You can implement logic to toggle the collapse state for a specific row
    };

    return (
        <TableContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <ExportButton data={csvData} filename={'table_data.csv'}>
                    Export as CSV
                </ExportButton>
            </div>
            <Table>
                <thead>
                    <tr>
                        <TableHeader>
                            <TableCheckbox
                                type="checkbox"
                                checked={selectedRows.length === tableData.length}
                                onChange={handleSelectAll}
                            />
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'full_name' ? sortConfig.direction : ''}
                            onClick={() => handleSort('full_name')}
                        >
                            Full Name {renderSortIndicator('full_name', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'pskill' ? sortConfig.direction : ''}
                            onClick={() => handleSort('pskill')}
                        >
                            Primary Skill {renderSortIndicator('pskill', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'sskill' ? sortConfig.direction : ''}
                            onClick={() => handleSort('sskill')}
                        >
                            Secondary Skill {renderSortIndicator('sskill', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'pexp' ? sortConfig.direction : ''}
                            onClick={() => handleSort('pexp')}
                        >
                            Professional Experience {renderSortIndicator('pexp', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'fexp' ? sortConfig.direction : ''}
                            onClick={() => handleSort('fexp')}
                        >
                            Freelancing Experience {renderSortIndicator('fexp', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'phcharge' ? sortConfig.direction : ''}
                            onClick={() => handleSort('phcharge')}
                        >
                            Per Hour Charge {renderSortIndicator('phcharge', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'avail_name' ? sortConfig.direction : ''}
                            onClick={() => handleSort('avail_name')}
                        >
                            Availability {renderSortIndicator('avail_name', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'del_name' ? sortConfig.direction : ''}
                            onClick={() => handleSort('del_name')}
                        >
                            Delivery Mode {renderSortIndicator('del_name', sortConfig)}
                        </TableHeader>
                    </tr>
                    <tr>
                        <TableHeader>
                            {/* Select All checkbox */}
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Full Name"
                                value={filters.full_name}
                                onChange={(e) => handleFilterChange('full_name', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Primary Skill"
                                value={filters.pskill}
                                onChange={(e) => handleFilterChange('pskill', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Secondary Skill"
                                value={filters.sskill}
                                onChange={(e) => handleFilterChange('sskill', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Professional Experience"
                                value={filters.pexp}
                                onChange={(e) => handleFilterChange('pexp', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Freelancing Experience"
                                value={filters.fexp}
                                onChange={(e) => handleFilterChange('fexp', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Per Hour Charge"
                                value={filters.phcharge}
                                onChange={(e) => handleFilterChange('phcharge', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Availability"
                                value={filters.avail_name}
                                onChange={(e) => handleFilterChange('avail_name', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Delivery Mode"
                                value={filters.del_name}
                                onChange={(e) => handleFilterChange('del_name', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row) => (
                        <React.Fragment key={row.id}>
                    
                            <TableRow>
                                <TableCell>
                                    <ExpandCollapseButton onClick={() => handleSelectRow(row.id)}>
                                        {/* You can use icons like ▶ and ▼ for better UX */}
                                        {isRowSelected(row.id) ? '▼' : '▶'}
                                    </ExpandCollapseButton>
                                    <TableCheckbox
                                        type="checkbox"
                                        onChange={() => handleSelectRow(row.id)}
                                    />
                                </TableCell>
                                <TableCell>{row.full_name}</TableCell>
                                <TableCell>{row.pskill}</TableCell>
                                <TableCell>{row.sskill}</TableCell>
                                <TableCell>{row.pexp}</TableCell>
                                <TableCell>{row.fexp}</TableCell>
                                <TableCell>{row.phcharge}</TableCell>
                                <TableCell>{row.avail_name}</TableCell>
                                <TableCell>{row.del_name}</TableCell>
                            </TableRow>
                            {isRowSelected(row.id) && (
                                <tr>
                                    <td colSpan="9">
                                        {/* Content to be displayed when the row is expanded */}
                                        {/* You can customize this based on your requirements */}
                                        <div style={{ padding: '10px', backgroundColor: '#f2f2f2' }}>
                                            Content for {row.full_name}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
        </TableContainer>
    );
};

const renderSortIndicator = (key, sortConfig) => {
    return (
        <>
            {key === sortConfig.key && sortConfig.direction === 'ascending' && '↑'}
            {key === sortConfig.key && sortConfig.direction === 'descending' && '↓'}
        </>
    );
};

export default Example;
