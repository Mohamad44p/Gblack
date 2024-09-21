import React, { useRef, useState, useEffect } from 'react';

interface VirtualListProps<T> {
    items: T[];
    itemHeight: number;
    renderItem: (item: T) => React.ReactNode;
}

export function VirtualList<T>({ items, itemHeight, renderItem }: VirtualListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

    useEffect(() => {
        const updateVisibleRange = () => {
            if (containerRef.current) {
                const { scrollTop, clientHeight } = containerRef.current;
                const start = Math.floor(scrollTop / itemHeight);
                const end = Math.min(items.length, Math.ceil((scrollTop + clientHeight) / itemHeight));
                setVisibleRange({ start, end });
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', updateVisibleRange);
            updateVisibleRange();
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', updateVisibleRange);
            }
        };
    }, [items.length, itemHeight]);

    const totalHeight = items.length * itemHeight;
    const visibleItems = items.slice(visibleRange.start, visibleRange.end);

    return (
        <div ref={containerRef} style={{ height: '100%', overflowY: 'auto' }}>
            <div style={{ height: totalHeight, position: 'relative' }}>
                {visibleItems.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            top: (visibleRange.start + index) * itemHeight,
                            height: itemHeight,
                        }}
                    >
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </div>
    );
}