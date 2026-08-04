import { useEffect, useRef, useState } from "react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { FaChevronDown, FaStar } from "react-icons/fa";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
}

export function Button({
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...props
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0";
    const variants: Record<string, string> = {
        primary:
            "bg-gradient-to-r from-gold-light to-gold text-ink hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20",
        secondary: "bg-white/[0.06] text-ivory border border-white/10 hover:bg-white/10",
        outline: "border border-white/15 text-ivory hover:border-gold/60 hover:text-gold",
        ghost: "text-ivory/70 hover:text-ivory hover:bg-white/5",
        danger:
            "bg-gradient-to-r from-rose to-rose/80 text-ivory hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose/20",
    };
    const sizes: Record<string, string> = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-3.5 text-base",
    };

    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    );
}


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function Input({ label, className = "", id, ...props }: InputProps) {
    return (
        <label className="block" htmlFor={id}>
            {label && (
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ivory/45">
                    {label}
                </span>
            )}
            <input
                id={id}
                className={`w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-ivory placeholder:text-ivory/30 outline-none transition-colors focus:border-gold/50 focus:bg-white/[0.07] ${className}`}
                {...props}
            />
        </label>
    );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export function TextArea({ label, className = "", id, ...props }: TextAreaProps) {
    return (
        <label className="block" htmlFor={id}>
            {label && (
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ivory/45">
                    {label}
                </span>
            )}
            <textarea
                id={id}
                className={`w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-ivory placeholder:text-ivory/30 outline-none transition-colors focus:border-gold/50 focus:bg-white/[0.07] ${className}`}
                {...props}
            />
        </label>
    );
}


interface StarRatingProps {
    value: number | null;
    onChange?: (value: number) => void;
    readOnly?: boolean;
    size?: "sm" | "md" | "lg";
}

export function StarRating({ value, onChange, readOnly, size = "md" }: StarRatingProps) {
    const [hover, setHover] = useState<number | null>(null);
    const sizes = { sm: "text-sm gap-0.5", md: "text-2xl gap-1", lg: "text-3xl gap-1.5" };
    const display = hover ?? value ?? 0;

    return (
        <div className={`flex ${sizes[size]}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(null)}
                    className={`transition-colors ${readOnly ? "cursor-default" : "cursor-pointer"} ${star <= display ? "text-gold" : "text-white/15"
                        }`}
                >
                    <FaStar />
                </button>
            ))}
        </div>
    );
}


interface DropdownProps {
    value: string;
    options: string[];
    onChange: (value: string) => void;
    label?: string;
}

export function Dropdown({ value, options, onChange, label }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            {label && (
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ivory/45">
                    {label}
                </span>
            )}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex w-full min-w-[160px] items-center justify-between gap-3 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-sm text-ivory transition-colors hover:border-white/25"
            >
                {value}
                <FaChevronDown className={`text-xs text-ivory/40 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="glass absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-white/10 bg-ink/95 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${opt === value ? "bg-gold/15 text-gold" : "text-ivory/75 hover:bg-white/5 hover:text-ivory"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}


interface PaginationProps {
    page: number;
    count: number;
    onChange: (page: number) => void;
}

export function Pagination({ page, count, onChange }: PaginationProps) {
    if (count <= 1) return null;

    const pages = new Set<number>([1, count, page, page - 1, page + 1]);
    const items = Array.from(pages)
        .filter((p) => p >= 1 && p <= count)
        .sort((a, b) => a - b);

    const nodes: (number | "...")[] = [];
    items.forEach((p, i) => {
        if (i > 0 && p - items[i - 1] > 1) nodes.push("...");
        nodes.push(p);
    });

    const pillBase = "flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm transition-colors";

    return (
        <div className="flex items-center justify-center gap-1.5">
            <button
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
                className={`${pillBase} border border-white/10 text-ivory/70 hover:border-gold/40 hover:text-gold disabled:opacity-30`}
            >
                Prev
            </button>
            {nodes.map((n, i) =>
                n === "..." ? (
                    <span key={`e-${i}`} className="px-1 text-ivory/30">
                        ⋯
                    </span>
                ) : (
                    <button
                        key={n}
                        onClick={() => onChange(n)}
                        className={`${pillBase} ${n === page ? "bg-gradient-to-r from-gold-light to-gold text-ink font-semibold" : "text-ivory/60 hover:text-ivory"
                            }`}
                    >
                        {n}
                    </button>
                )
            )}
            <button
                disabled={page === count}
                onClick={() => onChange(page + 1)}
                className={`${pillBase} border border-white/10 text-ivory/70 hover:border-gold/40 hover:text-gold disabled:opacity-30`}
            >
                Next
            </button>
        </div>
    );
}

export function Spinner({ className = "" }: { className?: string }) {
    return (
        <div
            className={`h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
}