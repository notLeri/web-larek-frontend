export interface IModal {
    open(): void;
    close(): void;
    handleEscUp (evt: KeyboardEvent): void;
}