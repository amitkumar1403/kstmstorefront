function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ')
}

export default classNames;
