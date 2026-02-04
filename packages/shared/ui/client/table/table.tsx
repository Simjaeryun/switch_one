"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  type ColumnDef,
  type Table as TableType,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@repo/shared/lib/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.base";

// ----------------------------------------------------------------------
// !테이블 전역타입

declare module "@tanstack/react-table" {
  export interface TableMeta<TData extends unknown> {
    addRow: (row?: TData) => void;
    deleteRow?: (...idx: number[]) => void;
    updateData: (rowIndex: number, columnId: string, value: any) => void;
    insertData?: (data: TData[]) => void;
    activateEditableInput?: (rowIndex: number, colIndex: number) => void;
  }
}

// ----------------------------------------------------------------------
// ! 테이블 프로퍼티 타입

interface DataTableProps<TColmns, TValue> {
  columns: ColumnDef<TValue, TColmns>[];
  data: TValue[];
  renderItem: (table: TableType<TValue>) => React.ReactElement;
  className?: string;
  type?: "page" | "modal";
  /**
   * 가상화 설정 옵션
   */
  virtualization?: {
    /**
     * 행 높이 (픽셀)
     * @default 45
     */
    rowHeight?: number;
    /**
     * 한번에 로드될 항목 오버스캔 수 (위/아래)
     * @default 10
     */
    overscan?: number;
    /**
     * 테이블 컨테이너 높이
     * @default 600
     */
    height?: number;
  };
  /**
   * 컬럼 너비 설정
   * @default true
   */
  columnSizing?: boolean;
  /**
   * 셀 범위 선택 및 복사 기능 활성화
   * @default true
   */
  enableCellSelection?: boolean;
}

// ----------------------------------------------------------------------

export const JrTable = <T,>({
  data,
  columns,
  renderItem,
  className,
  type = "page",
  virtualization = {
    rowHeight: 45,
    overscan: 10,
    height: 600,
  },
  columnSizing = true,
  enableCellSelection = true,
}: DataTableProps<T, T>) => {
  const [rowSelection, setRowSelection] = useState({});
  const [rowData, setRowData] = useState<T[]>(data);
  const cellRefs = useRef<Map<string, HTMLElement>>(new Map());
  const editableCellsState = useRef<Map<string, (isEditing: boolean) => void>>(
    new Map()
  );
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 셀 선택 상태 관리
  const [selectionStart, setSelectionStart] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // 각 컬럼에 기본 너비 설정 (만약 컬럼 정의에 size가 없는 경우)
  const columnsWithSizing = React.useMemo(() => {
    if (!columnSizing) return columns;

    return columns.map((column) => {
      if ("size" in column) return column;

      return {
        ...column,
        size: 150, // 기본 너비
      };
    });
  }, [columns, columnSizing]);

  const table = useReactTable({
    data: rowData,
    columns: columnsWithSizing,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    meta: {
      addRow: (addRow) => {
        setRowData((pre) => {
          return addRow ? [...pre, addRow] : pre;
        });
      },
      deleteRow: (...delIdx) => {
        setRowData((pre) => {
          return pre.filter((_, idx) => !delIdx.includes(idx));
        });
      },
      updateData: (rowIndex, columnId, value) => {
        setRowData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
      insertData: (data) => {
        setRowData((pre) => [...pre, ...data]);
      },
      activateEditableInput: (rowIndex, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        const setEditingState = editableCellsState.current.get(key);
        if (setEditingState) {
          setEditingState(true);
        }
      },
    },
  });

  const { rows } = table.getRowModel();

  // 가상 스크롤 설정
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => virtualization.rowHeight || 45,
    overscan: virtualization.overscan || 10,
    scrollPaddingEnd: 60, // 하단 스크롤바를 위한 패딩 추가
  });

  // 선택 영역 계산
  const calculateSelectedCells = React.useCallback(
    (
      start: { rowIndex: number; colIndex: number } | null,
      end: { rowIndex: number; colIndex: number } | null
    ) => {
      if (!start || !end) return [];

      const minRow = Math.min(start.rowIndex, end.rowIndex);
      const maxRow = Math.max(start.rowIndex, end.rowIndex);
      const minCol = Math.min(start.colIndex, end.colIndex);
      const maxCol = Math.max(start.colIndex, end.colIndex);

      const cells: string[] = [];

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          cells.push(`${r}-${c}`);
        }
      }

      return cells;
    },
    []
  );

  // 셀 선택 시작
  const handleCellMouseDown = (
    e: React.MouseEvent<HTMLElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (!enableCellSelection) return;

    // 오른쪽 클릭 무시
    if (e.button !== 0) return;

    // shift 키를 누르고 있는 경우 범위 확장
    if (e.shiftKey && selectionStart) {
      setSelectionEnd({ rowIndex, colIndex });
      const newSelectedCells = calculateSelectedCells(selectionStart, {
        rowIndex,
        colIndex,
      });
      setSelectedCells(newSelectedCells);
    } else {
      setSelectionStart({ rowIndex, colIndex });
      setSelectionEnd({ rowIndex, colIndex });
      setSelectedCells([`${rowIndex}-${colIndex}`]);
      setIsSelecting(true);
    }

    // 클릭된 셀에 포커스 설정
    const cellKey = `${rowIndex}-${colIndex}`;
    const targetCell = cellRefs.current.get(cellKey);
    if (targetCell) {
      targetCell.focus();
    }

    // 텍스트 선택 방지
    e.preventDefault();
  };

  // 셀 선택 드래그
  const handleCellMouseEnter = (rowIndex: number, colIndex: number) => {
    if (!enableCellSelection || !isSelecting || !selectionStart) return;

    setSelectionEnd({ rowIndex, colIndex });
    const newSelectedCells = calculateSelectedCells(selectionStart, {
      rowIndex,
      colIndex,
    });
    setSelectedCells(newSelectedCells);
  };

  // 셀 선택 완료
  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  // 키보드 이벤트 수정: 방향키 + shift로 셀 범위 선택 추가
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTableCellElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    const headerGroups = table.getHeaderGroups();
    if (!headerGroups.length) return;

    const totalRows = table.getRowModel().rows.length;
    const totalCols = headerGroups[0]?.headers.length ?? 0;
    let nextCell: HTMLElement | undefined;
    let nextRowIndex = rowIndex;
    let nextColIndex = colIndex;

    // 키보드 조작에 따른 다음 셀 인덱스 계산
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        // EditableInput 활성화
        table.options.meta?.activateEditableInput?.(rowIndex, colIndex);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (rowIndex > 0) {
          nextRowIndex = rowIndex - 1;
          nextCell = cellRefs.current.get(`${nextRowIndex}-${colIndex}`);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (rowIndex < totalRows) {
          nextRowIndex = rowIndex + 1;
          nextCell = cellRefs.current.get(`${nextRowIndex}-${colIndex}`);
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (colIndex > 0) {
          nextColIndex = colIndex - 1;
          nextCell = cellRefs.current.get(`${rowIndex}-${nextColIndex}`);
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        if (colIndex < totalCols - 1) {
          nextColIndex = colIndex + 1;
          nextCell = cellRefs.current.get(`${rowIndex}-${nextColIndex}`);
        }
        break;
      case "c":
        // Ctrl+C 또는 Command+C
        if ((e.ctrlKey || e.metaKey) && selectedCells.length > 0) {
          e.preventDefault();
          copySelectedCells();
        }
        break;
      case "v":
        // Ctrl+V 또는 Command+V
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          /* @ts-ignore */
          handlePasteFromClipboard(rowIndex, colIndex);
        }
        break;
    }

    // shift를 누르고 있으면서 방향키를 누르면 선택 영역 확장
    if (
      e.shiftKey &&
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      if (!selectionStart) {
        setSelectionStart({ rowIndex, colIndex });
      }
      setSelectionEnd({ rowIndex: nextRowIndex, colIndex: nextColIndex });
      const newSelectedCells = calculateSelectedCells(
        selectionStart || { rowIndex, colIndex },
        {
          rowIndex: nextRowIndex,
          colIndex: nextColIndex,
        }
      );
      setSelectedCells(newSelectedCells);
    } else if (
      !e.shiftKey &&
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      // shift 없이 방향키만 누르면 선택 초기화하고 포커스 이동
      setSelectionStart(null);
      setSelectionEnd(null);
      setSelectedCells([]);
    }

    nextCell?.focus();
  };

  // 선택한 셀 복사 기능
  const copySelectedCells = React.useCallback(() => {
    try {
      if (!selectionStart || !selectionEnd || selectedCells.length === 0)
        return;

      const minRow = Math.min(selectionStart.rowIndex, selectionEnd.rowIndex);
      const maxRow = Math.max(selectionStart.rowIndex, selectionEnd.rowIndex);
      const minCol = Math.min(selectionStart.colIndex, selectionEnd.colIndex);
      const maxCol = Math.max(selectionStart.colIndex, selectionEnd.colIndex);

      // 선택된 행을 배열로 변환
      const rowsData: string[][] = [];

      for (let r = minRow; r <= maxRow; r++) {
        const rowData: string[] = [];

        for (let c = minCol; c <= maxCol; c++) {
          try {
            // 헤더 행인 경우
            if (r === 0) {
              const headerGroups = table.getHeaderGroups();
              const headerRow = headerGroups[0];

              if (headerRow && c < headerRow.headers.length) {
                const header = headerRow.headers[c];
                if (header && header.column && header.column.columnDef) {
                  const headerContent = header.column.columnDef.header;
                  const headerText =
                    typeof headerContent === "string" ? headerContent : "";
                  rowData.push(headerText);
                } else {
                  rowData.push("");
                }
              } else {
                rowData.push("");
              }
            } else {
              // 데이터 행
              const rows = table.getRowModel().rows;
              const rowIndex = r - 1; // rowIndex는 헤더를 포함하므로 1을 빼줍니다

              if (rowIndex >= 0 && rowIndex < rows.length) {
                const row = rows[rowIndex];
                if (row) {
                  const cells = row.getVisibleCells();
                  if (c >= 0 && c < cells.length) {
                    const cell = cells[c];
                    if (cell) {
                      let value = "";
                      try {
                        const cellValue = cell.getValue();
                        value =
                          cellValue !== null && cellValue !== undefined
                            ? String(cellValue)
                            : "";
                      } catch (e) {
                        value = "";
                      }
                      rowData.push(value);
                    } else {
                      rowData.push("");
                    }
                  } else {
                    rowData.push("");
                  }
                } else {
                  rowData.push("");
                }
              } else {
                rowData.push("");
              }
            }
          } catch (e) {
            // 셀 처리 중 오류 발생 시 빈 문자열 추가
            rowData.push("");
          }
        }

        rowsData.push(rowData);
      }

      // TSV 형식으로 변환
      const tsvContent = rowsData.map((row) => row.join("\t")).join("\n");

      // 클립보드에 복사
      navigator.clipboard.writeText(tsvContent).catch((err) => {
        console.error("클립보드 복사 실패:", err);
      });
    } catch (e) {
      console.error("셀 복사 중 오류 발생:", e);
    }
  }, [selectionStart, selectionEnd, selectedCells, table]);

  // 붙여넣기 처리 함수
  /* @ts-ignore */
  const handlePasteFromClipboard = React.useCallback(
    async (rowIndex: number, colIndex: number) => {
      try {
        if (
          !table ||
          !setSelectionStart ||
          !setSelectionEnd ||
          !setSelectedCells ||
          !calculateSelectedCells
        ) {
          console.error("필요한 의존성이 없습니다");
          return;
        }

        // 클립보드에서 텍스트 가져오기
        let clipboard = "";
        try {
          clipboard = await navigator.clipboard.readText();
        } catch (err) {
          console.error("클립보드 접근 오류:", err);
          return;
        }

        if (!clipboard) return;

        // 붙여넣을 시작 위치 (헤더는 건너뛰기)
        const startRow = rowIndex > 0 ? rowIndex - 1 : 0; // 헤더인 경우(rowIndex=0) 첫 번째 데이터 행으로 설정
        const startCol = colIndex;

        // 데이터 파싱 (탭과 개행으로 구분된 값 처리)
        const clipboardRows = clipboard
          .split(/\r\n|\n|\r/)
          .filter((row) => row.trim() !== "");
        if (!clipboardRows.length) return;

        // 데이터 테이블에 적용
        /* @ts-ignore */
        const tableModel = table.getRowModel();
        if (!tableModel) return;

        /* @ts-ignore */
        const tableRows = tableModel.rows || [];

        clipboardRows.forEach((rowStr, rowOffset) => {
          const rowValues = rowStr.split("\t");

          rowValues.forEach((cellValue, colOffset) => {
            const targetRowIndex = startRow + rowOffset;

            // 테이블 범위를 벗어나는지 확인
            if (targetRowIndex < 0 || targetRowIndex >= tableRows.length) {
              return;
            }

            const row = tableRows[targetRowIndex];
            if (!row) return;

            const targetColIndex = startCol + colOffset;
            // @ts-ignore - 여기서 타입 오류가 발생하지만 실제 동작에는 문제 없음
            const cells = row.getVisibleCells();
            if (
              !cells ||
              !Array.isArray(cells) ||
              targetColIndex < 0 ||
              targetColIndex >= cells.length
            ) {
              return;
            }

            const cell = cells[targetColIndex];
            if (!cell || !cell.column) return;

            const columnId = cell.column.id;
            if (!columnId) return;

            // 데이터 업데이트
            if (table.options.meta?.updateData) {
              table.options.meta.updateData(
                targetRowIndex,
                columnId,
                cellValue
              );
            }
          });
        });

        // 데이터 업데이트 후 선택 영역 갱신
        const rowsLength = tableRows ? tableRows.length - 1 : 0;
        const endRowIndex = Math.min(
          startRow + clipboardRows.length - 1,
          rowsLength
        );

        if (clipboardRows.length > 0) {
          const firstRowValues = clipboardRows[0]!.split("\t");
          if (firstRowValues.length > 0) {
            const endColOffset = firstRowValues.length - 1;

            /* @ts-ignore */
            const headerGroups = table.getHeaderGroups();
            const headerRow =
              headerGroups && headerGroups.length > 0 ? headerGroups[0] : null;
            const headerLength =
              headerRow && headerRow.headers ? headerRow.headers.length - 1 : 0;

            const newEndColIndex = Math.min(
              startCol + endColOffset,
              headerLength
            );

            // 붙여넣은 영역으로 선택 영역 변경
            const newSelectionStart = {
              rowIndex: startRow + 1,
              colIndex: startCol,
            };
            const newSelectionEnd = {
              rowIndex: endRowIndex + 1,
              colIndex: newEndColIndex,
            };

            setSelectionStart(newSelectionStart);
            setSelectionEnd(newSelectionEnd);

            const newSelectedCells = calculateSelectedCells(
              newSelectionStart,
              newSelectionEnd
            );
            setSelectedCells(newSelectedCells);
          }
        }
      } catch (error) {
        console.error("붙여넣기 처리 중 오류가 발생했습니다:", error);
      }
    },
    [
      table,
      calculateSelectedCells,
      setSelectionStart,
      setSelectionEnd,
      setSelectedCells,
    ]
  );

  // 테이블에서 붙여넣기 이벤트 리스너
  const handlePaste = React.useCallback(
    (e: React.ClipboardEvent | ClipboardEvent) => {
      // 선택한 셀이 있고 셀 선택이 활성화된 경우만 처리
      if (!enableCellSelection || !selectionStart) return;

      // 기본 동작 방지 (안전을 위해)
      e.preventDefault();

      // 선택된 첫 번째 셀에 붙여넣기
      /* @ts-ignore */
      handlePasteFromClipboard(
        selectionStart.rowIndex,
        selectionStart.colIndex
      );
    },
    [
      enableCellSelection,
      selectionStart,
      /* @ts-ignore */ handlePasteFromClipboard,
    ]
  );

  // 테이블 전체 클릭 이벤트 방지를 위한 이벤트 리스너
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsSelecting(false);
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  // 전역 키보드 이벤트 리스너 (Ctrl+C / Command+C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "c" &&
        selectedCells.length > 0
      ) {
        copySelectedCells();
      }
    };

    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (selectedCells.length > 0) {
        handlePaste(e);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("paste", handleGlobalPaste);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("paste", handleGlobalPaste);
    };
  }, [selectedCells, copySelectedCells, handlePaste]);

  const setCellRef = (
    element: HTMLElement | null,
    rowIndex: number,
    colIndex: number
  ) => {
    if (element) {
      cellRefs.current.set(`${rowIndex}-${colIndex}`, element);
    } else {
      cellRefs.current.delete(`${rowIndex}-${colIndex}`);
    }
  };

  useEffect(() => {
    setRowData(data);
    table.toggleAllPageRowsSelected(false);
  }, [data]);

  const totalSize = rowVirtualizer.getTotalSize();
  const virtualRows = rowVirtualizer.getVirtualItems();

  const tableHeight = virtualization.height || 600;

  // 셀이 선택되었는지 확인하는 함수
  const isCellSelected = (rowIndex: number, colIndex: number) => {
    return selectedCells.includes(`${rowIndex}-${colIndex}`);
  };

  return (
    <div className="space-y-4">
      {type === "page" && <div className="p-2">{renderItem(table)}</div>}

      <div
        ref={tableContainerRef}
        className={cn("overflow-auto rounded-lg bg-white shadow-sm", className)}
        style={{
          height: `${tableHeight}px`,
          overflowX: "auto",
          position: "relative",
          paddingBottom: "16px",
        }}
        onMouseUp={handleMouseUp}
      >
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-50 bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="whitespace-nowrap">
                {headerGroup.headers.map((header, colIndex) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-center",
                      isCellSelected(0, colIndex) && "bg-blue-100"
                    )}
                    colSpan={header.colSpan}
                    ref={(el) => setCellRef(el, 0, colIndex)}
                    onKeyDown={(e) => handleKeyDown(e, 0, colIndex)}
                    onMouseDown={(e) => handleCellMouseDown(e, 0, colIndex)}
                    onMouseEnter={() => handleCellMouseEnter(0, colIndex)}
                    tabIndex={0}
                    style={{
                      width: header.column.columnDef.size
                        ? `${header.column.columnDef.size}px`
                        : "150px",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {virtualRows.length > 0 ? (
              <>
                {/* 상단 패딩 */}
                {virtualRows.length > 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      style={{ height: `${virtualRows[0]?.start || 0}px` }}
                    />
                  </tr>
                )}

                {/* 가상 행 */}
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  if (!row) return null; // 행이 없는 경우 렌더링하지 않음

                  return (
                    <TableRow
                      key={row.id}
                      className="whitespace-nowrap"
                      data-state={row.getIsSelected() && "selected"}
                      data-index={virtualRow.index}
                    >
                      {row.getVisibleCells().map((cell, colIndex) => {
                        return (
                          <TableCell
                            className={cn(
                              "overflow-hidden text-ellipsis whitespace-nowrap text-center",
                              isCellSelected(virtualRow.index + 1, colIndex) &&
                                "bg-blue-100"
                            )}
                            key={cell.id}
                            ref={(el) =>
                              setCellRef(el, virtualRow.index + 1, colIndex)
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, virtualRow.index + 1, colIndex)
                            }
                            onMouseDown={(e) =>
                              handleCellMouseDown(
                                e,
                                virtualRow.index + 1,
                                colIndex
                              )
                            }
                            onMouseEnter={() =>
                              handleCellMouseEnter(
                                virtualRow.index + 1,
                                colIndex
                              )
                            }
                            tabIndex={0}
                            style={{
                              height: `${virtualization.rowHeight || 45}px`,
                              width: cell.column.columnDef.size
                                ? `${cell.column.columnDef.size}px`
                                : "150px",
                              maxWidth: cell.column.columnDef.size
                                ? `${cell.column.columnDef.size}px`
                                : "150px",
                            }}
                          >
                            <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}

                {/* 하단 패딩 */}
                {virtualRows.length > 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      style={{
                        height: `${totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)}px`,
                        padding: 0,
                        border: "none",
                        minHeight: "60px", // 하단에 최소 높이 설정
                      }}
                    />
                  </tr>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center font-medium text-gray-400"
                >
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {type === "modal" && <div className="p-2">{renderItem(table)}</div>}
    </div>
  );
};
