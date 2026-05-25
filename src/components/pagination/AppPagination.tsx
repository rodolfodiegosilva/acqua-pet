import Pagination from '@mui/material/Pagination';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import './AppPagination.css';

interface AppPaginationProps {
  page: number;
  count: number;
  onChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  tone?: 'store' | 'portal' | 'backoffice';
}

export const MOBILE_DEFAULT_PAGE_SIZE = 3;
export const DESKTOP_DEFAULT_PAGE_SIZE = 5;
const MOBILE_BREAKPOINT = 768;
const PAGE_SIZE_OPTIONS = [3, 5, 10, 50];

export const getResponsiveDefaultPageSize = () =>
  typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
    ? MOBILE_DEFAULT_PAGE_SIZE
    : DESKTOP_DEFAULT_PAGE_SIZE;

export const AppPagination = ({ page, count, onChange, pageSize, onPageSizeChange, tone = 'store' }: AppPaginationProps) => {
  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    onPageSizeChange(Number(event.target.value));
  };

  if (count <= 1) {
    return (
      <div className={`app-pagination app-pagination--${tone}`}>
        <div className="app-pagination-size">
          <span className="app-pagination-size-label">Itens por página</span>
          <Select<number> size="small" value={pageSize} onChange={handlePageSizeChange}>
            {PAGE_SIZE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-pagination app-pagination--${tone}`}>
      <div className="app-pagination-size">
        <span className="app-pagination-size-label">Itens por página</span>
        <Select<number> size="small" value={pageSize} onChange={handlePageSizeChange}>
          {PAGE_SIZE_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Pagination
        page={page}
        count={count}
        color="primary"
        shape="rounded"
        siblingCount={0}
        boundaryCount={1}
        onChange={(_, nextPage) => onChange(nextPage)}
      />
    </div>
  );
};
