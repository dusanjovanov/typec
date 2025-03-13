export class Include {
  static relative(name: string) {
    return `#include "${name}"`;
  }

  static system(name: string) {
    return `#include <${name}>`;
  }
}
