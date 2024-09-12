class Catalog implements ICatalog {
    items: IItemAPI[] = [];

    initItems(items: IItemAPI[]) {
        this.items = items;
    }

    getItem(id: string): IItemAPI | null {
        return this.items.find(item => item.id === id);
    }
}