declare namespace chrome {
  namespace storage {
    namespace local {
      function get(keys: string[]): Promise<{ [key: string]: any }>;
      function set(items: { [key: string]: any }): Promise<void>;
    }
  }
}

declare const chrome: typeof chrome; 