import { useRef, useState, useCallback, memo } from "react";
import "../detailStyle/3dClothes.css";

function Clothes3D({ colors = [], selectedColor, onSelectColor, appliedColor }) {
    const [rotation, setRotation] = useState(0);
    const dragStart = useRef(null);
    const rafRef = useRef(null);

    const onTouchStart = useCallback((e) => {
        dragStart.current = e.touches[0].clientX;
    }, []);

    const onTouchMove = useCallback((e) => {
        if (dragStart.current === null) return;
        const clientX = e.touches[0].clientX;
        if (rafRef.current) return;

        rafRef.current = requestAnimationFrame(() => {
            const dx = clientX - dragStart.current;
            setRotation((prev) => prev + dx * 0.5);
            dragStart.current = clientX;
            rafRef.current = null;
        });
    }, []);

    const onTouchEnd = useCallback(() => {
        dragStart.current = null;
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }, []);

    const handleColorClick = useCallback((hex) => {
        onSelectColor?.(hex);
    }, [onSelectColor]);

    return (
        <div className="c3d-inline-box">
            <div className="c3d-inline-left">
                <p className="c3d-label">Colours</p>
                <div className="c3d-colors">
                    {colors.map((hex) => (
                        <button
                            key={hex}
                            className={`c3d-color ${selectedColor === hex ? "active" : ""}`}
                            style={{ background: hex }}
                            onClick={() => handleColorClick(hex)}
                            aria-label={hex}
                        />
                    ))}
                </div>
            </div>

            <div className="c3d-inline-right">
                <div
                    className="c3d-stage"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div
                        className="c3d-model"
                        style={{ transform: `rotateY(${rotation}deg)` }}
                    >
                        <div className="c3d-head" />
                        <div className="c3d-neck" />
                        <div className="c3d-torso" />
                        <div className="c3d-arm c3d-arm-left" />
                        <div className="c3d-arm c3d-arm-right" />
                        <div className="c3d-leg c3d-leg-left" />
                        <div className="c3d-leg c3d-leg-right" />

                        {appliedColor && (
                            <>
                                <div className="c3d-shirt c3d-shirt-body" style={{ background: appliedColor }} />
                                <div className="c3d-shirt c3d-shirt-arm-left" style={{ background: appliedColor }} />
                                <div className="c3d-shirt c3d-shirt-arm-right" style={{ background: appliedColor }} />
                            </>
                        )}
                    </div>
                </div>
                <p className="c3d-hint">← Swipe →</p>
            </div>
        </div>
    );
}

export default memo(Clothes3D);