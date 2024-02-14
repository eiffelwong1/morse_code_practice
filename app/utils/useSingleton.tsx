import { useState } from 'react';

function useSingleton<T>(initializer: () => T): T {
    const [instance, setInstance] = useState<T | null>(null);

    if (!instance) {
        const newInstance = initializer();
        setInstance(newInstance);
        return newInstance;
    }

    return instance;
}

export default useSingleton;