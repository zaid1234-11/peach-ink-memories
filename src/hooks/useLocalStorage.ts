import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing localStorage with automatic JSON serialization
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    // Get initial value from localStorage or use provided initialValue
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            return initialValue;
        }
    });

    // Update localStorage whenever value changes
    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);

                if (typeof window !== "undefined") {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            } catch (error) {
                console.error(`Error saving ${key} to localStorage:`, error);
            }
        },
        [key, storedValue]
    );

    // Remove item from localStorage
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== "undefined") {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue] as const;
}
