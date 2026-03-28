import { ChevronsUpDown, Globe } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CountryOption } from "@/constants/countries";
import { COUNTRIES } from "@/constants/countries";
import { cn } from "@/lib/utils";

export interface CountryComboboxProps {
	/** Código ISO del país seleccionado (ej. "CO") */
	value: string;
	onChange: (value: string) => void;
	/** Lista de países; por defecto usa la lista global de @/constants/countries */
	countries?: CountryOption[];
	placeholder?: string;
	className?: string;
	id?: string;
	"aria-invalid"?: boolean;
	disabled?: boolean;
}

/**
 * Combobox reutilizable para seleccionar país (nombre + indicativo).
 * Incluye búsqueda por nombre, código o indicativo.
 */
export const CountryCombobox = ({
	value,
	onChange,
	countries = COUNTRIES,
	placeholder = "Selecciona un país",
	className,
	id,
	"aria-invalid": ariaInvalid,
	disabled = false,
}: CountryComboboxProps) => {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const selectedCountry = useMemo(() => countries.find((c) => c.code === value), [countries, value]);

	const filteredCountries = useMemo(() => {
		if (!search.trim()) return countries;
		const q = search.toLowerCase().trim();
		return countries.filter(
			(c) => c.name.toLowerCase().includes(q) || c.phoneCode.includes(q) || c.code.toLowerCase().includes(q),
		);
	}, [countries, search]);

	const handleSelect = (code: string) => {
		onChange(code);
		setOpen(false);
		setSearch("");
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					id={id}
					type="button"
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-invalid={ariaInvalid}
					disabled={disabled}
					className={cn(
						"w-full justify-between font-normal h-9 px-3 pl-10",
						!value && "text-muted-foreground",
						className,
					)}
				>
					<div className="flex items-center gap-2 min-w-0">
						<Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
						<span className="truncate">
							{selectedCountry ? `${selectedCountry.name} (${selectedCountry.phoneCode})` : placeholder}
						</span>
					</div>
					<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
				<div className="p-2 border-b">
					<input
						type="text"
						placeholder="Buscar país..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
					/>
				</div>
				<ScrollArea className="h-[240px]">
					<div className="p-1">
						{filteredCountries.length === 0 ? (
							<p className="py-6 text-center text-sm text-muted-foreground">Ningún país encontrado.</p>
						) : (
							filteredCountries.map((country) => (
								<button
									key={country.code}
									type="button"
									className={cn(
										"w-full flex items-center gap-2 rounded-sm px-2 py-2 text-left text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors",
										value === country.code && "bg-accent",
									)}
									onClick={() => handleSelect(country.code)}
								>
									{country.name} ({country.phoneCode})
								</button>
							))
						)}
					</div>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
};
