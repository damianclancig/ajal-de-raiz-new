import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/lib/types"

const statusBadgeVariants = cva(
    "",
    {
        variants: {
            status: {
                'Pendiente': "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                'Pendiente de Pago': "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                'Pendiente de Confirmación': "border-transparent bg-primary/80 text-primary-foreground hover:bg-primary/60",
                'Confirmado': "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                'Enviado': "border-transparent bg-blue-500 text-white hover:bg-blue-600",
                'Entregado': "border-transparent bg-green-500 text-white hover:bg-green-600",
                'Cancelado': "text-foreground border-foreground/20",
            },
        },
        defaultVariants: {
            status: "Pendiente",
        },
    }
)

export interface StatusBadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
    status: OrderStatus;
    label?: string;
}

export function StatusBadge({ className, status, label, ...props }: StatusBadgeProps) {
    // We map the status to the badge variant style
    // Note: We use the existing Badge component but override its variant classes with our CVA status map
    // However, Badge has its own variants. A cleaner way is to use Badge with 'outline' (base) and add our classes.
    // Or just render a div styled like a badge if we want full control.
    // Let's use Badge 'className' override.

    return (
        <Badge
            variant="outline" // base style
            className={cn(statusBadgeVariants({ status }), className)}
            {...props}
        >
            {label || status}
        </Badge>
    )
}
