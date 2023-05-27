module.exports = {
  singleQuote: true,
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用 tab 缩进，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: false,
  // 对象的 key 仅在必要时用引号
  quoteProps: "as-needed",
  singleQuote: false,
  // jsx 单引号
  jsxSingleQuote: false,
  //trailingComma: 'all',
  // 大括号内的首尾需要空格 { foo: bar }
  bracketSpacing: false,
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  jsxBracketSameLine: false,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: "preserve",
  // 换行符使用 lf
  endOfLine: "lf",

  templateIndent: 2,
  htmlWhitespaceSensitivity: "ignore",
}
