"use client";

import { Fragment, useState } from "react";
import { Table } from "@mantine/core";
import { Minus, Plus } from "lucide-react";
import {
  ExpandToggleButton,
  ExpandedCell,
  TableEmptyMessage,
  TableScroller,
} from "./data_table_styles";

export type DataTableColumn<TRow> = {
  key: string;
  header: string;
  render: (row: TRow) => React.ReactNode;
  align?: "left" | "right" | "center";
};

export type DataTableRowAction<TRow> = {
  on_click: (row: TRow) => void;
  describe: (row: TRow) => string;
  is_enabled?: (row: TRow) => boolean;
};

const activation_keys = new Set(["Enter", " "]);

const is_inside_control = (target: EventTarget | null, row: HTMLElement): boolean => {
  const control = (target as HTMLElement | null)?.closest("button, a, input, select, textarea, [role='button'], .ant-select");

  return Boolean(control && control !== row && row.contains(control));
};

export type DataTableExpansion<TRow> = {
  render: (row: TRow) => React.ReactNode;
  describe: (row: TRow) => string;
};

type DataTableProps<TRow> = {
  columns: DataTableColumn<TRow>[];
  rows: TRow[];
  get_row_key: (row: TRow) => string;
  empty_message?: string;
  expansion?: DataTableExpansion<TRow>;
  row_action?: DataTableRowAction<TRow>;
};

export const DataTable = <TRow,>({
  columns,
  rows,
  get_row_key,
  empty_message = "Nenhum registro encontrado.",
  expansion,
  row_action,
}: DataTableProps<TRow>) => {
  const [expanded_keys, set_expanded_keys] = useState<Set<string>>(new Set());

  if (rows.length === 0) {
    return <TableEmptyMessage>{empty_message}</TableEmptyMessage>;
  }

  const toggle_row = (row_key: string) => {
    set_expanded_keys((current_keys) => {
      const next_keys = new Set(current_keys);

      if (next_keys.has(row_key)) {
        next_keys.delete(row_key);
      } else {
        next_keys.add(row_key);
      }

      return next_keys;
    });
  };

  const column_count = columns.length + (expansion ? 1 : 0);

  return (
    <TableScroller>
      <Table horizontalSpacing="sm" verticalSpacing={0}>
        <Table.Thead>
          <Table.Tr>
            {expansion ? <Table.Th style={{ width: 48 }} aria-label="Abrir detalhes" /> : null}
            {columns.map((column) => (
              <Table.Th key={column.key} style={{ textAlign: column.align ?? "left" }}>
                {column.header}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => {
            const row_key = get_row_key(row);
            const is_expanded = expanded_keys.has(row_key);
            const panel_id = `expanded_row_${row_key}`;
            const is_row_clickable = Boolean(row_action && (row_action.is_enabled?.(row) ?? true));

            return (
              <Fragment key={row_key}>
                <Table.Tr
                  data-expanded={is_expanded || undefined}
                  data-clickable={is_row_clickable || undefined}
                  tabIndex={is_row_clickable ? 0 : undefined}
                  aria-label={is_row_clickable && row_action ? row_action.describe(row) : undefined}
                  onClick={(event) => {
                    if (is_row_clickable && row_action && !is_inside_control(event.target, event.currentTarget)) {
                      row_action.on_click(row);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (
                      is_row_clickable &&
                      row_action &&
                      event.target === event.currentTarget &&
                      activation_keys.has(event.key)
                    ) {
                      event.preventDefault();
                      row_action.on_click(row);
                    }
                  }}
                >
                  {expansion ? (
                    <Table.Td>
                      <ExpandToggleButton
                        type="button"
                        aria-expanded={is_expanded}
                        aria-controls={panel_id}
                        aria-label={`${is_expanded ? "Fechar" : "Abrir"} ${expansion.describe(row)}`}
                        onClick={() => toggle_row(row_key)}
                      >
                        {is_expanded ? <Minus size={16} strokeWidth={2} /> : <Plus size={16} strokeWidth={2} />}
                      </ExpandToggleButton>
                    </Table.Td>
                  ) : null}
                  {columns.map((column) => (
                    <Table.Td key={column.key} style={{ textAlign: column.align ?? "left" }}>
                      {column.render(row)}
                    </Table.Td>
                  ))}
                </Table.Tr>
                {expansion && is_expanded ? (
                  <Table.Tr data-expanded-panel>
                    <ExpandedCell id={panel_id} colSpan={column_count}>
                      {expansion.render(row)}
                    </ExpandedCell>
                  </Table.Tr>
                ) : null}
              </Fragment>
            );
          })}
        </Table.Tbody>
      </Table>
    </TableScroller>
  );
};
