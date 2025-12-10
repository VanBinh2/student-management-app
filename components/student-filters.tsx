"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { StudentFilters } from "@/lib/types"

interface StudentFiltersProps {
  filters: StudentFilters
  onFiltersChange: (filters: StudentFilters) => void
  majors: string[]
  classes: string[]
}

export function StudentFiltersComponent({ filters, onFiltersChange, majors, classes }: StudentFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      search: "",
      status: "",
      major: "",
      class: "",
    })
  }

  const hasFilters = filters.search || filters.status || filters.major || filters.class

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên, mã SV, email..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value === "all" ? "" : value })}
      >
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="active">Đang học</SelectItem>
          <SelectItem value="inactive">Nghỉ học</SelectItem>
          <SelectItem value="graduated">Tốt nghiệp</SelectItem>
          <SelectItem value="suspended">Đình chỉ</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.major}
        onValueChange={(value) => onFiltersChange({ ...filters, major: value === "all" ? "" : value })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Ngành học" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả ngành</SelectItem>
          {majors.map((major) => (
            <SelectItem key={major} value={major}>
              {major}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.class}
        onValueChange={(value) => onFiltersChange({ ...filters, class: value === "all" ? "" : value })}
      >
        <SelectTrigger className="w-full sm:w-[130px]">
          <SelectValue placeholder="Lớp" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả lớp</SelectItem>
          {classes.map((cls) => (
            <SelectItem key={cls} value={cls}>
              {cls}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={handleReset}>
          <X className="h-4 w-4" />
          <span className="sr-only">Xóa bộ lọc</span>
        </Button>
      )}
    </div>
  )
}
