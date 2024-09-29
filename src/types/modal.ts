export interface IModal {
    open(id?: string): void;
    close(): void;
    handleEscUp (evt: KeyboardEvent): void;
}
