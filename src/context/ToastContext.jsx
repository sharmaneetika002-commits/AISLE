import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toastMessage, setToastMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const timerRef = useRef(null);

    const showToast = useCallback((msg) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setToastMessage(msg);
        setVisible(true);
        timerRef.current = setTimeout(() => {
            setVisible(false);
        }, 2200);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && (
                <div style={{
                    position: 'fixed',
                    bottom: '25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#30251f',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    fontSize: '13px',
                    fontWeight: 500,
                    zIndex: 9999,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    pointerEvents: 'none',
                    textAlign: 'center'
                }}>
                    {toastMessage}
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
