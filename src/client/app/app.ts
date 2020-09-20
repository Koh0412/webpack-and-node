class Baz {
  name: string;
  constructor() {
    this.name = Baz.name;
  }
}

const baz = new Baz();
console.log(baz);