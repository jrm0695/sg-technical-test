export function requireString(raw: any, field: string, context: string): string {
    if (typeof raw[field] !== "string") {
        throw new Error(`${context}: missing or invalid '${field}' (expected string)`);
    }
    return raw[field];
}

export function requireNumber(raw: any, field: string, context: string): number {
    if (typeof raw[field] !== "number") {
        throw new Error(`${context}: missing or invalid '${field}' (expected number)`);
    }
    return raw[field];
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}