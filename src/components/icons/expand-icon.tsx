import React from 'react';
import type { SVGProps } from 'react';

export function ExpandIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 50 50" {...props}><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path stroke="#344054" d="m29.167 18.75l6.25 6.25l-6.25 6.25M18.75 18.75L25 25l-6.25 6.25M25 25H6.25"></path><path stroke="#306cfe" d="M35.417 41.667h6.25a2.083 2.083 0 0 0 2.083-2.084V10.417a2.083 2.083 0 0 0-2.083-2.084h-6.25"></path></g></svg>);
}