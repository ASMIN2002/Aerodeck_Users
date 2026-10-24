import { useEffect, useRef, useState } from "react";
import "./Loading.css";

const DEFAULT_COUNT_BY_TYPE = {
    product: 4,
    cart: 3,
    order: 3,
    default: 1,
};

const Line = ({ size = "md" }) => (
    <div className={`hp-skeleton-line hp-skeleton-line-${size}`} />
);

const Box = ({ className }) => (
    <div className={`hp-skeleton-box ${className}`} />
);

function ProductSkeleton({ count }) {
    return (
        <div className="hp-skeleton-grid">
            {Array.from({ length: count }, (_, i) => (
                <div className="hp-skeleton-product" key={i}>
                    <Box className="hp-skeleton-image" />
                    <Line size="lg" />
                    <Line size="sm" />
                    <Line size="md" />
                </div>
            ))}
        </div>
    );
}

function DetailsSkeleton() {
    return (
        <div className="hp-skeleton-details">
            <Box className="hp-skeleton-details-image" />
            <Line size="lg" />
            <Line size="md" />
            <Line size="sm" />
            <Line size="md" />
            <Line size="lg" />
        </div>
    );
}

function CartSkeleton({ count }) {
    return (
        <div className="hp-skeleton-cart-list">
            {Array.from({ length: count }, (_, i) => (
                <div className="hp-skeleton-cart" key={i}>
                    <Box className="hp-skeleton-cart-image" />
                    <div className="hp-skeleton-cart-info">
                        <Line size="lg" />
                        <Line size="sm" />
                        <Line size="md" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="hp-skeleton-profile">
            <Box className="hp-skeleton-avatar" />
            <Line size="lg" />
            <Line size="md" />
            <div className="hp-skeleton-row">
                <Line size="sm" />
                <Line size="sm" />
            </div>
            <Line size="lg" />
            <Line size="md" />
        </div>
    );
}

function OrderSkeleton({ count }) {
    return (
        <div className="hp-skeleton-order-list">
            {Array.from({ length: count }, (_, i) => (
                <div className="hp-skeleton-order" key={i}>
                    <div className="hp-skeleton-row">
                        <Line size="lg" />
                        <Line size="sm" />
                    </div>
                    <div className="hp-skeleton-row">
                        <Line size="md" />
                        <Line size="md" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function VideoSkeleton() {
    return (
        <div className="hp-skeleton-video">
            <Box className="hp-skeleton-video-box" />
        </div>
    );
}

function DefaultSkeleton() {
    return (
        <div className="hp-skeleton-default">
            <Line size="lg" />
            <Line size="md" />
            <Line size="sm" />
            <Line size="md" />
        </div>
    );
}

const SKELETON_BY_TYPE = {
    product: ProductSkeleton,
    details: DetailsSkeleton,
    cart: CartSkeleton,
    profile: ProfileSkeleton,
    order: OrderSkeleton,
    video: VideoSkeleton,
    default: DefaultSkeleton,
};

function Loading({
    duration = 3000,
    text = "Please wait...",
    onComplete,
    manual = false,
    type = "default",
    count,
}) {
    const [visible, setVisible] = useState(true);

    const onCompleteRef = useRef(onComplete);
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        if (manual) return;

        const timer = setTimeout(() => {
            setVisible(false);
            onCompleteRef.current?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, manual]);

    if (!visible) return null;

    const SkeletonComponent = SKELETON_BY_TYPE[type] || SKELETON_BY_TYPE.default;
    const itemCount = count ?? DEFAULT_COUNT_BY_TYPE[type] ?? 1;

    return (
        <div className="hp-loading-overlay">
            <div className="hp-loading-card">
                <SkeletonComponent count={itemCount} />

                {text && <div className="hp-loading-text">{text}</div>}
            </div>
        </div>
    );
}

export default Loading;