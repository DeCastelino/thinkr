import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type DropdownProps = {
    options: string[];
};
const Dropdown = ({ options }: DropdownProps) => {
    return (
        <Select>
            <SelectTrigger className="rounded-full bg-accent w-[180px] hover:cursor-pointer">
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="rounded-lg bg-accent">
                <SelectGroup className="hover:cursor-pointer">
                    {options.map((option) => (
                        <SelectItem
                            key={option}
                            value={option}
                            className="hover:cursor-pointer hover:font-bold"
                        >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default Dropdown;
