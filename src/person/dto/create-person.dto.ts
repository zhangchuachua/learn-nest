export class CreatePersonDto {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    console.log('this is create person dto class constructor');

    console.log(`name: ${name}, age: ${age}`);

    this.name = name;
    this.age = age;
  }

  static logP() {
    console.log('p');
  }
}
