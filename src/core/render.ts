import Block from "./block"

export default function render(query: string, block: Block): HTMLElement {
  const root: HTMLElement | null = document.querySelector(query);
  if (!root) {
    throw Error("Корневой элемент не найден");
  }
  root.appendChild(block.getContent());
  return root;
}
