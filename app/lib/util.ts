
/* removes all non-alphanumeric chars */
export function strip(toStrip: string):string{
	return toStrip.replace(/[\W_]+/g, '');
}