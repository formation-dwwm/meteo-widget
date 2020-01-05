export namespace JSXFactory {
  interface AttributeCollection {
    [name: string]: string;
  }

  export function createElement(tagName: string, attributes: AttributeCollection | null, ...children: any[]): string/*Element | DocumentFragment*/ {
    return `<${tagName} ${Object.keys(attributes || {}).map(key => `${key}="${attributes[key]}"`).join(' ')}>${children.join('')}</${tagName}>`;
  }
}

export default JSXFactory;