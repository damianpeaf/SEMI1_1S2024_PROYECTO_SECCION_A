"use client";
import React, { useState } from "react";
import {
  Pagination,
  Table as NextTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TableProps as NextTableProps,
  Skeleton,
} from "@nextui-org/react";

interface TableHeader<T = any> {
  key?: string;
  title: string;
  formatter?: (record: T) => React.ReactNode;
}

type TableProps<T = any> = {
  items: T[];
  headers: TableHeader[];
  itemPerPage?: number;
  onPageChange?: (page: number, itemPerPage: number) => void;
  isLoading?: boolean;
} & NextTableProps;

export const Table = ({
  items,
  headers,
  itemPerPage = 10,
  isLoading = false,
  ...tableProps
}: TableProps) => {
  const [page, setPage] = useState(1);
  const pages =
    Math.ceil(items.length / itemPerPage) > 0
      ? Math.ceil(items.length / itemPerPage)
      : 1;
  const start = (page - 1) * itemPerPage;
  const end = start + itemPerPage;
  items = items.slice(start, end);

  const handlePageChange = (page: number) => {
    setPage(page);
    tableProps.onPageChange?.(page, itemPerPage);
  };

  if (isLoading)
    return (
      <TableSkeleton
        rows={items.length > 0 ? items.length : 10}
        columns={headers.length}
      />
    );

  return (
    <NextTable
      aria-label="Example table with client side pagination"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color={tableProps.color || "primary"}
            page={page}
            total={pages}
            onChange={handlePageChange}
          />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
      {...tableProps}
    >
      <TableHeader>
        {headers.map((header, index) => (
          <TableColumn key={header.key || `header-${index}`}>
            {header.title}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header.key}>
                {header.formatter
                  ? header.formatter(item)
                  : header.key
                  ? item[header.key]
                  : ""}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </NextTable>
  );
};

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
} & NextTableProps;

export const TableSkeleton = ({
  rows = 10,
  columns = 10,
  ...tableProps
}: TableSkeletonProps) => {
  const rowsArray = Array.from({ length: rows })
    .fill(0)
    .map((_, index) => ({ key: index }));
  const columnsArray = Array.from({ length: columns }).fill(0);

  console.log({ rowsArray });

  return (
    <NextTable
      bottomContent={
        <div className="flex w-full justify-center">
          <Skeleton>
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={1}
              total={1}
            />
          </Skeleton>
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
      {...tableProps}
    >
      <TableHeader>
        {columnsArray.map((_, index) => (
          <TableColumn key={`header-s-${index}`}>
            <Skeleton />
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody items={rowsArray}>
        {() => (
          <TableRow>
            {columnsArray.map((_, index) => (
              <TableCell key={`cell-s-${index}`}>
                <Skeleton className="text-3xl">abc</Skeleton>
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </NextTable>
  );
};
