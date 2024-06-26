const { newAsyncRuntime } = require("quickjs-emscripten");
const _fetch = require("node-fetch");

async function main() {
  try {
    const runtime = await newAsyncRuntime();
    const context = runtime.newContext();

    // logger
    const logHandle = context.newFunction("log", (...args) => {
      const nativeArgs = args.map(context.dump);
      console.log("QuickJS:", ...nativeArgs);
    });
    const consoleHandle = context.newObject();
    context.setProp(consoleHandle, "log", logHandle);
    context.setProp(context.global, "console", consoleHandle);

    // getData function
    const getDataHandle = context.newFunction("getData", () => {
      const _object = context.newObject();
      const _nested = context.newObject();
      context.setProp(_nested, "city", context.newString("India"));
      context.setProp(_object, "name", context.newString("User1"));
      context.setProp(_object, "age", context.newNumber(21));
      context.setProp(_object, "address", _nested);
      return context.newFunction("myFunc", () => {
        return context.newString("HELLO");
      });
    });

    context.setProp(context.global, "getData", getDataHandle);

    consoleHandle.dispose();
    logHandle.dispose();

    // fetch method
    const fetchHandle = context.newAsyncifiedFunction("fetch", async (url) => {
      let _url = context.dump(url);
      const response = await _fetch(_url);
      let _output = context.newObject();
      context.setProp(
        _output,
        "json",
        context.newFunction("json", () => {
          // const _value = await response.json();
          //TODO: need to iterate value and return using context functions
          return context.newString("FETCH SUCCESS");
        })
      );
      return _output;
    });

    context.setProp(context.global, "request", fetchHandle);

    const fnString = `
      async function execute() {
        const data = await request("https://tstcdn1.zingworks.com/static/translation/web/8489/en/messages.json");
        console.log("111", data)
        return { a:12, b:1, data: data.json() };
        return output;
      }
      execute();
    `;

    const _eval = await context.evalCodeAsync(fnString);
    runtime.executePendingJobs();
    const result = context.dump(_eval.value);

    if (result.error) {
      console.log("Execution failed:", result.error);
      // result.error.dispose();
    } else {
      console.log("Success:", result.value);
      // result.value.dispose();
    }

    // vm.dispose();
  } catch (e) {
    console.info("ERRR", e);
  } finally {
    console.info("FDDD");
  }
}

main();
