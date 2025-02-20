"use client"
import { useState, useEffect } from 'react';

const checkChromeAIAvailability = () => {
    return false; 
};

const APIWarningBanner = () => {
        const [isVisible, setIsVisible] = useState(true);

        useEffect(() => {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000); 
    
            return () => clearTimeout(timer); 
        }, []);
    
        if (!isVisible || checkChromeAIAvailability()) return null;
    
        return (
        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold mr-2">Important:</strong>
            <span className="block sm:inline">
            Chrome AI is not available. To enable it:
            <ol className="mt-2 ml-4 list-decimal">
                <li>Open <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">chrome://flags</code></li>
                <li>Search for &quot;Experimental Generative AI&quot;</li>
                <li>Enable &quot;Experimental Generative AI API&quot;</li>
                <li>Restart Chrome</li>
            </ol>
            </span>
            <button
            className="absolute top-0 right-0 p-4"
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss"
            >
            ×
            </button>
        </div>
        );
        };
    
    export default APIWarningBanner;