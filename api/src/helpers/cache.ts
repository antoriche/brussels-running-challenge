const cache__ = new Map<string, unknown>();

export const Caching =
  <T extends unknown>() =>
  (method: Function, descriptor: TypedPropertyDescriptor<(...arguments_: unknown[]) => Promise<T>>) =>
    function (...arguments_: unknown[]) {
      const propertyKey = method.toString();
      const key = propertyKey + "\t" + JSON.stringify(arguments_);

      if (cache__.has(key)) {
        return Promise.resolve(cache__.get(key) as T);
      } else {
        return new Promise<T>((resolve) => resolve(method.apply(this, arguments_))).then((value) => {
          cache__.set(key, value);
          return value;
        });
      }
    };
