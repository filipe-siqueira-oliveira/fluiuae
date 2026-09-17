"use client";

import { Badge, Button, Input, Popover, Select } from "antd";
import { TransactionType } from "@fluiuae/database/enums";
import { Search, SlidersHorizontal } from "lucide-react";
import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { label_text, media_mobile } from "@/styles/typography";
import { quick_filters, resolve_quick_filter_key } from "../helpers/transaction_quick_filters";
import type { TransactionViewFilters } from "../hooks/use_transactions_list";
import type { AccountDto, CategoryDto } from "@/types/api";

const { colors, font_sizes } = theme_tokens;

const ToolbarFrame = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 0 16px;
  border-bottom: 1px solid ${colors.border};

  ${media_mobile} {
    gap: 12px;
    padding: 14px 0 12px;
  }
`;

const SearchRow = styled.div`
  display: flex;
  gap: 10px;

  .ant-input-affix-wrapper {
    height: 48px;
    border-color: ${colors.border};
    border-radius: 14px;
    background: ${colors.page_background};
    font-size: ${font_sizes.body_large};
  }

  .ant-input-affix-wrapper-focused {
    background: ${colors.surface};
  }

  .ant-input {
    background: transparent;
  }

  & > .ant-badge > .ant-btn {
    height: 48px;
    border-radius: 14px;
  }
`;

const ChipRow = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  ${media_mobile} {
    margin: 0 -16px;
    padding: 0 16px;
  }
`;

const Chip = styled.button<{ $is_active: boolean }>`
  flex-shrink: 0;
  height: 38px;
  padding: 0 18px;
  border: 1px solid ${({ $is_active }) => ($is_active ? colors.text : colors.border_strong)};
  border-radius: 999px;
  background: ${({ $is_active }) => ($is_active ? colors.text : colors.surface)};
  color: ${({ $is_active }) => ($is_active ? colors.surface : colors.text_muted)};
  font-family: inherit;
  font-size: ${font_sizes.body};
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease;

  &:hover {
    border-color: ${colors.text};
    color: ${({ $is_active }) => ($is_active ? colors.surface : colors.text)};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

const FilterPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 260px;
`;

const FilterField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    ${label_text}
  }
`;

type TransactionToolbarProps = {
  filters: TransactionViewFilters;
  accounts: AccountDto[];
  categories: CategoryDto[];
  on_change: (filters: TransactionViewFilters) => void;
};

export const TransactionToolbar = ({ filters, accounts, categories, on_change }: TransactionToolbarProps) => {
  const update_filter = (partial_filters: TransactionViewFilters) => on_change({ ...filters, ...partial_filters });
  const extra_filter_count = [filters.account_id, filters.category_id].filter(Boolean).length;
  const active_quick_filter = resolve_quick_filter_key(filters);
  const visible_categories = categories.filter((category) =>
    filters.type && filters.type !== TransactionType.TRANSFER ? category.kind === filters.type : true
  );

  const filter_panel = (
    <FilterPanel>
      <FilterField>
        <span>Conta</span>
        <Select
          allowClear
          placeholder="Todas"
          options={accounts.map((account) => ({ value: account.id, label: account.name }))}
          value={filters.account_id}
          onChange={(account_id) => update_filter({ account_id })}
        />
      </FilterField>
      <FilterField>
        <span>Categoria</span>
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="Todas"
          options={visible_categories.map((category) => ({ value: category.id, label: category.name }))}
          value={filters.category_id}
          onChange={(category_id) => update_filter({ category_id })}
        />
      </FilterField>
      <Button
        type="text"
        disabled={extra_filter_count === 0}
        onClick={() => update_filter({ account_id: undefined, category_id: undefined })}
      >
        Limpar filtros
      </Button>
    </FilterPanel>
  );

  return (
    <ToolbarFrame data-tour="transactions_filters">
      <SearchRow>
        <Input
          allowClear
          prefix={<Search size={18} style={{ color: colors.text_subtle }} />}
          placeholder="Buscar transação..."
          aria-label="Buscar transação"
          value={filters.search}
          onChange={(event) => update_filter({ search: event.target.value || undefined })}
        />
        <Popover trigger="click" placement="bottomRight" content={filter_panel} arrow={false}>
          <Badge count={extra_filter_count} size="small" color={colors.primary}>
            <Button icon={<SlidersHorizontal size={16} />} aria-label="Filtrar por conta ou categoria" />
          </Badge>
        </Popover>
      </SearchRow>
      <ChipRow role="group" aria-label="Mostrar lançamentos">
        {quick_filters.map((quick_filter) => (
          <Chip
            key={quick_filter.key}
            type="button"
            $is_active={active_quick_filter === quick_filter.key}
            aria-pressed={active_quick_filter === quick_filter.key}
            onClick={() =>
              update_filter({
                type: quick_filter.type,
                status: quick_filter.status,
                category_id: quick_filter.type === filters.type ? filters.category_id : undefined,
              })
            }
          >
            {quick_filter.label}
          </Chip>
        ))}
      </ChipRow>
    </ToolbarFrame>
  );
};
