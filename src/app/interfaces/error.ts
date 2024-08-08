export type TErrorSource = {
  path: string | number;
  message: string;
  value?: string;
}[];

// error response type

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSource;
  stack?: string;
  value?: string;
};
