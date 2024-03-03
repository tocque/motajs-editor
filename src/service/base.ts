export type RecordTree<T> = {
  [key: string]: T | RecordTree<T>
};
