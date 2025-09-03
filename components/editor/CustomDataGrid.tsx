import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, Menu, MenuItem, Checkbox, FormControlLabel, Toolbar, Typography, ButtonGroup, Button, Divider, Select, SelectChangeEvent } from '@mui/material';
import { Download, ContentCopy, FilterList, ViewColumn, DensitySmall, DensityMedium, DensityLarge, Clear, ArrowDownward, ArrowUpward, Edit } from '@mui/icons-material';
import { DataGridColumn } from '../../types';

export interface CustomDataGridProps {
  columns: DataGridColumn[];
  rows: { [key: string]: any }[];
  density?: 'compact' | 'standard' | 'comfortable';
  pageSize?: number;
  editable?: boolean;
  showToolbar?: boolean;
  striped?: boolean;
}

const densityRowHeight: Record<'compact'|'standard'|'comfortable', number> = {
  compact: 32,
  standard: 44,
  comfortable: 56,
};

function toCSV(rows: any[], columns: DataGridColumn[]): string {
  const header = columns.filter(c => !c.hidden).map(c => JSON.stringify(c.headerName ?? c.field)).join(',');
  const data = rows.map(r => columns.filter(c => !c.hidden).map(c => JSON.stringify(r[c.field] ?? '')).join(',')).join('\n');
  return header + '\n' + data;
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function exportAsExcelHtml(rows: any[], columns: DataGridColumn[]) {
  const headers = columns.filter(c => !c.hidden).map(c => `<th>${c.headerName ?? c.field}</th>`).join('');
  const body = rows.map(r => `<tr>${columns.filter(c => !c.hidden).map(c => `<td>${(r[c.field] ?? '').toString().replace(/</g,'&lt;')}</td>`).join('')}</tr>`).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><table><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table></body></html>`;
  download('data.xls', html, 'application/vnd.ms-excel');
}

const CustomDataGrid: React.FC<CustomDataGridProps> = ({ columns: colsProp, rows: rowsProp, density = 'standard', pageSize = 10, editable = true, showToolbar = true, striped }) => {
  const [columns, setColumns] = useState<DataGridColumn[]>(colsProp || []);
  const [rows, setRows] = useState<any[]>(rowsProp || []);
  const [sort, setSort] = useState<{ field: string; dir: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<{ [field: string]: string }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(pageSize);
  const [dens, setDens] = useState<'compact' | 'standard' | 'comfortable'>(density);
  const [editing, setEditing] = useState<{ row: number; field: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; field: string } | null>(null);

  useEffect(() => setColumns(colsProp || []), [colsProp]);
  useEffect(() => setRows(rowsProp || []), [rowsProp]);

  const visibleColumns = useMemo(() => columns.filter(c => !c.hidden), [columns]);

  const filteredRows = useMemo(() => {
    let r = [...rows];
    // apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (!value) return;
      r = r.filter(row => String(row[field] ?? '').toLowerCase().includes(String(value).toLowerCase()));
    });
    // apply sort
    if (sort) {
      const { field, dir } = sort;
      r.sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av == null && bv == null) return 0;
        if (av == null) return dir === 'asc' ? -1 : 1;
        if (bv == null) return dir === 'asc' ? 1 : -1;
        if (typeof av === 'number' && typeof bv === 'number') return dir === 'asc' ? av - bv : bv - av;
        return dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return r;
  }, [rows, filters, sort]);

  const pagedRows = useMemo(() => {
    const start = page * size;
    return filteredRows.slice(start, start + size);
  }, [filteredRows, page, size]);

  const toggleSort = (field: string) => () => {
    setPage(0);
    setSort(prev => prev && prev.field === field ? (prev.dir === 'asc' ? { field, dir: 'desc' } : null) : { field, dir: 'asc' });
  };

  const setFilter = (field: string, value: string) => {
    setPage(0);
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const toggleColumn = (field: string) => {
    setColumns(prev => prev.map(c => c.field === field ? { ...c, hidden: !c.hidden } : c));
  };

  const handleCsv = () => download('data.csv', toCSV(filteredRows, columns), 'text/csv;charset=utf-8');
  const handleXls = () => exportAsExcelHtml(filteredRows, columns);

  const beginEdit = (rowIndex: number, field: string) => {
    if (!editable || (columns.find(c => c.field === field)?.editable === false)) return;
    setEditing({ row: rowIndex, field });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    if (!editing) return;
    const value = inputRef.current?.value ?? '';
    setRows(prev => prev.map((r, i) => i === editing.row ? { ...r, [editing.field]: value } : r));
    setEditing(null);
  };

  const onCellKeyDown = (e: React.KeyboardEvent, rowIndex: number, field: string) => {
    if (e.key === 'Enter') {
      if (editing) commitEdit();
      else beginEdit(rowIndex, field);
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      const val = rows[rowIndex]?.[field] ?? '';
      navigator.clipboard.writeText(String(val));
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        setRows(prev => prev.map((r, i) => i === rowIndex ? { ...r, [field]: text } : r));
      });
    }
  };

  const onPasteIntoEditor = (e: React.ClipboardEvent) => {
    if (!editing) return;
    e.stopPropagation();
  };

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / size));

  return (
    <Box onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
      {showToolbar && (
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Typography variant="subtitle2" sx={{ flex: 1 }}>Rows: {filteredRows.length}</Typography>
          <Tooltip title="Toggle Filters"><IconButton size="small" onClick={() => setShowFilters(v => !v)}><FilterList fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Column Visibility"><IconButton size="small" onClick={(e) => setColumnMenuAnchor(e.currentTarget)}><ViewColumn fontSize="small" /></IconButton></Tooltip>
          <Menu anchorEl={columnMenuAnchor} open={Boolean(columnMenuAnchor)} onClose={() => setColumnMenuAnchor(null)}>
            {columns.map(col => (
              <MenuItem key={col.field} onClick={() => toggleColumn(col.field)}>
                <Checkbox checked={!col.hidden} sx={{ mr: 1 }} /> {col.headerName ?? col.field}
              </MenuItem>
            ))}
          </Menu>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Density Compact"><IconButton size="small" color={dens==='compact'? 'primary': 'default'} onClick={() => setDens('compact')}><DensitySmall fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Density Standard"><IconButton size="small" color={dens==='standard'? 'primary': 'default'} onClick={() => setDens('standard')}><DensityMedium fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Density Comfortable"><IconButton size="small" color={dens==='comfortable'? 'primary': 'default'} onClick={() => setDens('comfortable')}><DensityLarge fontSize="small" /></IconButton></Tooltip>
          <Divider orientation="vertical" flexItem />
          <ButtonGroup size="small" variant="outlined">
            <Button onClick={handleCsv}>CSV</Button>
            <Button onClick={handleXls}>Excel</Button>
          </ButtonGroup>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption">Page Size</Typography>
            <Select size="small" value={String(size)} onChange={(e: SelectChangeEvent) => setSize(parseInt(e.target.value as string, 10))}>
              {[5,10,25,50,100].map(n => <MenuItem key={n} value={String(n)}>{n}</MenuItem>)}
            </Select>
          </Box>
        </Toolbar>
      )}

      <TableContainer>
        <Table stickyHeader size={dens === 'compact' ? 'small' : 'medium'} sx={{
          '& td, & th': { height: densityRowHeight[dens], py: dens==='comfortable'? 1.5 : dens==='standard'? 1 : 0.5 }
        }}>
          <TableHead>
            <TableRow>
              {visibleColumns.map(col => (
                <TableCell key={col.field} sx={{ cursor: (col.sortable ?? true) ? 'pointer': 'default' }} onClick={(col.sortable ?? true) ? toggleSort(col.field) : undefined}>
                  <Box sx={{ display:'flex', alignItems:'center', gap: 0.5 }}>
                    <span>{col.headerName ?? col.field}</span>
                    {sort?.field === col.field && (sort.dir === 'asc' ? <ArrowUpward fontSize="inherit" /> : <ArrowDownward fontSize="inherit" />)}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
            {showFilters && (
              <TableRow>
                {visibleColumns.map(col => (
                  <TableCell key={col.field}>
                    {(col.filterable ?? true) ? (
                      <TextField size="small" fullWidth placeholder="Filter" value={filters[col.field] || ''} onChange={e => setFilter(col.field, e.target.value)} />
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {pagedRows.map((row, rIdx) => (
              <TableRow key={rIdx} sx={{ '&:nth-of-type(odd)': { backgroundColor: striped ? 'action.hover' : 'inherit' } }}>
                {visibleColumns.map(col => {
                  const value = row[col.field];
                  const isEditing = editing && editing.row === (page*size + rIdx) && editing.field === col.field;
                  return (
                    <TableCell key={col.field}
                      tabIndex={0}
                      onKeyDown={(e) => onCellKeyDown(e, page*size + rIdx, col.field)}
                      onDoubleClick={() => beginEdit(page*size + rIdx, col.field)}
                      onClick={() => setSelectedCell({ row: page*size + rIdx, field: col.field })}
                    >
                      {isEditing ? (
                        <TextField size="small" defaultValue={value ?? ''} inputRef={inputRef} onBlur={commitEdit} onKeyDown={(e) => { if (e.key==='Enter') commitEdit(); e.stopPropagation(); }} onPaste={onPasteIntoEditor} fullWidth />
                      ) : (
                        <span>{value as any}</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', p: 1 }}>
        <Typography variant="caption">Page {page + 1} / {totalPages}</Typography>
        <Box sx={{ display:'flex', gap: 1 }}>
          <Button size="small" disabled={page === 0} onClick={() => setPage(0)}>First</Button>
          <Button size="small" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Prev</Button>
          <Button size="small" disabled={page >= totalPages - 1} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>Next</Button>
          <Button size="small" disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>Last</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomDataGrid;
