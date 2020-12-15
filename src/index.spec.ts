import { Example } from "../src";

describe("Example class", () => {
  it("should create an instance using its constructor", () => {
    const example: Example = new Example();
    const loggerSpy = jest.spyOn(example.logger, "debug");

    const param = "this is a test";
    example.exampleMethod(param);
    expect(loggerSpy).toHaveBeenCalledWith(`Received: ${param}`);
  });
  it("should return whatever is passed to exampleMethod()", () => {
    const example: Example = new Example();
    const param: string = "This is my param.";
    const returnValue: string = example.exampleMethod(param);
    expect(returnValue).toEqual(param);
  });
});
