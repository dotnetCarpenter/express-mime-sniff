import { NextFunction, Request, Response } from "express";

interface Options {
	filters?: RegExp[]
}

export function sniffer (errorHandler: (error:string) => any)
	:(successHandler: (mimeType:string) => any)
	=> (path: string) => void;

export function middleware (root:string, options:Options)
	:(request:Request, response:Response, next:NextFunction)
	=> void;