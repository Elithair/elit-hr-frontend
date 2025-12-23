import { useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
    type PaginationState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    CakeIcon,
    UserIcon,
    GlobeAltIcon,
    BuildingOfficeIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Employee type based on DUMMY_EMPLOYEE_LIST structure
interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    dateOfBirth: string;
    employmentStatus: string;
    workLocation: string;
    workEmail: string;
    workPhone: string;
}

interface EmployeeTableProps {
    data: Employee[];
}

const EmploymentStatusBadge = ({ status }: { status: string }) => {
    const styles = {
        "Full-Time Permanent": "bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-emerald-600/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-medium",
        "Contract": "bg-gradient-to-br from-rose-500/20 via-red-500/15 to-rose-600/10 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-medium",
        "Part-Time": "bg-gradient-to-br from-amber-500/20 via-yellow-500/15 to-amber-600/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-medium",
        "Internship": "bg-gradient-to-br from-sky-500/20 via-blue-500/15 to-sky-600/10 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-medium",
        "Temporary": "bg-gradient-to-br from-orange-500/20 via-orange-500/15 to-orange-600/10 text-orange-700 dark:text-orange-300 border border-orange-500/30 font-medium",
        "Default": "bg-gradient-to-br from-slate-500/20 via-gray-500/15 to-slate-600/10 text-slate-700 dark:text-slate-300 border border-slate-500/30 font-medium",
        "In Trial": "bg-gradient-to-br from-purple-500/20 via-purple-500/15 to-purple-600/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-medium",
    };

    return (
        <Badge variant={"secondary"} className={cn("bg-gradient-to-br font-medium", styles[status as keyof typeof styles])}>
            {status}
        </Badge>
    )
}

// Define columns for the employee table
const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: "firstName",
        header: "Full Name",
        enableSorting: true,
        cell: ({ row }) => {
            return (
                <HoverCard openDelay={150}>
                    <HoverCardTrigger>
                        <Link to="/">
                            <Button variant={"link"} className="font-medium">
                                <Avatar className="size-10">
                                    <AvatarImage src="https://avatars.githubusercontent.com/u/40718231?v=4&size=512" />
                                    <AvatarFallback>
                                        {row.original.firstName[0] + row.original.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start">
                                    <h4 className="align-left leading-tight mb-1">
                                        {row.original.firstName} {row.original.lastName}
                                    </h4>
                                    <p className="alight-left font-normal text-sm text-muted-foreground mb-2">{row.original.title}</p>
                                </div>
                            </Button>
                        </Link>
                    </HoverCardTrigger>
                    <HoverCardContent side="right" className="w-80 p-0 overflow-hidden border-border/50 shadow-xl">
                        {/* Header Section */}
                        <div className="relative bg-primary/5 p-5 pb-4">
                            <div className="flex items-start gap-4">
                                <Avatar className="!rounded-md size-18">
                                    <AvatarImage src="https://avatars.githubusercontent.com/u/40718231?v=4&size=512" />
                                    <AvatarFallback className="bg-primary/15 text-lg font-semibold">
                                        {row.original.firstName[0] + row.original.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-base leading-tight mb-1">
                                        {row.original.firstName} {row.original.lastName}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-2">{row.original.title}</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                        {row.original.employmentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 space-y-2.5 bg-background/50 backdrop-blur-sm">
                            <div className="group flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-accent/50">
                                <div className="flex items-center justify-center size-8 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <CakeIcon className="size-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground">Date of Birth</p>
                                    <p className="text-sm font-medium">{row.original.dateOfBirth}</p>
                                </div>
                            </div>

                            <div className="group flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-accent/50">
                                <div className="flex items-center justify-center size-8 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                    <UserIcon className="size-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground">Gender</p>
                                    <p className="text-sm font-medium">Male</p>
                                </div>
                            </div>

                            <div className="group flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-accent/50">
                                <div className="flex items-center justify-center size-8 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                    <GlobeAltIcon className="size-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground">Nationality</p>
                                    <p className="text-sm font-medium">Turkish</p>
                                </div>
                            </div>

                            <div className="h-px bg-border/50 my-1" />

                            <div className="group flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-accent/50">
                                <div className="flex items-center justify-center size-8 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <BuildingOfficeIcon className="size-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground">Department</p>
                                    <p className="text-sm font-medium">IT Team</p>
                                </div>
                            </div>

                            <div className="group flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-accent/50">
                                <div className="flex items-center justify-center size-8 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                    <UserCircleIcon className="size-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground">Supervisor</p>
                                    <p className="text-sm font-medium">John Doe</p>
                                </div>
                            </div>

                            <Button variant={"secondary"} className="w-full !py-4">
                                <Link to="/">
                                    <p className="text-sm font-medium">Go to employee's profile</p>
                                </Link>
                            </Button>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            )
        }
    },
    {
        accessorKey: "employmentStatus",
        header: "Employment Status",
        enableSorting: true,
        cell: ({ row }) => <EmploymentStatusBadge status={row.original.employmentStatus} />,
    },
    {
        accessorKey: "workLocation",
        header: "Location",
        enableSorting: true,
    },
    {
        accessorKey: "workEmail",
        header: "Email",
        enableSorting: true,
        cell: ({ row }) => (
            <a
                href={`mailto:${row.original.workEmail}`}
                className="text-blue-500 hover:underline"
            >
                {row.getValue("workEmail")}
            </a>
        ),
    },
    {
        accessorKey: "workPhone",
        header: "Phone",
        enableSorting: false,
        cell: ({ row }) => (
            <a
                href={`tel:${row.original.workPhone}`}
                className="text-blue-500 hover:underline"
            >
                {row.getValue("workPhone")}
            </a>
        ),
    },
];

export function EmployeeTable({ data }: EmployeeTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={
                                                    header.column.getCanSort()
                                                        ? "flex cursor-pointer select-none items-center gap-2"
                                                        : ""
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                                {header.column.getCanSort() && (
                                                    <span className="flex flex-col">
                                                        {header.column.getIsSorted() ===
                                                            "asc" ? (
                                                            <ChevronUpIcon className="size-4" />
                                                        ) : header.column.getIsSorted() ===
                                                            "desc" ? (
                                                            <ChevronDownIcon className="size-4" />
                                                        ) : (
                                                            <div className="size-4 opacity-30">
                                                                <ChevronsUpDown className="size-4" />
                                                            </div>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}{" "}
                        of {table.getFilteredRowModel().rows.length} rows
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Rows per page:</span>
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                table.setPageSize(Number(e.target.value));
                            }}
                            className="h-8 w-[70px] rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            {[10, 20, 30, 50, 100].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronDoubleLeftIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Button>
                        <span className="flex items-center gap-1 px-2 text-sm">
                            <span>Page</span>
                            <strong>
                                {table.getState().pagination.pageIndex + 1} of{" "}
                                {table.getPageCount()}
                            </strong>
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronDoubleRightIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
