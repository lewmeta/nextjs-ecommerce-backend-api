import React from 'react'
import { Progress } from './ui/progress'
import { cn } from '@/lib/utils';

interface ProductProgressProps {
    value: number;
    variant?: 'default' | 'success',
    size: 'default' | 'sm'
}

const colorByVariant = {
    default: "text-sky-700",
    success: 'text-emerald-700',
}

const sizeByVariant = {
    default: 'text-sm',
    sm: 'text-xs',
}

export const ProductProgress = ({
    value,
    variant,
    size,
}: ProductProgressProps) => {
    return (
        <div className='flex items-center gap-x-3 w-full'>
            <Progress
                className='h-4'
                value={value}
                variant={variant}
            />
            <p className={cn(
                'font-medium flex items-center text-sky-700  gap-x-2',
                colorByVariant[variant || 'default'],
                sizeByVariant[size || 'default']
            )}>
                {Math.round(value)}%
                <span>
                    complete
                </span>
            </p>
        </div>
    )
}
