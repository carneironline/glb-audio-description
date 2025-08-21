import { vi } from 'vitest';

export function createMockElement(
    options: {
        textContent?: string;
        dataset?: Record<string, string>;
        classList?: string[];
    } = {}
) {
    const { textContent = '', dataset = {}, classList = [] } = options;

    const mockClassList = {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn((className: string) => classList.includes(className)),
        toggle: vi.fn(),
    };

    return {
        textContent,
        dataset,
        classList: mockClassList,
        querySelector: vi.fn(),
        querySelectorAll: vi.fn(() => []),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        insertAdjacentHTML: vi.fn(),
        closest: vi.fn(),
    };
}

export function createMockDocument() {
    return {
        querySelector: vi.fn(),
        querySelectorAll: vi.fn(() => []),
        createElement: vi.fn(() => createMockElement()),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    };
}

export function waitFor(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
