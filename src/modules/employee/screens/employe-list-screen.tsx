import { EmployeeTable } from "../components/employee-table";
import { DUMMY_EMPLOYEE_LIST } from "../constants";
import { Contact, FileUser, Mail, MailPlus, Phone, School, SendHorizonal, ShieldHalf, ShieldPlus, ShieldQuestion, ShieldUser, Undo2, User } from "lucide-react";
import { createFilter, type Filter, type FilterFieldConfig, Filters } from "@/components/ui/filters";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/app-store";

// Dummy data
const DUMMY_DEPARTMENTS = [
    { value: 'medical', label: 'Medical Department' },
    { value: 'nursing', label: 'Nursing Department' },
    { value: 'administration', label: 'Administration' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'it', label: 'Information Technology' },
    { value: 'finance', label: 'Finance' },
];

const DUMMY_SUPERVISORS = [
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'david-brown', label: 'David Brown' },
];

const ROLE_OPTIONS = [
    { value: 'general-manager', label: 'General Manager' },
    { value: 'manager', label: 'Manager' },
    { value: 'employee', label: 'Employee' },
];

const fields: FilterFieldConfig[] = [
    {
        group: "basic",
        fields: [
            {
                key: 'fullName',
                label: 'Full Name',
                type: 'text',
                icon: <User />,
                placeholder: 'John Doe'
            },
            {
                key: 'email',
                label: 'Email',
                type: 'text',
                icon: <Mail />,
                placeholder: 'john.doe@elitklinik.com'
            },
            {
                key: 'tel',
                label: 'Phone',
                type: 'text',
                icon: <Phone />,
                placeholder: '123-456-7890'
            }
        ]
    },
    {
        group: 'Select',
        fields: [
            {
                key: 'status',
                label: 'Status',
                type: 'select',
                icon: <Contact />,
                searchable: false,
                className: 'w-[200px]',
                options: [
                    {
                        value: 'fullTimePermanent',
                        label: 'Full-Time Permanent',
                        icon: <ShieldUser className="size-3 text-green-400" />,
                    },
                    {
                        value: 'partTime',
                        label: 'Part-Time',
                        icon: <ShieldHalf className="size-3 text-yellow-400" />
                    },
                    {
                        value: 'contract',
                        label: 'Contract',
                        icon: <FileUser className="size-3 text-red-400" />
                    },
                    {
                        value: 'internship',
                        label: 'Internship',
                        icon: <School className="size-3 text-blue-400" />
                    },
                    {
                        value: 'temporary',
                        label: 'Temporary',
                        icon: <ShieldPlus className="size-3 text-orange-400" />
                    },
                    {
                        value: 'trial',
                        label: 'On Trial',
                        icon: <ShieldQuestion className="size-3 text-purple-400" />
                    }
                ]
            }
        ]
    }
];

export function EmployeeListScreen() {
    const { employeeMode } = useAppStore();

    const [filters, setFilters] = useState<Filter[]>([
        createFilter("")
    ]);
    const [secondStep, setSecondStep] = useState(false);
    const [hasVisitedStep2, setHasVisitedStep2] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Form state
    const [role, setRole] = useState('')
    const [roleOpen, setRoleOpen] = useState(false)
    const [department, setDepartment] = useState('')
    const [departmentOpen, setDepartmentOpen] = useState(false)
    const [supervisor, setSupervisor] = useState('')
    const [supervisorOpen, setSupervisorOpen] = useState(false)

    const handleFiltersChange = useCallback((filters: Filter[]) => {
        console.log("Filters updated:", filters)
        setFilters(filters)
    }, []);

    const handleStepChange = () => {
        if (!secondStep) {
            setHasVisitedStep2(true);
        }
        setSecondStep(!secondStep)
    }

    const handleDialogOpenChange = (isOpen: boolean) => {
        setDialogOpen(isOpen);
        if (!isOpen) {
            // Reset to step 1 when dialog closes
            setSecondStep(false);
            setHasVisitedStep2(false);
        }
    }

    return (
        <div className="w-full">
            <h1 className="mb-6 text-3xl font-bold">Employees</h1>
            <div className="w-full flex items-center justify-between mb-4">
                {employeeMode === "manager" && (
                    <div className="flex-1">
                        <Filters filters={filters} fields={fields} variant="outline" onChange={handleFiltersChange} />
                    </div>
                )}
                {employeeMode === "manager" && (
                    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                        <DialogTrigger>
                            <Button variant={"outline"}>
                                <MailPlus className="size-4" />
                                Invite Employee
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="overflow-hidden">
                            {!secondStep ? (
                                <motion.div
                                    key="step-1"
                                    initial={hasVisitedStep2 ? { x: -300, opacity: 0 } : { x: 0, opacity: 1 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -300, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <DialogHeader>
                                        <DialogTitle>
                                            Invite Employee
                                        </DialogTitle>
                                        <DialogDescription>
                                            Invite a new employee to the system.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-2">
                                        <Label>
                                            Email
                                        </Label>
                                        <Input
                                            type="email"
                                            placeholder="john.doe@elitklinik.com"
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step-2"
                                    initial={{ x: 300, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 300, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <DialogHeader>
                                        <DialogTitle>
                                            Employee Details
                                        </DialogTitle>
                                        <DialogDescription>
                                            Enter the employee details.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        {/* First Name and Last Name */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label>First Name</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Last Name</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input
                                                type="text"
                                                placeholder="e.g., Senior Nurse, Medical Doctor"
                                            />
                                        </div>

                                        {/* Department */}
                                        <div className="space-y-2">
                                            <Label>Department</Label>
                                            <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button className="w-full justify-start" variant="outline">
                                                        {department ? DUMMY_DEPARTMENTS.find(t => t.value === department)?.label || "Select Department" : "Select Department"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="p-0 w-[var(--radix-popover-trigger-width)]">
                                                    <Command>
                                                        <CommandInput placeholder="Search department..." className="h-9" />
                                                        <CommandList>
                                                            <CommandGroup>
                                                                {DUMMY_DEPARTMENTS.map((team) => (
                                                                    <CommandItem
                                                                        key={team.value}
                                                                        value={team.value}
                                                                        onSelect={() => {
                                                                            setDepartment(team.value);
                                                                            setDepartmentOpen(false);
                                                                        }}
                                                                    >
                                                                        {team.label}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        {/* Role */}
                                        <div className="space-y-2">
                                            <Label>Role</Label>
                                            <Popover open={roleOpen} onOpenChange={setRoleOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button className="w-full justify-start" variant="outline">
                                                        {role ? ROLE_OPTIONS.find(r => r.value === role)?.label : "Select Role"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="p-0 w-[var(--radix-popover-trigger-width)]">
                                                    <Command>
                                                        <CommandInput placeholder="Search role..." className="h-9" />
                                                        <CommandList>
                                                            <CommandGroup>
                                                                {ROLE_OPTIONS.map((roleOption) => (
                                                                    <CommandItem
                                                                        key={roleOption.value}
                                                                        value={roleOption.value}
                                                                        onSelect={() => {
                                                                            setRole(roleOption.value);
                                                                            setRoleOpen(false);
                                                                        }}
                                                                    >
                                                                        {roleOption.label}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        {/* Supervisor */}
                                        <div className="space-y-2 w-full">
                                            <Label>Supervisor</Label>
                                            <Popover open={supervisorOpen} onOpenChange={setSupervisorOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button className="w-full justify-start" variant="outline">
                                                        <p>{supervisor ? DUMMY_SUPERVISORS.find(s => s.value === supervisor)?.label : "Select Supervisor"}</p>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="p-0 w-[var(--radix-popover-trigger-width)]">
                                                    <Command>
                                                        <CommandInput placeholder="Search supervisor..." className="h-9" />
                                                        <CommandList className="w-full">
                                                            <CommandGroup className="w-full">
                                                                {DUMMY_SUPERVISORS.map((sup) => (
                                                                    <CommandItem
                                                                        key={sup.value}
                                                                        value={sup.value}
                                                                        onSelect={() => {
                                                                            setSupervisor(sup.value);
                                                                            setSupervisorOpen(false);
                                                                        }}
                                                                        className="w-full"
                                                                    >
                                                                        {sup.label}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <DialogFooter>
                                <DialogClose>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={handleStepChange}>
                                    {secondStep && <Undo2 className="size-4 inline-block" />}
                                    {secondStep ? "Back" : "Next"}
                                </Button>
                                {secondStep && (
                                    <Button onClick={() => setSecondStep(false)}>
                                        <SendHorizonal className="size-4 inline-block" />
                                        Send Invite
                                    </Button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <EmployeeTable data={DUMMY_EMPLOYEE_LIST} />
        </div>
    );
}