import { NextFunction, Request, Response } from "express";

declare namespace expressMimeSniff {
	declare interface Options {
		filters?: RegExp[]
	}

	export type sniffer = (errorHandler: (error:string) => any)
	=> (successHandler: (mimeType:string) => any)
	=> (path: string) => void;

	export type middleware = (root:string, options:Options)
	=> (request:Request, response:Response, next:NextFunction)
	=> void;

}
